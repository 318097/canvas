import _ from "lodash";

const NODE_ENV = process.env.NODE_ENV;
const CRISP_WEBSITE_ID = process.env.REACT_APP_CRISP_WEBSITE_ID;

const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;

const config = {
  NODE_ENV,
  IS_DEV: NODE_ENV === "development",
  IS_PROD: NODE_ENV === "production",
  CRISP_WEBSITE_ID,
  FIREBASE: {
    FIREBASE_API_KEY,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
  },
  appId: "CANVAS",
  appName: "Canvas",
  tagline: "<app_tagline>",
  sponser: "https://www.buymeacoffee.com/mehullakhanpal",
};

const PROPERTIES = [
  {
    label: "Font Family",
    key: "font-family",
    options: [
      {
        label: "Arvo",
        value: "font-arvo",
      },
      {
        label: "Cabin",
        value: "font-cabin",
      },
      {
        label: "Courier Prime",
        value: "font-courier-prime",
      },
      {
        label: "Crimson Text",
        value: "font-crimson-text",
      },
      {
        label: "Fira Code",
        value: "font-fira-code",
      },
      {
        label: "IBM Plex Mono",
        value: "font-ibm-plex-mono",
      },
      {
        label: "Inconsolata",
        value: "font-inconsolata",
      },
      {
        label: "Lato",
        value: "font-lato",
      },
      {
        label: "Merriweather",
        value: "font-merriweather",
      },
      {
        label: "Monospace",
        value: "font-monospace",
      },
      {
        label: "Montserrat",
        value: "font-montserrat",
      },
      {
        label: "Nunito",
        value: "font-nunito",
      },
      {
        label: "Open Sans",
        value: "font-open-sans",
      },
      {
        label: "Playfair Display",
        value: "font-playfair-display",
      },
      {
        label: "Poppins",
        value: "font-poppins",
      },
      {
        label: "PT Serif",
        value: "font-pt-serif",
      },
      {
        label: "Raleway",
        value: "font-raleway",
      },
      {
        label: "Roboto",
        value: "font-roboto",
      },
      {
        label: "Source Sans Pro",
        value: "font-source-sans-pro",
      },
      {
        label: "Space Mono",
        value: "font-space-mono",
      },
      {
        label: "Zilla Slab",
        value: "font-zilla-slab",
      },
    ],
  },
  {
    label: "Font Size",
    key: "text-size",
    options: [
      {
        label: "Inherit",
        value: "font-[inherit]",
      },
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
        label: "LG",
        value: "text-lg",
      },
      {
        label: "XL",
        value: "text-xl",
      },
      {
        label: "2XL",
        value: "text-2xl",
      },
      {
        label: "3XL",
        value: "text-3xl",
      },
      {
        label: "4XL",
        value: "text-4xl",
      },
      {
        label: "5XL",
        value: "text-5xl",
      },
      {
        label: "6XL",
        value: "text-6xl",
      },
      {
        label: "7XL",
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
    options: [
      {
        label: "Transparent",
        value: "decoration-transparent",
      },
      {
        label: "White",
        value: "decoration-white",
      },
      {
        label: "Gray-100",
        value: "decoration-gray-100",
      },
      {
        label: "Gray-200",
        value: "decoration-gray-200",
      },
      {
        label: "Gray-300",
        value: "decoration-gray-300",
      },
      {
        label: "Gray-400",
        value: "decoration-gray-400",
      },
      {
        label: "Gray-500",
        value: "decoration-gray-500",
      },
      {
        label: "Gray-600",
        value: "decoration-gray-600",
      },
      {
        label: "Gray-700",
        value: "decoration-gray-700",
      },
      {
        label: "Gray-800",
        value: "decoration-gray-800",
      },
      {
        label: "Gray-900",
        value: "decoration-gray-900",
      },
      {
        label: "Red",
        value: "decoration-red-500",
      },
      {
        label: "Blue",
        value: "decoration-blue-500",
      },
      {
        label: "Green",
        value: "decoration-green-500",
      },
      {
        label: "Yellow",
        value: "decoration-yellow-500",
      },
      {
        label: "Purple",
        value: "decoration-purple-500",
      },
      {
        label: "Pink",
        value: "decoration-pink-500",
      },
      {
        label: "Orange",
        value: "decoration-orange-500",
      },
      {
        label: "Teal",
        value: "decoration-teal-500",
      },
      {
        label: "Cyan",
        value: "decoration-cyan-500",
      },
      {
        label: "Lime",
        value: "decoration-lime-500",
      },
    ],
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
    options: [
      {
        label: "Transparent",
        value: "text-transparent",
      },
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
    label: "Background",
    key: "bg-color",
    options: [
      {
        label: "Transparent",
        value: "bg-transparent",
      },
      {
        label: "White",
        value: "bg-white",
      },
      {
        label: "Gray-100",
        value: "bg-gray-100",
      },
      {
        label: "Gray-200",
        value: "bg-gray-200",
      },
      {
        label: "Gray-300",
        value: "bg-gray-300",
      },
      {
        label: "Gray-400",
        value: "bg-gray-400",
      },
      {
        label: "Gray-500",
        value: "bg-gray-500",
      },
      {
        label: "Gray-600",
        value: "bg-gray-600",
      },
      {
        label: "Gray-700",
        value: "bg-gray-700",
      },
      {
        label: "Gray-800",
        value: "bg-gray-800",
      },
      {
        label: "Gray-900",
        value: "bg-gray-900",
      },
      {
        label: "Red",
        value: "bg-red-500",
      },
      {
        label: "Blue",
        value: "bg-blue-500",
      },
      {
        label: "Green",
        value: "bg-green-500",
      },
      {
        label: "Yellow",
        value: "bg-yellow-500",
      },
      {
        label: "Purple",
        value: "bg-purple-500",
      },
      {
        label: "Pink",
        value: "bg-pink-500",
      },
      {
        label: "Orange",
        value: "bg-orange-500",
      },
      {
        label: "Teal",
        value: "bg-teal-500",
      },
      {
        label: "Cyan",
        value: "bg-cyan-500",
      },
      {
        label: "Lime",
        value: "bg-lime-500",
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
        label: "Transparent",
        value: "border-transparent",
      },
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

const DEFAULT_CLASSES = {
  "text-decoration": "no-underline",
  "text-decoration-color": "decoration-transparent",
  "text-transform": "normal-case",
  "bg-color": "bg-transparent",
  "font-style": "not-italic",
  border: "border-none",
  "border-color": "border-transparent",
  "border-radius": "rounded-none",
  padding: "p-0",
  "font-family": "font-monospace",
};

const GLOBAL = {
  code: {
    ...DEFAULT_CLASSES,
    "bg-color": "bg-gray-700",
    "border-radius": "rounded",
    padding: "p-1",
    "text-color": "text-white",
    "text-size": "font-[inherit]",
  },
  strong: {
    ...DEFAULT_CLASSES,
    "text-color": "text-gray-400",
    "text-size": "font-[inherit]",
  },
  a: {
    ...DEFAULT_CLASSES,
    "text-color": "text-white",
    "text-size": "font-[inherit]",
    "text-decoration": "underline",
    "text-decoration-color": "decoration-cyan-500",
    decoration: "decoration-4",
  },
  pagination: {
    ...DEFAULT_CLASSES,
    "text-color": "text-white",
    "text-size": "font-sm",
    decoration: "decoration-4",
    position: "absolute",
    bottom: "bottom-4",
    right: "right-12",
  },
  title: {
    ...DEFAULT_CLASSES,
    "text-size": "text-5xl",
    "text-weight": "font-bold",
    "text-align": "text-center",
    "text-color": "text-white",
    "flex-width": "w-4/5",
    padding: "p-2",
    leading: "leading-normal",
  },
  content: {
    ...DEFAULT_CLASSES,
    "text-size": "text-3xl",
    "text-align": "text-left",
    "text-color": "text-white",
    "text-weight": "font-normal",
    "flex-width": "w-4/5",
    padding: "p-2",
    leading: "leading-relaxed",
  },
  files: {
    border: "rounded",
    "border-radius": "rounded",
    overflow: "overflow-hidden",
    "flex-width": "w-4/5",
  },
  "raw-editor-root": {
    padding: "p-4",
    "bg-color": "bg-[#202227]",
    position: "relative",
    gap: "gap-2",
    display: "flex",
    "flex-direction": "flex-col",
  },
  brand: {
    ...DEFAULT_CLASSES,
    "text-size": "text-xs",
    "text-color": "text-white",
    "text-weight": "font-normal",
  },
};

const POST_VARIANTS = [
  {
    label: "Single-page",
    value: "default",
  },
  {
    label: "Multi-page",
    value: "multipage",
  },
  {
    label: "Listicle",
    value: "listicle",
  },
  // {
  //   label: "Cover",
  //   value: "cover",
  // },

  // {
  //   label: "Carousel",
  //   value: "carousel",
  // },
  // {
  //   label: "Video",
  //   value: "video",
  // },
];

const GENERIC_PROPERTIES = ["code", "strong", "a"];
const GENERIC_CLASSES = [".raw-editor-root"];

const PROPERTIES_MAP = _.keyBy(PROPERTIES, "key");

export {
  PROPERTIES,
  PROPERTIES_MAP,
  GENERIC_PROPERTIES,
  POST_VARIANTS,
  GLOBAL,
  DEFAULT_CLASSES,
  GENERIC_CLASSES,
};

export default config;
