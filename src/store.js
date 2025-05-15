import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getSlug } from "./helpers";
import { GLOBAL } from "./config";
import { updateConfigInFirestore } from "./firebase";
import { generateTemplate } from "./helpers";
import { getAuth, signOut } from "firebase/auth";
import _ from "lodash";
import shortid from "shortid";
import dayjs from "dayjs";
import { thunk as thunkMiddleware } from "redux-thunk";

const INITIAL_DATA = {
  title: "Did you know the `world’s` first website is still live? 🌍💻",
  content: `Tim Berners-Lee launched the **World Wide Web Project** at CERN, giving birth to the internet as we know it.   
The original site, hosted at [**info.cern.ch**](https://info.cern.ch/), was the first step toward a digital revolution.
    `,
  brand: "brand.name.co",
  files: [],
};

const DATA_CONFIG = {
  title: {
    key: "title",
    type: "textarea",
    rows: 4,
    order: 1,
    visible: true,
  },
  content: {
    key: "content",
    type: "textarea",
    rows: 16,
    order: 2,
    visible: true,
  },
  brand: {
    key: "brand",
    type: "input",
    order: 0,
    rows: 1,
    visible: true,
  },
};

const initialConfig = {
  data: INITIAL_DATA,
  globalProperties: GLOBAL,
  localProperties: {},
  propertyType: "global",
  templates: [],
  selectedTemplates: ["instagram"],
  postVariant: "default",
  zoomLevel: 0.7,
  view: "col",
  themes: [],
  dataConfig: DATA_CONFIG,
};

const nonMutableConfig = {
  exportId: 1,
  totalExports: 0,
  themes: [],
};

const initialState = {
  loading: true,
  selectedElement: "",
  filename: "",
  showControls: true,
  notification: null,
  ...nonMutableConfig,
  ...initialConfig,
};

const INITIAL_ZOOM_LEVEL = 0.6;

const isMultipageOrListicle = (postVariant, content) =>
  (postVariant === "multipage" && content.includes("---")) ||
  (postVariant === "listicle" && content.includes("\n"));

const rawSlice = createSlice({
  name: "sdata",
  initialState,
  reducers: {
    setData: (state, action) => {
      const data = { ...state.data, ...action.payload };
      if (data.title) {
        state.filename = getSlug(data.title);
      }
      state.data = data;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    setPostVariant: (state, action) => {
      state.postVariant = action.payload;

      state.data = _.pick(state.data, Object.keys(INITIAL_DATA));
      state.templates = generateTemplate(state.selectedTemplates);

      if (isMultipageOrListicle(state.postVariant, state.data.content)) {
        console.log("parsse....");
        const isListicle = state.postVariant === "listicle";
        const contentList = state.data.content
          .trim()
          .split(isListicle ? "\n" : "---")
          .map((item) => item.trim())
          .filter((item) => item.length);

        const contentIdObj = [];
        const contentBreakdownObj = contentList.reduce(
          (ob, contentLine, index) => {
            const key = `content_#${index + 1}`;
            contentIdObj.push(key);
            return { ...ob, [key]: contentLine };
          },
          {}
        );

        const finalPages = [];
        state.templates.forEach((template) => {
          const { platform } = template;
          const groupId =
            template.groupId && template.groupId !== "detached"
              ? template.groupId
              : shortid();
          const pages = [
            ...generateTemplate(platform, {
              title: "title",
              content: isListicle ? null : "content_#1",
              groupId,
            }),
            ...(isListicle ? contentIdObj : contentIdObj.slice(1)).map(
              (id, idx) =>
                generateTemplate(
                  platform,
                  {
                    title: null,
                    content: id,
                    groupId,
                  },
                  {
                    pagination: `${idx + 1}/${contentIdObj.length}`,
                  }
                )[0]
            ),
          ].map((obj, idx) => ({
            ...obj,
            order: idx + 1,
          }));

          finalPages.push(...pages);
        });

        state.templates = finalPages;
        state.data = { ...state.data, ...contentBreakdownObj };
      }
    },
    setSelectedTemplates: (state, action) => {
      state.selectedTemplates = action.payload;
      state.zoomLevel =
        state.selectedTemplates.length > 1 ? INITIAL_ZOOM_LEVEL : 0.8;

      state.view = state.selectedTemplates.length > 1 ? "row" : "col";
      state.templates = generateTemplate(state.selectedTemplates);
    },
    setFilename: (state, action) => {
      state.filename = action.payload;
    },
    setPropertyType: (state, action) => {
      state.propertyType = action.payload;
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setGlobalProperties: (state, action) => {
      state.globalProperties = action.payload;
    },
    setLocalProperties: (state, action) => {
      state.localProperties = action.payload;
    },
    setShowControls: (state, action) => {
      state.showControls = action.payload;
    },
    setSelectedFiles: (state, action) => {
      state.data.files = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    saveTheme: (state) => {
      state.themes.push({
        id: shortid(),
        createdAt: dayjs().format("YYYY-MM-DD"),
        localProperties: state.localProperties,
        globalProperties: state.globalProperties,
      });
      state.notification = "Theme Saved.";
    },
    applyRandomTheme: (state) => {
      if (state.themes.length > 0) {
        const randomIndex = Math.floor(Math.random() * state.themes.length);
        const randomTheme = state.themes[randomIndex];
        state.localProperties = randomTheme.localProperties;
        state.globalProperties = randomTheme.globalProperties;
      }
    },
    resetState: (state) => {
      Object.assign(state, _.omit(initialState, Object.keys(nonMutableConfig)));
      state.templates = generateTemplate(state.selectedTemplates);
    },
    incrementExportId: (state) => {
      state.exportId++;
    },
    incrementTotalExports: (state) => {
      state.totalExports++;
    },
    updateDataConfig: (state, { payload }) => {
      const { key, property } = payload;

      if (property === "visible")
        _.set(
          state.dataConfig,
          [key, "visible"],
          !_.get(state.dataConfig, [key, "visible"])
        );
    },
    setInitialState: (state, action) => {
      Object.assign(state, {
        ...initialState,
        ...action.payload,
      });
      state.templates = generateTemplate(state.selectedTemplates);
      state.loading = false;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel =
        Math.round(
          (action.payload === "+"
            ? Number(state.zoomLevel) + 0.1
            : Number(state.zoomLevel) - 0.1) * 10
        ) / 10;
    },
    logout: (state, action) => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          state.loading = true;
          Object.assign(state, initialState);
        })
        .catch((error) => {
          console.log("error::-", error);
          // state.notification = "Logout failed: " + error.message;
        });
    },
  },
});

export const {
  setData,
  setView,
  setPostVariant,
  setZoomLevel,
  setSelectedTemplates,
  setFilename,
  setPropertyType,
  setTemplates,
  setGlobalProperties,
  setLocalProperties,
  setShowControls,
  setSelectedFiles,
  resetState,
  incrementExportId,
  saveTheme,
  applyRandomTheme,
  setNotification,
  setInitialState,
  logout,
  incrementTotalExports,
  updateDataConfig,
} = rawSlice.actions;

const setDataThunk = (data) => async (dispatch, getState) => {
  const { sdata } = getState();
  await dispatch(setData(data));
  if (sdata.postVariant === "multipage" || data.content.includes("---")) {
    dispatch(setPostVariant("multipage"));
  }
};

export { setDataThunk };

const store = configureStore({
  reducer: {
    sdata: rawSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
});

store.subscribe(() => {
  const state = store.getState();

  if (state.loading) return;

  updateConfigInFirestore({
    ..._.pick(state.sdata, [
      ...Object.keys(initialConfig),
      ...Object.keys(nonMutableConfig),
    ]),
    data: {
      ..._.pick(state.sdata.data, Object.keys(INITIAL_DATA)),
    },
  });
});

export { initialState };

export default store;
