import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getSlug, splitName } from "./helpers";
import { GLOBAL } from "./config";
import { updateConfigInFirestore } from "./firebase";
import { generateTemplate } from "./helpers";
import { getAuth, signOut } from "firebase/auth";
import _ from "lodash";
import shortid from "shortid";
import dayjs from "dayjs";
import { thunk as thunkMiddleware } from "redux-thunk";

const INITIAL_DATA = {
  title: "Welcome to the `Markdown`-based Social Media Post Generator  ",
  content: `
## Features
- **Markdown Support**: Write your content in Markdown format for easy formatting.
- **Template Generation**: Automatically generate templates for different platforms.
- **Multi-page Support**: Create multi-page or listicle-style posts effortlessly.

<br>

## Getting Started
1. **Set Your Title** Use the \`title\` field to define the main heading of your post.
2. **Write Your Content** Add your content in the \`content\` field. You can use Markdown syntax for formatting.
3. **Add Branding** Use the \`brand\` field to include your brand name or tagline.

<page>

## Advanced Usage
**Multi-page Posts** To create multi-page posts, use \` &lt; page &gt; \` to separate pages in your content.
**Listicle Posts** For listicle-style posts, use line breaks to separate items.

<br>

## Tips for Best Results
- Keep your content concise and engaging.
- Use headings (\`#\`, \`##\`, etc.) to structure your content.
- Preview your post to ensure proper formatting.

<br>

[Markdown Guide](https://www.markdownguide.org/)

Happy Posting! 🎉
`,
  //   title: "Did you know the `world’s` first website is still live? 🌍💻",
  //   content: `Tim Berners-Lee launched the **World Wide Web Project** at CERN, giving birth to the internet as we know it.
  // The original site, hosted at [**info.cern.ch**](https://info.cern.ch/), was the first step toward a digital revolution.
  //     `,
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

const appConfig = {
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

const nonResettableConfig = {
  exportId: 1,
  totalExports: 0,
  themes: [],
  dataConfig: DATA_CONFIG,
};

const initialState = {
  loading: true,
  filename: "",
  notification: null,
  updateGenericTag: false,
  ...nonResettableConfig,
  ...appConfig,
};

const INITIAL_ZOOM_LEVEL = 0.6;

const isMultipageOrListicle = (postVariant, content) => {
  const isMultipage = postVariant === "multipage" && content.includes("<page>");
  const isListicle = postVariant === "listicle" && content.includes("\n");
  return isMultipage || isListicle;
};

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
        const isListicle = state.postVariant === "listicle";
        const contentList = state.data.content
          .trim()
          .split(isListicle ? "\n" : "<page>")
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
    setSelectedFiles: (state, action) => {
      state.data.files = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    saveThemeOrVariant: (state, action) => {
      const { element } = splitName(action.payload);
      if (element) {
        if (!state.dataConfig[element]) {
          state.dataConfig[element] = {
            key: element,
            visible: true,
            variants: [],
            activeVariant: null,
          };
        }
        if (!state.dataConfig[element].variants) {
          state.dataConfig[element].variants = [];
        }
        state.dataConfig[element].variants.push({
          id: shortid(),
          createdAt: dayjs().format("YYYY-MM-DD"),
          properties: {
            ..._.get(state.globalProperties, element, {}),
            ..._.get(state.localProperties, element, {}),
          },
        });
      } else {
        state.themes.push({
          id: shortid(),
          createdAt: dayjs().format("YYYY-MM-DD"),
          localProperties: state.localProperties,
          globalProperties: state.globalProperties,
        });
      }
      state.notification = action.payload
        ? `Theme saved for ${action.payload}`
        : `Theme Saved.`;
    },
    applyNextThemeOrVariant: (state, action) => {
      const { element } = splitName(action.payload);
      if (element) {
        const variants = _.get(state.dataConfig, [element, "variants"], []);
        const variantIdx = _.get(
          state.dataConfig,
          [element, "activeVariant"],
          null
        );
        if (variants.length > 0) {
          const nextVariantIdx =
            variantIdx === null ? 0 : (variantIdx + 1) % variants.length;
          _.set(state.dataConfig, [element, "activeVariant"], nextVariantIdx);
          const nextVariant = variants[nextVariantIdx];
          state.globalProperties[element] = nextVariant.properties;
          state.updateGenericTag = true;
        }
      } else {
        if (state.themes.length > 0) {
          const randomIndex = Math.floor(Math.random() * state.themes.length);
          const randomTheme = state.themes[randomIndex];
          state.localProperties = randomTheme.localProperties;
          state.globalProperties = randomTheme.globalProperties;
        }
      }
    },
    resetElement: (state, action) => {
      const { element } = splitName(action.payload);

      state.localProperties[action.payload] = {};
      state.globalProperties[element] = _.get(GLOBAL, element, {});
      state.updateGenericTag = true;
    },
    resetState: (state) => {
      Object.assign(
        state,
        _.omit(initialState, Object.keys(nonResettableConfig))
      );
      state.templates = generateTemplate(state.selectedTemplates);
    },
    incrementExportId: (state) => {
      state.exportId++;
    },
    setUpdateGenericTag: (state) => {
      state.updateGenericTag = false;
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
  setSelectedFiles,
  resetState,
  incrementExportId,
  saveThemeOrVariant,
  applyNextThemeOrVariant,
  setNotification,
  setInitialState,
  logout,
  incrementTotalExports,
  updateDataConfig,
  resetElement,
  setUpdateGenericTag,
} = rawSlice.actions;

const setDataThunk = (data) => async (dispatch, getState) => {
  const { sdata } = getState();
  await dispatch(setData(data));
  if (sdata.postVariant === "multipage" || data.content.includes("<page>")) {
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
      ...Object.keys(appConfig),
      ...Object.keys(nonResettableConfig),
    ]),
    data: {
      ..._.pick(state.sdata.data, Object.keys(INITIAL_DATA)),
    },
  });
});

export { initialState };

export default store;
