import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        // جدا کردن وابستگی‌های سنگین تا کش مرورگر بهتر کار کند و بسته اصلی سبک‌تر شود
        manualChunks(id) {
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) return "firebase";
          if (id.includes("node_modules/react")) return "react";
          if (/\/(BaseLessons|ExpandedLessons|ExtraLessons|SpanishLessons)\.ts$/.test(id)) return "lessons";
        },
      },
    },
  },
});
