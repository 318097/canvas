import _ from "lodash";
import { md } from "../helpers";
import React from "react";
import "./Raw.scss";
import cn from "classnames";
import { Carousel } from "antd";
import { generateName, getCleanKey } from "../helpers";
import { useSelector } from "react-redux";

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
    dataConfig,
  } = useSelector((state) => state.sdata);

  const grouppedTemplates = Object.entries(_.groupBy(templates, "groupId"));

  const zoomTransitionClasses = `transition-all duration-300 ease-in-out`;
  const cardContainerClasses = `flex flex-col items-start gap-1 ${zoomTransitionClasses}`;
  const cardContainerStyles = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: "0% 0%",
  };

  const cardProps = {
    templateRef,
    data,
    selectedElement,
    _updateSelectedElement,
    localProperties,
    globalProperties,
    showControls,
    dataConfig,
  };

  return (
    <div
      className={`p-2 bg-white grow h-full overflow-auto flex max-w-full justify-center ${
        view === "col"
          ? "flex-col gap-2 items-center"
          : "flex-wrap gap-2 items-start"
      }`}
      ref={canvasContainerRef}
    >
      {grouppedTemplates.map(([groupId, templates]) => {
        if (groupId === "detached") {
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

const Title = ({ platform, className, templates, containerWidth }) => (
  <div
    className="flex items-center justify-between w-full"
    style={{ width: `${containerWidth}px` }}
  >
    <h1 className="text-xl font-bold grow w-full">
      {platform} ({className})
    </h1>
    <div className="shrink-0">
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
  dataConfig,
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
      className={cn(
        "raw-editor-root",
        className,
        ...Object.values(_.get(globalProperties, "raw-editor-root", {}))
      )}
    >
      {layout
        .filter(({ key: element }) =>
          _.get(dataConfig, [element, "visible"], true)
        )
        .map(({ key: element, type }) => {
          const fullKey = generateName(platform, groupId, element);
          let value = _.get(data, element, "");

          if (element === "brand") {
            value = value.replace(/\./g, "&#46;"); // replace '.' with html entity code for dot, fixes conversion to hyperlink
          }

          const mergedProperties = {
            ..._.get(globalProperties, getCleanKey(element), {}),
            ..._.get(localProperties, fullKey, {}),
          };
          if (!value && type !== "media") return null;

          const classNames = cn("element", ...Object.values(mergedProperties), {
            outlined: selectedElement === fullKey,
          });

          if (type === "media") {
            const hasFiles = data.files?.length;
            return hasFiles ? (
              <div
                className={classNames}
                key={fullKey}
                onClick={() => _updateSelectedElement(fullKey)}
              >
                {data.files?.map(({ url }, index) => (
                  <img
                    className="w-full"
                    key={index}
                    src={url}
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
    </div>
  );
};

export default Canvas;
