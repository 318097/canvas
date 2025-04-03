import React from "react";
import { Select } from "antd";
import { generateTemplate, POST_VARIANTS } from "./config";

const Header = ({ template, setTemplate, postVariant, setPostVariant }) => {
  return (
    <header className="flex items-center justify-between w-full p-4 bg-cyan-200">
      <h3 className="text-white font-bold">Canvas</h3>
      <div className="flex items-center gap-2">
        <Select
          className="w-[100px]"
          options={generateTemplate("all").map(({ platform }) => ({
            label: platform,
            value: platform,
          }))}
          value={template}
          onChange={setTemplate}
        />
        <Select
          placeholder="Theme"
          className="w-[100px]"
          options={POST_VARIANTS.map(({ name }) => ({
            label: name,
            value: name,
          }))}
          value={postVariant}
          onChange={setPostVariant}
        />
      </div>
    </header>
  );
};

export default Header;
