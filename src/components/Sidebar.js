import _ from "lodash";
import React, { Fragment } from "react";
import { Input, Select, Button, Radio, Collapse, Upload } from "antd";
import { DATA_CONFIG, PROPERTIES_MAP } from "../config";
import { getCleanKey, splitName } from "../helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  applyRandomTheme,
  saveTheme,
  setData,
  setPropertyType,
  setSelectedFiles,
} from "../store";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const Sidebar = ({
  selectedElement,
  handlePropertyChange,
  isGlobal,
  isGenericTagSelected,
}) => {
  const dispatch = useDispatch();
  const { data, localProperties, globalProperties, propertyType, themes } =
    useSelector((state) => state.sdata);

  const handleMediaChange = (file, fileList) => {
    const filesPromises = fileList.map(
      (file) =>
        new Promise((resolve) => {
          getBase64(file, (url) => {
            resolve(url);
          });
        })
    );

    Promise.all(filesPromises).then((files) => {
      dispatch(setSelectedFiles(files));
    });

    return false;
  };

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
      <div className="flex flex-col items-start gap-1 mb-2">
        <label className="text-xs font-bold">Files</label>
        <Upload
          name="avatar"
          multiple
          showUploadList={false}
          beforeUpload={handleMediaChange}
        >
          <Button>
            <PlusOutlined />
            Upload
          </Button>
        </Upload>
      </div>

      {!!selectedElement && (
        <Fragment>
          <hr />
          <h3 className="text-sm font-bold text-left">{selectedElement}</h3>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
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
      <hr />
      <div className="flex flex-col items-start gap-1 mt-2">
        <label className="text-xs font-bold">Theme ({themes.length})</label>
        <div className="flex gap-2 w-full">
          <Button
            disabled={!themes.length}
            type="primary"
            className="grow"
            onClick={() => dispatch(applyRandomTheme())}
          >
            Random
          </Button>
          <Button className="grow" onClick={() => dispatch(saveTheme())}>
            Save
          </Button>
        </div>
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

        const globalValue = _.get(
          globalProperties,
          isGenericTagSelected
            ? [getCleanKey(element), key]
            : [getCleanKey(uid), key]
        );

        const value = isGlobal
          ? globalValue
          : _.get(localProperties, [selectedElement, key]);

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
              placeholder={globalValue}
            />
          </div>
        );
      })}
    </Fragment>
  );
};
export default Sidebar;
