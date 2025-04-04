import React from "react";
import { Button, Select } from "antd";
import { POST_VARIANTS } from "./config";
import { generateTemplate } from "./helpers";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const Header = ({
  selectedTemplates,
  setSelectedTemplates,
  postVariant,
  setPostVariant,
  setZoomLevel,
  zoomLevel,
}) => {
  return (
    <header className="flex items-center justify-between w-full p-4 bg-cyan-200">
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
          onChange={setSelectedTemplates}
        />
        <Select
          placeholder="Theme"
          className="w-[100px]"
          options={POST_VARIANTS}
          value={postVariant}
          onChange={setPostVariant}
        />
        <div className="flex items-center gap-1">
          <Button
            icon={<MinusOutlined />}
            onClick={() =>
              setZoomLevel((p) => Math.round((Number(p) - 0.1) * 10) / 10)
            }
          />
          {zoomLevel}
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              setZoomLevel((p) => Math.round((Number(p) + 0.1) * 10) / 10)
            }
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
