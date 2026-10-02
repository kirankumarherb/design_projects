# Herbalife LMS — Current Implementation Reference

This document describes the current state of the Herbalife Lookup Management System (LMS) application in enough detail that an LLM can regenerate an equivalent version of the codebase from scratch. It captures architecture, routing, component responsibilities, styling conventions, and data shapes.

## 1. Project Overview

- **App name (display):** "Herbalife Lookup Management System" (short name in some contexts: "Herbalife LMS")
- **Purpose:** Enterprise reference-data management console — lookup types, value sets, translations, user roles, and audit logging.
- **Stack:** Angular 21 (standalone components, signals, `@if`/`@for` control-flow syntax), Vite 8 as the build/dev tool (via `@analogjs/vite-plugin-angular`), Tailwind CSS v4, TypeScript 5.9, RxJS.
- **No NgModules** — every component is `standalone: true` with inline `template` strings (no separate `.html`/`.css` files).
- **No backend** — all data is mocked inline within components (arrays/objects), no services/models directory.
- **Routing mode:** hash-based (bootstrapped in `src/main.ts`).

## 2. Tooling & Configuration

### package.json
```json
{
  "name": "figma-make-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
	"dev": "vite --host 0.0.0.0",
	"build": "vite build",
	"preview": "vite preview",
	"format": "oxfmt"
  },
  "dependencies": {
	"@angular/animations": "^21.2.22",
	"@angular/common": "^21.2.22",
	"@angular/compiler": "^21.2.22",
	"@angular/core": "^21.2.22",
	"@angular/forms": "^21.2.22",
	"@angular/platform-browser": "^21.2.22",
	"@angular/router": "^21.2.22",
	"rxjs": "^7.8.2",
	"tslib": "^2.8.1",
	"zone.js": "~0.15.0"
  },
  "devDependencies": {
	"@analogjs/vite-plugin-angular": "3.0.0-alpha.70",
	"@angular-devkit/build-angular": "21.2.22",
	"@angular/compiler-cli": "21.2.22",
	"@tailwindcss/vite": "^4.0.0",
	"@types/node": "^22.0.0",
	"eslint": "^10.9.1",
	"oxfmt": "^0.2.0",
	"tailwindcss": "^4.0.0",
	"typescript": "^5.9.3",
	"vite": "^8.0.5"
  }
}
```

### vite.config.ts (key points)
- Uses `defineConfig(({ mode }) => ...)`.
- Plugins: `tailwindcss()`, a Figma site-configuration plugin, a Figma error-overlay-replay plugin, and a Figma "Make Kit" plugin (these are project-scaffolding conveniences from the Figma "Make" tool and are optional to replicate — they are not required for the app to function).
- `esbuild.target = 'ES2022'`, `keepNames: true`.
- `optimizeDeps.include` lists all `@angular/*` packages, `zone.js`, `rxjs`, `tslib`.
- `resolve.alias['@'] = './src'`.
- `server.host = '0.0.0.0'`, `server.port = process.env.PORT || 8443`, `server.strictPort = false` (falls back to next free port, e.g. 8444, when 8443 is busy).
- `server.watch.ignored` includes `**/.figma/**`, `**/.vs/**`, `**/node_modules/**`, `**/.git/**` (important on Windows/Visual Studio to avoid `EBUSY` watcher crashes from the `.vs` solution folder).

### src/index.css
- Imports Google Font "Noto Sans" and applies it globally to `html, body, app-root`:
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&display=swap');
/* plus Tailwind import(s) */
html, body, app-root {
  font-family: 'Noto Sans', sans-serif;
}
```

### src/main.ts
- Bootstraps the standalone `AppComponent` with the router (hash location strategy) and animations providers.

## 3. Routing (src/app/app.routes.ts)

```
'' (root)              → redirect to 'login'
'login'                 → LoginComponent
'' (AppLayoutComponent) → parent layout, with children:
	'dashboard'                    → DashboardComponent
	'lookup-types'                 → LookupTypesComponent (list)
	'lookup-types/create'          → CreateLookupTypeComponent
	'lookup-types/edit/:code'      → EditLookupTypeComponent
	'value-sets'                   → ValueSetsComponent (list)
	'value-sets/create'            → CreateValueSetComponent
	'value-sets/dept-hierarchy'    → ManageValuesComponent
	'translations'                 → TranslationsComponent
	'user-roles'                   → UserRolesComponent
	'audit-log'                    → AuditLogComponent
'**'                    → redirect to 'dashboard'
```

## 4. Application Shell

### src/app/app.component.ts
- Selector `app-root`, standalone, template is just `<router-outlet />`.

### src/app/layouts/app-layout.component.ts
- Selector `app-layout`.
- Wraps `<app-sidebar />` + a scrollable content area containing `<router-outlet />`.
- Root container: full-height flex row, `overflow-hidden`; content area background `#F9F8F4` (brand light beige/cream), scrollable.

## 5. Shared Components

### src/app/components/sidebar.component.ts — `SidebarComponent`
- Selector `app-sidebar`, standalone, imports `RouterLink`.
- `NavItem` interface: `{ label: string; route: string; iconDefault: string; iconActive: string }`.
- State: `collapsed = signal(false)`; `toggleCollapsed()` flips it.
- `isActive(route)` uses `Router.isActive('/' + route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' })`.
- **Widths:** collapsed = `76px` (`w-[76px]`, padding `p-3`); expanded = `312px` (`w-[312px]`, padding `p-6`) — note: expanded width was intentionally increased 20% from an original `260px` baseline. Both use `transition-all duration-200`.
- Background: `bg-[#007044]` (Herbalife primary green), right border `border-[#163E35]`.
- Header row: hamburger toggle button (far left, 3-line icon SVG, `viewBox 0 0 24 24`), then a white rounded square (`bg-white`, `size-8`) containing the Herbalife logo image `<img src="/assets/herbalife-symbol.svg" class="block size-[18px]" alt="Herbalife" />`, then (when expanded) app name text: bold "Herbalife LMS" title line + small uppercase subtitle "Reference Data".
- Nav list: `@for (item of navItems; track item.route)` — buttons with `[routerLink]`, active state style `bg-[#163E35]` with white bold text, inactive style `hover:bg-[#163E35]/50` with `#F9F8F4` text. Icons swap between `iconDefault`/`iconActive` SVG assets based on `isActive`. When collapsed, labels are hidden and `title` attribute shows label as tooltip; nav buttons center icon.
- `navItems` array (6 entries): Dashboard, Lookup Types, Value Sets, Translations, User Roles, Audit Log — each with distinct default/active icon asset paths under `/assets/*.svg`.
- Footer (only when expanded): "Environment" label + badge `PROD-US-EAST` styled `bg-[#FDF3D9]` background, `#7A4B00` text.

### src/app/components/app-header.component.ts — `AppHeaderComponent`
- Selector `app-header`, standalone.
- `Breadcrumb` interface: `{ label: string; green?: boolean }`.
- Inputs: `@Input() breadcrumbs: Breadcrumb[]`, `@Input() title: string`.
- Template: white header bar (`bg-white`, bottom border `#E7E4DB`) with:
  - Left: breadcrumb trail rendered as segments joined by "/" separators; segments marked `green: true` render in `#309C46`; below/beside it the page `title` in bold `#101921` text.
  - Right: a search input (placeholder like "Search types, value sets..."), notification icon(s), and a user profile block (initials avatar, name, role).
- **All page components pass a `breadcrumbs` array whose first entry is `{ label: 'Herbalife Lookup Management System', green: true }`**, followed by page-specific trail segments (e.g., `{ label: 'Standard Lookups' }`).

## 6. Pages (src/app/pages/**)

Each page is a standalone component using `AppHeaderComponent` (except Login) and Tailwind-styled cards/tables. Mock data is defined as plain arrays/objects inside the component class (no services).

1. **login/login.component.ts** — `LoginComponent`. Centered auth card on `#F9F8F4` background; decorative SVG shapes; shows "Herbalife Lookup Management System" as a bold heading (`text-2xl font-extrabold text-[#101921]`) next to a green rounded tile containing the Herbalife logo (`bg-[#007044]` tile, white/inverted `herbalife-symbol.svg`); email/password fields, "Remember workstation" checkbox, SSO/OAuth2 buttons; `signIn()` navigates to `/dashboard`.

2. **dashboard/dashboard.component.ts** — `DashboardComponent`. Header title: `"LMS Overview Dashboard"`. Breadcrumbs: `[{ label: 'Herbalife Lookup Management System', green: true }]`. Sections:
   - Stat cards row (`statCards`): Total Lookup Types, Total Value Sets, Active Users, Pending Translations — each `{ label, value, sub, icon, iconBg }`.
   - "Recently Modified Lookups" list (`recentItems`): `{ code, desc, module, by, time }`, with a "View all" button routing to `/lookup-types`.
   - "System Audit Log Activity" timeline (`auditItems`): `{ title, time, desc, by }`.

3. **lookup-types/lookup-types.component.ts** — `LookupTypesComponent`. Breadcrumbs: base + `{ label: 'Standard Lookups' }`. Table of lookup type definitions with search box, module filter, export and "Create" buttons. Columns: TYPE CODE, MEANING, DESCRIPTION, MODULE, ENABLED, LAST UPDATED, ACTIONS. Rows are expandable (expanded row background `#F9F8F4`).

4. **lookup-types/create-lookup-type.component.ts** — `CreateLookupTypeComponent`. Form with card sections: Type Definition (code, meaning), Configuration, and an editable Lookup Values table. `LookupValue` interface: `{ code, meaning, description, enabled, startDate, endDate }`.

5. **lookup-types/edit-lookup-type.component.ts** — `EditLookupTypeComponent`. Same structure as Create, pre-filled, plus an audit banner (last modified by/when) and an "Active" status badge with green dot indicator. Contains two breadcrumb arrays (list view breadcrumb + a variant with an extra segment) — both must use the current app-name label.

6. **value-sets/value-sets.component.ts** — `ValueSetsComponent`. Breadcrumbs: base + `{ label: 'Value Sets' }`. Table columns: VALUE SET CODE, NAME, VALIDATION TYPE, FORMAT TYPE, MAX LEN; search + create button.

7. **value-sets/create-value-set.component.ts** — `CreateValueSetComponent`. Form: Value Set Definition, Validation Type configuration, Format & Max Length — same card layout pattern as Create Lookup Type.

8. **manage-values/manage-values.component.ts** — `ManageValuesComponent`. Header title: `"Manage Values: DEPT_HIERARCHY"`. Left panel: hierarchical tree list (indented items via `pl-7` for nested levels); right panel: value details/edit area.

9. **translations/translations.component.ts** — `TranslationsComponent`. Two tabs: Lookup Translations and Value Set Translations.
   - `LookupTransRow`: `{ id, lookupType, valueCode, baseMeaning, language, languageName, translation, status, translatedBy, lastModified }`.
   - `VSTransRow`: `{ id, valueSet, valueCode, baseValue, language, languageName, translation, status, translatedBy, lastModified }`.
   - `status` values: `'active' | 'needs-review' | 'draft'`.

10. **user-roles/user-roles.component.ts** — `UserRolesComponent`. Breadcrumbs: base + `{ label: 'Security Panel' }`. `RoleAssignment` interface: `{ id, user, initials, email, role, scope, assignedBy, assignedDate, status }`. Tabbed layout (Role Assignments, etc.).

11. **audit-log/audit-log.component.ts** — `AuditLogComponent`. `AuditEntry` interface: `{ id, ts, tsShort, user, userInitials, role, action, type, entity, summary, ip, status, before, after, sessionId }`. `action` ∈ `CREATE | UPDATE | DELETE | VIEW | LOGIN | EXPORT`; `type` ∈ `lookup-type | value-set | user-roles | system | security`; `status` ∈ `success | failed | warning`.

## 7. Herbalife Brand Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#007044` | Sidebar background, primary buttons, active accents |
| Dark Green | `#163E35` | Sidebar borders, active nav item background, hover states |
| Accent Green | `#309C46` | Links, breadcrumb separators/green segments, positive/status indicators |
| Brand Cream | `#F9F8F4` | Page/content background, subtle panel backgrounds |
| Text Dark | `#101921` | Headings, primary text |
| Text Muted | `#837976` | Secondary text, table header labels |
| Border | `#E7E4DB` | Card borders, dividers |
| Warning BG | `#FDF3D9` | Badge/alert backgrounds |
| Warning Text | `#7A4B00` | Badge/alert text (e.g., environment badge) |

### Typography
- Font family: **Noto Sans** (Google Fonts), weights 400/500/600/700/800.
- Headings: `font-bold`/`font-extrabold`, `text-[#101921]`.
- Body/labels: `font-medium`/`font-semibold`, varying sizes (`text-xs`, `text-[11px]`, `text-[13px]`, `text-sm`, `text-base`).

### Common UI Patterns (Tailwind CSS v4 utility classes)
- **Cards:** `bg-white border border-[#E7E4DB] rounded-xl p-6` (optionally `drop-shadow` for elevated cards).
- **Primary buttons:** `bg-[#007044] text-white rounded-lg py-2.5 px-4 hover:bg-[#163E35]`.
- **Inputs:** `border border-[#E7E4DB] rounded-lg px-3 py-2.5 focus:border-[#007044] focus:ring-2`.
- **Table headers:** `bg-[#F9F8F4] font-bold text-[#837976] text-xs uppercase`.
- **Status/env badges:** rounded pill/box with tinted background + matching darker text color (e.g., `#FDF3D9` bg / `#7A4B00` text).

### Herbalife Logo Asset
- File: `public/assets/herbalife-symbol.svg`.
- Official 3-leaf brandmark, `viewBox="0 0 277 333"`, three `<path>` leaf shapes, `fill="#007044"`.
- Used in: sidebar logo tile (white background, green mark) and login page logo tile (green background `#007044`, mark inverted to white via `brightness-0 invert` on an `<img>`).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277 333" fill="#007044" aria-label="Herbalife" role="img">
<path d="M173.08,185.97c0.56,0.96,1.14,1.94,1.74,2.91c7.73-9.12,19.13-18.64,31.57-29.01v0.03C249.38,124.03,304.58,78.01,261,3.46l-0.06-0.12c-0.57-0.97-1.14-1.94-1.75-2.91c-7.7,9.12-19.13,18.63-31.57,29.01c-43,35.86-98.19,81.86-54.62,156.39L173.08,185.97z"/>
<path d="M157.01,208.45c1.06-0.29,2.17-0.6,3.26-0.93c-6.8-9.82-13.05-23.3-19.85-38l0.03,0.01C116.93,118.71,86.77,53.48,3.48,76.29l-0.13,0.03c-1.09,0.3-2.17,0.6-3.26,0.93c6.81,9.79,13.05,23.3,19.85,38c23.5,50.82,53.66,116.03,136.92,93.24L157.01,208.45z"/>
<path d="M260.5,147.03c-0.57-0.97-1.14-1.94-1.74-2.91c-7.7,9.12-19.13,18.63-31.57,29.01c-43.01,35.86-98.19,81.86-54.63,156.39l0.08,0.14c0.55,0.96,1.14,1.94,1.74,2.91c7.73-9.12,19.13-18.63,31.57-29.01v0.03c42.99-35.87,98.2-81.89,54.61-156.44L260.5,147.03z"/>
</svg>
```

## 8. Application Name / Text Standardization

The app display name was standardized to **"Herbalife Lookup Management System"** everywhere it previously read "Herbalife LMS" (11 occurrences across breadcrumbs and the login heading):
- `src/app/pages/login/login.component.ts`
- `src/app/pages/lookup-types/create-lookup-type.component.ts`
- `src/app/pages/manage-values/manage-values.component.ts`
- `src/app/pages/audit-log/audit-log.component.ts`
- `src/app/pages/value-sets/create-value-set.component.ts`
- `src/app/pages/user-roles/user-roles.component.ts`
- `src/app/pages/value-sets/value-sets.component.ts`
- `src/app/pages/lookup-types/edit-lookup-type.component.ts` (two occurrences)
- `src/app/pages/translations/translations.component.ts`
- `src/app/pages/lookup-types/lookup-types.component.ts`

The sidebar's small logo-adjacent label text still reads "Herbalife LMS" (short form) intentionally, since space is constrained there.

## 9. Regeneration Checklist for an LLM

To rebuild this app from scratch, in order:
1. Scaffold an Angular 21 standalone app with Vite + `@analogjs/vite-plugin-angular`, Tailwind CSS v4, hash routing.
2. Add `src/index.css` with Noto Sans import and Tailwind import.
3. Create `AppComponent` (router-outlet only) and `AppLayoutComponent` (sidebar + routed content, `#F9F8F4` background).
4. Create `SidebarComponent` and `AppHeaderComponent` per section 5, using the exact color tokens from section 7.
5. Create `public/assets/herbalife-symbol.svg` with the exact SVG markup in section 7.
6. Create the 11 page components per section 6, wiring `app.routes.ts` per section 3, each supplying a `breadcrumbs` array whose first item is `{ label: 'Herbalife Lookup Management System', green: true }`.
7. Configure `vite.config.ts` with `server.strictPort = false` and `watch.ignored` including `**/.vs/**` for Windows/Visual Studio compatibility.
8. Verify with `npm run build` and `npm run dev` (falls back to port 8444 if 8443 is occupied).
