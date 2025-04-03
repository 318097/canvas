const COLORS = [
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
];

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
    label: "Text Decoration",
    key: "text-decoration",
    options: [
      {
        label: "None",
        value: "no-underline",
      },
      {
        label: "Underline",
        value: "underline",
      },
      {
        label: "Overline",
        value: "overline",
      },
      {
        label: "Line Through",
        value: "line-through",
      },
    ],
  },
  {
    label: "Text Decoration Color",
    key: "text-decoration-color",
    options: COLORS.map((color) => ({
      ...color,
      value: color.value.replace("text", "decoration"),
    })),
  },
  {
    label: "Text Transform",
    key: "text-transform",
    options: [
      {
        label: "None",
        value: "normal-case",
      },
      {
        label: "Uppercase",
        value: "uppercase",
      },
      {
        label: "Lowercase",
        value: "lowercase",
      },
      {
        label: "Capitalize",
        value: "capitalize",
      },
    ],
  },
  {
    label: "Text Color",
    key: "text-color",
    options: COLORS,
  },
  {
    label: "Background",
    key: "bg-color",
    options: COLORS.map((color) => ({
      ...color,
      value: color.value.replace("text", "bg"),
    })).reverse(),
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
  {
    label: "Font Style",
    key: "font-style",
    options: [
      {
        label: "Normal",
        value: "not-italic",
      },
      {
        label: "Italic",
        value: "italic",
      },
    ],
  },
  {
    label: "Height",
    key: "flex-basis",
    options: [
      {
        label: "10%",
        value: "basis-1/10",
      },
      {
        label: "20%",
        value: "basis-1/5",
      },
      {
        label: "25%",
        value: "basis-1/4",
      },
      {
        label: "33.33%",
        value: "basis-1/3",
      },
      {
        label: "50%",
        value: "basis-1/2",
      },
      {
        label: "66.66%",
        value: "basis-2/3",
      },
      {
        label: "75%",
        value: "basis-3/4",
      },
      {
        label: "80%",
        value: "basis-4/5",
      },
      {
        label: "90%",
        value: "basis-9/10",
      },
      {
        label: "100%",
        value: "basis-full",
      },
    ],
  },
  {
    label: "Width",
    key: "flex-width",
    options: [
      {
        label: "10%",
        value: "w-1/10",
      },
      {
        label: "20%",
        value: "w-1/5",
      },
      {
        label: "25%",
        value: "w-1/4",
      },
      {
        label: "33.33%",
        value: "w-1/3",
      },
      {
        label: "50%",
        value: "w-1/2",
      },
      {
        label: "66.66%",
        value: "w-2/3",
      },
      {
        label: "75%",
        value: "w-3/4",
      },
      {
        label: "80%",
        value: "w-4/5",
      },
      {
        label: "90%",
        value: "w-9/10",
      },
      {
        label: "100%",
        value: "w-full",
      },
    ],
  },
  {
    label: "Border",
    key: "border",
    options: [
      {
        label: "None",
        value: "border-none",
      },
      {
        label: "Thin",
        value: "border",
      },
      {
        label: "Medium",
        value: "border-2",
      },
      {
        label: "Thick",
        value: "border-4",
      },
      {
        label: "Extra Thick",
        value: "border-8",
      },
    ],
  },
  {
    label: "Border Color",
    key: "border-color",
    options: [
      {
        label: "White",
        value: "border-white",
      },
      {
        label: "Gray-100",
        value: "border-gray-100",
      },
      {
        label: "Gray-200",
        value: "border-gray-200",
      },
      {
        label: "Gray-300",
        value: "border-gray-300",
      },
      {
        label: "Gray-400",
        value: "border-gray-400",
      },
      {
        label: "Gray-500",
        value: "border-gray-500",
      },
      {
        label: "Gray-600",
        value: "border-gray-600",
      },
      {
        label: "Gray-700",
        value: "border-gray-700",
      },
      {
        label: "Gray-800",
        value: "border-gray-800",
      },
      {
        label: "Gray-900",
        value: "border-gray-900",
      },
      {
        label: "Red",
        value: "border-red-500",
      },
      {
        label: "Blue",
        value: "border-blue-500",
      },
      {
        label: "Green",
        value: "border-green-500",
      },
      {
        label: "Yellow",
        value: "border-yellow-500",
      },
      {
        label: "Purple",
        value: "border-purple-500",
      },
      {
        label: "Pink",
        value: "border-pink-500",
      },
      {
        label: "Orange",
        value: "border-orange-500",
      },
      {
        label: "Teal",
        value: "border-teal-500",
      },
      {
        label: "Cyan",
        value: "border-cyan-500",
      },
      {
        label: "Lime",
        value: "border-lime-500",
      },
    ],
  },
  {
    label: "Border Radius",
    key: "border-radius",
    options: [
      {
        label: "None",
        value: "rounded-none",
      },
      {
        label: "Small",
        value: "rounded-sm",
      },
      {
        label: "Medium",
        value: "rounded-md",
      },
      {
        label: "Large",
        value: "rounded-lg",
      },
      {
        label: "Full",
        value: "rounded-full",
      },
    ],
  },
  {
    label: "Padding",
    key: "padding",
    options: [
      {
        label: "None",
        value: "p-0",
      },
      {
        label: "Small",
        value: "p-2",
      },
      {
        label: "Medium",
        value: "p-4",
      },
      {
        label: "Large",
        value: "p-6",
      },
      {
        label: "Extra Large",
        value: "p-8",
      },
    ],
  },
];

const generateTemplate = (platform, keys) => {
  const { title = "title", content = "content", groupId = "none" } = keys || {};

  const TEMPLATES = [
    {
      platform: "Instagram",
      groupId: groupId,
      containerWidth: 680,
      className: `h-[680px] w-[680px]`,
      layout: [
        {
          type: "text",
          key: title,
          label: "Title",
          className: "leading-relaxed",
          properties: {
            "text-size": "text-5xl",
            "text-weight": "font-bold",
            "text-align": "text-center",
            "text-color": "text-white",
            "flex-width": "w-3/4",
          },
        },
        {
          type: "text",
          key: content,
          className: "leading-relaxed",
          properties: {
            "text-size": "text-3xl",
            "text-align": "text-left",
            "text-color": "text-white",
            "text-weight": "font-normal",
            "flex-width": "w-3/4",
          },
        },
      ],
    },
    {
      platform: "Twitter",
      groupId: groupId,
      containerWidth: 1200,
      className: `h-[675px] w-[1200px]`,
      layout: [
        {
          type: "text",
          key: title,
          className: "leading-relaxed",
          properties: {
            "text-size": "text-5xl",
            "text-weight": "font-bold",
            "text-align": "text-center",
            "text-color": "text-white",
          },
        },
        {
          type: "text",
          key: content,
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

  return TEMPLATES.filter((template) =>
    platform === "all" ? true : template.platform === platform
  ).map((template) => {
    return {
      ...template,
      layout: template.layout.filter((layout) => layout.key !== null),
    };
  });
};

const THEMES = [
  {
    name: "Default",
  },
  {
    name: "Multipage",
  },
  {
    name: "Cover",
  },
  {
    name: "Listicle",
  },
  {
    name: "Carousel",
  },
  {
    name: "Video",
  },
];

const getDefaultContent = () => {
  return {
    title: "Custom `.pick` for **objects**",
    content: `
1. snake_case  
2. keb-case  
3. camelCase (JS variables, functions)  
4. PascalCase (JS Classes)  
5. SCREAMING_SNAKE_CASE (JS constants)  
`,
  };
};

const GENERIC_PROPERTIES = ["CODE", "STRONG"];

export {
  getDefaultContent,
  PROPERTIES,
  generateTemplate,
  GENERIC_PROPERTIES,
  THEMES,
};
