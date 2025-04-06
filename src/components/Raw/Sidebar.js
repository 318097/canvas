import _ from "lodash";
import React, { Fragment } from "react";
import { Input, Select, Button, Radio } from "antd";
import { DATA_CONFIG, PROPERTIES } from "./config";
import { getCleanKey, splitName } from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import { setData, setFilename, setPropertyType } from "./store";

const { TextArea } = Input;

const Sidebar = ({
  handleDownload,
  selectedElement,
  handlePropertyChange,
  isGlobal,
}) => {
  const { data, filename, localProperties, globalProperties, propertyType } =
    useSelector((state) => state.config);

  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-2 bg-gray-100 border border-l-gray-300 p-2 w-[300px] shrink-0 h-full overflow-auto">
      {Object.keys(data).map((key) => {
        const rows = _.get(DATA_CONFIG, [key, "rows"], 3);
        return (
          <div className="flex flex-col items-start gap-1 mb-2" key={key}>
            <label className="text-xs font-bold">{key}</label>
            <TextArea
              rows={rows}
              placeholder={key}
              value={data[key]}
              onChange={(e) => dispatch(setData({ [key]: e.target.value }))}
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
            onChange={(e) => dispatch(setPropertyType(e.target.value))}
            value={propertyType}
          />
          {PROPERTIES.map((property) => {
            const { options, label, key } = property;

            const { uid } = splitName(selectedElement);

            const value = isGlobal
              ? _.get(globalProperties, [getCleanKey(uid), key], "")
              : _.get(localProperties, [selectedElement, key], "");

            return (
              <div
                className="flex flex-col items-start gap-1 mb-2"
                key={`${isGlobal ? "g-" : "l-"}${key}`}
              >
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
          onChange={(e) => dispatch(setFilename(e.target.value))}
        />
        <Button type="primary" className="w-full" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
