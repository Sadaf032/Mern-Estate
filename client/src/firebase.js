import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ebfce.firebaseapp.com",
  projectId: "mern-estate-ebfce",
  messagingSenderId: "867076469679",
  appId: "1:867076469679:web:d33a8dbd6479fe9930355a",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);