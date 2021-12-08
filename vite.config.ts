import { Alias, defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgr from "vite-plugin-svgr";

import path from "path";

import * as tsconfig from "./tsconfig.paths.json";

function readAliasFromTsConfig(): Alias[] {
  const pathReplaceRegex = new RegExp(/\/\*$/, "");

  return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
    const find = fromPaths.replace(pathReplaceRegex, "");
    const toPath = toPaths[0].replace(pathReplaceRegex, "");
    const replacement = path.resolve(__dirname, toPath);

    aliases.push({ find, replacement });
    return aliases;
  }, [] as Alias[]);
}

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
  },
  plugins: [reactRefresh(), svgr()],
  resolve: {
    alias: readAliasFromTsConfig(),
  },
});
