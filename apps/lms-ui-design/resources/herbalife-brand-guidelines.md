# Herbalife Brand Guidelines for AI Prompts

Source: `Full Brand Book_Final_1.6 12.pdf`, reviewed 2026-08-30.

Use this file as the compact AI-readable reference for applying Herbalife branding in this project. Prefer this summary over re-reading the PDF unless exact legal or asset approval guidance is required.

## Rebrand Scope Guardrails

These rules are mandatory for future AI edits in this project. The rebrand may only change the visual brand layer. If a requested change requires touching a forbidden item, stop and report it instead of proceeding. If anything is ambiguous, report it instead of choosing silently.

Allowed changes:
- Color values in CSS, including hex, rgb, hsl, and named colors.
- `font-family`, `font-weight`, and `letter-spacing` declarations.
- Logo and brand image `src` or `href` paths.
- CSS custom properties under `--brand-*`.
- `background-image` gradients and brand-owned SVG `fill` / `stroke` values.

Forbidden changes:
- Do not modify any text node or visible copy in HTML.
- Do not modify `href` values on anchor tags, form `action` URLs, or any navigation target.
- Do not modify element IDs, class names, `data-*` attributes, or ARIA attributes.
- Do not change DOM structure: no adding, removing, reordering, or renesting elements.
- Do not modify form field `name`, `id`, or `value` attributes.
- Do not modify JavaScript files, including logic, selectors, event handlers, or string literals.
- Do not modify layout properties: `display`, `position`, `flex`, `grid`, `width`, `height`, `margin`, or `padding`.
- Do not modify media query breakpoints.
- Do not modify meta tags other than `theme-color`.
- Do not rewrite selectors for cleanup or cosmetic refactoring.

Practical implication: when rebranding `htdocs/welcome-index.html` and `htdocs/css/main.css`, prefer scoped CSS color/font edits and approved logo/image path swaps. Preserve content, links, selectors, behavior, structure, and layout dimensions.

## Brand Essence

Herbalife should feel modern, premium, optimistic, warm, human, wellness-focused, and community-oriented.

Purpose: helping people live their best lives.

Vision: to be the world's premier health and wellness company, community, and platform.

Values:
- Do what's right.
- Work together.
- Build it better.

Brand personality:
- Approachable
- Authentic
- Empowering
- Encouraging
- Optimistic
- Vibrant

Brand tone:
- Informative
- Friendly
- Caring
- Passionate

For internal enterprise tools, keep the tone clear, trustworthy, and useful. Avoid marketing-heavy copy, but preserve warmth and approachability.

## Logo / Brandmark

Preferred usage:
- Use the Herbalife brandmark in Garden Green on a white background whenever possible.
- Secondary usage is white brandmark on Garden Green.
- On black/dark backgrounds, use the approved high-contrast exception only when a dark surface is necessary.
- Do not recolor the logo with secondary colors.
- Do not stretch, distort, add shadows, add effects, or place the logo on visually busy backgrounds.
- Use the full brandmark for general brand presence; use symbol-only treatments only where space or UI context requires it.

For web navigation or compact app headers, the brandmark without tagline is acceptable. The tagline should not be included at very small logo sizes.

## Core Colors

Primary palette:

| Name | Hex | RGB | Usage |
| --- | --- | --- | --- |
| Garden Green | `#007044` | `0, 112, 68` | Main brand color, logo, primary accents |
| Forest Green | `#163E35` | `22, 62, 53` | Premium dark surfaces, strong contrast |
| Energy Green | `#309C46` | `48, 156, 70` | Energetic accent, bolder moments |
| Beige | `#F9F8F4` | `249, 248, 244` | Secondary background, hierarchy separation |
| White | `#FFFFFF` | `255, 255, 255` | Primary background |

Tertiary palette:

| Name | Hex | RGB | Usage |
| --- | --- | --- | --- |
| Black | `#101921` | `16, 25, 33` | Main text, dark UI surfaces |
| Grey | `#837976` | `131, 121, 118` | Secondary/supporting text |

Secondary accent palette, use sparingly:

| Name | Hex | RGB |
| --- | --- | --- |
| Blueberry | `#5662D0` | `86, 98, 208` |
| Blueberry Dark | `#4B25B0` | `75, 37, 176` |
| Mango Light | `#F7EB55` | `247, 235, 85` |
| Mango | `#F2A900` | `242, 169, 0` |
| Laguna Light | `#B1E4F1` | `177, 228, 241` |
| Laguna | `#2D68CB` | `45, 104, 203` |
| Raspberry | `#DB0661` | `219, 6, 97` |
| Raspberry Dark | `#872046` | `135, 32, 70` |

Color usage rules:
- Everyday brand communications should use about 90% primary colors and 10% secondary colors.
- More expressive campaigns may use 60% primary and up to 40% secondary colors.
- Prefer white backgrounds for primary messaging.
- Beige may be used to separate sections or create calm hierarchy.
- Use solid fills only. Avoid gradients, arbitrary tints, shadows, and decorative color effects unless explicitly specified by brand guidance.
- Tertiary colors should be minimal and functional.
- Metallic colors are reserved for recognition/celebratory use and should not be used in ordinary enterprise UI.

Recommended UI pairings:
- Garden Green text or icon on white.
- White text or icon on Garden Green.
- Energy Green text on Forest Green for high-contrast dark surfaces.
- Black text on white or beige for readable body copy.

## Typography

Official typefaces:
- Herbalife Natural: primary headlines and key messaging. Human, organic, approachable.
- Herbalife Walsheim GT: body copy, captions, small titles, and UI. Friendly, structured, precise.
- Noto Sans: fallback for languages not supported by the official fonts.
- Arial Nova: Microsoft Office only; do not use for web development.

Web fallback guidance:
- If Herbalife Natural and Walsheim GT are not available, use Noto Sans for UI and body text.
- Avoid Oswald, Calibri, Arial, or generic legacy corporate fonts when modernizing the page.

Text styling:
- Prefer sentence case for headlines and body copy.
- Use all caps only for high-energy moments, events, labels, or small supporting titles.
- Body copy should use normal tracking and comfortable line height.
- Keep hierarchy clear through size, weight, and spacing rather than excessive decoration.

## Iconography

Herbalife icons should be simple, modern, friendly, and minimal.

Icon system:
- Minimal icons are the primary system and should cover most UI/icon use.
- Duotone icons are secondary and should be used only when the icon is central to the story.

Preferred UI icon combinations:
- Garden Green icon on white.
- White icon on Garden Green.
- Duotone on white or Garden Green only when appropriate.

Avoid:
- Gradients
- Drop shadows
- Added stroke weight
- Dashes or decorative outlines
- Stretched icons
- Random icon colors
- White icons over busy images
- Duotone icons on colors other than white or Garden Green

## Photography / Visual Direction

Photography should feel authentic, inclusive, warm, and active.

Use imagery that shows:
- Real people and community togetherness.
- Candid, unstaged moments.
- Natural movement and energy.
- Morning-light warmth.
- Wellness, product use, or business/community activity in real settings.
- Subtle branding, not forced branding.

Avoid imagery that feels:
- Overly posed or fake.
- Cold, artificial, or studio-like unless specifically required.
- Overbranded outside events.
- Visually inappropriate for all ages.
- Product-focused in unnatural environments.

For product imagery:
- Show products in real, lived-in settings.
- Use natural ingredients, human details, or contextual cues when possible.
- Keep unrelated containers/drinkware unbranded for authenticity.

## Application to This SSO Project

Current project page: `htdocs/welcome-index.html` with styles in `htdocs/css/main.css`.

Current state observations:
- The existing page has some Herbalife cues: Herbalife logo, green accents, category panels, enterprise-app focus.
- The current design is not fully aligned with the brand book because it uses a blue geometric background, Material-style greens/teals, orange divider, Oswald/Calibri typography, and table-heavy legacy layout.

Recommended redesign direction:
- Use a clean white or beige page background.
- Use Garden Green as the main brand accent.
- Use Forest Green for premium header/sidebar/footer surfaces if needed.
- Use Energy Green sparingly for status or emphasis.
- Replace random greens/teals/orange with the official palette.
- Use minimal, flat icons and avoid shadows/gradients.
- Prefer a modern enterprise tool layout: structured, scannable, dense enough for repeated use, but warmer than the current legacy table layout.
- Keep application links clear and practical. This is an internal SSO portal, so usability should lead over promotional styling.

## Prompt Snippet

When asking an AI to update this project, include:

"Use the Herbalife brand guide in `htdocs/brandingreference/herbalife-brand-guidelines.md`. Apply Herbalife's modern, premium, optimistic wellness identity: Garden Green `#007044`, Forest Green `#163E35`, Energy Green `#309C46`, white, and beige `#F9F8F4`; use secondary colors only as small accents. Prefer official Herbalife fonts if available, otherwise Noto Sans. Keep the UI clean, approachable, enterprise-usable, and brand-compliant. Avoid gradients, arbitrary Material colors, heavy shadows, overbranding, and legacy table-heavy visual styling."
