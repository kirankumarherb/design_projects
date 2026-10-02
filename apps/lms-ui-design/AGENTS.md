# Herbalife Lookup Management System

Angular 21 single-page application built and served with Vite.

## Development Server

```bash
npm install
npm run dev
```

The dev server targets `http://localhost:8443/`. `strictPort` is disabled in `vite.config.ts`, so if 8443 is occupied Vite falls back to the next free port (8444, 8445, ...). Override with the `PORT` environment variable. Source changes rebuild and reload automatically.

## Project Structure

- `src/main.ts` - Bootstrap entrypoint; calls `bootstrapApplication` with the router providers
- `src/app/app.component.ts` - Root shell hosting `<router-outlet />`
- `src/app/app.routes.ts` - Route table for login, dashboard, lookup types, value sets, manage values, translations, user roles, and audit log
- `src/app/layouts/app-layout.component.ts` - Authenticated shell combining the sidebar and routed content
- `src/app/components/` - Shared UI such as `sidebar.component.ts` and `app-header.component.ts`
- `src/app/pages/` - One folder per feature screen
- `src/index.css` - Global stylesheet and Tailwind entrypoint
- `index.html` - HTML shell containing the `<app-root>` element
- `vite.config.ts` - Dev server, build, alias (`@` -> `./src`), and file-watch configuration
- `public/assets/` - Herbalife brand logo and per-route navigation icon SVGs, served from `/assets`
- `resources/current-implementation.md` - Regeneration spec describing the current build
- `resources/database/` - Oracle schema (`schema.sql`) and seed data (`seed-data.sql`)

## Dependencies

- Runtime: Angular 21 with standalone components and signals
- Styling: Tailwind CSS v4 via `postcss.config.js`
- Build tooling: Vite 8 and TypeScript

## Styling

Tailwind utility classes are used directly in inline component templates. Global CSS and font wiring belong in `src/index.css`. Keep CSS `@import` statements first, followed by the Tailwind import.

## Routing

The router uses hash location strategy, so URLs look like `/#/dashboard`. The root path redirects to `/login`, and unknown paths redirect to `/dashboard`.

## Navigation icons

Each sidebar route has a dedicated pair of SVGs in `public/assets/` following the `<route>-default.svg` / `<route>-active.svg` naming convention. Default icons are rendered white via `brightness-0 invert`; active icons use the Herbalife green stroke. The expanded sidebar is `312px` wide and collapses to `76px`.

## Code quality

- Components are standalone; declare dependencies in the `imports` array rather than an NgModule.
- Use the `@if` / `@for` built-in control flow blocks in templates.
- Reference brand assets with absolute paths such as `/assets/herbalife-symbol.svg`.
- Keep `vite.config.ts` watch-ignore entries (`.vs`, `.git`, `node_modules`, `.figma`) in place to avoid Windows file-lock watcher errors.
