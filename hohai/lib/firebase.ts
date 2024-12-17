// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoeFHbjPtirEZCuB4VqeTXLDm7jCqMBxA",
  authDomain: "hohaibot.firebaseapp.com",
  projectId: "hohaibot",
  storageBucket: "hohaibot.firebasestorage.app",
  messagingSenderId: "538072271893",
  appId: "1:538072271893:web:2af84ced9991c6c3b2121c",
  measurementId: "G-66FZT9P8R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);