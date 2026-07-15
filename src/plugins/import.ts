import importPlugin from "eslint-plugin-import-x";
import type { FlatConfig } from "../types";

interface ImportStyleOptions {
  svelte?: boolean;
  vue?: boolean;
}

const createImportStyleConfig = (options: ImportStyleOptions = {}): FlatConfig => {
  const files = [
    "**/*.js",
    "**/*.mjs",
    "**/*.cjs",
    "**/*.ts",
    "**/*.tsx"
  ];

  if (options.vue) {
    files.push("**/*.vue");
  }

  if (options.svelte) {
    files.push("**/*.svelte");
  }

  return {
    files,
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
};

const importStyleConfig: FlatConfig = createImportStyleConfig();

export { createImportStyleConfig, importStyleConfig };
