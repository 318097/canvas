import _ from "lodash";
import React, { Fragment } from "react";
import { Input, Select, Button, Radio } from "antd";
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
  global,
  setGlobal,
  propertyType,
  setPropertyType,
  isGlobal,
}) => {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 border border-l-gray-300 p-2 w-[300px] shrink-0 h-full overflow-auto">
      {Object.keys(data).map((key) => {
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
          <h3 className="text-sm font-bold text-left">{selectedElement}</h3>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            className="mb-4"
            options={[
              {
                label: "Global",
                value: "global",
              },
              {
                label: "Local",
                value: "local",
              },
            ]}
            onChange={(e) => setPropertyType(e.target.value)}
            value={propertyType}
          />
          {PROPERTIES.map((property) => {
            const { options, label, key } = property;

            const [, element] = selectedElement.split(":");
            const value = isGlobal
              ? _.get(global, [element, key], "")
              : _.get(properties, [selectedElement, key], "");

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
