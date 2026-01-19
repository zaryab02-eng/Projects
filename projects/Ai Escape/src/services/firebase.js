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

// ✅ Validate Firebase config - CRITICAL for iOS Safari
const isMissingConfig = !firebaseConfig.projectId || !firebaseConfig.databaseURL || !firebaseConfig.apiKey;

if (isMissingConfig) {
  console.error(
    "❌ Firebase configuration incomplete. Check environment variables:",
  );
  console.error("Missing:", {
    apiKey: !firebaseConfig.apiKey ? "VITE_FIREBASE_API_KEY" : "✓",
    projectId: !firebaseConfig.projectId ? "VITE_FIREBASE_PROJECT_ID" : "✓",
    databaseURL: !firebaseConfig.databaseURL
      ? "VITE_FIREBASE_DATABASE_URL"
      : "✓",
  });
  
  // ✅ Show user-friendly error instead of TLS error
  alert("⚠️ App configuration error. Please contact the administrator.\n\nMissing Firebase environment variables.");
  
  // Throw error to prevent app from attempting to use Firebase
  throw new Error("Firebase configuration is incomplete. Cannot initialize app.");
}

// ✅ Initialize Firebase with error handling for iOS Safari
let app, database, auth;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  
  // ✅ Show user-friendly error instead of TLS error
  alert("⚠️ Unable to connect to game servers.\n\nError: " + error.message + "\n\nPlease check your internet connection and try again.");
  
  // Re-throw to prevent app from continuing with broken Firebase
  throw new Error("Firebase initialization failed: " + error.message);
}

export { app, database, auth };
