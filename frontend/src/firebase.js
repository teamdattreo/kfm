// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALKBsvAwo2pNe1MFpbWmRtkHMfGgUHUBQ",
  authDomain: "kfmstd-d09f7.firebaseapp.com",
  projectId: "kfmstd-d09f7",
  storageBucket: "kfmstd-d09f7.firebasestorage.app",
  messagingSenderId: "151874680588",
  appId: "1:151874680588:web:7d6dc582d91c6a5d247b29",
  measurementId: "G-529XE4KEEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);