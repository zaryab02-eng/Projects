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
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* values to .env and restart the dev server.",
    );
  }

  // Popup is primary: it relays the sign-in result via postMessage between
  // windows in real time, so it isn't affected by browsers partitioning
  // storage on the firebaseapp.com authDomain as "third-party" relative to
  // this site (which silently breaks signInWithRedirect with no error).
  try {
    return await signInWithPopup(auth, getGoogleProvider());
  } catch (error) {
    // Only fall back to redirect if the popup genuinely couldn't open
    // (e.g. installed/standalone PWA, strict popup blockers). Don't fall
    // back on user-cancelled popups.
    if (
      error?.code === "auth/popup-blocked" ||
      error?.code === "auth/operation-not-supported-in-this-environment"
    ) {
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
    case "auth/unauthorized-domain":
      return "This domain isn't authorized for sign-in. Add it under Firebase → Authentication → Settings → Authorized domains.";
    default:
      return "Could not sign in with Google. Please try again.";
  }
}
