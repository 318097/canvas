import _ from "lodash";
import { marked } from "marked";
import React from "react";
import "./Raw.scss";
import cn from "classnames";
import { Carousel } from "antd";
import { generateName, getCleanKey } from "./helpers";

const Canvas = ({
  canvasContainerRef,
  templateRef,
  data,
  _updateSelectedElement,
  selectedElement,
  templates,
  properties,
  global,
}) => {
  const grouppedTemplates = Object.entries(_.groupBy(templates, "groupId"));

  const containerClasses = `flex flex-col items-start gap-1 mb-12`;

  return (
    <div
      className="p-2 bg-white grow h-full overflow-auto flex flex-col items-center max-w-full"
      ref={canvasContainerRef}
    >
      {grouppedTemplates.map(([groupId, templates], idx) => {
        const cardProps = {
          templateRef,
          data,
          selectedElement,
          _updateSelectedElement,
          properties,
          global,
        };
        if (groupId === "none") {
          return templates.map((template) => {
            const { platform, className } = template;
            return (
              <div className={containerClasses} key={idx}>
                <Title platform={platform} className={className} />
                <Card template={template} {...cardProps} />
              </div>
            );
          });
        } else {
          const { containerWidth, className, platform } = templates[0];
          return (
            <div className={containerClasses} key={idx}>
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
                    <Card
                      template={template}
                      key={template.idx}
                      {...cardProps}
                    />
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
  properties,
  global,
}) => {
  const { layout, className = "", platform, groupId, idx } = template;
  const refId = `${groupId}-${platform}-${idx}`;
  return (
    <div
      ref={(el) => (templateRef.current[refId] = el)}
      className={`raw-editor-root flex flex-col gap-2 bg-gray-800 p-4 ${className}`}
    >
      {layout.map((layout) => {
        const { key, type, className = "" } = layout;
        const fullKey = generateName(groupId, platform, key);
        const value = _.get(data, key, "");

        const mergedProperties = {
          ..._.get(global, getCleanKey(key), {}),
          ..._.get(properties, fullKey, {}),
        };
        if (!value) return null;

        const classNames = cn(
          "element",
          type,
          // "p-2",
          className,
          ...Object.values(mergedProperties),
          {
            outlined: selectedElement === fullKey,
          }
        );
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
