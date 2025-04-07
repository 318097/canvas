import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import "./Raw.scss";
import { GENERIC_PROPERTIES } from "./config";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Header from "./Header";
import shortid from "shortid";
import { getFormattedDate } from "./helpers";
import {
  isGenericTag,
  splitName,
  generateName,
  generateTemplate,
  getCleanKey,
} from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setGlobalProperties,
  setLocalProperties,
  setTemplates,
  setView,
} from "./store";

const Raw = () => {
  const [selectedElement, setSelectedElement] = useState("");

  const dispatch = useDispatch();
  const {
    data,
    postVariant,
    selectedTemplates,
    filename,
    propertyType,
    templates,
    globalProperties,
    localProperties,
  } = useSelector((state) => state.config);

  const isGlobal = propertyType === "global";
  const templateRef = useRef({});
  const canvasContainerRef = useRef();

  const isGenericTagSelected = isGenericTag(selectedElement);

  const _updateSelectedElement = (newValue) => {
    setSelectedElement((prev) => {
      const { element } = splitName(prev);
      if (GENERIC_PROPERTIES.includes(element))
        updatedClassesForTag(prev, "outlined", "remove");
      return newValue;
    });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    // setZoomLevel(selectedTemplates.length > 1 ? INITIAL_ZOOM_LEVEL : 0.8);
    dispatch(setView(selectedTemplates.length > 1 ? "row" : "col"));
    dispatch(setTemplates(generateTemplate(selectedTemplates)));
  }, [selectedTemplates]);

  useEffect(() => {
    parseDataForVariant();
  }, [postVariant]);

  useEffect(() => {
    canvasContainerRef.current.addEventListener(
      "click",
      (e) => {
        const tag = e.target.tagName;
        if (["CODE", "STRONG", "A"].includes(tag)) {
          e.stopPropagation();
          console.log("Detected click on <code>, <strong>");
          const id = e.target.dataset.id ? e.target.dataset.id : shortid();
          e.target.dataset.id = id;
          const fullKey = generateName(`none`, tag, id);
          _updateSelectedElement(fullKey);
          updatedClassesForTag(fullKey, "outlined", "add");
        } else {
          _updateSelectedElement("");
        }
      },
      true
    );
  }, [canvasContainerRef.current]);

  useEffect(() => {
    const node = canvasContainerRef.current;

    for (const key in globalProperties) {
      if (isGenericTag(key)) {
        node.querySelectorAll(key).forEach((el) => {
          const classes = Object.values(globalProperties[key]);
          el.classList.add(...classes);
        });
      }
    }
  }, [globalProperties, data, canvasContainerRef.current]);

  const parseDataForVariant = () => {
    if (postVariant === "listicle") {
      const contentList = data.content.trim().split("\n");
      const contentIdObj = [];
      const contentBreakdownObj = contentList.reduce(
        (ob, contentLine, index) => {
          const key = `content_#${index + 1}`;
          contentIdObj.push(key);
          return { ...ob, [key]: contentLine };
        },
        {}
      );

      const finalPages = [];
      templates.forEach((template) => {
        const { platform } = template;
        const groupId = template.groupId ? template.groupId : shortid();
        const pages = [
          ...generateTemplate(platform, {
            title: "title",
            content: null,
            groupId,
          }),
          ...contentIdObj.map(
            (id) =>
              generateTemplate(platform, {
                title: null,
                content: id,
                groupId,
              })[0]
          ),
        ].map((obj, idx) => ({ ...obj, order: idx + 1 }));

        finalPages.push(...pages);
      });

      dispatch(setTemplates(finalPages));
      dispatch(setData(contentBreakdownObj));
    } else {
      dispatch(setTemplates(generateTemplate(selectedTemplates)));
    }
  };

  const handleDownload = useCallback(() => {
    _updateSelectedElement("");

    templates.forEach((template) => {
      const { platform, groupId, order, containerWidth, containerHeight } =
        template;
      const refId = `${groupId}-${platform}-${order}`;
      htmlToImage
        .toPng(templateRef.current[refId], {
          cacheBust: true,
          quality: 1,
          width: containerWidth,
          height: containerHeight,
        })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `[${getFormattedDate()}:${platform}] ${
            order ? `${order} - ` : ""
          }${filename}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [templateRef, templates, filename]);

  const updatedClassesForTag = (selectedElement, classes, action = "set") => {
    if (!selectedElement) return;
    const { element, uid } = splitName(selectedElement);
    const elements = canvasContainerRef.current.querySelectorAll(
      uid ? `${element}[data-id='${uid}']` : element
    );

    elements.forEach((el) => {
      if (action === "remove") {
        el.classList.remove(classes);
      } else if (action === "set") {
        el.classList = classes;
      } else if (action === "add") {
        el.classList.add(classes);
      }
    });
  };

  const handlePropertyChange = (property, value) => {
    const { element, uid } = splitName(selectedElement);
    let updatedProperties;

    const keyToUpdate = isGenericTagSelected ? element : getCleanKey(uid);

    if (isGlobal) {
      updatedProperties = {
        ...(globalProperties[keyToUpdate] || {}),
        [property]: value,
      };

      dispatch(
        setGlobalProperties({
          ...globalProperties,
          [keyToUpdate]: updatedProperties,
        })
      );
      updatedProperties = {
        ...updatedProperties,
        ...localProperties[selectedElement],
      };
    } else {
      updatedProperties = {
        ...(localProperties[selectedElement] || {}),
        [property]: value,
      };

      dispatch(
        setLocalProperties({
          ...localProperties,
          [selectedElement]: updatedProperties,
        })
      );
      updatedProperties = {
        ...globalProperties[keyToUpdate],
        ...updatedProperties,
      };
    }

    if (isGenericTagSelected) {
      // if tags, then apply the classes
      const updatedClasses = [
        ...Object.values(updatedProperties),
        value,
        "outlined",
      ].join(" ");
      updatedClassesForTag(selectedElement, updatedClasses);
    }
  };

  const canvasProps = {
    canvasContainerRef,
    templateRef,
    _updateSelectedElement,
    selectedElement,
  };

  const sidebarProps = {
    handleDownload,
    selectedElement,
    isGlobal,
    handlePropertyChange,
    isGenericTagSelected,
  };

  return (
    <div className="flex items-center flex-col p-0 h-full">
      <Header />
      <div className="flex items-start gap-0 w-full grow overflow-hidden">
        <Canvas {...canvasProps} />
        <Sidebar {...sidebarProps} />
      </div>
    </div>
  );
};

export default Raw;
