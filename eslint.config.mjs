import globals from "globals";
import oryz from "@oryz/eslint-config";

export default [
  {
    ignores: ["dist/**", "node_modules/**", ".pnpm-store/**"]
  },
  ...oryz.base,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
