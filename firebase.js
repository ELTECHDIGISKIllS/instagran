import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCaPPtFZSqzmvRlm4TfyPzXh19aKb7mzVY",
  authDomain: "instagram-68ff5.firebaseapp.com",
  projectId: "instagram-68ff5",
  storageBucket: "instagram-68ff5.appspot.com",
  messagingSenderId: "173524911738",
  appId: "1:173524911738:web:fae9b7ad88c2d079419dc3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth(app);

export { app, db, storage, auth };
