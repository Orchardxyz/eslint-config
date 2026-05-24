import globals from "globals";
import { base } from "@oryz/eslint-config";

export default [
  {
    ignores: ["node_modules/**", ".pnpm-store/**"]
  },
  ...base,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
