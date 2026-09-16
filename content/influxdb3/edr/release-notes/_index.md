---
title: EDR release notes
description: >
  Changes and updates to EDR (Edge Data Replication) for InfluxDB 3
  Enterprise.
menu:
  influxdb3_edr:
    name: Release notes
weight: 11
related:
  - /influxdb3/edr/
---

EDR beta releases. Version numbers follow `0.MINOR.PATCH` during the beta:
the minor bumps with each beta drop, a patch marks a re-spin of the same
drop, and `1.0.0` marks general availability (release candidates for it are
numbered `1.0.0-0.rc.N`). Every release is immutable once published—a
given version always refers to exactly the same bytes—and the agent
identifies its build precisely: `influxdb3-edr --version` prints the
version plus the source revision it was built from (for example, `0.2.0
(682ce264f)`), the same identity appears in the agent's startup log, and
each agent reports it to its downstream, so the destination's API/UI shows
which build every connected edge is running.

Each release is built against a pinned InfluxDB 3 Enterprise revision,
encoded in the image tag (`edr:<version>-pro<revision>-<arch>`).

## v1.0.0-0.rc.1 {date="2026-09-01"}

Release candidate for the 1.0.0 general-availability release. Built against
InfluxDB 3 Enterprise **3.11.0** (revision `e5242f505d`). Images:
`edr:1.0.0-0.rc.1-proe5242f505d-amd64` / `-arm64`.

**Compatibility** (see
[Compatibility](/influxdb3/edr/reference/compatibility/)): agent protocol
**v3** (stateless data path; v1 peers accepted—a mixed fleet with 0.2.0
agents interoperates in both directions); InfluxDB storage matrix **3.10.x
and 3.11.x**—the agent runs unchanged across a source server's 3.10 to
3.11 upgrade (upgrade EDR first).

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
  archive—with per-destination scope, schedule, journal, and health/UI
  channel. See
  [Replicate to multiple destinations](/influxdb3/edr/admin/multi-destination-fan-out/).
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
  via gap fill where possible.
- **Cleanup correctness.** Agent-side WAL cleanup now holds a fourth floor
  under queued/in-flight work and unresolved gap-ledger ranges, so a slow
  or recovering destination can never have its input deleted out from
  under it.
- **Bandwidth schedule hardening.** Stricter validation (unknown fields,
  malformed times/dates, empty day lists are config errors), UTC-by-default
  semantics with the `bandwidth_timezone` opt-in above.
- **Refreshed embedded UI**, matching InfluxDB 3 Explorer's branding.
- **`edr-inspect`**—a read-only triage CLI (`state` / `metrics` /
  `topology`), shipped in the image and run via `docker exec`.
- **Optional observability overlay** in the signals demo: Telegraf +
  Grafana dashboards layered on with a second compose file, like licensing.

**Known limitation**: the source server's WAL retention
(`wal-snapshots-to-keep`, un-prefixed spelling on 3.11) is the only hold on
WAL files EDR has not yet replicated; size it generously on constrained or
intermittently connected edges. A server-side retention hold negotiated by
EDR is planned for GA.

## v0.2.0 {date="2026-07-16"}

First customer beta release. Built against InfluxDB 3 Enterprise 3.10.0
(revision `0119b6f42f`). Images: `edr:0.2.0-pro0119b6f42f-amd64` /
`-arm64`.

**Compatibility** (see
[Compatibility](/influxdb3/edr/reference/compatibility/)): agent protocol
**v1** (implicit—predates protocol versioning); InfluxDB storage matrix
**3.10.x only**.

**Highlights over the preview builds (0.1.0):**

- **Delivery-ordering guarantees made explicit.** Strict-order delivery is
  now the default (`concurrent_sends: 1`), and every feature that reorders
  or re-sends data—concurrent sending, priority routing, historic fill,
  multi-ingest—requires the `idempotent_writes: true` assertion and is
  rejected by config validation otherwise. See
  [Configuration file reference](/influxdb3/edr/reference/config-file/#performance-vs-correctness).
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
