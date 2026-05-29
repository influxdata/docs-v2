# Plan: Signal InfluxDB 3 as the current generation on the home page

Issue: #7273 (parent #7230 Phase 0; related #7219, #7242/#7243)

## Goal

Make the docs home page (`/`) state, near the top, that InfluxDB 3 is the
current generation of InfluxDB and the recommended choice for new time series
workloads, and link to the decision page at `/influxdb3/which-influxdb-3/`.
Keep existing v1/v2 entry points reachable.

## Approach

Single-file, additive change to `layouts/index.html`. Within the existing
`#influxdb3` product group, replace the lone feature tagline under the
`InfluxDB 3` heading with:

1. A current-generation lead sentence that mirrors the canonical language
   already on `/influxdb3/_index.md` ("InfluxDB 3 is the current generation of
   InfluxDB and the recommended platform for new time series workloads"), with
   the existing descriptive phrasing folded in via an em dash (no surrounding
   spaces). In an HTML template the Goldmark typographer does not run, so use a
   literal `—` character (matching codebase convention) rather than markdown `--`.
2. A decision-page pointer line linking to `/influxdb3/which-influxdb-3/`,
   wrapped in a `decision-cta` class as a styling hook (no new CSS unless the
   default rendering looks off).

### Resulting markup

```html
<h2>InfluxDB 3</h2>
<p>InfluxDB 3 is the current generation of InfluxDB and the recommended platform
for new time series workloads—built for high-speed, high-cardinality data from
the edge to the cloud.</p>
<p class="decision-cta">Not sure which product fits your use case? See
<a href="/influxdb3/which-influxdb-3/">Which InfluxDB 3 should I use?</a></p>
```

## Constraints / positioning

- Factual product enumeration only. No "choose product X" steering for
  managed/single-tenant scenarios; readers with that need are pointed to the
  decision page. The Self-managed group keeps leading with Core + Enterprise;
  the Fully-Managed group (Serverless, Cloud Dedicated) remains a factual list.
- No changes to the InfluxDB 2, InfluxDB 1, Telegraf, or Other Products groups.

## Verification

- `npx hugo` builds without errors.
- Run `npx hugo server`; load `/` and confirm:
  - The current-generation lead is visible above the fold.
  - The decision-page link resolves to `/influxdb3/which-influxdb-3/`.
  - v1/v2 product groups remain present and reachable.
- Screenshot the home page for the PR.

## Acceptance criteria (from #7273)

- [ ] Home page makes the current-generation message visible above the fold.
- [ ] Home page links to `/influxdb3/which-influxdb-3/`.
- [ ] Existing v1/v2 navigation remains reachable.
