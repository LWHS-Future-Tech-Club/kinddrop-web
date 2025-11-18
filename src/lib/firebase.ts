// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE1bt8UorGcLNciD4WGWvrM10fx5DMIUk",
  authDomain: "futuretechclub-bf762.firebaseapp.com",
  projectId: "futuretechclub-bf762",
  storageBucket: "futuretechclub-bf762.firebasestorage.app",
  messagingSenderId: "458131059264",
  appId: "1:458131059264:web:6f805005f9087ca1df65a5",
  measurementId: "G-89PJL532L2"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };
