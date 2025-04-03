import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import "./Raw.scss";
import { GENERIC_PROPERTIES, getDefaultContent, TEMPLATES } from "./config";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Header from "./Header";

const Raw = () => {
  const [data, setData] = useState(getDefaultContent());
  const [selectedElement, setSelectedElement] = useState("");
  const [properties, setProperties] = useState({});
  const [templates, setTemplates] = useState(TEMPLATES);
  const [filename, setFilename] = useState("");

  const ref = useRef();
  const canvasContainerRef = useRef();

  const isGenericTagSelected = GENERIC_PROPERTIES.includes(selectedElement);

  const updateSelectedItem = (newValue) => {
    setSelectedElement((prev) => {
      if (GENERIC_PROPERTIES.includes(prev))
        updatedClassesForTag(prev, "outlined", "remove");
      return newValue;
    });
  };

  useEffect(() => {
    if (!selectedElement || isGenericTagSelected) return;

    const [platform, section] = selectedElement.split(":");
    const match = templates[0].layout.find((item) => item.key === section);
    setProperties((prev) => ({
      ...prev,
      [selectedElement]: {
        ...(prev[selectedElement] || {}),
        ...match.properties,
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
          const id = Math.random().toString(36).substr(2, 9);
          e.target.dataset.id = id;
          // updateSelectedItem(`${tag}:${id}`);
          updateSelectedItem(tag);
          updatedClassesForTag(tag, "outlined", "add");
        } else {
          updateSelectedItem("");
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

  const handleDownload = useCallback(() => {
    updateSelectedItem("");
    if (ref.current === null) {
      return;
    }

    htmlToImage
      .toPng(ref.current, {
        cacheBust: true,
        quality: 1,
        width: 1080,
        height: 1080,
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

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

  const handlePropertyChange = (key, value) => {
    const [element, section] = selectedElement.split(":");
    let updatedProperties;
    setProperties((prev) => {
      updatedProperties = {
        ...(prev[selectedElement] || {}),
        [key]: value,
      };
      return {
        ...prev,
        [selectedElement]: updatedProperties,
      };
    });

    if (isGenericTagSelected) {
      const updatedClasses = [
        ...Object.values(updatedProperties),
        value,
        "outlined",
      ].join(" ");
      updatedClassesForTag(element, updatedClasses);
    } else {
      setTemplates((prev) => {
        const newConfig = [...prev];
        const match = newConfig[0].layout.find((item) => item.key === section);
        match.properties[key] = value;
        return newConfig;
      });
    }
  };

  const canvasProps = {
    canvasContainerRef,
    ref,
    data,
    updateSelectedItem,
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
