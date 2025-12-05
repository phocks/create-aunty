import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { loadingScript } from "vite-plugin-script-loader";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl =
    env.BASE_URL ||
    "https://www.abc.net.au/res/sites/news-projects/";
  const projectDir = env.PROJECT_DIR || "{{PROJECT_DIR}}";
  const deployDir = env.DEPLOY_DIR || "unversioned";

  const isDev = command === "serve";
  return {
    base: isDev ? "/" : `${baseUrl}${projectDir}/${deployDir}/`,
    plugins: [svelte(), loadingScript()],
    server: {
      cors: true,
    },
  };
});
