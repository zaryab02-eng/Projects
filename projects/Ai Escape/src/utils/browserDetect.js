/**
 * Browser detection utilities for Safari-specific fixes
 */

/**
 * Detect if the browser is Safari (including iOS Safari)
 * @returns {boolean} True if Safari browser
 */
export const isSafari = () => {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const webkit = /WebKit/.test(ua);
  const safari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua);
  
  return iOS || (webkit && safari);
};

/**
 * Detect if the browser is iOS Safari specifically
 * @returns {boolean} True if iOS Safari
 */
export const isIOSSafari = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
};

/**
 * Check if autoplay is likely to be blocked
 * @returns {boolean} True if autoplay might be blocked
 */
export const willAutoplayBlock = () => {
  return isSafari() || isIOSSafari();
};

/**
 * Attempt to enable video playback with user gesture fallback
 * @param {HTMLVideoElement} videoElement - The video element to play
 * @param {Function} fallback - Callback if autoplay fails
 */
export const safePlayVideo = async (videoElement, fallback) => {
  if (!videoElement) return;

  try {
    await videoElement.play();
    console.log("Video playing successfully");
  } catch (err) {
    console.log("Video autoplay prevented:", err.message);
    if (fallback) {
      fallback();
    }
  }
};

/**
 * Attempt to enable audio playback with user gesture fallback
 * @param {HTMLAudioElement} audioElement - The audio element to play
 * @param {Function} fallback - Callback if autoplay fails
 */
export const safePlayAudio = async (audioElement, fallback) => {
  if (!audioElement) return;

  try {
    await audioElement.play();
    console.log("Audio playing successfully");
  } catch (err) {
    console.log("Audio autoplay prevented:", err.message);
    if (fallback) {
      fallback();
    }
  }
};
