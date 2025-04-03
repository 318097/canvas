import _ from "lodash";
import { marked } from "marked";
import React from "react";
import "./Raw.scss";
import cn from "classnames";
import { Carousel } from "antd";

const Canvas = ({
  canvasContainerRef,
  templateRef,
  data,
  _updateSelectedElement,
  selectedElement,
  templates,
}) => {
  const grouppedTemplates = Object.entries(_.groupBy(templates, "groupId"));

  const containerClasses = `flex flex-col items-start gap-1 mb-12`;

  return (
    <div
      className="p-2 bg-white grow h-full overflow-auto flex flex-col items-center max-w-full"
      ref={canvasContainerRef}
    >
      {grouppedTemplates.map(([groupId, templates]) => {
        const cardProps = {
          templateRef,
          data,
          selectedElement,
          _updateSelectedElement,
        };
        if (groupId === "none") {
          return templates.map((template) => {
            const { platform, className } = template;
            return (
              <div className={containerClasses}>
                <Title platform={platform} className={className} />
                <Card template={template} {...cardProps} />
              </div>
            );
          });
        } else {
          const { containerWidth, className, platform } = templates[0];
          return (
            <div className={containerClasses}>
              <Title
                platform={platform}
                className={className}
                templates={templates}
              />
              <div
                className={`bg-gray-200 border p-[10px]`}
                style={{
                  width: `${containerWidth}px`,
                }}
              >
                <Carousel arrows infinite={false} className="m-auto">
                  {templates.map((template) => (
                    <Card template={template} {...cardProps} />
                  ))}
                </Carousel>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const Title = ({ platform, className, templates }) => (
  <div className="flex items-center justify-between w-full">
    <h1 className="text-xl font-bold">
      {platform} ({className})
    </h1>
    {!!templates && (
      <div className="text-sm">{`Total ${templates.length}`}</div>
    )}
  </div>
);

const Card = ({
  template,
  templateRef,
  data,
  selectedElement,
  _updateSelectedElement,
}) => {
  const { layout, className = "", platform, groupId } = template;
  return (
    <div
      ref={templateRef}
      className={`raw-editor-root flex flex-col gap-2 bg-gray-800 p-4 ${className}`}
    >
      {layout.map((layout) => {
        const { key, type, className = "", properties = {} } = layout;

        const value = _.get(data, key, "");

        if (!value) return null;

        const fullKey = `${groupId}:${platform}:${key}`;

        const classNames = cn(
          "element",
          type,
          "p-2",
          className,
          ...Object.values(properties),
          {
            outlined: selectedElement === fullKey,
          }
        );
        return (
          <div
            onClick={() => {
              _updateSelectedElement(fullKey);
            }}
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
