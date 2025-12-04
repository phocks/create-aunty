import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { loadingScript } from "vite-plugin-script-loader";

// https://vite.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  const isDev = command === "serve";
  return {
    base: isDev
      ? "/"
      : "https://www.abc.net.au/res/sites/news-projects/interactive-vite-testing/",
    plugins: [
      svelte(),
      loadingScript({
        fileName: "index",
        shouldHash: true,
        devEntry: "src/main.ts",
      }),
    ],
    server: {
      cors: true,
    },
  };
});
