# Share InfluxDB v1 prose content, but not the v1 API specs

InfluxDB v1 OSS and v1 Enterprise kept two copies of every overlapping page,
coupled only by convention, and they drifted: 74 overlapping pages differed by
4,881 lines, including edition-independent Flux guides and OSS links to a
`tools/shell/` page that no longer exists. We are moving the pages whose
divergence is provably accidental into `content/shared/influxdb-v1/`, so that
duplication becomes structurally impossible rather than merely discouraged.

This deliberately does **not** extend to the v1 OpenAPI specs. ADR-adjacent
prior art, `docs/plans/2026-02-04-v1-api-deduplication-design.md`, decided to
"keep both specs as complete, standalone files -- accept duplication for
simplicity," and that decision stands. Specs are generated artifacts consumed by
tooling, where a merge conflict surfaces immediately; prose is hand-edited by
many people, where drift is silent. The two are not inconsistent, they respond
to different failure modes.

## Consequences

Pages whose editions genuinely differ -- clustering, hardware sizing, upgrade
paths, and the parts of the glossary that describe meta and data nodes -- stay
as separate files. Forcing those into one file with conditionals produces
something no one can safely edit, which is a worse hazard than two honest
copies.

Merging also raises the blast radius of a bad link: a stale target in a shared
file is wrong in both products at once. That argues for care when reconciling,
not against sharing.
