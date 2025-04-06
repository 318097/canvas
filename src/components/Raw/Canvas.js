import _ from "lodash";
import { marked } from "marked";
import React from "react";
import "./Raw.scss";
import cn from "classnames";
import { Carousel } from "antd";
import { generateName, getCleanKey } from "./helpers";
import { useSelector } from "react-redux";

// const renderer = new marked.Renderer();

// renderer.br = () => {
//   // Replace a single <br> with multiple <br> tags
//   return "<span class='space'></span>";
// };

// Configure marked to use the custom renderer
// marked.setOptions({
//   renderer,
// });

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
  } = useSelector((state) => state.config);

  const grouppedTemplates = Object.entries(_.groupBy(templates, "groupId"));

  const zoomTransitionClasses = `transition-all duration-300 ease-in-out`;
  const cardContainerClasses = `flex flex-col items-start gap-1 ${zoomTransitionClasses}`;
  const cardContainerStyles = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: "0% 0%",
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
        const cardProps = {
          templateRef,
          data,
          selectedElement,
          _updateSelectedElement,
          localProperties,
          globalProperties,
        };

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
    {!!templates && (
      <div className="text-sm shrink-0">{`Total ${templates.length}`}</div>
    )}
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
}) => {
  const { layout, className = "", platform, groupId, order } = template;
  const refId = `${groupId}-${platform}-${order}`;
  return (
    <div
      ref={(el) => (templateRef.current[refId] = el)}
      className={`raw-editor-root flex flex-col gap-2 bg-[#202227] p-4 ${className}`}
    >
      {layout.map(({ key }) => {
        const fullKey = generateName(groupId, platform, key);
        const value = _.get(data, key, "");

        const mergedProperties = {
          ..._.get(globalProperties, getCleanKey(key), {}),
          ..._.get(localProperties, fullKey, {}),
        };
        if (!value) return null;

        const classNames = cn("element", ...Object.values(mergedProperties), {
          outlined: selectedElement === fullKey,
        });
        return (
          <div
            key={fullKey}
            onClick={() => _updateSelectedElement(fullKey)}
            className={classNames}
            dangerouslySetInnerHTML={{
              __html: marked.parseInline(value).replace(/^<p>|<\/p>$/g, ""),
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default Canvas;
