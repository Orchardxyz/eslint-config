import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @typedef {import("eslint").Linter.Config} FlatConfig */
/** @typedef {NonNullable<FlatConfig["languageOptions"]>["globals"]} Globals */

export const typedLanguageOptions = {
  parserOptions: {
    projectService: true
  }
};

export const maxLinesRuleOptions = {
  skipBlankLines: true,
  skipComments: true
};

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ["**/*.ts", "**/*.tsx"]
}));

const sharedTypeScriptRules = {
  "@typescript-eslint/consistent-type-imports": [
    "warn",
    {
      prefer: "type-imports",
      fixStyle: "separate-type-imports"
    }
  ],
  "@typescript-eslint/no-base-to-string": "off",
  "@typescript-eslint/no-floating-promises": "off",
  "@typescript-eslint/no-unnecessary-type-assertion": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      ignoreRestSiblings: true,
      varsIgnorePattern: "^_"
    }
  ],
  "@typescript-eslint/require-await": "off",
  "no-console": [
    "error",
    {
      allow: ["warn", "error", "info"]
    }
  ],
  "no-nested-ternary": "error",
  "no-restricted-syntax": [
    "error",
    {
      selector: "CallExpression[optional=false] > ArrowFunctionExpression.callee",
      message: "Do not use immediately invoked function expressions (IIFEs). Extract to a named function instead."
    },
    {
      selector: "CallExpression[optional=false] > FunctionExpression.callee",
      message: "Do not use immediately invoked function expressions (IIFEs). Extract to a named function instead."
    }
  ],
  "no-void": "error"
};

export const base = [js.configs.recommended];

export const typed = [
  ...typeCheckedConfigs,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: typedLanguageOptions,
    rules: sharedTypeScriptRules
  }
];

export const typescript = typed;

export const recommended = [...base, ...typed];

/**
 * @param {{ files?: string[], globals?: Globals }} [options]
 * @returns {FlatConfig}
 */
export const createDisableTypeCheckedConfig = (options = {}) => {
  const { files, globals } = options;
  const disableTypeCheckedConfig = /** @type {FlatConfig} */ (tseslint.configs.disableTypeChecked);

  return {
    ...disableTypeCheckedConfig,
    ...(files ? { files } : {}),
    languageOptions: {
      ...disableTypeCheckedConfig.languageOptions,
      ...(globals ? { globals } : {})
    }
  };
};

export const disableTypeChecked = createDisableTypeCheckedConfig;
