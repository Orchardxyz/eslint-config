import yamlPlugin from "eslint-plugin-yml";
import * as yamlParser from "yaml-eslint-parser";
import type { FlatConfig } from "../types";

const pnpmWorkspaceYamlSortConfig: FlatConfig = {
  files: ["pnpm-workspace.yaml"],
  languageOptions: {
    parser: yamlParser
  },
  plugins: {
    yaml: yamlPlugin
  },
  rules: {
    "yaml/sort-keys": [
      "error",
      {
        pathPattern: "^catalog$",
        order: {
          type: "asc"
        }
      },
      {
        pathPattern: "^catalogs$",
        order: {
          type: "asc"
        }
      },
      {
        pathPattern: "^catalogs\\.[^.]+$",
        order: {
          type: "asc"
        }
      }
    ]
  }
};

export { pnpmWorkspaceYamlSortConfig };
