import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { ESLint } from "eslint";
import oryz from "@oryz/eslint-config";

const execFileAsync = promisify(execFile);
const repoDir = fileURLToPath(new URL("../", import.meta.url));
const fixtureDir = fileURLToPath(new URL("./fixtures/consumer/", import.meta.url));
const fixtureConfigPath = path.join(fixtureDir, "eslint.config.mjs");
const packageNodeModulesDir = path.join(repoDir, "node_modules");

const createPnpmWorkspaceEslint = (options = {}) =>
  new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath,
    ...options
  });

const createEslintFromConfig = (overrideConfig) =>
  new ESLint({
    cwd: fixtureDir,
    overrideConfig,
    overrideConfigFile: true
  });

const assertImportStyleRulesEnabled = (config) => {
  assert.equal(config.rules["import/first"][0], 2);
  assert.equal(config.rules["import/order"][0], 2);
  assert.equal(config.rules["import/newline-after-import"][0], 2);
};

const assertImportStyleRulesDisabled = (config) => {
  assert.equal(config?.rules["import/first"], void 0);
  assert.equal(config?.rules["import/order"], void 0);
  assert.equal(config?.rules["import/newline-after-import"], void 0);
};

const linkDependency = async (consumerNodeModulesDir, packageName) => {
  const source = path.join(packageNodeModulesDir, packageName);
  const target = path.join(consumerNodeModulesDir, packageName);

  await mkdir(path.dirname(target), { recursive: true });
  await symlink(source, target, "dir");
};

const createMinimalConsumerPackage = async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "oryz-eslint-config-"));
  const consumerPackageDir = path.join(tempDir, "node_modules", "@oryz", "eslint-config");
  const consumerNodeModulesDir = path.join(tempDir, "node_modules");

  await mkdir(consumerPackageDir, { recursive: true });
  await cp(path.join(repoDir, "dist"), path.join(consumerPackageDir, "dist"), {
    recursive: true
  });
  await writeFile(
    path.join(consumerPackageDir, "package.json"),
    JSON.stringify({
      name: "@oryz/eslint-config",
      type: "module",
      exports: {
        ".": {
          default: "./dist/index.js"
        }
      }
    })
  );

  for (const packageName of [
    "@eslint/js",
    "eslint-plugin-import-x",
    "eslint-plugin-vue",
    "eslint-plugin-yml",
    "typescript-eslint",
    "vue-eslint-parser",
    "yaml-eslint-parser"
  ]) {
    await linkDependency(consumerNodeModulesDir, packageName);
  }

  return tempDir;
};

test("exports the expected flat-config building blocks", () => {
  assert.ok(Array.isArray(oryz.base));
  assert.ok(Array.isArray(oryz.typed));
  assert.equal(oryz.typed, oryz.typescript);
  assert.equal(oryz.recommended.length, oryz.base.length + oryz.typed.length);
  assert.deepEqual(oryz(), oryz.recommended);
  assert.equal(typeof oryz.pnpmWorkspaceYamlSort, "object");
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

test("default preset enables yaml/sort-keys for pnpm-workspace.yaml", async () => {
  const eslint = createPnpmWorkspaceEslint();
  const config = await eslint.calculateConfigForFile("pnpm-workspace.yaml");

  assert.equal(config.rules["yaml/sort-keys"][0], 2);
});

test("pnpm workspace helper remains available for manual composition", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: true,
    overrideConfig: [oryz.pnpmWorkspaceYamlSort]
  });
  const config = await eslint.calculateConfigForFile("pnpm-workspace.yaml");

  assert.equal(config.rules["yaml/sort-keys"][0], 2);
});

test("default preset reports unsorted top-level catalog keys", async () => {
  const eslint = createPnpmWorkspaceEslint();
  const code = ["catalog:", "  zod: ^3.0.0", "  react: ^19.0.0", ""].join("\n");
  const [result] = await eslint.lintText(code, { filePath: "pnpm-workspace.yaml" });

  assert.ok(result.messages.some((message) => message.ruleId === "yaml/sort-keys"));
});

test("default preset reports unsorted catalog names", async () => {
  const eslint = createPnpmWorkspaceEslint();
  const code = [
    "catalogs:",
    "  web:",
    "    react: ^19.0.0",
    "  base:",
    "    eslint: ^10.0.0",
    ""
  ].join("\n");
  const [result] = await eslint.lintText(code, { filePath: "pnpm-workspace.yaml" });

  assert.ok(result.messages.some((message) => message.ruleId === "yaml/sort-keys"));
});

test("default preset reports unsorted package keys inside named catalogs", async () => {
  const eslint = createPnpmWorkspaceEslint();
  const code = [
    "catalogs:",
    "  base:",
    "    zod: ^3.0.0",
    "    react: ^19.0.0",
    ""
  ].join("\n");
  const [result] = await eslint.lintText(code, { filePath: "pnpm-workspace.yaml" });

  assert.ok(result.messages.some((message) => message.ruleId === "yaml/sort-keys"));
});

test("default preset fixes representative catalog sorting issues", async () => {
  const eslint = createPnpmWorkspaceEslint({ fix: true });
  const code = [
    "catalog:",
    "  zod: ^3.0.0",
    "  react: ^19.0.0",
    "catalogs:",
    "  web:",
    "    zod: ^3.0.0",
    "    react: ^19.0.0",
    "  base:",
    "    typescript: ^6.0.0",
    "    eslint: ^10.0.0",
    ""
  ].join("\n");
  const [result] = await eslint.lintText(code, { filePath: "pnpm-workspace.yaml" });

  assert.equal(
    result.output,
    [
      "catalog:",
      "  react: ^19.0.0",
      "  zod: ^3.0.0",
      "catalogs:",
      "  base:",
      "    eslint: ^10.0.0",
      "    typescript: ^6.0.0",
      "  web:",
      "    react: ^19.0.0",
      "    zod: ^3.0.0",
      ""
    ].join("\n")
  );
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

test("import style rules are enabled for JS and TS files by default", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const tsConfig = await eslint.calculateConfigForFile("src/example.ts");
  const jsConfig = await eslint.calculateConfigForFile("src/example.js");

  for (const config of [tsConfig, jsConfig]) {
    assertImportStyleRulesEnabled(config);
  }
});

test("Vue and Svelte import style rules are disabled by default", async () => {
  const eslint = new ESLint({
    cwd: fixtureDir,
    overrideConfigFile: fixtureConfigPath
  });

  const vueConfig = await eslint.calculateConfigForFile("src/example.vue");
  const svelteConfig = await eslint.calculateConfigForFile("src/example.svelte");

  assertImportStyleRulesDisabled(vueConfig);
  assertImportStyleRulesDisabled(svelteConfig);
});

test("Vue option does not load Svelte packages", async (t) => {
  const tempDir = await createMinimalConsumerPackage();
  t.after(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  const { stdout } = await execFileAsync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      [
        'import oryz from "@oryz/eslint-config";',
        "const configs = oryz({ vue: true });",
        "const hasVueRule = configs.some((config) => config.rules?.['vue/no-parsing-error']);",
        "if (!hasVueRule) throw new Error('Vue recommended config was not loaded.');",
        "console.log('ok');"
      ].join("\n")
    ],
    { cwd: tempDir }
  );

  assert.equal(stdout.trim(), "ok");
});

test("Vue option enables Vue recommended and import style rules for Vue files", async () => {
  const eslint = createEslintFromConfig(oryz({ vue: true }));
  const vueConfig = await eslint.calculateConfigForFile("src/example.vue");
  const svelteConfig = await eslint.calculateConfigForFile("src/example.svelte");

  assert.equal(vueConfig.rules["vue/no-parsing-error"][0], 2);
  assert.equal(vueConfig.rules["vue/no-v-html"][0], 1);
  assertImportStyleRulesEnabled(vueConfig);
  assertImportStyleRulesDisabled(svelteConfig);
});

test("Svelte option enables Svelte recommended and import style rules for Svelte files", async () => {
  const eslint = createEslintFromConfig(oryz({ svelte: true }));
  const svelteConfig = await eslint.calculateConfigForFile("src/example.svelte");
  const vueConfig = await eslint.calculateConfigForFile("src/example.vue");

  assert.equal(svelteConfig.rules["svelte/no-at-html-tags"][0], 2);
  assert.equal(svelteConfig.rules["svelte/no-at-debug-tags"][0], 1);
  assertImportStyleRulesEnabled(svelteConfig);
  assertImportStyleRulesDisabled(vueConfig);
});

test("Vue and Svelte options can be enabled together", async () => {
  const eslint = createEslintFromConfig(oryz({ svelte: true, vue: true }));
  const vueConfig = await eslint.calculateConfigForFile("src/example.vue");
  const svelteConfig = await eslint.calculateConfigForFile("src/example.svelte");

  assert.equal(vueConfig.rules["vue/no-parsing-error"][0], 2);
  assert.equal(svelteConfig.rules["svelte/no-at-html-tags"][0], 2);
  assertImportStyleRulesEnabled(vueConfig);
  assertImportStyleRulesEnabled(svelteConfig);
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
