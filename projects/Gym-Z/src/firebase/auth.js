import {
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";

const RECAPTCHA_SITE_KEY = "6LfgR1UtAAAAAP3VWMtd10iKn3k5Je4r_XZ2WyhG";

function ensureRecaptchaReady() {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha?.enterprise?.ready) {
      window.grecaptcha.enterprise.ready(() => resolve());
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="recaptcha/enterprise.js"]',
    );

    const finish = () => {
      if (window.grecaptcha?.enterprise?.ready) {
        window.grecaptcha.enterprise.ready(() => resolve());
      } else {
        resolve();
      }
    };

    if (existingScript) {
      existingScript.addEventListener("load", finish, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load reCAPTCHA.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = finish;
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA."));
    document.head.appendChild(script);
  });
}

export async function getRecaptchaVerifier(
  containerId = "recaptcha-container",
) {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add your VITE_FIREBASE_* values to .env and restart the dev server.",
    );
  }

  await ensureRecaptchaReady();

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return window.recaptchaVerifier;
}

export async function sendOtp(phoneNumber, containerId) {
  const verifier = await getRecaptchaVerifier(containerId);
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
