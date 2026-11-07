
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/arabic-600.css";
import "@fontsource/vazirmatn/arabic-700.css";
import "@fontsource/vazirmatn/arabic-800.css";
import "@fontsource/vazirmatn/latin-400.css";
import "@fontsource/vazirmatn/latin-500.css";
import "@fontsource/vazirmatn/latin-600.css";
import "@fontsource/vazirmatn/latin-700.css";
import "@fontsource/vazirmatn/latin-800.css";
import "./index.css";
import "./auth-modal.css";
import "./polish.css";
import "./ux-a11y.css";
import "./home-polish.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("واژه‌نو نتوانست حالت آفلاین را فعال کند.", error);
    });
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('عنصر root در فایل index.html پیدا نشد.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
