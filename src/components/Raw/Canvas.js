import _ from "lodash";
import { marked } from "marked";
import React from "react";
import "./Raw.scss";
import cn from "classnames";

const Canvas = ({
  canvasContainerRef,
  ref,
  data,
  updateSelectedItem,
  selectedElement,
  templates,
}) => {
  return (
    <div
      className="p-2 bg-white grow h-full overflow-auto flex flex-col items-center"
      ref={canvasContainerRef}
    >
      {templates.map((template) => {
        const { layout, className = "", platform } = template;
        return (
          <div className="flex flex-col items-start gap-1 mb-12">
            <h1 className="text-xl font-bold">
              {platform} ({className})
            </h1>
            <div
              ref={ref}
              className={`raw-editor-root flex flex-col gap-2 bg-gray-800 p-4 ${className}`}
            >
              {layout.map((layout) => {
                const { key, type, className = "", properties = {} } = layout;
                const value = _.get(data, key, "");

                if (!value) return null;

                const fullKey = `${platform}:${key}`;

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
                      updateSelectedItem(fullKey);
                    }}
                    className={classNames}
                    dangerouslySetInnerHTML={{
                      __html: marked
                        .parseInline(value)
                        .replace(/^<p>|<\/p>$/g, ""),
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
