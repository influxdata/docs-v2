---
title: Historic fill and gap fill
description: >
  Understand how EDR backfills pre-existing data on first attach and
  recovers gaps left by WAL retention or downtime.
menu:
  influxdb3_edr:
    name: Historic fill and gap fill
    parent: Monitor
weight: 1
---

1. [Historic fill](#historic-fill)
2. [Gap fill](#gap-fill)

## Historic fill

Historic fill replicates data that existed on the source *before* EDR was
deployed, or before this destination was added.

`historic_fill` is required—there is no default. This is deliberate: you
must declare your intent for existing data before EDR attaches to a
source. If `historic_fill` is absent, the agent **refuses to start** and
prints the choices below.

```yaml
downstream:
  # ... name, address, auth_token ...
  historic_fill:
    mode: none            # required -- choose: none | full | since
    # mode: full
    # mode: since
    # since: "7d"         # only with mode: since -- whole days (Nd) or ISO date (no sub-day units)
```

| Mode | Behavior |
|---|-----|
| `none` | **Live only.** Start at the most recent WAL (the leading edge) and replicate new data as it lands; no pre-existing data is backfilled. Data that evicts before EDR reaches it is *not* recovered. |
| `full` | Backfill **all** pre-existing data (from snapshots / cv2), then live. |
| `since` | Backfill pre-existing data whose **data timestamp** is after the `since` threshold, then live. Threshold is a whole-day duration (`7d`, `30d`—floored to the start of that UTC day) or an ISO date (`2026-06-01`). Sub-day units (`30m`, `6h`) are **rejected**—cv2 is partitioned by data date, so day is the only honest resolution. An unparseable value fails at startup. |

**Start point.** On a fresh start, *every* mode (including `none`) seeds the
live cursor to the **snapshot boundary**—the frontier WAL ID near the
leading edge—so live replication begins from the most recent WAL, never
from WAL 1. The difference between the modes is only what (if anything)
gets backfilled *below* that boundary. `none` does no backfill; `full`/
`since` hand the below-boundary data to historic fill.

The historic/live boundary is in WAL-ID (ingest) space and is computed once
at startup; the `since` threshold filters by *data timestamp* (event time).

### How historic fill works

On first startup (no prior cursor), the agent computes a snapshot
boundary—the frontier WAL ID. The live WAL replicator handles everything
after the frontier; historic fill handles everything before it:

1. **Snapshot manifests (`.ptsnap`)** are read to build a work list of gen0
   files, each carrying its WAL range and time range.
2. **Gen0 files** on the work list are read and replicated, one file at a
   time, at lower priority than live data (unless a priority rule claims
   historic fill explicitly).
3. **cv2 files (L1+)** are the primary medium for genuinely old data—data
   whose gen0 files and snapshot manifests have already been compacted
   away. cv2 candidates are enumerated by time window and processed as
   first-class work list entries.

Progress is persisted in a manifest file, so historic fill survives agent
restarts and resumes where it left off. When the work list is exhausted the
fill is marked complete and never runs again (the manifest records
completion).

### What to expect in the logs

Historic fill is deliberately loud. These messages are normal:

- `historic fill: starting — N snapshots, M files`—work list built.
- `historic fill: MANIFEST GAP — snapshot manifests for WAL X-Y were
  deleted by compactor. Will recover from WAL files or cv2 files.`—
  **expected** whenever the compactor has cleaned up older snapshot
  manifests. The agent recovers the gap from surviving WAL files where
  possible, and from cv2 files for the evicted head.
- `historic fill: MANIFEST GAP only partially covered by WAL files — WAL
  X-Y were evicted. Enumerating cv2 files for the evicted head; cv2 is the
  primary medium for this data.`—the mixed three-tier situation: a suffix
  of the gap comes from WAL files, the evicted head from cv2.
- `historic fill: added N cv2 work list entries ...`—cv2 recovery in
  progress.
- Warnings about over-replication when sending cv2 files: cv2 files are
  compacted, so they contain data beyond the exact recovery window.
  Block-level time filters cut this down, but some over-replication is
  inherent. **These loud warnings are EXPECTED when recovering compacted
  data**—the destination's idempotent writes absorb the duplicates, and
  correctness is unaffected. The warnings exist so you can see the
  bandwidth cost, not because something is wrong.
- `historic fill: MANIFEST GAP — ... no cv2 files found covering the gap —
  POTENTIAL DATA LOSS`—this one is **not** normal. It means data was
  deleted from every tier (WAL, gen0, cv2) before EDR could read it.
  Investigate retention settings.
- `historic fill: completed` / `historic fill: already completed —
  skipping`—done; restart-safe.

During a fill, the metrics API reports `historic_fill_active`,
`gapfill_files_done`, and `gapfill_files_total` so you can track progress.

## Gap fill

Gap fill handles the live-replication analogue of the historic problem: a
WAL file the replicator expected was deleted (snapshotted and evicted)
before it could be sent—typically after a long outage with short WAL
retention. The agent detects the missing WAL ID range, records it in a gap
ledger, and recovers the data through the same tiered matching as historic
fill: snapshot manifests, gen0 files, cv2 files.

Operationally:

- Gaps appear in metrics as `gaps_pending` and in the gap ledger file next
  to the state file. After recovery they are marked resolved.
- **A recovering agent is visibly recovering.** Gaps a round is actively
  working move from `gaps_pending` to `gaps_in_progress` (pending counts
  only untouched gaps), and the round's phases publish progress:
  `gapfill_discovery_candidates` / `gapfill_discovery_scanned` while it
  searches the store for covering files, then `gapfill_files_done` /
  `gapfill_files_total` while it replicates them. If those gauges are
  moving, recovery is working—even when `gaps_resolved_total` hasn't
  ticked yet (gaps settle when their round completes).
- `gapfill_files_vanished_total` counts covering files the server's
  compactor removed mid-recovery (the agent re-discovers their
  replacements automatically). A high rate means recovery is racing
  compaction—expect rounds to take longer.
- Recovery from gen0 is precise. Recovery from cv2 over-replicates (see
  above)—expected, absorbed by idempotent writes.
- If you see gaps regularly, increase `--wal-snapshots-to-keep` on the
  source InfluxDB. See
  [Size WAL retention](/influxdb3/edr/size-wal-retention/); recovery
  from compacted files is a safety net, not the intended steady state.
