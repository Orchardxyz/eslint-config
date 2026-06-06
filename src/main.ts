import js from "@eslint/js";
import tseslint from "typescript-eslint";

import type {
  DisableTypeCheckedOptions,
  FlatConfig,
  FlatConfigItem,
  OryzConfig
} from "./types";

const typedLanguageOptions = {
  parserOptions: {
    projectService: true
  }
} satisfies NonNullable<FlatConfig["languageOptions"]>;

const maxLinesRuleOptions = {
  skipBlankLines: true,
  skipComments: true
} as const;

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ["**/*.ts", "**/*.tsx"]
})) as FlatConfig[];

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
} satisfies NonNullable<FlatConfig["rules"]>;

const base: FlatConfig[] = [js.configs.recommended];

const typed: FlatConfig[] = [
  ...typeCheckedConfigs,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: typedLanguageOptions,
    rules: sharedTypeScriptRules
  }
];

const typescript = typed;

const recommended: FlatConfig[] = [...base, ...typed];

const createDisableTypeCheckedConfig = (
  options: DisableTypeCheckedOptions = {}
): FlatConfig => {
  const { files, globals } = options;
  const disableTypeCheckedConfig = tseslint.configs.disableTypeChecked as FlatConfig;

  return {
    ...disableTypeCheckedConfig,
    ...(files ? { files } : {}),
    languageOptions: {
      ...disableTypeCheckedConfig.languageOptions,
      ...(globals ? { globals } : {})
    }
  };
};

const disableTypeChecked = createDisableTypeCheckedConfig;

const oryz: OryzConfig = Object.assign(
  (...configs: FlatConfigItem[]): FlatConfig[] => [
    ...recommended,
    ...configs.flatMap((config) => (Array.isArray(config) ? config : [config]))
  ],
  {
    typedLanguageOptions,
    maxLinesRuleOptions,
    base,
    typed,
    typescript,
    recommended,
    createDisableTypeCheckedConfig,
    disableTypeChecked
  }
);

export default oryz;
