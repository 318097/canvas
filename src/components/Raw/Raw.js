import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import "./Raw.scss";
import { GENERIC_PROPERTIES, GLOBAL } from "./config";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Header from "./Header";
import shortid from "shortid";
import { getFormattedDate, getSlug } from "./helpers";
import {
  isGenericTag,
  splitName,
  generateName,
  getDefaultContent,
  generateTemplate,
  getCleanKey,
} from "./helpers";

const INITIAL_ZOOM_LEVEL = 0.6;

const Raw = () => {
  const [data, setData] = useState(getDefaultContent());
  const [selectedElement, setSelectedElement] = useState("");
  const [globalProperties, setGlobalProperties] = useState(GLOBAL);
  const [localProperties, setLocalProperties] = useState({});
  const [propertyType, setPropertyType] = useState("local");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState(["instagram"]);
  const [postVariant, setPostVariant] = useState("default");
  const [filename, setFilename] = useState("");
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL);
  const [view, setView] = useState("col");

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

  useEffect(() => {
    setZoomLevel(selectedTemplates.length > 1 ? INITIAL_ZOOM_LEVEL : 0.8);
    setView(selectedTemplates.length > 1 ? "row" : "col");
    setTemplates(generateTemplate(selectedTemplates));
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

  useEffect(() => {
    setFilename(getSlug(data.title));
  }, [data]);

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
        const groupId = shortid();
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

      setTemplates(finalPages);
      setData((prev) => ({ ...prev, ...contentBreakdownObj }));
    } else {
      setTemplates(generateTemplate(selectedTemplates));
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
      setGlobalProperties((prev) => {
        updatedProperties = {
          ...(prev[keyToUpdate] || {}),
          [property]: value,
        };
        return {
          ...prev,
          [keyToUpdate]: updatedProperties,
        };
      });
      updatedProperties = {
        ...updatedProperties,
        ...localProperties[selectedElement],
      };
    } else {
      setLocalProperties((prev) => {
        updatedProperties = {
          ...(prev[selectedElement] || {}),
          [property]: value,
        };
        return {
          ...prev,
          [selectedElement]: updatedProperties,
        };
      });
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

  const headerProps = {
    selectedTemplates,
    setSelectedTemplates,
    postVariant,
    setPostVariant,
    zoomLevel,
    setZoomLevel,
    setView,
    view,
  };

  const canvasProps = {
    canvasContainerRef,
    templateRef,
    data,
    _updateSelectedElement,
    selectedElement,
    templates,
    localProperties,
    globalProperties,
    zoomLevel,
    view,
  };

  const sidebarProps = {
    data,
    setData,
    filename,
    setFilename,
    handleDownload,
    selectedElement,
    localProperties,
    handlePropertyChange,
    globalProperties,
    setGlobalProperties,
    propertyType,
    setPropertyType,
    isGlobal,
  };

  return (
    <div className="flex items-center flex-col p-0 h-full">
      <Header {...headerProps} />
      <div className="flex items-start gap-0 w-full grow overflow-hidden">
        <Canvas {...canvasProps} />
        <Sidebar {...sidebarProps} />
      </div>
    </div>
  );
};

export default Raw;
