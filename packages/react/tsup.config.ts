import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "hapleroo-quizzard-core"],
  injectStyle: false,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".css": "css",
    };
  },
});
