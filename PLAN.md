# Plan: `lucide` shortcode — make the Lucide icon library available in docs

## Goal

Provide a reusable Hugo shortcode, `{{< lucide "name" >}}`, that inlines any
icon from the [Lucide](https://lucide.dev/icons) library as SVG. Telegraf
Controller docs are the first consumer (the TC UI uses Lucide icons), but the
shortcode is product-neutral so any docs can use it.

## Why inline SVG (not an icon font)

- The repo's existing `icon`/`nav-icon` shortcodes use IcoMoon **icon fonts**
  tied to the InfluxDB "Clockface" UI. Lucide is SVG-first.
- Inlining ships only the icons actually referenced (no full-font payload, no
  extra network request), inherits text color via `currentColor`, and gives
  real accessibility hooks.
- Lucide icon names are stable, documented, kebab-case — so the shortcode is a
  thin name pass-through, with no per-icon mapping table to maintain (unlike
  the \~270-line `icon.html`).

## Design

### Sourcing

- Add `lucide-static` as a `devDependency`. It ships every icon as an
  individual SVG under `node_modules/lucide-static/icons/<name>.svg`.
- Reachable from Hugo via the existing `node_modules` → `assets/node_modules`
  mount (`config/_default/hugo.yml`), so `resources.Get` can read them. No new
  config.

### Shortcode — `layouts/shortcodes/lucide.html`

- Args: positional `0` = icon name; named `label` (accessible name),
  `size` (`small` | `large`, default 1em).
- `resources.Get "node_modules/lucide-static/icons/<name>.svg"`; on miss, log a
  build warning (`warnf`) and render nothing — a typo doesn't fail the build.
- Strip Lucide's hardcoded `width="24" height="24"` so CSS/font-size controls
  size (the `viewBox` stays, so it scales).
- Inject accessibility attrs: `aria-hidden="true" focusable="false"` by
  default, or `role="img" aria-label="…"` when `label` is set.
- Append the `size` modifier to the existing `class="lucide …"` when provided.

### Styling — `assets/styles/layouts/_lucide-icons.scss`

- Target `svg.lucide` (Lucide already emits `class="lucide lucide-<name>"`).
- `width/height: 1em`, `vertical-align: -0.125em`, `stroke: currentColor`;
  `.small` and `.large` modifiers.
- Register with `+ "layouts/lucide-icons"` in `assets/styles/styles-default.scss`.

### Docs / example / test

- `DOCS-SHORTCODES.md`: new entry (syntax, `label`, `size`, note that any
  lucide.dev name works).
- `content/example.md`: usages (plain, `label`, `size`) — render target.
- `cypress/e2e/content/lucide-shortcode.cy.js`: visit `/example/`; assert
  `svg.lucide` renders, `aria-label` present when `label` set, unknown name
  yields no `svg`.

## Files touched

| File                                         | Change                   |
| -------------------------------------------- | ------------------------ |
| `package.json`                               | + `lucide-static` devDep |
| `layouts/shortcodes/lucide.html`             | new                      |
| `assets/styles/layouts/_lucide-icons.scss`   | new                      |
| `assets/styles/styles-default.scss`          | + 1 import line          |
| `DOCS-SHORTCODES.md`                         | new entry                |
| `content/example.md`                         | usage examples           |
| `cypress/e2e/content/lucide-shortcode.cy.js` | new                      |

## Verification

- `npx hugo --quiet` builds with no template errors.
- Cypress test passes against `/example/`.

## Out of scope

- Migrating existing `icon`/`nav-icon` usages to Lucide.
- Adding Lucide icons to specific Telegraf Controller content pages (follow-up).
