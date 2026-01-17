import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// 🔑 Firebase configuration - loaded from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Validate Firebase config
if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
  console.error(
    "❌ Firebase configuration incomplete. Check environment variables:",
  );
  console.error("Missing:", {
    projectId: !firebaseConfig.projectId ? "VITE_FIREBASE_PROJECT_ID" : "✓",
    databaseURL: !firebaseConfig.databaseURL
      ? "VITE_FIREBASE_DATABASE_URL"
      : "✓",
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };
