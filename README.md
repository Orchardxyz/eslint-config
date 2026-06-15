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
