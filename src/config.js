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

export default config;
