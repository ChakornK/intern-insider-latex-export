import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

import { defineConfig } from "rolldown";
import solid from "@rolldown-plugin/solid";

import postcss from "postcss";
import { createPlugin as postcssUno } from "@unocss/postcss/esm";
import postcssImport from "postcss-import";

import { transform } from "lightningcss";

const gitHash = (() => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
})();

const userScriptMetadata = `// ==UserScript==
// @name        Intern Insider LaTeX Resume Exporter
// @namespace   Violentmonkey Scripts
// @match       https://interninsider.me/*
// @version     ${process.env.VERSION || "1.0.0"}
// @author      -
// @description Build ${gitHash} - ${new Date().toLocaleString("en")}
// @homepageURL https://github.com/chakornk/intern-insider-latex-export
// @downloadURL https://github.com/chakornk/intern-insider-latex-export/releases/latest/download/intern-insider-latex-export.user.js
// @updateURL   https://github.com/chakornk/intern-insider-latex-export/releases/latest/download/intern-insider-latex-export.user.js
// ==/UserScript==`;

export default defineConfig({
  input: "src/index.tsx",
  output: {
    cleanDir: true,
    file: "dist/intern-insider-latex-export.user.js",
    comments: false,
    format: "iife",
    minify: true,
    postBanner: userScriptMetadata,
  },
  moduleTypes: {
    ".css": "text",
    ".tex": "text",
  },
  plugins: [
    solid(),
    {
      name: "postcss",
      transform: async (code: string, id: string) => {
        if (!id.endsWith(".css")) return null;
        const processed: string = await new Promise((resolve) => {
          postcss([postcssUno({}), postcssImport()])
            .process(code, {
              from: id,
            })
            .then((result) => {
              resolve(result.css);
            });
        });
        const { code: minified } = transform({
          filename: id,
          code: Buffer.from(processed),
          minify: true,
        });
        const cleaned = minified
          .toString()
          .replaceAll(/\/\*!.*?\*\//g, "")
          .trim();

        if (!existsSync(`${process.cwd()}/dist/debug`)) {
          mkdirSync(`${process.cwd()}/dist/debug`, { recursive: true });
        }
        writeFileSync(`${process.cwd()}/dist/debug/${id.split(/\/|\\/).pop()}`, cleaned);

        return cleaned;
      },
    },
  ],
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
});
