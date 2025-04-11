import _ from "lodash";
import React, { Fragment } from "react";
import { Input, Select, Button, Radio, Collapse } from "antd";
import { DATA_CONFIG, PROPERTIES_MAP } from "../config";
import { getCleanKey, splitName } from "../helpers";
import { useDispatch, useSelector } from "react-redux";
import { setData, setFilename, setPropertyType } from "../store";

const { TextArea } = Input;

const Sidebar = ({
  handleDownload,
  selectedElement,
  handlePropertyChange,
  isGlobal,
  isGenericTagSelected,
}) => {
  const { data, filename, localProperties, globalProperties, propertyType } =
    useSelector((state) => state.config);

  const getProperties = (list) => {
    const props = {
      selectedElement,
      isGlobal,
      globalProperties,
      isGenericTagSelected,
      localProperties,
      handlePropertyChange,
      properties: list.map((key) => PROPERTIES_MAP[key]),
    };
    return <Properties {...props} />;
  };
  const items = [
    {
      key: "5",
      label: "General",
      children: getProperties(["bg-color"]),
    },
    {
      key: "1",
      label: "Font",
      children: getProperties([
        "font-family",
        "font-style",
        "text-weight",
        "text-size",
        "text-color",
      ]),
    },
    {
      key: "2",
      label: "Decoration",
      children: getProperties([
        "text-align",
        "text-decoration",
        "text-decoration-color",
        "text-transform",
      ]),
    },
    {
      key: "3",
      label: "Spacing",
      children: getProperties(["flex-basis", "flex-width", "padding"]),
    },
    {
      key: "4",
      label: "Border",
      children: getProperties(["border", "border-color", "border-radius"]),
    },
  ];

  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-2 bg-gray-100 border border-l-gray-300 p-2 w-[300px] shrink-0 h-full overflow-auto">
      {Object.keys(data)
        .sort((a, b) => {
          const orderA = _.get(DATA_CONFIG, [a, "order"], Infinity);
          const orderB = _.get(DATA_CONFIG, [b, "order"], Infinity);
          return orderA - orderB;
        })
        .map((key) => {
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
          <Collapse
            items={items}
            defaultActiveKey={["1", "2", "3", "4", "5"]}
            size="small"
            ghost
            bordered
          />
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

const Properties = ({
  selectedElement,
  isGlobal,
  globalProperties,
  isGenericTagSelected,
  localProperties,
  handlePropertyChange,
  properties,
}) => {
  return (
    <Fragment>
      {properties.map((property) => {
        const { options, label, key } = property;
        const { uid, element } = splitName(selectedElement);

        const value = isGlobal
          ? _.get(
              globalProperties,
              isGenericTagSelected
                ? [getCleanKey(element), key]
                : [getCleanKey(uid), key],
              ""
            )
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
  );
};
export default Sidebar;
