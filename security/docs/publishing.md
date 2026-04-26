# Publishing `@wsws/auth`

Today the package is consumed via a vendored tarball (`vendor/wsws-auth-*.tgz`). That works for
local dev but doesn't scale — every consumer pins a literal file path, and updates require manual
`pnpm pack` + copy.

For multi-app consumption, publish to a **GitHub Packages** registry on the `wireservers` org.
GitHub Packages is free for private packages within an org and integrates with the existing
GitHub auth.

## One-time setup

### 1. Create a personal access token (classic) with `read:packages` and `write:packages`

[github.com/settings/tokens/new](https://github.com/settings/tokens/new). Save it as
`GITHUB_TOKEN`.

### 2. Add `.npmrc` to the security workspace

```bash
# wsws/security/.npmrc
@wsws:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

(Don't commit the token — pnpm reads `${GITHUB_TOKEN}` from the environment.)

### 3. Publish

```bash
cd wsws/security/packages/auth
pnpm publish --no-git-checks
```

The `publishConfig` in `package.json` already targets `https://npm.pkg.github.com`.

## In each consuming project

Add a project-local `.npmrc`:

```
@wsws:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install normally:

```bash
pnpm add @wsws/auth
```

`GITHUB_TOKEN` needs to be available in CI (GitHub Actions provides it automatically as
`${{ secrets.GITHUB_TOKEN }}` — wire it into the build env).

## Versioning

Bump the version in `packages/auth/package.json` before publishing. Use semver:

- patch: bug fixes, no API change
- minor: new exports, no breaking change
- major: removing or renaming exported symbols, changing config shape

## Release flow (recommended)

1. Make changes on a feature branch.
2. Bump version (`pnpm -C packages/auth version patch|minor|major`).
3. Open PR → review → merge to `main`.
4. Tag the release (`git tag @wsws/auth@0.2.0`) and push tags.
5. From `main`: `pnpm -C packages/auth publish`.
6. Consumers bump their dependency on the next regular update cadence.
