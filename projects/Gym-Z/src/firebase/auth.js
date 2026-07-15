import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { auth } from './config.js'

export function getRecaptchaVerifier(containerId = 'recaptcha-container') {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    })
  }
  return window.recaptchaVerifier
}

export async function sendOtp(phoneNumber, containerId) {
  const verifier = getRecaptchaVerifier(containerId)
  return signInWithPhoneNumber(auth, phoneNumber, verifier)
}

export async function confirmOtp(confirmationResult, code) {
  return confirmationResult.confirm(code)
}

export async function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  return signOut(auth)
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}
