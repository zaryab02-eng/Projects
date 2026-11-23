import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Paused from "./pages/Paused.jsx";
import { ContentProvider } from "./lib/content.jsx";
import "./index.css";

// To pause the website: set the host variable VITE_SITE_PAUSED to true and redeploy.
// To resume: remove the variable (or set it to false) and redeploy. Nothing is lost.
const paused =
  String(import.meta.env.VITE_SITE_PAUSED || "").toLowerCase() === "true";

ReactDOM.createRoot(document.getElementById("root")).render(
  paused ? (
    <Paused />
  ) : (
    <BrowserRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  ),
);
