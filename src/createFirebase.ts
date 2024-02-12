import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-LJGhPtQvwlCEQh3PcN_-RuDAAR5u3-4",
  authDomain: "voting-insta.firebaseapp.com",
  projectId: "voting-insta",
  storageBucket: "voting-insta.appspot.com",
  messagingSenderId: "566329160826",
  appId: "1:566329160826:web:0e2dd9cd4130b4ad1f77c3",
};

initializeApp(firebaseConfig);
export const auth = getAuth();
