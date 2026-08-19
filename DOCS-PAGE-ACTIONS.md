# Page Actions

In-repo developer documentation for the `.page-actions` UI region.
This file is contributor reference only — it's not published to
docs.influxdata.com (Hugo's published content lives under `content/`).

## What it is

`.page-actions` is the cluster of buttons and links shown next to the
article title, alongside the format selector. It's composed of one or more
partials that each emit an action (or group of related actions) into a
shared flex container.

```
<div class="page-actions">         ← container, styled in components/_page-actions.scss
  {{ partial "article/format-selector.html" . }}
  {{ partial "article/telegraf-plugin-links.html" . }}
  ...add new action partials here
</div>
```

The container, in [layouts/partials/article.html](layouts/partials/article.html),
applies a consistent visual language to every direct child so individual
action partials don't need to know about styling.

## When to use it

Add an action to `.page-actions` when **all** of these are true:

- The action is **general** — applies across a category of pages, not just
  one. Examples: "link to the source for this Flux stdlib package",
  "link to the source for this InfluxDB 3 plugin", "download a related
  config file".
- The action is **specific to the current page** — what it links to or
  downloads is derived from the page's frontmatter, identifier, or
  section, not hardcoded.
- The action belongs in the **page header** — it's a peer of the title
  and format selector, not in-content guidance.

**Don't use it for:**

- A one-off control that only appears on a single page. Inline that control
  in the page content instead.
- Anything tied to a single piece of functionality that doesn't generalize
  (e.g., a button that triggers a demo specific to one tutorial). Put it
  in a shortcode and use it from the body.
- Navigation between pages. Use the article body, related links, or the
  sidebar.

## How it's wired up

| File                                                                                        | Role                                                                                                                         |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [layouts/partials/article.html](layouts/partials/article.html)                              | Defines the `<div class="page-actions">` container and includes child partials.                                              |
| `layouts/partials/article/<action>.html`                                                    | Each action gets its own partial. Decides whether to render (via product/section guards) and emits the anchor/button markup. |
| [assets/styles/components/\_page-actions.scss](assets/styles/components/_page-actions.scss) | Container layout + base look. Restyles `a.btn` inside the container so legacy anchors match the format-selector button.      |
| [assets/styles/styles-default.scss](assets/styles/styles-default.scss)                      | Imports the SCSS partial. Required if you ever add another file.                                                             |

## Adding a new action

### 1. Create the action partial

Put it in `layouts/partials/article/<action-name>.html`. Inside, guard the
output so it only renders on the pages where it belongs — usually a check
on `.Params.product`, the section, the layout, or a shortcode presence.

```go-html-template
{{ if (eq .Params.product "<product>") }}
  {{ if .Parent.HasShortcode "<shortcode>" }}
    <a class="btn github"
       href="<URL>"
       target="_blank">Link label</a>
  {{ end }}
{{ end }}
```

[layouts/partials/article/telegraf-plugin-links.html](layouts/partials/article/telegraf-plugin-links.html)
is a working example: it derives the plugin category and ID from the
page's menu identifier, then renders two anchors only on Telegraf plugin
pages that use the `telegraf/plugins` shortcode.

### 2. Include it from `article.html`

Add a `{{ partial "article/<action-name>.html" . }}` line inside the
`<div class="page-actions">` block in
[layouts/partials/article.html](layouts/partials/article.html). Order is
visual order — left-to-right, with the format selector usually last on
the right.

### 3. Style — usually nothing to do

`_page-actions.scss` already styles `a.btn` inside the container to match
the format selector. If your anchor uses `class="btn"` (with optional
`github`/`download` modifiers for icomoon icons), it will look right.

If you need a new visual variant, prefer extending the existing tokens
(`$sidebar-search-bg`, `$nav-border`, `$sidebar-search-highlight`) over
adding novel colors — drift between actions is what the rewrite was
trying to fix.

### 4. JS — only if the action does something on click

For a plain link, none. For an enhanced behavior (download, copy, modal,
etc.), follow the component pattern:

1. Create `assets/js/components/<component-name>.ts` exporting a default
   `init({ component })` function.
2. Register it in [assets/js/main.js](assets/js/main.js): add the import
   and an entry in `componentRegistry`.
3. Add `data-component="<component-name>"` to the element in your action
   partial.

[assets/js/components/download-external.ts](assets/js/components/download-external.ts)
is the working example — it intercepts clicks on
`<a data-component="download-external">` to make cross-origin file
downloads save to disk instead of opening inline. Critically, it keeps
the anchor's `href` as the JS-disabled and fetch-failure fallback.

## Element conventions

- **Anchor (`<a>`) for navigation**, **button (`<button>`) for action.**
  A link to GitHub, a downloadable file, or a related page is an anchor —
  even when JS enhances the click handler, the `href` should still point
  to a working URL so middle-click, right-click "Save link as", and the
  no-JS path all work. Use `<button>` only when activation has no
  meaningful URL (toggling a modal, copying to clipboard, etc.).
- **Keep `href` truthful.** It's both the fallback and the source of
  truth for the action's destination. Don't use `href="#"` with a JS
  click handler.
- **Don't reinvent the styling.** Rely on the container. If a new action
  doesn't fit the visual language, the container styles probably need
  updating — discuss before forking the look.

## Examples shipped on this branch

| Partial                                                                                                    | What it adds                                                         | Renders when                                                 |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| [layouts/partials/article/format-selector.html](layouts/partials/article/format-selector.html)             | "Copy page for AI" dropdown with markdown/ChatGPT/Claude/MCP entries | Almost every doc page (excludes `/search`)                   |
| [layouts/partials/article/telegraf-plugin-links.html](layouts/partials/article/telegraf-plugin-links.html) | "Plugin source" + "Download sample.conf" anchors                     | Telegraf plugin pages using the `telegraf/plugins` shortcode |
