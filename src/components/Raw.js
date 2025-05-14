import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import "./Raw.scss";
import { GENERIC_PROPERTIES } from "../config";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import Mainbar from "./Mainbar";
import shortid from "shortid";
import {
  isGenericTag,
  splitName,
  generateName,
  getCleanKey,
  getFormattedDate,
  getGenericClass,
  isGenericClass,
} from "../helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementExportId,
  incrementTotalExports,
  setGlobalProperties,
  setLocalProperties,
  setNotification,
  setShowControls,
} from "../store";
import { message, Progress } from "antd";
import _ from "lodash";

const Raw = () => {
  const [selectedElement, setSelectedElement] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const {
    data,
    filename,
    propertyType,
    templates,
    globalProperties,
    localProperties,
    exportId,
    notification,
  } = useSelector((state) => state.sdata);

  const isGlobal = propertyType === "global";
  const templateRef = useRef({});
  const canvasContainerRef = useRef();

  const isGenericTagSelected = isGenericTag(selectedElement);
  const isGenericClassSelected = isGenericClass(selectedElement);

  const _updateSelectedElement = (newValue) => {
    setSelectedElement((prev) => {
      const { element } = splitName(prev);
      if (GENERIC_PROPERTIES.includes(element))
        updatedClassesForTag(prev, "outlined", "remove");
      return newValue;
    });
  };

  useEffect(() => {
    canvasContainerRef.current.addEventListener(
      "click",
      (e) => {
        const tag = _.toLower(e.target.tagName);
        if (
          GENERIC_PROPERTIES.includes(tag) ||
          getGenericClass(e.target.classList)
        ) {
          e.stopPropagation();
          e.preventDefault();
          const id = e.target.dataset.id ? e.target.dataset.id : shortid();
          e.target.dataset.id = id;
          const fullKey = generateName(
            "null",
            `detached`,
            getGenericClass(e.target.classList) ?? tag,
            id
          );
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
    if (!notification) return;
    setTimeout(() => {
      showMsg(notification);
    }, 500);
  }, [notification]);

  const handleDownload = useCallback(() => {
    dispatch(setShowControls(false));
    _updateSelectedElement("");
    setProgressPercent(20);
    const eachProgress = Math.floor(80 / templates.length);
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
          dispatch(incrementTotalExports());
          const link = document.createElement("a");
          link.download = `#${exportId} [${getFormattedDate()}:${platform}] ${
            order ? `${order} - ` : ""
          }${filename || "export"}.png`;
          link.href = dataUrl;
          link.click();
          setProgressPercent((prev) => {
            const newPercent = prev + eachProgress;
            if (newPercent >= 100) {
              dispatch(setNotification("Export completed"));
              return 100;
            }
            return newPercent;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
    setTimeout(() => {
      dispatch(setShowControls(true));
      dispatch(incrementExportId());
      setProgressPercent(0);
    }, 3000);
  }, [templateRef, templates, filename, exportId]);

  const showMsg = (msg) => {
    messageApi.info(msg);
    setTimeout(() => {
      dispatch(setNotification(null));
    }, 100);
  };

  const updatedClassesForTag = (selectedElement, classList, action = "set") => {
    classList = [].concat(classList);
    if (!selectedElement) return;
    const { element, uid } = splitName(selectedElement);
    const elements = canvasContainerRef.current.querySelectorAll(
      uid ? `${element}[data-id='${uid}']` : element
    );

    elements.forEach((el) => {
      if (action === "remove") {
        el.classList.remove(classList);
      } else if (action === "set") {
        el.classList = classList.join(" ");
      } else if (action === "add") {
        el.classList.add(...classList);
      }
    });
  };

  const handlePropertyChange = (property, value) => {
    const { element } = splitName(selectedElement);
    let updatedProperties;

    const keyToUpdate = getCleanKey(element);

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

    if (isGenericTagSelected || isGenericClassSelected) {
      // if tags, then apply the classes
      const updatedClasses = [
        ...Object.values(updatedProperties),
        value,
        "outlined",
      ];
      updatedClassesForTag(
        selectedElement,
        updatedClasses,
        isGenericClassSelected ? "add" : "set"
      );
    }
  };

  const canvasProps = {
    canvasContainerRef,
    templateRef,
    _updateSelectedElement,
    selectedElement,
  };

  const mainbarProps = {
    handleDownload,
  };
  const sidebarProps = {
    selectedElement,
    isGlobal,
    handlePropertyChange,
  };

  return (
    <div className="flex items-center flex-col p-0 h-full">
      {!!progressPercent && (
        <Progress
          percent={progressPercent}
          strokeLinecap="butt"
          status="active"
          showInfo={false}
        />
      )}
      <div className="flex items-start gap-0 w-full grow overflow-hidden">
        <Mainbar {...mainbarProps} />
        <Canvas {...canvasProps} />
        <Sidebar {...sidebarProps} />
      </div>
      {contextHolder}
    </div>
  );
};

export default Raw;
