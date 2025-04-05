import React from "react";
import { Select } from "antd";
import { POST_VARIANTS } from "./config";
import { generateTemplate } from "./helpers";

const Header = ({
  selectedTemplates,
  setSelectedTemplates,
  postVariant,
  setPostVariant,
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
      </div>
    </header>
  );
};

export default Header;
