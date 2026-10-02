---
description: Bootstrap a fresh monorepo-template clone into a Moon + release-please monorepo
argument-hint: REPO_NAME="..." REPO_DESCRIPTION="..." APPS="app-ui,app-api" APP_DESCRIPTIONS="UI app,API service"
---

Bootstrap this repository into a Moon + release-please monorepo.

Parse command arguments from: $ARGUMENTS
Expected keys:
- REPO_NAME
- REPO_DESCRIPTION
- APPS
- APP_DESCRIPTIONS
- (no CODEOWNERS_TEAMS argument; preserve existing CODEOWNERS file if present)
- (no INITIAL_VERSION argument; fixed to 0.1.0)

If any required key is missing, ask for it before making changes.

Defaults and fixed behavior:
- INITIAL_VERSION is always `0.1.0`.
- Do not take `CODEOWNERS_TEAMS` as input.

Execution requirements:
1. Parse `APPS` by comma, trim whitespace, preserve order.
2. Parse `APP_DESCRIPTIONS` by comma, trim whitespace, preserve order.
3. Validate APPS and APP_DESCRIPTIONS have equal length; if mismatch, stop and ask for correction.
4. For each app, create a human-readable Moon project name from kebab-case.

Create/update these files and folders:
- .gitignore
- .commitlintrc.json
- version.txt
- release-please-config.json
- .release-please-manifest.json
- .moon/workspace.yml
- .github/CODEOWNERS
- .github/workflows/pr.yaml
- .github/workflows/release-please.yaml
- apps/.gitkeep
- packages/.gitkeep
- doc/
- apps/<APP>/package.json
- apps/<APP>/moon.yml
- README.md

Required content constraints:
- `.gitignore` must include:
  - `.moon/cache`
  - `.moon/docker`
  - `.vscode/`
  - `.idea/`
  - `*.sublime-workspace`
  - `*.sublime-project`
  - `.claude/`
- `.commitlintrc.json` must be:
  {
    "extends": ["@commitlint/config-conventional"],
    "rules": {
      "subject-case": [0, "always", "sentence-case"]
    }
  }
- `version.txt` single line: `0.1.0`
- `release-please-config.json` must include one `apps/<app>` entry per app under `packages`, plus `"sequential-calls": true`
- `.release-please-manifest.json` must include the same `apps/<app>` keys with `0.1.0` values
- `.moon/workspace.yml` must include projects `apps/*` and `packages/*`, vcs manager `git`, defaultBranch `main`, schema `./cache/schemas/workspace.json`
- `.github/CODEOWNERS`: if the file already exists, preserve it; if missing, create with:
  - `# This file is managed by Terraform.`
  - `# DON'T EDIT THIS FILE DIRECTLY`
  - `* @herbalifehub/principaldevops @herbalifehub/devops-devex`
- `.github/workflows/pr.yaml` must use:
  - `actions/checkout@v6`
  - `herbalifehub/gha-workflows/actions/conventional-commits@main`
  and must not use:
  - `amannn/action-semantic-pull-request`
  - `wagoid/commitlint-github-action`
- `.github/workflows/release-please.yaml` must use:
  - `actions/checkout@v6`
  - `actions/create-github-app-token@v2`
  - `googleapis/release-please-action@v4`
  with:
  - `config-file: release-please-config.json`
  - `manifest-file: .release-please-manifest.json`
- Each `apps/<APP>/package.json` must contain:
  - `name` = app name
  - `version` = `0.1.0`
  - `private` = true
  - `description` = matching app description
- Each `apps/<APP>/moon.yml` must contain schema `../../.moon/cache/schemas/project.json`
- README must be replaced with project-specific content using REPO_NAME, REPO_DESCRIPTION, and apps table.

Validation before finishing:
1. Confirm no stray tracked `node_modules`, `.moon/cache`, `.claude/` artifacts.
2. Confirm exact same app keys in `release-please-config.json` and `.release-please-manifest.json`.
3. Confirm every app directory has valid `package.json` + `moon.yml` with required fields.
4. Confirm `.moon/workspace.yml` includes both project globs.
5. Confirm release workflow references exact config and manifest filenames.
6. Confirm PR workflow uses `herbalifehub/gha-workflows/actions/conventional-commits@main` and not old actions.
7. Validate JSON/YAML syntax for all created config files.

Final response format:
1. Summary of created/updated files
2. App matrix (app -> description)
3. Validation results checklist
4. Manual follow-ups required in GitHub (`DEVOPS_GH_APP_ID`, `DEVOPS_GH_PRIVATE_KEY`, branch protection)
