// Import the functions you need from the SDKs you need
// Firebase SDK import
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        // 인증
import { getFirestore } from "firebase/firestore"; // Firestore
import { getAnalytics } from "firebase/analytics"; // Analytics (선택)

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4TuDnGc7_WlR8dYXnH2TAcTjrvXXznZ8",
  authDomain: "giftee-28e6a.firebaseapp.com",
  projectId: "giftee-28e6a",
  storageBucket: "giftee-28e6a.firebasestorage.app",
  messagingSenderId: "515160334382",
  appId: "1:515160334382:web:788d48ad3531b91786ffbf",
  measurementId: "G-32H5ED0HNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;