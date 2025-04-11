import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getDefaultContent, getSlug } from "./helpers";
import { GLOBAL } from "./config";
import {
  getConfigFromFirestore,
  getUser,
  updateConfigInFirestore,
} from "./firebase";
import _ from "lodash";
import { generateTemplate } from "./helpers";
import shortid from "shortid";

const DEFAULT_STATE = {
  data: getDefaultContent(),
  selectedElement: "",
  globalProperties: GLOBAL,
  localProperties: {},
  propertyType: "local",
  templates: [],
  selectedTemplates: ["instagram"],
  postVariant: "default",
  filename: "",
  zoomLevel: 0.7,
  view: "col",
  showControls: true,
  selectedFiles: [],
  exportId: 1,
};

const INITIAL_ZOOM_LEVEL = 0.6;

const loadInitialState = async () => {
  await getUser();
  const userConfig = await getConfigFromFirestore();
  return {
    ...DEFAULT_STATE,
    ...userConfig,
  };
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     const uid = user.uid;
  //   }
  //   return initial;
  // });
};

const initialState = await loadInitialState();

const rawSlice = createSlice({
  name: "config",
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
      if (state.postVariant === "listicle") {
        const contentList = state.data.content
          .trim()
          .split("\n")
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
            template.groupId && template.groupId !== "none"
              ? template.groupId
              : shortid();
          const pages = [
            ...generateTemplate(platform, {
              title: "title",
              content: null,
              groupId,
            }),
            ...contentIdObj.map(
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
      } else {
        state.templates = generateTemplate(state.selectedTemplates);
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
      state.selectedFiles = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, _.omit(DEFAULT_STATE, "exportId"));
    },
    incrementExportId: (state, action) => {
      state.exportId++;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel =
        Math.round(
          (action.payload === "+"
            ? Number(state.zoomLevel) + 0.1
            : Number(state.zoomLevel) - 0.1) * 10
        ) / 10;
    },
  },
});

export { initialState };
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
  setInitialState,
  setShowControls,
  setSelectedFiles,
  resetState,
  incrementExportId,
} = rawSlice.actions;

const store = configureStore({
  reducer: {
    config: rawSlice.reducer,
  },
});

store.subscribe((a, b) => {
  const state = store.getState();
  updateConfigInFirestore({
    data: {
      ..._.pick(state.config.data, ["title", "content", "brand"]),
    },
    ..._.pick(state.config, [
      "globalProperties",
      "localProperties",
      "propertyType",
      "templates",
      "selectedTemplates",
      "postVariant",
      "zoomLevel",
      "view",
      "exportId",
    ]),
  });
});

export default store;
