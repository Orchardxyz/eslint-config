import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
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

test("import style rules are enabled for both JS and TS files", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const tsConfig = await eslint.calculateConfigForFile("src/example.ts");
  const jsConfig = await eslint.calculateConfigForFile("src/example.js");

  for (const config of [tsConfig, jsConfig]) {
    assert.equal(config.rules["import/first"][0], 2);
    assert.equal(config.rules["import/order"][0], 2);
    assert.equal(config.rules["import/newline-after-import"][0], 2);
  }
});

test("import/order rule enforces alphabetized ordering with no newlines between groups", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const config = await eslint.calculateConfigForFile("src/example.js");
  const orderRule = config.rules["import/order"];

  assert.equal(orderRule[0], 2);
  assert.deepEqual(orderRule[1].groups, ["builtin", "external", "internal", "parent", "sibling", "index", "type"]);
  assert.equal(orderRule[1]["newlines-between"], "never");
  assert.equal(orderRule[1].alphabetize.order, "asc");
  assert.equal(orderRule[1].alphabetize.caseInsensitive, true);
});

test("import/newline-after-import rule enforces exactly one blank line after imports", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const config = await eslint.calculateConfigForFile("src/example.js");
  const newlineRule = config.rules["import/newline-after-import"];

  assert.equal(newlineRule[0], 2);
  assert.deepEqual(newlineRule[1], { count: 1, exactCount: true });
});

test("import/first reports an error when imports appear after other statements", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath,
    overrideConfig: [{ rules: { "import/order": "off", "import/newline-after-import": "off" } }]
  });

  const code = 'const x = 1;\nimport path from "path";\n';
  const [result] = await eslint.lintText(code, { filePath: "test.js" });

  assert.ok(result.messages.some((msg) => msg.ruleId === "import/first"));
});

test("import/order reports an error for disordered imports", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath,
    overrideConfig: [{ rules: { "import/first": "off", "import/newline-after-import": "off" } }]
  });

  const code = 'import path from "path";\nimport fs from "fs";\n';
  const [result] = await eslint.lintText(code, { filePath: "test.js" });

  assert.ok(result.messages.some((msg) => msg.ruleId === "import/order"));
});

test("import/newline-after-import reports an error when no blank line follows imports", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath,
    overrideConfig: [{ rules: { "import/first": "off", "import/order": "off" } }]
  });

  const code = 'import path from "path";\nconst x = 1;\n';
  const [result] = await eslint.lintText(code, { filePath: "test.js" });

  assert.ok(result.messages.some((msg) => msg.ruleId === "import/newline-after-import"));
});
