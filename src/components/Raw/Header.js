import React from "react";
import { Button, Segmented, Select } from "antd";
import { POST_VARIANTS } from "./config";
import { generateTemplate } from "./helpers";
import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setPostVariant,
  setSelectedTemplates,
  setView,
  setZoomLevel,
} from "./store";

const Header = () => {
  const { selectedTemplates, postVariant, zoomLevel, view } = useSelector(
    (state) => state.config
  );
  const dispatch = useDispatch();
  return (
    <header className="flex items-center justify-between w-full p-4 bg-slate-300">
      <h3 className="text-white font-bold">Canvas</h3>
      <div className="flex items-center gap-2">
        <Select
          mode="multiple"
          className="min-w-[100px]"
          options={generateTemplate("all").map(({ platform }) => ({
            label: platform,
            value: platform,
          }))}
          value={selectedTemplates}
          onChange={(value) => {
            dispatch(setSelectedTemplates(value));
          }}
        />
        <Select
          placeholder="Theme"
          className="w-[100px]"
          options={POST_VARIANTS}
          value={postVariant}
          onChange={(variant) => dispatch(setPostVariant(variant))}
        />
        <Segmented
          onChange={(view) => dispatch(setView(view))}
          value={view}
          options={[
            { value: "col", icon: <ColumnHeightOutlined /> },
            { value: "row", icon: <ColumnWidthOutlined /> },
          ]}
        />
        <div className="flex items-center gap-1">
          <Button
            icon={<MinusOutlined />}
            onClick={() => dispatch(setZoomLevel("-"))}
          />
          {zoomLevel}
          <Button
            icon={<PlusOutlined />}
            onClick={() => dispatch(setZoomLevel("+"))}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
