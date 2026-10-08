# Keep the divergent v1 URL roots; resolve shared paths from products.yml

InfluxDB v1's two editions live under different product roots --
`/influxdb/v1/` and `/enterprise_influxdb/v1/` -- unlike every other shared pair
in this repo, where both editions share a root (`/influxdb/v2/` and
`/influxdb/cloud/`; `/influxdb3/core/` and `/influxdb3/enterprise/`). That is
why the existing `<product-root>/version` link placeholder cannot serve v1: the
placeholder is a literal string in the shared file, and the two editions would
need different literals.

We considered moving Enterprise v1 under the `influxdb` root to match the rest.
We chose not to, for now: it changes 186 URLs, requires rewriting about 1,968
link references and adding a redirect for every old path, and puts SEO on a paid
product's documentation at risk -- none of which is needed to stop the drift.
Instead, shared v1 content uses a product-neutral `/product/version/`
placeholder that `layouts/partials/article/content.html` resolves from the
consuming page's `content_path` in `data/products.yml`, via the existing
product/version cascade. No product name or path is hardcoded in a template or
in JavaScript.

## Consequences

The asymmetry we dislike stays visible, but it is now confined to one field in
`data/products.yml` rather than spread across content files. That also makes the
URL move cheaper if we ever do it: shared content already addresses links
through a resolved token, so unifying the roots becomes a data change plus
redirects, with no shared-content churn.
