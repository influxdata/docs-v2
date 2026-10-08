# Discriminate v1 editions by product, not by version

The `show-in` and `hide-in` shortcodes decided which edition sees a block by
testing the page's cascaded `version`. That works when editions have distinct
versions (`core` vs `enterprise`, `v2` vs `cloud`), but both InfluxDB v1
editions cascade `version: v1` -- so the shortcodes could not tell them apart at
all.

The obvious fix is to give the editions distinct `version` values. We rejected
it: `version` is a lookup key into `data/products.yml` for `latest_patches`,
`content_path`, and `name__v1`, and it drives `layouts/partials/article/feedback.html`.
Renaming it to solve a display problem would break those. Instead both
shortcodes now match a list entry against three identifiers -- `<version>`,
`<product>`, and the composite `<product>/<version>` -- so shared v1 content
uses `show-in "enterprise_influxdb/v1"`.

Prefer the composite form. A bare `<product>` matches every version of that
product, so `"influxdb"` is true on v1 *and* v2 pages -- harmless today only
because v2 pages do not read v1 shared files.

## Consequences

List entries are now trimmed, which changed existing behavior: five call sites
in `content/shared/influxdb3-visualize/powerbi.md` and
`content/shared/influxdb3-query-guides/query-timeout-best-practices.md` wrote
`"core, enterprise"` with a space, and the untrimmed token never matched. Those
pages rendered a broken sentence ("Database token: Your with query permissions
for the target database"). They now render as their authors intended.
