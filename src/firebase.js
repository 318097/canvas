import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import config from "./config";
import {
  collection,
  getFirestore,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { initialState } from "./store";

const { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } =
  config.FIREBASE;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "canvas-ed355.firebaseapp.com",
  projectId: "canvas-ed355",
  storageBucket: "canvas-ed355.firebasestorage.app",
  messagingSenderId: "767863917859",
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

const COLLECTION_NAME = "users";
const USERS_COLLECTION = collection(db, COLLECTION_NAME);

const getTime = () => new Date().getTime();

const getDefaultObj = (userInfo) => {
  const now = getTime();
  return {
    userId: getUserId(),
    ...userInfo,
    createdAt: now,
    updatedAt: now,
    ...initialState,
  };
};

const validateUserInFireDb = async (userInfo = {}) => {
  try {
    const uid = getUserId();

    const userDocRef = doc(db, "users", uid);
    let userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, getDefaultObj(userInfo));
      console.log("New user document created with ID:", uid);
    } else {
      console.log("User already exists with ID:", uid);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error in fetching user::", errorCode, errorMessage);
  }
};

const getUserId = () => {
  const uid = auth.currentUser.uid;

  if (!uid) throw new Error("System error");

  return uid;
};

const updateConfigInFirestore = async (data) => {
  const postRef = doc(USERS_COLLECTION, getUserId());
  await updateDoc(postRef, {
    ...data,
    updatedAt: getTime(),
  });
};

const getConfigFromFirestore = async () => {
  const userDocRef = doc(db, "users", getUserId());
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User document not found");
  }

  return { ...userDoc.data(), id: userDoc.id };
};

export {
  getConfigFromFirestore,
  validateUserInFireDb,
  auth,
  updateConfigInFirestore,
};
