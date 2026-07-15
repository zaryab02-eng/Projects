import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";
import { getOwnerPrimaryGym } from "./firestore.js";

function getGoogleProvider() {
  return new GoogleAuthProvider();
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* values to .env and restart the dev server.",
    );
  }

  try {
    return await signInWithPopup(auth, getGoogleProvider());
  } catch (error) {
    if (error?.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, getGoogleProvider());
      return null;
    }
    throw error;
  }
}

export async function completeGoogleRedirectSignIn() {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }
  return getRedirectResult(auth);
}

export async function routeAfterGoogleSignIn(user, navigate) {
  try {
    const gym = await getOwnerPrimaryGym(user.uid);
    navigate(gym ? "/dashboard" : "/create-gym");
  } catch (error) {
    console.warn("Gym lookup failed after sign-in:", error);
    navigate("/create-gym");
  }
}

export async function logout() {
  return signOut(auth);
}

export function getGoogleAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Allow pop-ups for this site and try again.";
    case "auth/operation-not-allowed":
      return "Google sign-in is disabled in Firebase. Enable Google under Authentication → Sign-in method.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    default:
      return "Could not sign in with Google. Please try again.";
  }
}
