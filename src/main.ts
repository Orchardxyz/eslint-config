import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { importStyleConfig } from "./plugins/import";
import { pnpmWorkspaceYamlSortConfig } from "./plugins/pnpm";
import type {
  DisableTypeCheckedOptions,
  FlatConfig,
  FlatConfigItem,
  OryzConfig,
  OryzOptions
} from "./types";

const defaultAllowDefaultProject = ["*.config.ts"] as const;

const mergeAllowDefaultProject = (allowDefaultProject: string[] = []): string[] =>
  Array.from(new Set([...defaultAllowDefaultProject, ...allowDefaultProject]));

const createTypedLanguageOptions = (
  allowDefaultProject: string[]
): NonNullable<FlatConfig["languageOptions"]> => ({
  parserOptions: {
    projectService: {
      allowDefaultProject,
      defaultProject: "tsconfig.json"
    }
  }
});

const typedLanguageOptions = createTypedLanguageOptions(mergeAllowDefaultProject());

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

const base: FlatConfig[] = [
  js.configs.recommended,
  importStyleConfig,
  pnpmWorkspaceYamlSortConfig
];

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

const createTypedConfigs = (allowDefaultProject: string[] = []): FlatConfig[] => {
  const mergedAllowDefaultProject = mergeAllowDefaultProject(allowDefaultProject);

  return [
    ...typeCheckedConfigs,
    {
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: createTypedLanguageOptions(mergedAllowDefaultProject),
      rules: sharedTypeScriptRules
    },
    createDisableTypeCheckedConfig({
      files: mergedAllowDefaultProject
    })
  ];
};

const typed: FlatConfig[] = createTypedConfigs();

const typescript = typed;

const recommended: FlatConfig[] = [...base, ...typed];

const flatConfigKeys = new Set([
  "name",
  "files",
  "ignores",
  "languageOptions",
  "linterOptions",
  "plugins",
  "processor",
  "rules",
  "settings"
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOwn = (value: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const isFlatConfigLike = (value: unknown): value is FlatConfig =>
  isRecord(value) && Object.keys(value).some((key) => flatConfigKeys.has(key));

const isOryzOptions = (value: unknown): value is OryzOptions =>
  isRecord(value) && hasOwn(value, "allowDefaultProject") && !isFlatConfigLike(value);

const oryz: OryzConfig = Object.assign(
  (...args: [OryzOptions, ...FlatConfigItem[]] | FlatConfigItem[]): FlatConfig[] => {
    const [firstArg, ...restArgs] = args;
    const options = isOryzOptions(firstArg) ? firstArg : undefined;
    const configs: FlatConfigItem[] = options
      ? (restArgs as FlatConfigItem[])
      : (args as FlatConfigItem[]);

    return [
      ...base,
      ...(options ? createTypedConfigs(options.allowDefaultProject) : typed),
      ...configs.flatMap((config) => (Array.isArray(config) ? config : [config]))
    ];
  },
  {
    typedLanguageOptions,
    maxLinesRuleOptions,
    base,
    typed,
    typescript,
    recommended,
    pnpmWorkspaceYamlSort: pnpmWorkspaceYamlSortConfig,
    createDisableTypeCheckedConfig,
    disableTypeChecked
  }
);

export default oryz;
