import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import "./Raw.scss";
import { GENERIC_PROPERTIES, GLOBAL } from "./config";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Header from "./Header";
import shortid from "shortid";
import {
  isGenericTag,
  splitName,
  generateName,
  getDefaultContent,
  generateTemplate,
  getCleanKey,
} from "./helpers";

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
  const [zoomLevel, setZoomLevel] = useState(0.5);

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
        if (["CODE", "STRONG"].includes(tag)) {
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
  }, [globalProperties, canvasContainerRef.current]);

  useEffect(() => {
    setFilename(
      data.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 30)
    );
  }, [data]);

  const parseDataForVariant = () => {
    const platform = "instagram";
    if (postVariant === "listicle") {
      const content = data.content.trim().split("\n");
      const contentPageIds = [];
      const contentBreakdownObj = content.reduce((ob, content, index) => {
        const key = `content_#${index + 1}`;
        contentPageIds.push(key);
        return { ...ob, [key]: content };
      }, {});

      const groupId = shortid();
      const pages = [
        ...generateTemplate(platform, {
          title: "title",
          content: null,
          groupId,
        }),
        ...contentPageIds.map(
          (id) =>
            generateTemplate(platform, {
              title: null,
              content: id,
              groupId,
            })[0]
        ),
      ].map((obj, idx) => ({ ...obj, idx: idx + 1 }));

      setData((prev) => ({ ...prev, ...contentBreakdownObj }));
      setTemplates(pages);
    } else {
      setTemplates(generateTemplate(selectedTemplates));
    }
  };

  const handleDownload = useCallback(() => {
    _updateSelectedElement("");

    templates.forEach((template) => {
      const { platform, groupId, idx, containerWidth, containerHeight } =
        template;
      const refId = `${groupId}-${platform}-${idx}`;

      htmlToImage
        .toPng(templateRef.current[refId], {
          cacheBust: true,
          quality: 1,
          width: containerWidth,
          height: containerHeight,
        })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `[${new Date().getTime()}] ${
            idx ? `${idx}.` : ""
          }${filename}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [templateRef, templates]);

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
