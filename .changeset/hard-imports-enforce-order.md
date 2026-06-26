---
"@oryz/eslint-config": major
---

Add `eslint-plugin-import-x` import order and spacing rules to the default preset.

The default `oryz()` preset now enforces:
- `import/first` — all imports must appear before other statements
- `import/order` — imports sorted by group (builtin → external → internal → parent → sibling → index → type) and alphabetized, with no blank lines between imports
- `import/newline-after-import` — exactly one blank line after the import block

This is a **breaking change**: existing consumers will see new lint errors for files that don't follow these import conventions. Most issues are auto-fixable with `eslint --fix`.

To customize import rules (e.g. add alias path groups), append an override after `oryz()`:

```js
export default oryz({
  rules: {
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
        pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
        pathGroupsExcludedImportTypes: ["builtin"]
      }
    ]
  }
});
```