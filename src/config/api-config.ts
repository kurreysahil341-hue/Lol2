/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// =========================================================================
// JARVIS VOICE ASSISTANT - API CONFIGURATION FILE
// =========================================================================
// HINDI: Aap apni Gemini API Key yahan niche "GEMINI_API_KEY" ke samne daal sakte hain.
// Jab aap is app ki zip file ko GitHub par upload karenge aur APK banayenge,
// toh yeh API Key aapke mobile app (APK) mein seedhe kaam karegi!
//
// ENGLISH: You can paste your Gemini API Key in the field below.
// When you upload this zip to GitHub and compile your debug APK, 
// this key will be baked into the APK so that your voice assistant works offline/directly!
// =========================================================================

export const API_CONFIG = {
  // Yahan apni Gemini API Key likhein (e.g., "AIzaSy...")
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",

  // YouTube Data API Key (Optional)
  YOUTUBE_API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",

  // Google Maps API Key (Optional)
  GOOGLE_MAPS_API_KEY: "YOUR_GOOGLE_MAPS_API_KEY_HERE",

  // Calling / Telecom API Key (Optional)
  CALLING_API_KEY: "YOUR_CALLING_API_KEY_HERE",

  // Camera / Computer Vision API Key (Optional)
  CAMERA_API_KEY: "YOUR_CAMERA_API_KEY_HERE",
  
  // App default system language ('hi-IN' for Hindi, 'en-US' for English, or 'auto')
  DEFAULT_LANGUAGE: "auto",
  
  // Set to true if you want to use the API key directly in client-side (required for standalone APK)
  USE_CLIENT_SIDE_API_KEY: true,
};

/**
 * Helper function to retrieve the active Gemini API Key.
 */
export function getGeminiApiKey(): string {
  const savedKey = localStorage.getItem("JARVIS_GEMINI_API_KEY");
  if (savedKey && savedKey.trim() !== "" && savedKey !== "YOUR_GEMINI_API_KEY_HERE") {
    return savedKey.trim();
  }
  if (API_CONFIG.GEMINI_API_KEY && API_CONFIG.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
    return API_CONFIG.GEMINI_API_KEY.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
  if (envKey) {
    return envKey;
  }
  return "";
}

/**
 * Helper function to retrieve the YouTube API Key.
 */
export function getYoutubeApiKey(): string {
  const savedKey = localStorage.getItem("JARVIS_YOUTUBE_API_KEY");
  if (savedKey && savedKey.trim() !== "" && savedKey !== "YOUR_YOUTUBE_API_KEY_HERE") {
    return savedKey.trim();
  }
  if (API_CONFIG.YOUTUBE_API_KEY && API_CONFIG.YOUTUBE_API_KEY !== "YOUR_YOUTUBE_API_KEY_HERE") {
    return API_CONFIG.YOUTUBE_API_KEY.trim();
  }
  const envKey = (import.meta as any).env?.VITE_YOUTUBE_API_KEY || "";
  if (envKey) {
    return envKey;
  }
  return "";
}

/**
 * Helper function to retrieve Google Maps API Key.
 */
export function getGoogleMapsApiKey(): string {
  const savedKey = localStorage.getItem("JARVIS_GOOGLE_MAPS_API_KEY");
  if (savedKey && savedKey.trim() !== "" && savedKey !== "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return savedKey.trim();
  }
  if (API_CONFIG.GOOGLE_MAPS_API_KEY && API_CONFIG.GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return API_CONFIG.GOOGLE_MAPS_API_KEY.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  if (envKey) {
    return envKey;
  }
  return "";
}

/**
 * Helper function to retrieve Calling API Key.
 */
export function getCallingApiKey(): string {
  const savedKey = localStorage.getItem("JARVIS_CALLING_API_KEY");
  if (savedKey && savedKey.trim() !== "" && savedKey !== "YOUR_CALLING_API_KEY_HERE") {
    return savedKey.trim();
  }
  if (API_CONFIG.CALLING_API_KEY && API_CONFIG.CALLING_API_KEY !== "YOUR_CALLING_API_KEY_HERE") {
    return API_CONFIG.CALLING_API_KEY.trim();
  }
  return "";
}

/**
 * Helper function to retrieve Camera Vision API Key.
 */
export function getCameraApiKey(): string {
  const savedKey = localStorage.getItem("JARVIS_CAMERA_API_KEY");
  if (savedKey && savedKey.trim() !== "" && savedKey !== "YOUR_CAMERA_API_KEY_HERE") {
    return savedKey.trim();
  }
  if (API_CONFIG.CAMERA_API_KEY && API_CONFIG.CAMERA_API_KEY !== "YOUR_CAMERA_API_KEY_HERE") {
    return API_CONFIG.CAMERA_API_KEY.trim();
  }
  return "";
}
