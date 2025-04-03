import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import "./Raw.scss";
import {
  GENERIC_PROPERTIES,
  getDefaultContent,
  generateTemplate,
} from "./config";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Header from "./Header";
import shortid from "shortid";

const Raw = () => {
  const [data, setData] = useState(getDefaultContent());
  const [selectedElement, setSelectedElement] = useState("");
  const [properties, setProperties] = useState({});
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState("instagram");
  const [postVariant, setPostVariant] = useState("Default");
  const [filename, setFilename] = useState("");

  const templateRef = useRef({});
  const canvasContainerRef = useRef();

  const isGenericTagSelected = GENERIC_PROPERTIES.includes(
    selectedElement.split(":")[1]
  );

  const _updateSelectedElement = (newValue) => {
    setSelectedElement((prev) => {
      const tag = prev.split(":")[1];
      if (GENERIC_PROPERTIES.includes(tag))
        updatedClassesForTag(tag, "outlined", "remove");
      return newValue;
    });
  };

  useEffect(() => {
    setTemplates(generateTemplate("instagram"));
  }, []);

  useEffect(() => {
    parseDataForTheme();
  }, [postVariant]);

  useEffect(() => {
    if (!selectedElement || isGenericTagSelected) return;

    const [groupId, platform, key] = selectedElement.split(":");
    let matchedProperties = {};
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      if (template.groupId === groupId && template.platform === platform) {
        matchedProperties = template.layout.find((item) => item.key === key);
        if (matchedProperties) break;
      }
    }

    setProperties((prev) => ({
      ...prev,
      [selectedElement]: {
        ...(prev[selectedElement] || {}),
        ...matchedProperties.properties,
      },
    }));
  }, [selectedElement]);

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

          _updateSelectedElement(`none:${tag}:${id}`);
          updatedClassesForTag(tag, "outlined", "add");
        } else {
          _updateSelectedElement("");
        }
      },
      true
    );
  }, [canvasContainerRef.current]);

  useEffect(() => {
    setFilename(
      data.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 30)
    );
  }, [data]);

  const parseDataForTheme = () => {
    const platform = "instagram";
    if (postVariant === "Listicle") {
      const content = data.content.trim().split("\n");
      const contentPageIds = [];
      const parsedContent = content.reduce((ob, content, index) => {
        const key = `content_#${index + 1}`;
        contentPageIds.push(key);
        return { ...ob, [key]: content };
      }, {});

      const groupId = shortid();
      const pages = generateTemplate(platform, {
        title: "title",
        content: null,
        groupId,
      })
        .concat([
          ...contentPageIds.map(
            (id) =>
              generateTemplate(platform, {
                title: null,
                content: id,
                groupId,
              })[0]
          ),
        ])
        .map((obj, idx) => ({ ...obj, idx: idx + 1 }));

      setData((prev) => ({ ...prev, ...parsedContent }));
      setTemplates(pages);
    } else {
      setTemplates(generateTemplate(platform));
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
          link.download = `[${new Date().getTime()}] ${idx}.${filename}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [templateRef, templates]);

  const updatedClassesForTag = (tag, classes, action = "set") => {
    if (!tag) return;
    const elements = canvasContainerRef.current.querySelectorAll(tag);

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
    const [groupId, platform, key] = selectedElement.split(":");
    let updatedProperties;

    setProperties((prev) => {
      updatedProperties = {
        ...(prev[selectedElement] || {}),
        [property]: value,
      };
      return {
        ...prev,
        [selectedElement]: updatedProperties,
      };
    });

    if (isGenericTagSelected) {
      // if tags, then apply the classes
      const updatedClasses = [
        ...Object.values(updatedProperties),
        value,
        "outlined",
      ].join(" ");
      updatedClassesForTag(platform, updatedClasses);
    } else {
      // otherwise add the classes in templates obj
      setTemplates((prev) => {
        const updatedData = [...prev];

        let matchedProperties = {};
        for (let i = 0; i < updatedData.length; i++) {
          const template = updatedData[i];
          if (template.groupId === groupId && template.platform === platform) {
            matchedProperties = template.layout.find(
              (item) => item.key === key
            );
            if (matchedProperties) {
              break;
            }
          }
        }

        matchedProperties.properties[property] = value;
        return updatedData;
      });
    }
  };

  const headerProps = {
    template,
    setTemplate,
    postVariant,
    setPostVariant,
  };

  const canvasProps = {
    canvasContainerRef,
    templateRef,
    data,
    _updateSelectedElement,
    selectedElement,
    templates,
  };

  const sidebarProps = {
    data,
    setData,
    filename,
    setFilename,
    handleDownload,
    selectedElement,
    properties,
    handlePropertyChange,
    templates,
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
