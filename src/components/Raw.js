import _ from "lodash";
import { marked } from "marked";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import "./Raw.scss";
import cn from "classnames";

const PROPERTIES = [
  {
    label: "Font Size",
    key: "text-size",
    options: [
      {
        label: "Base",
        value: "text-base",
      },
      {
        label: "XS",
        value: "text-xs",
      },
      {
        label: "SM",
        value: "text-sm",
      },
      {
        label: "MD",
        value: "text-md",
      },
      {
        label: "LG",
        value: "text-3xl",
      },
      {
        label: "XL",
        value: "text-4xl",
      },
      {
        label: "2XL",
        value: "text-5xl",
      },
      {
        label: "3XL",
        value: "text-6xl",
      },
      {
        label: "4XL",
        value: "text-7xl",
      },
    ],
  },
  {
    label: "Text Align",
    key: "text-align",
    options: [
      {
        label: "Left",
        value: "text-left",
      },
      {
        label: "Center",
        value: "text-center",
      },
      {
        label: "Right",
        value: "text-right",
      },
      {
        label: "Justify",
        value: "text-justify",
      },
    ],
  },
  {
    label: "Text Color",
    key: "text-color",
    options: [
      {
        label: "Red",
        value: "text-red-500",
      },
      {
        label: "Blue",
        value: "text-blue-500",
      },
      {
        label: "Green",
        value: "text-green-500",
      },
      {
        label: "Yellow",
        value: "text-yellow-500",
      },
      {
        label: "Purple",
        value: "text-purple-500",
      },
      {
        label: "Pink",
        value: "text-pink-500",
      },
      {
        label: "Orange",
        value: "text-orange-500",
      },
      {
        label: "Teal",
        value: "text-teal-500",
      },
      {
        label: "Cyan",
        value: "text-cyan-500",
      },
      {
        label: "Lime",
        value: "text-lime-500",
      },
    ],
  },
  {
    label: "Font Weight",
    key: "text-weight",
    options: [
      {
        label: "Thin",
        value: "font-thin",
      },
      {
        label: "Extra Light",
        value: "font-extralight",
      },
      {
        label: "Light",
        value: "font-light",
      },
      {
        label: "Normal",
        value: "font-normal",
      },
      {
        label: "Medium",
        value: "font-medium",
      },
      {
        label: "Semi Bold",
        value: "font-semibold",
      },
      {
        label: "Bold",
        value: "font-bold",
      },
      {
        label: "Extra Bold",
        value: "font-extrabold",
      },
      {
        label: "Black",
        value: "font-black",
      },
    ],
  },
];

const CONFIG = [
  {
    platform: "INSTAGRAM",
    fontMultiplier: 2,
    className: `h-[1080px] w-[1080px]`,
    layout: [
      {
        type: "title",
        key: "title",
        className: "leading-relaxed",
        properties: {
          "text-size": "text-5xl",
          "text-weight": "font-bold",
          "text-align": "text-center",
          "text-color": "text-white",
        },
      },
      {
        type: "paragraph",
        key: "content",
        className: "leading-relaxed",
        properties: {
          "text-size": "text-3xl",
          "text-align": "text-left",
          "text-color": "text-white",
        },
      },
    ],
  },
];

const getDefaultContent = () => {
  return {
    title: "Custom `.pick` for objects",
    content: `
- snake_case  
- keb-case  
- camelCase (JS variables, functions)  
- PascalCase (JS Classes)  
- SCREAMING_SNAKE_CASE (JS constants)  
`,
  };
};

const Raw = () => {
  const [data, setData] = useState(getDefaultContent());
  const [selected, setSelected] = useState("");
  const [properties, setProperties] = useState({});
  const [config, setConfig] = useState(CONFIG);
  const ref = useRef();

  useEffect(() => {
    if (!selected) return;

    const [platform, section] = selected.split(":");
    const match = config[0].layout.find((item) => item.key === section);
    setProperties(match.properties);
  }, [selected]);

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

  const handleChange = (e, key) => {
    setProperties((prev) => ({
      ...prev,
      classes: cn(prev.classes, e.target.value),
    }));
    const [, section] = selected.split(":");
    setConfig((prev) => {
      const newConfig = [...prev];
      const match = newConfig[0].layout.find((item) => item.key === section);
      match.properties[key] = e.target.value;
      return newConfig;
    });
  };

  return (
    <div className="flex items-center flex-col p-1">
      <header class="flex items-center justify-between w-2/3 p-4 bg-green-400 rounded-xl">
        <h3 className="text-white font-bold">Canvas</h3>
        <button className="text-white text-sm" onClick={handleDownload}>
          Download
        </button>
      </header>
      <div className="flex items-start gap-2">
        <div className="p-1 rounded-xl bg-gray-400">
          {config.map((config) => {
            const { layout, className = "", fontMultiplier, platform } = config;
            return (
              <div className="flex flex-col items-start gap-2">
                <h1 className="text-2xl font-bold">{platform}</h1>
                <div
                  ref={ref}
                  className={`raw-editor-root flex flex-col gap-2 bg-gray-800 p-4 ${className}`}
                >
                  {layout.map((layout) => {
                    const {
                      key,
                      type,
                      className = "",
                      properties = {},
                    } = layout;
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
                        selected: selected === fullKey,
                      }
                    );
                    return (
                      <div className="atom">
                        <div
                          onClick={() => {
                            setSelected(fullKey);
                          }}
                          className={classNames}
                          dangerouslySetInnerHTML={{
                            __html: marked
                              .parseInline(value)
                              .replace(/^<p>|<\/p>$/g, ""),
                          }}
                        ></div>
                        <div className="actions">
                          <div class="action">align</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-gray-400 p-2 w-1/3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Title</label>
            <input
              type="text"
              className="p-2 rounded-xl bg-gray-800 text-white"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Content</label>
            <textarea
              rows={10}
              className="p-2 rounded-xl bg-gray-800 text-white"
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
            />
          </div>
          {!!selected && (
            <Fragment>
              <hr />
              <h3 className="text-sm font-bold">Properties: {selected}</h3>
              {PROPERTIES.map((property) => {
                const { options, label, key } = property;

                const value = _.get(properties, key, "");
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">{label}</label>
                    <select
                      className="p-2 rounded-xl bg-gray-800 text-white"
                      onChange={(e) => handleChange(e, key)}
                      value={value}
                    >
                      {options.map((option) => {
                        const { label, value } = option;
                        return (
                          <option
                            key={value}
                            value={value}
                            className="p-2 rounded-xl bg-gray-800 text-white"
                          >
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Raw;
