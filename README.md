# `@oryz/eslint-config`

Personal reusable ESLint flat config for Oryz projects.

## Install

```sh
pnpm add -D @oryz/eslint-config eslint typescript
```

`@oryz/eslint-config` ships its own `@eslint/js`, `globals`, and
`typescript-eslint` runtime dependencies. Consumers still need `eslint` and
`typescript` installed in their own repo.

## Usage

```js
// eslint.config.mjs
import { recommended } from "@oryz/eslint-config";

export default recommended;
```

Use `typed` or `typescript` when you want the TypeScript rules without the
combined preset:

```js
// eslint.config.mjs
import { base, typed } from "@oryz/eslint-config";

export default [...base, ...typed];
```

Use `createDisableTypeCheckedConfig` for files that should keep TS syntax support
without requiring type-aware linting:

```js
// eslint.config.mjs
import {
  base,
  createDisableTypeCheckedConfig,
  typed
} from "@oryz/eslint-config";

export default [
  ...base,
  ...typed,
  createDisableTypeCheckedConfig({
    files: ["scripts/**/*.ts", "*.config.ts"],
    globals: {
      console: "readonly",
      process: "readonly"
    }
  })
];
```

## Exports

- `base`: shared JS baseline from `@eslint/js`.
- `typed`: TS type-aware preset scoped to `*.ts` and `*.tsx`.
- `typescript`: alias of `typed`.
- `recommended`: combined `base + typed`.
- `typedLanguageOptions`: shared parser options with `projectService: true`.
- `maxLinesRuleOptions`: shared line-count options.
- `createDisableTypeCheckedConfig`: helper for opt-out file groups.
- `disableTypeChecked`: alias of `createDisableTypeCheckedConfig`.

## Development

```sh
pnpm install
pnpm check
```

This repo uses `pnpm@8.15.5`.

## Release Flow

1. Run `pnpm changeset` for every user-visible change.
2. Merge changes into `main`.
3. GitHub Actions opens or updates the release PR.
4. Merge the release PR to publish to npm and create the GitHub Release.

## npm Trusted Publisher Setup

This package is designed to publish with npm Trusted Publishers and GitHub
Actions OIDC only.

- Do not configure `NPM_TOKEN` for publish jobs.
- In npm package settings, add GitHub as a trusted publisher for this package.
- Bind it to the repository `Orchardxyz/eslint-config`.
- Bind it to the publish workflow in this repo.
- For trusted publisher setup created on or after 2026-05-20, explicitly enable
  `npm publish`.
- Keep the publish job on `Node 22.14.0+` and `npm 11.5.1+`.
