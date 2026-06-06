import type { Linter } from "eslint";

export type FlatConfig = Linter.Config;
export type Globals = NonNullable<FlatConfig["languageOptions"]>["globals"];
export type FlatConfigItem = FlatConfig | FlatConfig[];

export interface DisableTypeCheckedOptions {
  files?: string[];
  globals?: Globals;
}

export interface OryzConfig {
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
  readonly createDisableTypeCheckedConfig: (
    options?: DisableTypeCheckedOptions
  ) => FlatConfig;
  readonly disableTypeChecked: (options?: DisableTypeCheckedOptions) => FlatConfig;
}
