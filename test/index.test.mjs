import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";

import oryz from "@oryz/eslint-config";

const fixtureDir = fileURLToPath(new URL("./fixtures/consumer/", import.meta.url));
const fixtureConfigPath = path.join(fixtureDir, "eslint.config.mjs");

test("exports the expected flat-config building blocks", () => {
  assert.ok(Array.isArray(oryz.base));
  assert.ok(Array.isArray(oryz.typed));
  assert.equal(oryz.typed, oryz.typescript);
  assert.equal(oryz.recommended.length, oryz.base.length + oryz.typed.length);
  assert.deepEqual(oryz(), oryz.recommended);
  assert.deepEqual(oryz.maxLinesRuleOptions, {
    skipBlankLines: true,
    skipComments: true
  });
  assert.deepEqual(oryz.typedLanguageOptions, {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.config.ts"],
        defaultProject: "tsconfig.json"
      }
    }
  });
});

test("oryz appends extra configs after the default preset", () => {
  const extraConfig = /** @type {import("eslint").Linter.Config} */ ({
    rules: {
      "no-alert": "error"
    }
  });

  assert.deepEqual(oryz(extraConfig), [...oryz.recommended, extraConfig]);
  assert.deepEqual(oryz([extraConfig]), [...oryz.recommended, extraConfig]);
});

test("oryz keeps legacy flat-config calls compatible when the first arg is a config", () => {
  const extraConfig = /** @type {import("eslint").Linter.Config} */ ({
    rules: {
      "no-console": "off"
    }
  });

  assert.deepEqual(oryz(extraConfig), [...oryz.recommended, extraConfig]);
});

test("oryz merges allowDefaultProject into typed and disableTypeChecked configs", () => {
  const config = oryz({
    allowDefaultProject: ["src/browser/index.ts", "src/node/index.ts"]
  });
  const mergedAllowDefaultProject = [
    "*.config.ts",
    "src/browser/index.ts",
    "src/node/index.ts"
  ];
  const typedConfig = config.find(
    (item) =>
      Array.isArray(item.files) &&
      item.files.includes("**/*.ts") &&
      item.languageOptions?.parserOptions
  );
  const disableConfig = config.at(-1);

  assert.deepEqual(typedConfig?.languageOptions, {
    parserOptions: {
      projectService: {
        allowDefaultProject: mergedAllowDefaultProject,
        defaultProject: "tsconfig.json"
      }
    }
  });
  assert.deepEqual(disableConfig?.files, mergedAllowDefaultProject);
});

test("createDisableTypeCheckedConfig merges files and globals", () => {
  const config = oryz.createDisableTypeCheckedConfig({
    files: ["**/*.config.js"],
    globals: { MY_GLOBAL: "readonly" }
  });
  const configuredGlobals = /** @type {Record<string, string>} */ (config.languageOptions?.globals ?? {});

  assert.deepEqual(config.files, ["**/*.config.js"]);
  assert.equal(configuredGlobals.MY_GLOBAL, "readonly");
});

test("disableTypeChecked is an alias of createDisableTypeCheckedConfig", () => {
  assert.equal(oryz.disableTypeChecked, oryz.createDisableTypeCheckedConfig);
});

test("consumer fixture config can lint JS and TS files", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const results = await eslint.lintFiles([
    "src/example.js",
    "src/example.ts",
    "tsup.config.ts"
  ]);
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
