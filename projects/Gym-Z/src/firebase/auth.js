import {
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";

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
  const verifier = getRecaptchaVerifier(containerId);
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
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
