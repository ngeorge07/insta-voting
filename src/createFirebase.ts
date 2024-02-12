import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: "voting-insta.appspot.com",
  messagingSenderId: "566329160826",
  appId: import.meta.env.VITE_APP_ID,
};

initializeApp(firebaseConfig);
export const auth = getAuth();
