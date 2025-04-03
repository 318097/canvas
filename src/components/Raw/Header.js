import React from "react";

const Header = ({ filename, setFilename }) => {
  return (
    <header class="flex items-center justify-between w-full p-4 bg-cyan-200">
      <h3 className="text-white font-bold">Canvas</h3>
    </header>
  );
};

export default Header;
