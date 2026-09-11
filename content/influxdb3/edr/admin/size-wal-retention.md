---
title: Size WAL retention
description: >
  Size InfluxDB's WAL retention to your expected outage windows, and use
  EDR's optional WAL cleanup to bound the storage cost.
menu:
  influxdb3_edr:
    name: Size WAL retention
    parent: Manage
weight: 106
---

WAL retention on the **source** InfluxDB 3 Enterprise server is the primary
knob that determines whether EDR replicates from WAL files (fast, precise)
or falls back to slower compacted-file recovery after an outage. This page
covers sizing that retention and, if the resulting WAL buildup becomes a
storage concern, using EDR's optional WAL cleanup to bound it.

## Why retention matters

The InfluxDB flag `--wal-snapshots-to-keep` (spelled
`--pt-wal-snapshots-to-keep` on InfluxDB 3.10.x) controls how many WAL
snapshots are retained before deletion:

```
retention_window ~= snapshots_to_keep x snapshot_interval (~10-20s)
```

| `--wal-snapshots-to-keep` | Approximate retention window |
|--------------|---------------|
| 5 *(InfluxDB default)* | ~1-2 minutes |
| 100 | ~17-33 minutes |
| 1,000 | ~3-6 hours |
| 10,000 | ~28-56 hours |
| 100,000 | ~12-23 days |

The InfluxDB default (5) is only about one to two minutes of retention—with
it, any agent restart or network interruption longer than that sends EDR to
compacted-file recovery. EDR is **correct** either way—delivery is
at-least-once regardless, and data that outlives WAL retention is recovered
from the compacted files (see
[Historic fill](/influxdb3/edr/admin/monitor/#historic-fill) and
[Gap fill](/influxdb3/edr/admin/monitor/#gap-fill)). But EDR is *better*
with sized retention: WAL replication is precise and cheap, recovery from
cv2 is slower and replicates more bytes than strictly necessary.

**Size retention to exceed your maximum expected outage plus margin.** WAL
files are compact (about 3x smaller than gen0), so generous retention is
cheap: a source ingesting 1 MB/s needs about 86 GB for 24 hours of WAL
retention.

If you see gaps regularly (`gaps_pending` in metrics), increase
`--wal-snapshots-to-keep` on the source InfluxDB—recovery from compacted
files is a safety net, not the intended steady state.

## WAL cleanup (optional stop-gap)

The trade-off: generous retention also means WAL files linger long after EDR
has replicated them. EDR reads WAL files from the source object store; the
**source server** owns their lifecycle and deletes them once they've been
rolled into gen0 (governed by `--wal-snapshots-to-keep`). If you raise that
retention so EDR has a wide replication window, WAL files can accumulate
well past the point EDR has already replicated them.

`--wal-cleanup-enabled` turns on an **opt-in, in-agent** sweep that deletes
already-replicated WAL files itself. It is a **temporary stop-gap** until
the source server can honor a cleanup *hold* requested by EDR; leave it
**off** unless WAL buildup is a problem, because deleting source WAL is
destructive.

```
influxdb3-edr ... --wal-cleanup-enabled \
  --wal-cleanup-interval-secs 300 \
  --wal-cleanup-snapshot-margin 100
```

| Flag | Default | Description |
|---|---|---|
| `--wal-cleanup-enabled` | `false` | Enable agent-side deletion of already-replicated WAL files. |
| `--wal-cleanup-interval-secs` | `300` | How often the cleanup sweep runs. |
| `--wal-cleanup-snapshot-margin` | `100` | WAL files to keep below the last snapshotted WAL id—the safety margin behind the snapshot boundary. |
| `--wal-cleanup-max-destination-hold` | unbounded | Fan-out only: a destination whose cursor hasn't advanced for this long (`"7d"`, `"12h"`, `"30m"`) stops holding the cleanup floor; it recovers the evicted range via gap fill when it returns (over-replication, never loss). Unset = a down destination pins WAL indefinitely. |

When enabled, every `--wal-cleanup-interval-secs` (default 5 minutes) the
agent deletes WAL files for each source node **only below the lowest of
four floors**, so it can never strand anything that still needs them:

1. **The replication cursor**—only files EDR has already replicated. (This
   also means cleanup can never make a not-yet-replicated file look
   "missing" and trigger a false gap.)
2. **The snapshot boundary minus `--wal-cleanup-snapshot-margin`**—WAL
   above the source's last snapshot is not yet in gen0, so the source node
   itself still needs it to recover. The margin (default 100 files) keeps a
   safety buffer below that boundary.
3. **The historic-fill consumed floor**—historic fill reads older WAL
   during backfill; cleanup stays below what it still needs (and does
   nothing until historic fill's plan exists).
4. **The agent's own pipeline floor**—the oldest WAL file still queued or
   in flight in the agent, plus any range still unresolved in the gap
   ledger. The replication cursor alone is not a safe bound for the agent's
   own input: skip receipts can advance it past still-queued files, and
   without this floor a sufficiently-lagged agent could delete its own
   unprocessed backlog—a silent, unrecoverable shortfall.

With **multiple destinations** the first, third, and fourth floors are the
**min across every destination**—WAL is retained for the most-behind
consumer. A destination that is down therefore pins WAL indefinitely by
default; `--wal-cleanup-max-destination-hold` bounds that: a destination
whose cursor hasn't advanced within the hold stops holding the floor (one
loud WARN naming it), and when it returns it recovers the evicted range from
gen0/cv2 via gap fill—the standard over-replication trade, never loss.

Deletion is by WAL-id range (no object-store listing) and resumes from a
persisted per-node watermark, so steady-state sweeps only touch the small
new increment. Normal sweeps log at debug; a sweep that deletes files logs
one info line per node (`wal cleanup: deleted replicated WAL files`, with
the watermark and the four floors); delete errors warn and the watermark is
held (retried next sweep).

> [!Note]
> `edr_upstream_wal_files_deleted_total` is an **agent-level** count
> (cleanup is one task for the whole source), mirrored onto every
> destination's series—don't sum it across the `destination` label, that
> multiplies the real count by the number of destinations.

Operationally:

- Leave it off unless WAL buildup is an actual problem; sizing
  `--wal-snapshots-to-keep` appropriately is the first lever.
- After enabling, confirm `gaps_pending` / `wal_files_lost_total` stay flat—
  cleanup is designed never to create gaps; a rise is a signal to
  investigate, not expected.
