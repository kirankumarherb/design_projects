# Monorepo template

This is a template for creating monorepositories (`monorepos`).

We use [Moon](https://moonrepo.dev/) as our tool to handle monorepos, and
[release-please](https://github.com/googleapis/release-please) (in manifest mode)
to automate per-app versioning and changelogs.

## Structure

```
├── .moon/
│   └── workspace.yml               # Moon workspace configuration
├── .github/
│   ├── CODEOWNERS
│   └── workflows/
│       ├── pr.yaml                 # PR checks (conventional commits)
│       └── release-please.yaml     # Release automation
├── apps/                           # One folder per application
├── packages/                       # Shared packages
├── .commitlintrc.json              # Conventional Commits rules
├── .release-please-manifest.json   # Current per-app versions (managed by release-please)
├── release-please-config.json      # Release-please configuration
└── version.txt                     # Monorepo-level version marker
```

## How to add applications to the monorepo

For each application (e.g. `users`, `auth`):

1. Create `apps/<app_name>/` with at minimum:
   - `package.json` containing `{ "name": "<app_name>", "version": "0.1.0", "private": true }`
   - `moon.yml` (see the [Moon project config docs](https://moonrepo.dev/docs/config/project))
2. Register the app in `release-please-config.json`:
   ```json
   {
     "packages": {
       "apps/<app_name>": {}
     },
     "sequential-calls": true
   }
   ```
3. Add the starting version to `.release-please-manifest.json`:
   ```json
   { "apps/<app_name>": "0.1.0" }
   ```

Shared libraries follow the same pattern under `packages/`.

## CI / CD

### PR checks (`.github/workflows/pr.yaml`)
- Validates PR commits against [Conventional Commits](https://www.conventionalcommits.org/) using `.commitlintrc.json`.
- Skips validation for automated `release-please--*` PRs.
- Sets up the Moon toolchain so individual project checks can run.

### Release please (`.github/workflows/release-please.yaml`)
On every push to `main`, [release-please](https://github.com/googleapis/release-please) opens (or updates) a release PR that:
- Bumps the version in each affected app's `package.json`
- Updates `.release-please-manifest.json`
- Generates per-app changelog entries

When the release PR is merged, release-please creates a GitHub release per app.

Required org/repo secrets:
- `DEVOPS_GH_APP_ID`
- `DEVOPS_GH_PRIVATE_KEY`

These belong to a GitHub App used to open release PRs so they can re-trigger the PR workflow.

### Commit message conventions

| Prefix | Effect |
|---|---|
| `feat:` | Minor version bump |
| `fix:` | Patch version bump |
| `BREAKING CHANGE:` in body | Major version bump |
| `chore:`, `docs:`, `refactor:`, etc. | No version bump |

### Manual release

Trigger the `Release please` workflow from the Actions tab (`workflow_dispatch`).
