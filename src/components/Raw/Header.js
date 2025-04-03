import React from "react";
import { Select } from "antd";
import { generateTemplate, THEMES } from "./config";

const Header = ({ template, setTemplate, theme, setTheme }) => {
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
          options={THEMES.map(({ name }) => ({
            label: name,
            value: name,
          }))}
          value={theme}
          onChange={setTheme}
        />
      </div>
    </header>
  );
};

export default Header;
