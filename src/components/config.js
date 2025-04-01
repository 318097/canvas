const PROPERTIES = [
  {
    label: "Font Size",
    key: "text-size",
    options: [
      {
        label: "Base",
        value: "text-base",
      },
      {
        label: "XS",
        value: "text-xs",
      },
      {
        label: "SM",
        value: "text-sm",
      },
      {
        label: "MD",
        value: "text-md",
      },
      {
        label: "LG",
        value: "text-3xl",
      },
      {
        label: "XL",
        value: "text-4xl",
      },
      {
        label: "2XL",
        value: "text-5xl",
      },
      {
        label: "3XL",
        value: "text-6xl",
      },
      {
        label: "4XL",
        value: "text-7xl",
      },
    ],
  },
  {
    label: "Text Align",
    key: "text-align",
    options: [
      {
        label: "Left",
        value: "text-left",
      },
      {
        label: "Center",
        value: "text-center",
      },
      {
        label: "Right",
        value: "text-right",
      },
      {
        label: "Justify",
        value: "text-justify",
      },
    ],
  },
  {
    label: "Text Color",
    key: "text-color",
    options: [
      {
        label: "White",
        value: "text-white",
      },
      {
        label: "Gray-100",
        value: "text-gray-100",
      },
      {
        label: "Gray-200",
        value: "text-gray-200",
      },
      {
        label: "Gray-300",
        value: "text-gray-300",
      },
      {
        label: "Gray-400",
        value: "text-gray-400",
      },
      {
        label: "Gray-500",
        value: "text-gray-500",
      },
      {
        label: "Gray-600",
        value: "text-gray-600",
      },
      {
        label: "Gray-700",
        value: "text-gray-700",
      },
      {
        label: "Gray-800",
        value: "text-gray-800",
      },
      {
        label: "Gray-900",
        value: "text-gray-900",
      },
      {
        label: "Red",
        value: "text-red-500",
      },
      {
        label: "Blue",
        value: "text-blue-500",
      },
      {
        label: "Green",
        value: "text-green-500",
      },
      {
        label: "Yellow",
        value: "text-yellow-500",
      },
      {
        label: "Purple",
        value: "text-purple-500",
      },
      {
        label: "Pink",
        value: "text-pink-500",
      },
      {
        label: "Orange",
        value: "text-orange-500",
      },
      {
        label: "Teal",
        value: "text-teal-500",
      },
      {
        label: "Cyan",
        value: "text-cyan-500",
      },
      {
        label: "Lime",
        value: "text-lime-500",
      },
    ],
  },
  {
    label: "Font Weight",
    key: "text-weight",
    options: [
      {
        label: "Thin",
        value: "font-thin",
      },
      {
        label: "Extra Light",
        value: "font-extralight",
      },
      {
        label: "Light",
        value: "font-light",
      },
      {
        label: "Normal",
        value: "font-normal",
      },
      {
        label: "Medium",
        value: "font-medium",
      },
      {
        label: "Semi Bold",
        value: "font-semibold",
      },
      {
        label: "Bold",
        value: "font-bold",
      },
      {
        label: "Extra Bold",
        value: "font-extrabold",
      },
      {
        label: "Black",
        value: "font-black",
      },
    ],
  },
];

const CONFIG = [
  {
    platform: "INSTAGRAM",
    fontMultiplier: 2,
    className: `h-[1080px] w-[1080px]`,
    layout: [
      {
        type: "title",
        key: "title",
        className: "leading-relaxed",
        properties: {
          "text-size": "text-5xl",
          "text-weight": "font-bold",
          "text-align": "text-center",
          "text-color": "text-white",
        },
      },
      {
        type: "paragraph",
        key: "content",
        className: "leading-relaxed",
        properties: {
          "text-size": "text-3xl",
          "text-align": "text-left",
          "text-color": "text-white",
          "text-weight": "font-normal",
        },
      },
    ],
  },
];

const getDefaultContent = () => {
  return {
    title: "Custom `.pick` for objects",
    content: `
- snake_case  
- keb-case  
- camelCase (JS variables, functions)  
- PascalCase (JS Classes)  
- SCREAMING_SNAKE_CASE (JS constants)  
`,
  };
};

export { getDefaultContent, PROPERTIES, CONFIG };
