import "firebase/auth";
import "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import Constants from "expo-constants";
const firebaseConfig = Constants.expoConfig?.extra?.fireBaseConfig;
try {
  // Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
  if (!getApps().length) {
    initializeApp({ ...firebaseConfig, projectId: firebaseConfig?.projectId });
  }
} catch (e) {
  console.log("App reloaded, so firebase did not re-initialize");
}
// Initialize Firebase
const db = getFirestore();
const settings = doc(db, "menu", "settings");
const history = collection(db, "history");
const Firebase = {
  settings: settings,
  history: history,
};

export default Firebase;
