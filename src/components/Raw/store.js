import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getDefaultContent, getSlug } from "./helpers";
import { GLOBAL } from "./config";
import {
  getConfigFromFirestore,
  getUser,
  updateConfigInFirestore,
} from "./firebase";
import _ from "lodash";

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
};

const loadInitialState = async () => {
  await getUser();
  return await getConfigFromFirestore();

  // return DEFAULT_STATE;
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
    },
    setSelectedTemplates: (state, action) => {
      state.selectedTemplates = action.payload;
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
      Object.assign(state, DEFAULT_STATE);
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
      ..._.pick(state.config.data, ["title", "content"]),
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
    ]),
  });
});

export default store;
