---
title: EDR release notes
description: >
  Changes and updates to EDR (Edge Data Replication) for InfluxDB 3
  Enterprise.
menu:
  influxdb3_enterprise:
    parent: edr
    identifier: edr-release-notes
    name: Release notes
weight: 11
related:
  - /influxdb3/enterprise/edr/
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/releases.md -->
<!-- GA_REVIEW: EDR 1.0.0 at fcdf286; release-specific updates reconciled with docs/external at c2f088e. Existing VERIFIED corrections take precedence over upstream prose. -->

EDR follows [SemVer](https://semver.org). During the beta, the version stays
below `1.0.0`; within that range, EDR bumps the minor number for each beta
drop and the patch number for a re-spin of the same drop. `1.0.0` marks
general availability (release candidates for it are numbered
`1.0.0-0.rc.N`). Every release is immutable once published—a given version
always refers to exactly the same bytes—and the agent identifies its build
precisely: `influxdb3-edr --version` prints the version plus the source
revision it was built from (for example, `0.2.0 (682ce264f)`), the same
identity appears in the agent's startup log, and each agent reports it to
its downstream, so the destination's API and UI show which build every
connected edge is running.

Each release is built against a pinned InfluxDB 3 Enterprise revision,
encoded in the image tag (`edr:<VERSION>-pro<REVISION>-<ARCH>`).

## v1.0.0 {date="2026-10-01"}

General availability of EDR for InfluxDB 3 Enterprise.
Built against Enterprise 3.12.0, revision `7dd361197e`.
The image tags are `edr:1.0.0-pro7dd361197e-amd64` and `edr:1.0.0-pro7dd361197e-arm64`.

### Compatibility and upgrade

EDR 1.0.0 uses EDR replication protocol version 3 and accepts version 1 peers.
Supported source server lines are **3.11.x and 3.12.x**.
InfluxDB 3 Enterprise 3.10.x is unvalidated and unsupported for GA, even though the binary's displayed list includes it.

For rc.1, rc.2, or rc.3 on a 3.11 source, stop the agent and start GA with the same configuration, state location, and source data location.
No configuration changes are required.
For 0.2.0 on a 3.10 source, upgrade the agent to rc.3, the server to 3.11, the agent to GA, and then the server to 3.12 if needed.
Rc.3 cannot read a 3.12 source.
See the [compatibility matrix and upgrade procedure](/influxdb3/enterprise/edr/reference/compatibility/#upgrade-to-edr-100).

### Capabilities

- [Kubernetes and Helm installation](/influxdb3/enterprise/edr/install/kubernetes/) supports sender, receiver, and combined roles alongside an unmodified Enterprise Helm release.
  Agent state persists in object storage; tokens mount from Kubernetes Secrets.
- S3, Google Cloud Storage, and Azure Blob Storage are supported for source reads and agent state.
  State locations accept `s3://`, `gs://`, and `az://` URLs.
- The token store accepts server token JSON files with a `token` field.
  Set its location with `--token-store` or `INFLUXDB3_EDR_TOKEN_STORE`.
  The agent warns once about group or world token-file permissions.
  See [Manage tokens](/influxdb3/enterprise/edr/manage-tokens/).
- High server WAL retention plus opt-in agent WAL cleanup is the supported production configuration.
  Server-negotiated retention holds are not included in GA.
  See [Size WAL retention](/influxdb3/enterprise/edr/size-wal-retention/).

### Fixes

- Failed-WAL skip receipts hold the cleanup floor until the gap ledger records the failure.
  Cleanup cannot delete the file during that transition.
- `edr_owed_work` no longer briefly reports zero while gaps move from pending to in progress.
- The pending-gap counter no longer underflows.
- Wire batches containing more than 65,535 schemas fail explicitly instead of truncating a schema index.

For release artifacts and deployment coordination, [contact the InfluxData Sales team]({{< cta-link >}}).

## v1.0.0-0.rc.3 {date="2026-09-22"}

Third release candidate, built against Enterprise 3.11.0, revision `e5242f505d`.
Supports 3.10.x and 3.11.x sources, EDR replication protocol version 3, and version 1 peers.
It does not support 3.12.x sources.
Upgrades from rc.2, rc.1, or 0.2.0 preserve configuration, state, and source data locations.

> [!Warning]
> #### Verify wide-table field values after upgrading
>
> All earlier builds, including 0.2.0, rc.1, and rc.2, can pair field values with the wrong field names in tables wider than 100 fields.
> Different field types can cause a schema conflict and halt replication.
> Matching types can silently store mislabeled values.
> After upgrading, verify field-level values downstream or re-replicate affected tables.
> Row counts alone cannot detect this defect.

### Fixes and changes

- Recovery records an entire evicted WAL span as one gap and resumes live replication above the retention floor.
  Earlier builds could remain behind retention indefinitely without sending data.
- Direct-mode liveness treats HTTP 404 or 405 as proof of life for InfluxDB 3 Cloud, which has no `/health` route.
  Authentication failures and server errors still fail the probe.
- Checkpoint versions 12 and 13 are correctly labeled as 3.11-line state stamps.
  Version 13 includes bulk-import watermarks; these stamps do not establish 3.12 source support.
- `gapfill_blocked_on_halt` and a log message identify recovery blocked by a halted channel.
- The `historic_fill: { mode: none }` startup notice clarifies that all in-scope tables replicate from the startup boundary; only older history is skipped.
- Historic-fill width follows `concurrent_sends`.
  Gen0 processing no longer drains the pipeline at each snapshot boundary.
  Strict-order `concurrent_sends: 1` processes one file at a time.
- Signals demo host ports move to 18181–18184 and remain overridable in `.env`.

## v1.0.0-0.rc.2 {date="2026-09-14"}

Second release candidate, built against Enterprise 3.11.0, revision `e5242f505d`.
Supports 3.10.x and 3.11.x sources, EDR replication protocol version 3, and version 1 peers.
Upgrades from rc.1 or 0.2.0 require no configuration changes.
Keep the same state and source data locations; 0.2.0 state migrates automatically into per-destination namespaces.

### Fixes and changes

- Gap recovery replays exact raw WAL files when available.
  Transient read failures wait briefly and retry; evicted files fall back to compacted-file recovery.
  `gapfill_files_from_wal_total` reports raw-WAL recovery.
- Active recovery reports `gaps_in_progress`, discovery progress, and replication progress.
  `gapfill_files_vanished_total` counts files removed by compaction during recovery.
  Alert on stalled recovery rather than pending gaps alone.
- `rows_sent` now counts delivered physical rows.
  Wide tables split logical rows across field families, so this can exceed SQL row counts.
- Dashboard health panels use stable numeric series and reflect channel changes within a scrape interval.
  The Recovery row shows backlog, progress, and recovery medium.
- Direct-mode liveness authenticates like the write path, allowing auth-gated `/health` endpoints.
- `edr_owed_work` reports outstanding replication work per destination for drain checks.
- High server WAL retention plus opt-in agent cleanup becomes the supported production pattern.
  Server-negotiated retention holds are deferred beyond GA.

## v1.0.0-0.rc.1 {date="2026-09-01"}

Release candidate for the 1.0.0 general-availability release. Built against
InfluxDB 3 Enterprise **3.11.0** (revision `e5242f505d`). Images:
`edr:1.0.0-0.rc.1-proe5242f505d-amd64` and `-arm64`.

**Compatibility** (see
[Compatibility](/influxdb3/enterprise/edr/reference/compatibility/)): EDR replication
protocol **version 3** (stateless data path; version-1 peers accepted—a
mixed fleet with 0.2.0 agents interoperates in both directions); InfluxDB
storage matrix **3.10.x and 3.11.x**—the agent runs unchanged across a
source server's 3.10 to 3.11 upgrade (upgrade EDR first).

**Upgrading from 0.2.0**: drop-in. On first start the agent migrates its
on-disk state (v1 to v2, adding journal mirrors) automatically; no
configuration change is required. One behavioral change to review:
**bandwidth schedules are now interpreted in UTC** by default (previously
the agent process's local timezone). If your schedule windows were written
for a local clock, set the new `bandwidth_timezone` field (IANA name, for
example `Asia/Kolkata`) to keep them meaning what they meant.

**Highlights over 0.2.0:**

- **Multi-destination fan-out.** A sender can replicate to several
  downstreams at once—for example, a live feed plus a full-history
  archive—with per-destination scope, schedule, journal, and the
  health and UI channel. See
  [Replicate to multiple destinations](/influxdb3/enterprise/edr/replicate/to-multiple-destinations/).
- **Scope exclusions.** `exclude: { databases: [...], tables: [...] }`
  composes with instance- and database-level scope, so "everything except
  `internal_edr`" is now a two-line config.
- **State-loss resilience.** Journal files (cursor, gap ledger, historic
  manifest) are mirrored; a corrupt or vanished primary recovers from the
  mirror automatically. Behavior when both copies are lost is explicit
  config: `on_state_loss: recover` (default, requires idempotent writes) or
  `halt`.
- **WAL loss is accounted, not buried.** WAL evicted by the server before
  replication is classified distinctly (`WalFileMissing`), counted in a new
  `wal_files_lost_total` metric, and recovered from gen0/compacted files
  through gap fill where possible.
- **Cleanup correctness.** Agent-side WAL cleanup now holds a fourth floor
  under queued and in-flight work and unresolved gap-ledger ranges, so a
  slow or recovering destination can never have its input deleted out
  from under it.
- **Bandwidth schedule hardening.** Stricter validation (unknown fields,
  malformed times and dates, empty day lists are config errors),
  UTC-by-default semantics with the `bandwidth_timezone` opt-in above.
- **Refreshed embedded UI**, matching InfluxDB 3 Explorer's branding.
- **`edr-inspect`**—a read-only triage CLI (`state`, `metrics`, and
  `topology`), shipped in the image and run through `docker exec`.
- **Optional observability overlay** in the signals demo: Telegraf and
  Grafana dashboards layered on with a second compose file, like
  licensing.

**Known limitation**: the source server's WAL retention
(`wal-snapshots-to-keep`, un-prefixed spelling on 3.11) is the only hold on
WAL files EDR has not yet replicated; size it generously on constrained or
intermittently connected edges. Server-negotiated retention holds are not included in GA; use
[high server retention and opt-in agent cleanup](/influxdb3/enterprise/edr/size-wal-retention/).

## v0.2.0 {date="2026-07-16"}

First customer beta release. Built against InfluxDB 3 Enterprise 3.10.0
(revision `0119b6f42f`). Images: `edr:0.2.0-pro0119b6f42f-amd64` and
`-arm64`.

**Compatibility** (see
[Compatibility](/influxdb3/enterprise/edr/reference/compatibility/)): EDR replication
protocol **version 1** (implicit—predates protocol versioning); InfluxDB
storage matrix **3.10.x only**.

**Highlights over the preview builds (0.1.0):**

- **Delivery-ordering guarantees made explicit.** Strict-order delivery is
  now the default (`concurrent_sends: 1`), and every feature that reorders
  or re-sends data—concurrent sending, priority routing, historic fill,
  multi-ingest—requires the `idempotent_writes: true` assertion and is
  rejected by config validation otherwise. See
  [Configuration file reference](/influxdb3/enterprise/edr/reference/config-file/#performance-vs-correctness).
- **Agent-side WAL cleanup** (`--wal-cleanup-enabled`, opt-in): bounded
  deletion of already-replicated WAL from the source object store, so WAL
  no longer accumulates when server-side retention is set high. Deletion
  is bounded below the replication cursor, the snapshot boundary (minus a
  configurable margin), and the historic-fill floor—validated under chaos
  testing with zero loss and zero replication gaps.
- **Robustness hardening** from a full-codebase review: line-protocol
  encoding of names with special characters, schema-change detection
  during replication, wire-format hardening on the receiver, and
  crash-consistency fixes in historic fill and the replication cursor.
- **Build identity**: `--version` on both `influxdb3-edr` and
  `edr-inspect`, version in the startup log, and per-edge version
  visibility at the destination.

## v0.1.0 {date="2026-06-30"}

Internal preview builds circulated ahead of the first customer release
(preview). Superseded by v0.2.0; the v0.1.0 artifact line is retired.
