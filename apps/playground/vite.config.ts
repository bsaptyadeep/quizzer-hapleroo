import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "hapleroo-quizzard": path.resolve(__dirname, "../../packages/react/src"),
      "hapleroo-quizzard/styles.css": path.resolve(
        __dirname,
        "../../packages/react/src/styles/quiz.module.css",
      ),
    },
  },
  server: {
    port: 5173,
  },
});
