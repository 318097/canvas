import _ from "lodash";
import { md } from "../helpers";
import React from "react";
import "./Raw.scss";
import cn from "classnames";
import { Carousel, Button, Upload } from "antd";
import { generateName, getCleanKey } from "../helpers";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { applyRandomTheme, saveTheme, setSelectedFiles } from "../store";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const Canvas = ({
  canvasContainerRef,
  templateRef,
  _updateSelectedElement,
  selectedElement,
}) => {
  const {
    zoomLevel,
    view,
    templates,
    localProperties,
    globalProperties,
    data,
    showControls,
    selectedFiles,
  } = useSelector((state) => state.sdata);
  const dispatch = useDispatch();

  const grouppedTemplates = Object.entries(_.groupBy(templates, "groupId"));

  const zoomTransitionClasses = `transition-all duration-300 ease-in-out`;
  const cardContainerClasses = `flex flex-col items-start gap-1 ${zoomTransitionClasses}`;
  const cardContainerStyles = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: "0% 0%",
  };

  const handleMediaChange = (file, fileList) => {
    const filesPromises = fileList.map(
      (file) =>
        new Promise((resolve) => {
          getBase64(file, (url) => {
            resolve(url);
          });
        })
    );

    Promise.all(filesPromises).then((files) => {
      dispatch(setSelectedFiles(files));
    });

    return false;
  };
  const cardProps = {
    templateRef,
    data,
    selectedElement,
    _updateSelectedElement,
    localProperties,
    globalProperties,
    showControls,
    handleMediaChange,
    selectedFiles,
  };

  return (
    <div
      className={`p-2 bg-white grow h-full overflow-auto flex max-w-full justify-center ${
        view === "col"
          ? "flex-col gap-2 items-center"
          : "flex-wrap gap-8 items-start"
      }`}
      ref={canvasContainerRef}
    >
      {grouppedTemplates.map(([groupId, templates]) => {
        if (groupId === "none") {
          return templates.map((template, idx) => {
            const { platform, className } = template;
            const scalingContainerStyles = {
              width: `${template.containerWidth * zoomLevel}px`,
              height: `${template.containerHeight * zoomLevel + 40}px`,
            };
            return (
              <div
                key={groupId + idx}
                style={scalingContainerStyles}
                className={zoomTransitionClasses}
              >
                <div
                  className={cardContainerClasses}
                  style={cardContainerStyles}
                >
                  <Title
                    platform={platform}
                    className={className}
                    containerWidth={template.containerWidth}
                    saveTheme={() => dispatch(saveTheme())}
                    applyRandomTheme={() => dispatch(applyRandomTheme())}
                  />
                  <Card template={template} {...cardProps} />
                </div>
              </div>
            );
          });
        } else {
          const { containerWidth, className, platform } = templates[0];
          const scalingContainerStyles = {
            width: `${templates[0].containerWidth * zoomLevel}px`,
            height: `${templates[0].containerHeight * zoomLevel + 40}px`,
          };
          return (
            <div
              key={groupId}
              style={scalingContainerStyles}
              className={zoomTransitionClasses}
            >
              <div className={cardContainerClasses} style={cardContainerStyles}>
                <Title
                  platform={platform}
                  className={className}
                  templates={templates}
                  containerWidth={templates[0].containerWidth}
                  saveTheme={() => dispatch(saveTheme())}
                  applyRandomTheme={() => dispatch(applyRandomTheme())}
                />
                <div
                  className={`bg-gray-200 border p-[10px]`}
                  style={{
                    width: `${containerWidth}px`,
                  }}
                >
                  <Carousel arrows infinite={false} className="m-auto">
                    {templates.map((template) => (
                      <Card
                        template={template}
                        key={template.order}
                        {...cardProps}
                      />
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const Title = ({
  platform,
  className,
  templates,
  containerWidth,
  saveTheme,
  applyRandomTheme,
}) => (
  <div
    className="flex items-center justify-between w-full"
    style={{ width: `${containerWidth}px` }}
  >
    <h1 className="text-xl font-bold grow w-full" onClick={applyRandomTheme}>
      {platform} ({className})
    </h1>
    <div className="shrink-0">
      <button onClick={saveTheme}>Save</button>
      {!!templates && (
        <div className="text-sm">{`Total ${templates.length}`}</div>
      )}
    </div>
  </div>
);

const Card = ({
  template,
  templateRef,
  data,
  selectedElement,
  _updateSelectedElement,
  localProperties,
  globalProperties,
  showControls,
  handleMediaChange,
  selectedFiles = [],
}) => {
  const {
    layout,
    className = "",
    platform,
    groupId,
    order,
    pagination,
  } = template;
  const refId = `${groupId}-${platform}-${order}`;

  return (
    <div
      ref={(el) => (templateRef.current[refId] = el)}
      className={`raw-editor-root flex flex-col gap-2 bg-[#202227] p-4 relative ${className}`}
    >
      {layout.map(({ key, type }) => {
        const fullKey = generateName(groupId, platform, key);
        let value = _.get(data, key, "");

        if (key === "brand") {
          value = value.replace(/\./g, "&#46;"); // replace '.' with html entity code for dot, fixes conversion to hyperlink
        }

        const mergedProperties = {
          ..._.get(globalProperties, getCleanKey(key), {}),
          ..._.get(localProperties, fullKey, {}),
        };
        if (!value && type !== "media") return null;

        const classNames = cn("element", ...Object.values(mergedProperties), {
          outlined: selectedElement === fullKey,
        });

        if (type === "media") {
          const hasFiles = selectedFiles.length;
          return hasFiles ? (
            <div
              className={classNames}
              key={fullKey}
              onClick={() => _updateSelectedElement(fullKey)}
            >
              {selectedFiles.map((file, index) => (
                <img
                  className="w-full"
                  key={index}
                  src={file}
                  alt={`Selected file ${index + 1}`}
                />
              ))}
            </div>
          ) : null;
        }
        return (
          <div
            key={fullKey}
            onClick={() => _updateSelectedElement(fullKey)}
            className={classNames}
            dangerouslySetInnerHTML={{
              __html: md.render(value),
            }}
          ></div>
        );
      })}
      {pagination && (
        <div
          className={cn(
            Object.values(_.get(globalProperties, ["pagination"], {})).join(" ")
          )}
        >
          {pagination}
        </div>
      )}
      {showControls && (
        <div className="absolute bottom-1 right-1">
          <Upload
            name="avatar"
            multiple
            showUploadList={false}
            beforeUpload={handleMediaChange}
          >
            <Button>
              <PlusOutlined />
              Upload
            </Button>
          </Upload>
        </div>
      )}
    </div>
  );
};

export default Canvas;
