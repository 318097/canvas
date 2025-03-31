import _ from "lodash";
import { marked } from "marked";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import "./Raw.scss";
import cn from "classnames";

const Raw = () => {
  const [data, setData] = useState({
    title: "Custom `.pick` for objects",
    content: `
    - snake_case
    - kebab-case
    - camelCase (JS variables, functions)
    - PascalCase (JS Classes)
    - SCREAMING_SNAKE_CASE (JS constants)
    `,
  });
  const [highlighted, setHighlighted] = useState(true);

  const ref = useRef();

  const layout = [
    {
      type: "title",
      key: "title",
    },
    {
      type: "paragraph",
      key: "content",
    },
  ];

  const CONFIG = [
    {
      type: "INSTAGRAM",
      fontMultiplier: 4,
      className: `h-[1080px] w-[1080px]`,
      layout,
    },
  ];
  useEffect(() => {}, []);

  const handleDownload = useCallback(() => {
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
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="flex items-center flex-col">
      {CONFIG.map((config) => {
        const { layout, className = "", fontMultiplier } = config;
        return (
          <div
            ref={ref}
            className={`raw-editor-root flex flex-col gap-2 bg-gray-100 p-4 ${className}`}
          >
            {layout.map((layout) => {
              const { key, type } = layout;
              const value = _.get(data, key, "");

              if (!value) return null;

              const classNames = cn(
                type,
                "p-2",
                `text-[${1 * fontMultiplier}rem]`,
                {
                  highlighted,
                }
              );
              return (
                <div
                  className={classNames}
                  dangerouslySetInnerHTML={{
                    __html: marked.parseInline(value),
                  }}
                />
              );
            })}
          </div>
        );
      })}
      <br />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default Raw;
