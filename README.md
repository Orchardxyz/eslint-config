# `@oryz/eslint-config`

My ESLint flat config.

## Install

```sh
pnpm add -D @oryz/eslint-config eslint typescript
```

Package 内已经带了 `@eslint/js`、`globals` 和 `typescript-eslint`，项目里只需要自己装 `eslint` 和 `typescript`。

## Usage

```js
// eslint.config.mjs
import { recommended } from "@oryz/eslint-config";

export default recommended;
```

只要 TypeScript 规则：

```js
// eslint.config.mjs
import { base, typed } from "@oryz/eslint-config";

export default [...base, ...typed];
```

某些文件不想走 type-aware lint 时：

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

- `recommended`: 默认配置
- `base`: JS 基础规则
- `typed` / `typescript`: TS type-aware 规则
- `createDisableTypeCheckedConfig` / `disableTypeChecked`: 给部分文件关闭 type-aware lint
- `typedLanguageOptions`
- `maxLinesRuleOptions`

## Development

```sh
pnpm install
pnpm check
```
