---
name: hugo-template-dev
description: "Hugo template development for InfluxData docs-v2, enforcing build and runtime testing to catch template errors that build-only validation misses. Use when creating or editing Hugo layouts, partials, or shortcodes, debugging template errors, or accessing site data in templates."
---

# Hugo template development

| Change                    | Required evidence                             | Load                                                           |
| ------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| Template or partial       | Hugo build plus runtime Cypress coverage      | [references/runtime-testing.md](references/runtime-testing.md) |
| Product-specific behavior | Data-driven product context, no magic values  | [references/product-data.md](references/product-data.md)       |
| New shortcode             | example page, docs, and Cypress behavior test | [references/shortcodes.md](references/shortcodes.md)           |

Prerequisites: inspect nearby patterns and the page cascade. Never branch on a
hardcoded product name, version, or URL segment when `data/products.yml` and
the product context partial provide the fact. A build does not prove runtime
behavior.

```sh
npx hugo --quiet
node cypress/support/run-e2e-specs.js <content-file>
```

Load the route-specific reference only when that condition applies.
