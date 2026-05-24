import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";

import {
  base,
  createDisableTypeCheckedConfig,
  disableTypeChecked,
  maxLinesRuleOptions,
  recommended,
  typed,
  typedLanguageOptions,
  typescript
} from "@oryz/eslint-config";

const fixtureDir = fileURLToPath(new URL("./fixtures/consumer/", import.meta.url));
const fixtureConfigPath = path.join(fixtureDir, "eslint.config.mjs");

test("exports the expected flat-config building blocks", () => {
  assert.ok(Array.isArray(base));
  assert.ok(Array.isArray(typed));
  assert.equal(typed, typescript);
  assert.equal(recommended.length, base.length + typed.length);
  assert.deepEqual(maxLinesRuleOptions, {
    skipBlankLines: true,
    skipComments: true
  });
  assert.deepEqual(typedLanguageOptions, {
    parserOptions: {
      projectService: true
    }
  });
});

test("createDisableTypeCheckedConfig merges files and globals", () => {
  const config = createDisableTypeCheckedConfig({
    files: ["**/*.config.js"],
    globals: { MY_GLOBAL: "readonly" }
  });
  const configuredGlobals = /** @type {Record<string, string>} */ (config.languageOptions?.globals ?? {});

  assert.deepEqual(config.files, ["**/*.config.js"]);
  assert.equal(configuredGlobals.MY_GLOBAL, "readonly");
});

test("disableTypeChecked is an alias of createDisableTypeCheckedConfig", () => {
  assert.equal(disableTypeChecked, createDisableTypeCheckedConfig);
});

test("consumer fixture config can lint JS and TS files", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const results = await eslint.lintFiles(["src/example.js", "src/example.ts"]);
  const errors = results.flatMap((result) => result.messages);

  assert.deepEqual(errors, []);
});

test("type-checked rules are scoped to TypeScript files only", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const tsConfig = await eslint.calculateConfigForFile("src/example.ts");
  const jsConfig = await eslint.calculateConfigForFile("src/example.js");

  assert.equal(tsConfig.rules["@typescript-eslint/await-thenable"][0], 2);
  assert.equal(jsConfig.rules["@typescript-eslint/await-thenable"], void 0);
});
