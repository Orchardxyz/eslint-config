---
"@oryz/eslint-config": major
---

Refactor the package around a single `oryz` default export.

- make `oryz()` the primary entry point for composing the default config
- move the source to TypeScript and build the package with `tsup`
- simplify the public API for personal use and update the documentation
