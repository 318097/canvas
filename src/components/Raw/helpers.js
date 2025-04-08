import { GENERIC_PROPERTIES } from "./config";
import slugify from "slugify";
import dayjs from "dayjs";

const getFormattedDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

const getSlug = (str) =>
  slugify(str, {
    lower: true,
    strict: true,
  });

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
    title: "Did you know the `world’s` first website is still live? 🌍💻",
    content: `Tim Berners-Lee launched the **World Wide Web Project** at CERN, giving birth to the internet as we know it.   
The original site, hosted at [**info.cern.ch**](https://info.cern.ch/), was the first step toward a digital revolution.
    `,
  };
};

const generateTemplate = (platforms, keys) => {
  platforms = [].concat(platforms);
  const {
    title = "title",
    content = "content",
    groupId = "none",
    images = "images",
  } = keys || {};

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
  getSlug,
  getFormattedDate,
};
