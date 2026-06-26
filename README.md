# `@oryz/eslint-config`

Reusable ESLint flat config for my projects.

## Install

```sh
pnpm add -D @oryz/eslint-config eslint typescript
```

## Quick Start

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz();
```

`oryz()` returns the default flat config preset. It enables TypeScript project service, includes import ordering rules by default, and uses `["*.config.ts"]` as the built-in `allowDefaultProject` fallback.

## API

| Export | Type | What It Does | Example |
| --- | --- | --- | --- |
| `oryz()` | function | Returns the default preset. | `export default oryz()` |
| `oryz(options, ...configs)` | function | Extends the default preset with extra `allowDefaultProject` entries and appended flat config items. | `oryz({ allowDefaultProject: ["src/browser/index.ts"] }, { rules: { "no-console": "off" } })` |
| `oryz.pnpmWorkspaceYamlSort` | `FlatConfig` | Opt-in `pnpm-workspace.yaml` sorting via `yaml/sort-keys`. Sorts `catalog`, `catalogs`, and `catalogs.<name>` keys only. | `oryz(oryz.pnpmWorkspaceYamlSort)` |
| `oryz.base` | `FlatConfig[]` | Base JavaScript preset plus import style rules. | `export default [...oryz.base]` |
| `oryz.typed` | `FlatConfig[]` | Type-aware TypeScript preset. | `export default [...oryz.base, ...oryz.typed]` |
| `oryz.typescript` | `FlatConfig[]` | Alias of `oryz.typed`. | `oryz.typescript` |
| `oryz.recommended` | `FlatConfig[]` | Alias of `oryz()`. | `oryz.recommended` |
| `oryz.typedLanguageOptions` | `languageOptions` | Shared TypeScript project-service language options. | `languageOptions: oryz.typedLanguageOptions` |
| `oryz.maxLinesRuleOptions` | object | Shared max-lines rule options with blanks/comments ignored. | `["error", oryz.maxLinesRuleOptions]` |
| `oryz.createDisableTypeCheckedConfig(options)` | function | Creates a config that disables type-checked rules for matching files. | `oryz.createDisableTypeCheckedConfig({ files: ["scripts/**/*.ts"] })` |
| `oryz.disableTypeChecked(options)` | function | Alias of `oryz.createDisableTypeCheckedConfig`. | `oryz.disableTypeChecked({ files: ["*.config.ts"] })` |

## Notes

| Default Behavior | Details |
| --- | --- |
| TypeScript project service | Enabled by default. Matching `allowDefaultProject` files fall back to `tsconfig.json` and have type-checked rules disabled. |
| Import style | Enforces `import/first`, `import/order`, and `import/newline-after-import`. |
| `pnpm-workspace.yaml` sorting | Not enabled unless you explicitly append `oryz.pnpmWorkspaceYamlSort`. |
