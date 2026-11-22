import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These values come from the ".env" file (see README, "Connecting the admin app").
// If they are missing, the website simply uses the built-in sample data.
const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Which website's content to show. One admin app can manage many websites,
// each with its own id (e.g. "natusz"). Must match the siteId of the admin login.
export const siteId = env.VITE_SITE_ID || "";

export const firebaseReady = Boolean(config.apiKey && config.projectId && siteId);
export const db = firebaseReady ? getFirestore(initializeApp(config)) : null;
