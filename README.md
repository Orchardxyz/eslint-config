# `@oryz/eslint-config`

Reusable ESLint flat config for my projects.

## Install

```sh
pnpm add -D @oryz/eslint-config eslint typescript
```

## Usage

Default preset:

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz();
```

`oryz()` enables TypeScript project service with a default `allowDefaultProject` of `["*.config.ts"]`. Matching files automatically fall back to the default project and have type-checked rules disabled.

The default preset also enforces import order and spacing:

- All imports must appear before other statements (`import/first`)
- Imports are sorted by group (builtin → external → internal → parent → sibling → index → type) and alphabetized (`import/order`)
- No blank lines between imports (`import/order` with `newlines-between: "never"`)
- Exactly one blank line after the import block (`import/newline-after-import`)

To override import rules (e.g. to add custom alias groups):

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz(
  {
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "before" }
          ],
          pathGroupsExcludedImportTypes: ["builtin"]
        }
      ]
    }
  }
);
```

Append extra config or `allowDefaultProject` entries:

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz(
  {
    allowDefaultProject: ["src/browser/index.ts", "src/node/index.ts"]
  },
  {
    rules: {
      "no-console": "off"
    }
  }
);
```

Customize the preset manually:

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default [
  ...oryz.base,
  ...oryz.typed,
  oryz.createDisableTypeCheckedConfig({
    files: ["scripts/**/*.ts", "*.config.ts"],
    globals: {
      console: "readonly",
      process: "readonly"
    }
  })
];
```
