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
It also sorts `pnpm-workspace.yaml` catalogs by default.
Vue and Svelte file support is opt-in and loaded on demand:

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz({ vue: true, svelte: true });
```

## API

| Export | Type | What It Does | Example |
| --- | --- | --- | --- |
| `oryz()` | function | Returns the default preset. | `export default oryz()` |
| `oryz(options, ...configs)` | function | Extends the default preset with extra `allowDefaultProject` entries, optional Vue/Svelte support, and appended flat config items. | `oryz({ allowDefaultProject: ["src/browser/index.ts"], vue: true }, { rules: { "no-console": "off" } })` |
| `oryz.pnpmWorkspaceYamlSort` | `FlatConfig` | Standalone `pnpm-workspace.yaml` sorting config via `yaml/sort-keys`. Already included in the default preset, but still available for selective manual composition. | `oryz.pnpmWorkspaceYamlSort` |
| `oryz.base` | `FlatConfig[]` | Base preset, including JavaScript defaults, import style rules, and `pnpm-workspace.yaml` sorting. | `export default [...oryz.base]` |
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
| Import style | Enforces `import/first`, `import/order`, and `import/newline-after-import` for JS/TS files by default. Vue and Svelte files are included only when their options are enabled. |
| Vue support | Disabled by default. Use `oryz({ vue: true })` to load `eslint-plugin-vue` on demand and enable its Vue 3 flat recommended config, Vue parser support, and import style rules for `.vue` files. |
| Svelte support | Disabled by default. Use `oryz({ svelte: true })` to load `eslint-plugin-svelte` on demand and enable its recommended config, Svelte parser support, and import style rules for `.svelte` files. Non-Svelte projects do not need to install `svelte`. |
| `pnpm-workspace.yaml` sorting | Enabled by default for `catalog`, `catalogs`, and `catalogs.<name>` via `yaml/sort-keys`. |
