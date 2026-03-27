// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuAxfk1K6RslXWwkSk2f9nxqwdgTsmq94",
  authDomain: "superbookingapp.firebaseapp.com",
  projectId: "superbookingapp",
  storageBucket: "superbookingapp.firebasestorage.app",
  messagingSenderId: "455119199745",
  appId: "1:455119199745:web:50d27455e2d06da6b66a00",
  measurementId: "G-YGFK5DSKKG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
