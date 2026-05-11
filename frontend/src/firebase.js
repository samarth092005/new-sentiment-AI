import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAe7jtV1EJifmtCg2usl5svwFPLeUZfG4w",
  authDomain: "ai-sentiment-7c283.firebaseapp.com",
  projectId: "ai-sentiment-7c283",
  storageBucket: "ai-sentiment-7c283.firebasestorage.app",
  messagingSenderId: "176850583941",
  appId: "1:176850583941:web:662da260330dc707d084ec",
  measurementId: "G-97S3B9NCMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
