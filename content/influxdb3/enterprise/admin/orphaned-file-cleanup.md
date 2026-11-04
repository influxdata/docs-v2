---
title: Orphaned file cleanup
seotitle: Orphaned file cleanup for the InfluxDB 3 Enterprise upgraded storage engine
description: >
  Learn how InfluxDB 3 Enterprise finds and deletes compacted files that
  nothing references, when cleanup passes run, and how to inspect cleanup
  activity with the influxdb3 debug sweep and influxdb3 debug
  verify-references commands.
menu:
  influxdb3_enterprise:
    name: Orphaned file cleanup
    parent: Administer InfluxDB
weight: 109
related:
  - /influxdb3/enterprise/admin/distributed-compaction/
  - /influxdb3/enterprise/reference/cli/influxdb3/debug/sweep/
  - /influxdb3/enterprise/reference/cli/influxdb3/debug/verify-references/
  - /influxdb3/enterprise/reference/internals/storage-engine/
influxdb3/enterprise/tags: [compaction, storage, maintenance]
---

{{% product-name %}} clusters running the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
automatically find and delete compacted files in object storage that
nothing published references, known as **orphaned files**.
Compaction writes output files and then publishes references to them; a
crash, a lease change, or a superseded write between those two steps can
leave files that nothing ever references.
Orphaned file cleanup, also called the orphan sweep, is what reclaims that
storage over time.

Orphaned file cleanup runs only on the primary compactor, the same node
that plans and dispatches compaction work.
With [distributed compaction](/influxdb3/enterprise/admin/distributed-compaction/)
enabled, orphaned files also come from ordinary distributed-tier failure
handling, such as a worker that dies mid-job, so cleanup is part of running
that feature safely.

- [What gets deleted](#what-gets-deleted)
- [Grace period](#grace-period)
- [Cadence and the first pass](#cadence-and-the-first-pass)
- [Dry run and turning cleanup off](#dry-run-and-turning-cleanup-off)
- [Restores pause cleanup](#restores-pause-cleanup)
- [Inspect cleanup passes](#inspect-cleanup-passes)

## What gets deleted

A cleanup pass only considers objects under the prefixes the compactor
writes run-set data and index files to.
Ingest snapshots, the write-ahead log, the catalog, import staging, the
compactor lease, and checkpoints are never candidates, because each has
its own lifecycle and its own owner.

Within that scope, an object is a deletion candidate only when it's both:

- **Unreferenced**: absent from the published checkpoint, the delete queue,
  every table or shard with in-flight or committed-but-unpublished work,
  and every run-set ID reserved by an outstanding compaction job.
- **Past the grace period**: its object store `last_modified` timestamp is
  older than the pass's grace window (see [Grace period](#grace-period)).

## Grace period

Objects modified more recently than the grace period are never deletion
candidates, no matter what else is true about them.
The grace period defaults to `24h` and has a floor of `6h`:

| Option | Default | Notes |
| :----- | :------ | :---- |
| `--compactor-sweep-grace` | `24h` | Values below `6h` are raised to `6h`. Environment variable: `INFLUXDB3_COMPACTOR_SWEEP_GRACE` |

The grace period is a backstop, not the primary safety mechanism, since
in-flight work is already protected because it's tracked as referenced.
The grace period mainly absorbs clock skew between the primary and the
object store, and gives lingering multipart uploads time to complete.

## Cadence and the first pass

A scheduled cleanup pass runs every `7d` by default:

| Option | Default | Notes |
| :----- | :------ | :---- |
| `--compactor-sweep-interval` | `7d` | Set to `off` to disable scheduled passes. Environment variable: `INFLUXDB3_COMPACTOR_SWEEP_INTERVAL` |

The **first pass on a 3.12 cluster starts a few minutes after the primary
compactor starts**, rather than waiting a full interval, because no prior
pass is recorded yet.
After that, passes repeat on the configured interval.

The cadence survives restarts: if the newest recorded pass is older than
the interval, a pass fires on the next startup check, and an unfinished
scheduled pass resumes automatically instead of waiting out the full
interval.

Audit-trail objects for completed passes are retained for review:

| Option | Default | Notes |
| :----- | :------ | :---- |
| `--compactor-sweep-audit-retention` | `7d` | Older audit objects are deleted as housekeeping at the start of the next pass. Environment variable: `INFLUXDB3_COMPACTOR_SWEEP_AUDIT_RETENTION` |

## Dry run and turning cleanup off

Set the cleanup mode with `--compactor-sweep-mode`:

| Option | Default | Notes |
| :----- | :------ | :---- |
| `--compactor-sweep-mode` | `armed` | `armed` enqueues candidates into the delete queue, so orphaned files are actually deleted. `dry-run` only records candidates in the audit trail. Environment variable: `INFLUXDB3_COMPACTOR_SWEEP_MODE` |

Use `dry-run` to review what a pass would delete before you trust it to
delete anything.
Compare the candidates it reports against what you expect using
[`influxdb3 debug sweep report`](/influxdb3/enterprise/reference/cli/influxdb3/debug/sweep/report/).

To turn scheduled cleanup off entirely, set:

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  # ...
  --compactor-sweep-interval off
```

## Restores pause cleanup

Cleanup passes don't run while a
[restore](/influxdb3/enterprise/admin/backup-restore/) is in progress.
The compactor holds every delete, including orphaned-file candidates,
until the restore reaches it and completes, so a cleanup pass can never
delete a file a restore just copied back.
A pass that was running when a restore started abandons at its next
segment boundary and picks back up on the next scheduled fire.

## Inspect cleanup passes

Two commands read cleanup activity directly from object storage.
Both are offline and read-only, and neither needs a running
{{% product-name %}} server:

- [`influxdb3 debug sweep list`](/influxdb3/enterprise/reference/cli/influxdb3/debug/sweep/list/)
  names the recorded cleanup passes for a cluster, oldest to newest.
- [`influxdb3 debug sweep report`](/influxdb3/enterprise/reference/cli/influxdb3/debug/sweep/report/)
  reads one pass's audit trail back and summarizes it, or, with `--json`,
  emits the full per-segment detail as a diffable artifact.

A third command checks the opposite direction, confirming that nothing a
checkpoint references is missing, which is useful after an incident or a
migration, independent of whether cleanup ever ran:

- [`influxdb3 debug verify-references`](/influxdb3/enterprise/reference/cli/influxdb3/debug/verify-references/)
  checks that every object the newest compactor checkpoint references
  still exists, and exits nonzero if anything is missing, so you can gate
  automation on its exit code.
