import _ from "lodash";
import React, { Fragment } from "react";
import { Input, Select, Button } from "antd";
import { PROPERTIES } from "./config";

const { TextArea } = Input;

const Sidebar = ({
  data,
  setData,
  filename,
  setFilename,
  handleDownload,
  selectedElement,
  properties,
  handlePropertyChange,
  templates,
}) => {
  const selectedElementFields = templates.find((template) => {
    const [groupId, platform, key] = selectedElement.split(":");
    return (
      groupId === template.groupId &&
      platform === template.platform &&
      template.layout.find((layout) => layout.key === key)
    );
  });

  return (
    <div className="flex flex-col gap-2 bg-gray-100 border border-l-gray-300 p-2 w-[300px] shrink-0 h-full overflow-auto">
      {(selectedElementFields?.layout ?? []).map((fields) => {
        const { key } = fields;
        return (
          <div className="flex flex-col items-start gap-1 mb-2">
            <label className="text-xs font-bold">{key}</label>
            <TextArea
              rows={4}
              placeholder={key}
              value={data[key]}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
              spellCheck={false}
            />
          </div>
        );
      })}

      {!!selectedElement && (
        <Fragment>
          <hr />
          <h3 className="text-sm font-bold text-left">
            Properties: {selectedElement}
          </h3>
          {PROPERTIES.map((property) => {
            const { options, label, key } = property;

            const value = _.get(properties, [selectedElement, key], "");
            return (
              <div className="flex flex-col items-start gap-1 mb-2">
                <label className="text-xs font-bold">{label}</label>
                <Select
                  options={options}
                  onChange={(value) => handlePropertyChange(key, value)}
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
  );
};

export default Sidebar;
