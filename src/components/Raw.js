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
import { Input, Select, Button } from "antd";
import { getDefaultContent, PROPERTIES, CONFIG } from "./config";

const { TextArea } = Input;

const Raw = () => {
  const [data, setData] = useState(getDefaultContent());
  const [selected, setSelected] = useState("");
  const [properties, setProperties] = useState({});
  const [config, setConfig] = useState(CONFIG);
  const [filename, setFilename] = useState("");
  const ref = useRef();

  useEffect(() => {
    if (!selected) return;

    const [platform, section] = selected.split(":");
    const match = config[0].layout.find((item) => item.key === section);
    setProperties(match.properties);
  }, [selected]);

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
    setSelected("");
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

  const handleChange = (key, value) => {
    setProperties((prev) => ({
      ...prev,
      [key]: value,
    }));

    const [, section] = selected.split(":");

    setConfig((prev) => {
      const newConfig = [...prev];
      const match = newConfig[0].layout.find((item) => item.key === section);
      match.properties[key] = value;
      return newConfig;
    });
  };

  return (
    <div className="flex items-center flex-col p-0 h-full">
      <header class="flex items-center justify-between w-full p-4 bg-cyan-200">
        <h3 className="text-white font-bold">Canvas</h3>
      </header>
      <div className="flex items-start gap-0 w-full grow overflow-hidden">
        <div className="p-2 bg-white grow h-full overflow-auto flex flex-col items-center">
          {config.map((config) => {
            const { layout, className = "", fontMultiplier, platform } = config;
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
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 bg-gray-100 border border-l-gray-300 p-2 w-[300px] h-full overflow-auto">
          <div className="flex flex-col items-start gap-1 mb-2">
            <label className="text-xs font-bold">Title</label>
            <TextArea
              rows={4}
              placeholder="Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col items-start gap-1 mb-2">
            <label className="text-xs font-bold">Content</label>
            <TextArea
              rows={12}
              placeholder="Content"
              value={data.content}
              spellCheck={false}
              onChange={(e) => setData({ ...data, content: e.target.value })}
            />
          </div>
          {!!selected && (
            <Fragment>
              <hr />
              <h3 className="text-sm font-bold text-left">
                Properties: {selected}
              </h3>
              {PROPERTIES.map((property) => {
                const { options, label, key } = property;

                const value = _.get(properties, key, "");
                return (
                  <div className="flex flex-col items-start gap-1 mb-2">
                    <label className="text-xs font-bold">{label}</label>
                    <Select
                      options={options}
                      onChange={(value) => handleChange(key, value)}
                      value={value}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </Fragment>
          )}
          <div className="grow flex justify-end flex-col gap-2">
            <Input
              placeholder="Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <Button className="w-full" onClick={handleDownload}>
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Raw;
