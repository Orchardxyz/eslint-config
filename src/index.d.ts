import type { Linter } from "eslint";

export declare const typedLanguageOptions: NonNullable<Linter.Config["languageOptions"]>;
export declare const maxLinesRuleOptions: {
  skipBlankLines: true;
  skipComments: true;
};
export declare const base: Linter.Config[];
export declare const typed: Linter.Config[];
export declare const typescript: Linter.Config[];
export declare const recommended: Linter.Config[];
export interface DisableTypeCheckedOptions {
  files?: string[];
  globals?: NonNullable<Linter.Config["languageOptions"]>["globals"];
}
export declare function createDisableTypeCheckedConfig(
  options?: DisableTypeCheckedOptions
): Linter.Config;
export declare const disableTypeChecked: typeof createDisableTypeCheckedConfig;
