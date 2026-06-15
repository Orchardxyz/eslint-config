---
"@oryz/eslint-config": patch
---

Add `allowDefaultProject` support to `oryz()` so common config files and extra entry files can use the TypeScript default project without parsing errors, while automatically disabling type-checked rules for those matched files.
