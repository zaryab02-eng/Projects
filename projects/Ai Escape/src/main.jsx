import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Load media test utilities in development
if (import.meta.env.DEV) {
  import("./utils/mediaTest.js").then(() => {
    console.log("🧪 Development mode: Media test utilities available");
    console.log("Run window.mediaTest.runAllTests() to test media loading");
  });
}

// ✅ Global error handler for Safari - prevents TLS error appearance
window.addEventListener('error', (event) => {
  // Check if error is related to media loading
  if (event.target && (event.target.tagName === 'VIDEO' || event.target.tagName === 'AUDIO')) {
    console.error('Media loading error (non-critical):', event.target.src, event);
    event.preventDefault(); // Prevent default error handling that might crash the app
    return false;
  }
  
  // Log other errors but don't crash
  console.error('Application error:', event.error || event.message);
}, true);

// ✅ Handle unhandled promise rejections (common with Safari autoplay)
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection (non-critical):', event.reason);
  
  // Check if it's an autoplay-related error
  if (event.reason && 
      (event.reason.name === 'NotAllowedError' || 
       event.reason.message?.includes('play') ||
       event.reason.message?.includes('autoplay'))) {
    console.log('Safari autoplay restriction detected - app continues normally');
    event.preventDefault(); // Prevent unhandled rejection error
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
