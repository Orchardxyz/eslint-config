import importPlugin from "eslint-plugin-import-x";
import type { FlatConfig } from "../types";

const importStyleConfig: FlatConfig = {
  files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.ts", "**/*.tsx"],
  plugins: {
    import: importPlugin
  },
  rules: {
    "import/first": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type"
        ],
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true }
      }
    ],
    "import/newline-after-import": [
      "error",
      { count: 1, exactCount: true }
    ]
  }
};

export { importStyleConfig };