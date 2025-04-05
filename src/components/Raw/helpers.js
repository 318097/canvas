import { GENERIC_PROPERTIES } from "./config";

const isGenericTag = (selectedElement) => {
  return (
    GENERIC_PROPERTIES.includes(splitName(selectedElement)["element"]) ||
    GENERIC_PROPERTIES.includes(selectedElement)
  );
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

const getCleanKey = (key) => (key.includes("_") ? key.split("_")[0] : key);

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

const generateTemplate = (platforms, keys) => {
  platforms = [].concat(platforms);
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
        },
        {
          type: "text",
          key: content,
          className: "leading-relaxed",
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
        },
        {
          type: "text",
          key: content,
          className: "leading-relaxed",
        },
      ],
    },
  ];

  return TEMPLATES.filter((template) =>
    platforms[0] === "all" ? true : platforms.includes(template.platform)
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
  getCleanKey,
};
