import { DEFAULT_CLASSES, GENERIC_PROPERTIES } from "./config";

const isGenericTag = (selectedElement) => {
  return GENERIC_PROPERTIES.includes(splitName(selectedElement)["element"]);
};

const splitName = (selectedElement) => {
  const [groupId, element, uid] = selectedElement.split(":");
  return {
    groupId,
    element,
    uid,
  };
};

const generateName = (groupId, element, uid) => {
  return `${groupId || "none"}:${element}:${uid}`;
};

const getDefaultContent = () => {
  return {
    title: " `.pick` : Custom `.pick` **method** for **objects**",
    content: `
1. snake_case  
2. keb-case  
3. camelCase (JS variables, functions)  
4. PascalCase (JS Classes)  
5. SCREAMING_SNAKE_CASE (JS constants)  
`,
  };
};

const generateTemplate = (platform, keys) => {
  const { title = "title", content = "content", groupId = "none" } = keys || {};

  const TEMPLATES = [
    {
      platform: "instagram",
      groupId: groupId,
      containerWidth: 1080,
      containerHeight: 1080,
      className: `h-[1080px] w-[1080px]`,
      layout: [
        {
          type: "text",
          key: title,
          label: "Title",
          className: "leading-normal",
          properties: {
            "text-size": "text-5xl",
            "text-weight": "font-bold",
            "text-align": "text-center",
            "text-color": "text-white",
            "flex-width": "w-3/4",
            ...DEFAULT_CLASSES,
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
            ...DEFAULT_CLASSES,
          },
        },
      ],
    },
    {
      platform: "twitter",
      groupId: groupId,
      containerWidth: 1200,
      containerHeight: 675,
      className: `h-[675px] w-[1200px]`,
      layout: [
        {
          type: "text",
          key: title,
          className: "leading-normal",
          properties: {
            "text-size": "text-5xl",
            "text-weight": "font-bold",
            "text-align": "text-center",
            "text-color": "text-white",
            "flex-width": "w-3/4",
            ...DEFAULT_CLASSES,
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
            ...DEFAULT_CLASSES,
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

export {
  isGenericTag,
  splitName,
  generateName,
  getDefaultContent,
  generateTemplate,
};
