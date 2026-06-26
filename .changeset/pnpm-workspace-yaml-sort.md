---
"@oryz/eslint-config": minor
---

Add an opt-in `oryz.pnpmWorkspaceYamlSort` helper for `pnpm-workspace.yaml`.

The new helper uses `yaml/sort-keys` to sort catalog names under `catalogs` and package names inside `catalog` and each named catalog without changing the default preset.
