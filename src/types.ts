import type { Linter } from "eslint";

export type FlatConfig = Linter.Config;
export type Globals = NonNullable<FlatConfig["languageOptions"]>["globals"];
export type FlatConfigItem = FlatConfig | FlatConfig[];

export interface DisableTypeCheckedOptions {
  files?: string[];
  globals?: Globals;
}

export interface OryzOptions {
  allowDefaultProject?: string[];
}

export interface OryzConfig {
  (options: OryzOptions, ...configs: FlatConfigItem[]): FlatConfig[];
  (...configs: FlatConfigItem[]): FlatConfig[];
  readonly typedLanguageOptions: NonNullable<FlatConfig["languageOptions"]>;
  readonly maxLinesRuleOptions: {
    readonly skipBlankLines: true;
    readonly skipComments: true;
  };
  readonly base: FlatConfig[];
  readonly typed: FlatConfig[];
  readonly typescript: FlatConfig[];
  readonly recommended: FlatConfig[];
  readonly pnpmWorkspaceYamlSort: FlatConfig;
  readonly createDisableTypeCheckedConfig: (
    options?: DisableTypeCheckedOptions
  ) => FlatConfig;
  readonly disableTypeChecked: (options?: DisableTypeCheckedOptions) => FlatConfig;
}
