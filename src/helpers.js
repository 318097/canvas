import { GENERIC_PROPERTIES, GENERIC_CLASSES } from "./config";
import slugify from "slugify";
import dayjs from "dayjs";
import hljs from "highlight.js";
import markdown from "markdown-it";

const getFormattedDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

const getSlug = (str) =>
  slugify(str, {
    lower: true,
    strict: true,
  });

const isGenericClass = (selectedElement) =>
  GENERIC_CLASSES.includes(splitName(selectedElement)["element"]) ||
  GENERIC_CLASSES.includes(selectedElement);

const getGenericClass = (classList) => {
  for (const className of classList) {
    const cn = `.${className}`;
    if (isGenericClass(cn)) {
      return cn;
    }
  }
};

const isGenericTag = (selectedElement) =>
  GENERIC_PROPERTIES.includes(splitName(selectedElement)["element"]) ||
  GENERIC_PROPERTIES.includes(selectedElement);

const splitName = (selectedElement) => {
  const [platform, groupId, element, uid] = selectedElement.split(":");
  return {
    platform,
    groupId,
    element,
    uid,
  };
};

const generateName = (platform, groupId, element, uid) => {
  return `${platform}:${groupId || "detached"}:${element}:${uid || ""}`;
};

const getCleanKey = (key) => (key.includes("_") ? key.split("_")[0] : key);

const generateTemplate = (platforms, classNames, props = {}) => {
  platforms = [].concat(platforms);
  const {
    title = "title",
    content = "content",
    groupId = "detached",
    images = "images",
    brand = "brand",
  } = classNames || {};

  const layout = [
    {
      key: title,
    },
    {
      key: content,
    },
    {
      type: "media",
      key: images,
    },
    {
      key: brand,
    },
  ];

  const TEMPLATES = [
    {
      platform: "instagram",
      groupId: groupId,
      containerWidth: 1080,
      containerHeight: 1080,
      className: `h-[1080px] w-[1080px]`,
      layout,
    },
    {
      platform: "instagram_story",
      groupId: groupId,
      containerWidth: 1080,
      containerHeight: 1920,
      className: `h-[1920px] w-[1080px]`,
      layout,
    },
    {
      platform: "twitter",
      groupId: groupId,
      containerWidth: 1200,
      containerHeight: 675,
      className: `h-[675px] w-[1200px]`,
      layout,
    },
    {
      platform: "facebook_post",
      groupId: groupId,
      containerWidth: 1200,
      containerHeight: 630,
      className: `h-[630px] w-[1200px]`,
      layout,
    },
    {
      platform: "linkedin_post",
      groupId: groupId,
      containerWidth: 1200,
      containerHeight: 627,
      className: `h-[627px] w-[1200px]`,
      layout,
    },
    {
      platform: "youtube_thumbnail",
      groupId: groupId,
      containerWidth: 1280,
      containerHeight: 720,
      className: `h-[720px] w-[1280px]`,
      layout,
    },
  ];

  return TEMPLATES.filter((template) =>
    platforms[0] === "all" ? true : platforms.includes(template.platform)
  ).map((template) => {
    return {
      ...template,
      layout: template.layout.filter((layout) => layout.key !== null),
      ...props,
    };
  });
};

const md = markdown({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ""; // use external default escaping
  },
});

export {
  isGenericTag,
  splitName,
  generateName,
  generateTemplate,
  getCleanKey,
  getSlug,
  getFormattedDate,
  md,
  isGenericClass,
  getGenericClass,
};
