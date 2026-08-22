import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@quiz/react": path.resolve(__dirname, "../../packages/react/src"),
      "@quiz/react/styles.css": path.resolve(
        __dirname,
        "../../packages/react/src/styles/quiz.module.css",
      ),
    },
  },
  server: {
    port: 5173,
  },
});
