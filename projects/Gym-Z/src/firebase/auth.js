import {
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  linkWithCredential,
  initializeRecaptchaConfig,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";

let recaptchaConfigInitialized = false;

async function ensureRecaptchaConfig() {
  if (!recaptchaConfigInitialized) {
    await initializeRecaptchaConfig(auth);
    recaptchaConfigInitialized = true;
  }
}

export function resetRecaptchaVerifier() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // Ignore cleanup errors from stale verifiers.
    }
    window.recaptchaVerifier = null;
  }
}

export function getRecaptchaVerifier(containerId = "recaptcha-container") {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* values to .env and restart the dev server.",
    );
  }

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return window.recaptchaVerifier;
}

export async function sendOtp(phoneNumber, containerId) {
  await ensureRecaptchaConfig();
  const verifier = getRecaptchaVerifier(containerId);
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, verifier);
  } catch (error) {
    resetRecaptchaVerifier();
    throw error;
  }
}

export async function confirmOtp(confirmationResult, code) {
  return confirmationResult.confirm(code);
}

export async function signInWithPhoneCode(confirmationResult, code) {
  return confirmationResult.confirm(code);
}

export async function signInWithPhoneCredential(credential) {
  return signInWithCredential(auth, credential);
}

export async function linkPhoneCredential(user, credential) {
  return linkWithCredential(user, credential);
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword() {
  return Promise.resolve();
}

export function getPhoneAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-phone-number":
      return "Please use a valid international number such as +91XXXXXXXXXX.";
    case "auth/operation-not-allowed":
      return "Phone sign-in is disabled in Firebase. Enable Phone under Authentication → Sign-in method.";
    case "auth/too-many-requests":
      return "Too many OTP attempts. Wait a few minutes and try again.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded for this Firebase project. Check billing and SMS limits.";
    case "auth/captcha-check-failed":
    case "auth/invalid-app-credential":
      return "reCAPTCHA verification failed. Remove any custom reCAPTCHA script, redeploy, and confirm your Vercel domain is listed under Firebase → Authentication → Authorized domains.";
    case "auth/missing-app-credential":
      return "Phone verification could not start. Refresh the page and try again.";
    default:
      if (
        error?.message?.includes("SITE_MISMATCH") ||
        error?.message?.includes("CAPTCHA_CHECK_FAILED")
      ) {
        return "reCAPTCHA site key mismatch. Do not hardcode a reCAPTCHA key in index.html; Firebase provides the correct key automatically.";
      }
      if (
        error?.message?.includes("region") ||
        error?.message?.includes("SMS unable to be sent")
      ) {
        return "SMS is blocked for this region. In Firebase → Authentication → Settings → SMS region policy, allow India (+91).";
      }
      return "Could not send OTP. Check the phone number and Firebase phone-auth settings.";
  }
}
