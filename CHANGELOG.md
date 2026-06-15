# @oryz/eslint-config

## 1.0.1

### Patch Changes

- [#21](https://github.com/Orchardxyz/eslint-config/pull/21) [`3b77845`](https://github.com/Orchardxyz/eslint-config/commit/3b77845246152a81dfe902a9b8ebff5a656c6a58) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Add `allowDefaultProject` support to `oryz()` so common config files and extra entry files can use the TypeScript default project without parsing errors, while automatically disabling type-checked rules for those matched files.

## 1.0.0

### Major Changes

- [#18](https://github.com/Orchardxyz/eslint-config/pull/18) [`e09ee64`](https://github.com/Orchardxyz/eslint-config/commit/e09ee649e480efa71fd373f83a3dddbf68e1bde4) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Refactor the package around a single `oryz` default export.

  - make `oryz()` the primary entry point for composing the default config
  - move the source to TypeScript and build the package with `tsup`
  - simplify the public API for personal use and update the documentation

## 0.1.3

### Patch Changes

- [`5f570b3`](https://github.com/Orchardxyz/eslint-config/commit/5f570b3383b2771d738c6bc577883740fd2340ea) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Fix GitHub Release creation so release notes are extracted for the package version and release titles match the published version.

## 0.1.2

### Patch Changes

- [#12](https://github.com/Orchardxyz/eslint-config/pull/12) [`55ad9ee`](https://github.com/Orchardxyz/eslint-config/commit/55ad9ee3610cf2645df8ddf9ad54b7d596b35f0d) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Add explicit provenance publish configuration for the npm release workflow.

- [#14](https://github.com/Orchardxyz/eslint-config/pull/14) [`6cd0901`](https://github.com/Orchardxyz/eslint-config/commit/6cd0901229d9ffbfdce219ed8c30d0e22bad73e4) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Run the npm publish workflow from the `main` push created by merging the Changesets release PR so trusted publishing can authenticate with OIDC.

- [#8](https://github.com/Orchardxyz/eslint-config/pull/8) [`e7f325d`](https://github.com/Orchardxyz/eslint-config/commit/e7f325d73abba3849f9ce044ef0aa5e0da95e310) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Update the publish workflow to upgrade npm to the latest CLI before prerelease publishing.

- [#10](https://github.com/Orchardxyz/eslint-config/pull/10) [`8f4a998`](https://github.com/Orchardxyz/eslint-config/commit/8f4a998f1a3a3f850edd36d4e19f4410ffbfe2ab) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Fix the publish workflow by removing pnpm cache setup before pnpm is installed.

- [#5](https://github.com/Orchardxyz/eslint-config/pull/5) [`6f751b7`](https://github.com/Orchardxyz/eslint-config/commit/6f751b724cf3d7fd7c02bea0095ffe5fd22b5e0a) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Fix the publish workflow baseline check so prerelease validation can use the expected npm CLI.

## 0.1.2-beta.4

### Patch Changes

- [#14](https://github.com/Orchardxyz/eslint-config/pull/14) [`6cd0901`](https://github.com/Orchardxyz/eslint-config/commit/6cd0901229d9ffbfdce219ed8c30d0e22bad73e4) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Run the npm publish workflow from the `main` push created by merging the Changesets release PR so trusted publishing can authenticate with OIDC.

## 0.1.2-beta.3

### Patch Changes

- [#12](https://github.com/Orchardxyz/eslint-config/pull/12) [`55ad9ee`](https://github.com/Orchardxyz/eslint-config/commit/55ad9ee3610cf2645df8ddf9ad54b7d596b35f0d) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Add explicit provenance publish configuration for the npm release workflow.

## 0.1.2-beta.2

### Patch Changes

- [#10](https://github.com/Orchardxyz/eslint-config/pull/10) [`8f4a998`](https://github.com/Orchardxyz/eslint-config/commit/8f4a998f1a3a3f850edd36d4e19f4410ffbfe2ab) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Fix the publish workflow by removing pnpm cache setup before pnpm is installed.

## 0.1.2-beta.1

### Patch Changes

- [#8](https://github.com/Orchardxyz/eslint-config/pull/8) [`e7f325d`](https://github.com/Orchardxyz/eslint-config/commit/e7f325d73abba3849f9ce044ef0aa5e0da95e310) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Update the publish workflow to upgrade npm to the latest CLI before prerelease publishing.

## 0.1.2-prelease.0

### Patch Changes

- [#5](https://github.com/Orchardxyz/eslint-config/pull/5) [`6f751b7`](https://github.com/Orchardxyz/eslint-config/commit/6f751b724cf3d7fd7c02bea0095ffe5fd22b5e0a) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Fix the publish workflow baseline check so prerelease validation can use the expected npm CLI.

## 0.1.1

### Patch Changes

- [#3](https://github.com/Orchardxyz/eslint-config/pull/3) [`3c3b6ed`](https://github.com/Orchardxyz/eslint-config/commit/3c3b6ed6c25d560792d6dc78d3510b361024d74e) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Fix the publish workflow to enforce the required npm CLI baseline before release.

## 0.1.0

### Minor Changes

- [#1](https://github.com/Orchardxyz/eslint-config/pull/1) [`5c355fb`](https://github.com/Orchardxyz/eslint-config/commit/5c355fb2a0d0617c86bf4567ec860ceff8891d17) Thanks [@Orchardxyz](https://github.com/Orchardxyz)! - Bootstrap the initial public release of `@oryz/eslint-config`.
