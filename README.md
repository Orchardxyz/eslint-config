# `@oryz/eslint-config`

Reusable ESLint flat config for my projects.

## Install

```sh
pnpm add -D @oryz/eslint-config eslint typescript
```

## Usage

Use the default preset:

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz();
```

Append your own config:

```js
// eslint.config.mjs
import oryz from "@oryz/eslint-config";

export default oryz({
  rules: {
    "no-console": "off"
  }
});
```

Customize the preset:

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
