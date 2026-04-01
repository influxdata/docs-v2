---
title: Performance upgrade preview
seotitle: Performance upgrade preview for InfluxDB 3 Enterprise
description: >
  Preview performance upgrades in InfluxDB 3 Enterprise with improved
  single-series query performance, consistent resource usage, wide-and-sparse
  table support, column families, and bulk data export.
menu:
  influxdb3_enterprise:
    name: Performance upgrade preview
weight: 12
influxdb3/enterprise/tags: [storage, performance, beta, preview]
related:
  - /influxdb3/enterprise/get-started/setup/
  - /influxdb3/enterprise/admin/pachatree/configure/
  - /influxdb3/enterprise/admin/pachatree/monitor/
  - /influxdb3/enterprise/admin/performance-tuning/
---

> [!Warning]
> #### Performance preview beta
> The performance upgrade preview is available to {{% product-name %}} Trial
> and Commercial users as a beta. These features are subject to breaking changes
> and **should not be used for production workloads**.
>
> To share feedback on this preview, see [Support and feedback options](#bug-reports-and-feedback).
> Your feedback on stability
> and performance at scale helps shape the future of InfluxDB 3.

## What is the performance upgrade preview?

{{% product-name %}} includes a preview of major upgrades to the
storage layer that improve how data is written, stored, compressed, compacted,
and queried.
These upgrades touch every layer of the storage path--from a new on-disk file
format to how fields are organized into column families and how compaction
manages resources.

## Why these upgrades

The existing storage layer in InfluxDB 3 was built around Apache Parquet and
optimized for analytical workloads.
Customers running high-cardinality, wide-schema, and query-intensive workloads
need better single-series query performance, more predictable resource usage,
and the schema flexibility that made InfluxDB v1 and v2 popular.
These upgrades address those gaps while maintaining full compatibility with
InfluxDB 3's data model and query languages.

Key improvements include:

- **Faster single-series queries** -- Single-digit millisecond response times
  for highly selective time-series queries.
- **Consistent resource usage** -- Bounded CPU and memory during persistence
  and compaction, eliminating spikes during heavy ingestion or compaction bursts.
- **Wide-and-sparse table support** -- Schemas with up to millions of columns
  and dynamic schema evolution without expensive rewrites.
- **Column families** -- Group related fields for efficient compression and I/O,
  so queries only read the data they need.
- **Bulk data export** -- Export compacted data as Parquet files for use with
  external tools.
- **Automatic Parquet upgrade** -- Seamlessly migrate existing data with
  hybrid query mode during the transition.

## Enable the preview

Add the `--use-pacha-tree` flag to your
[`influxdb3 serve` startup command](/influxdb3/enterprise/get-started/setup/):

```bash
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --use-pacha-tree
```

You can also enable the preview with an environment variable:

```bash
export INFLUXDB3_ENTERPRISE_USE_PACHA_TREE=true
influxdb3 serve ...
```

The `--use-pacha-tree` flag exposes additional configuration options prefixed
with `--pt-`.
See [Configure the preview](/influxdb3/enterprise/admin/pachatree/configure/)
for tuning options, or
[Monitor the preview](/influxdb3/enterprise/admin/pachatree/monitor/)
for system tables and telemetry.

> [!Warning]
> #### Existing clusters with Parquet data
>
> On clusters with existing Parquet data, enabling `--use-pacha-tree`
> **automatically converts Parquet files to `.pt` format** on startup, which
> consumes additional CPU and memory while the migration runs.
> Queries continue to work normally during this period.
> See [Upgrade from Parquet](#upgrade-from-parquet) for details.
>
> For the beta, we recommend enabling the preview with a fresh cluster in a
> staging or test environment first.

## What's changed

These upgrades touch every layer of the storage path -- from the on-disk file
format to how data is compressed, organized, and compacted.

### New file format

Data is stored in a new columnar file format (`.pt` files) optimized for
time-series workloads.
All data within a file is sorted by column family key, series key, and
timestamp, which enables efficient compaction, querying, and filtering.

The format uses type-specific compression algorithms that adapt to data
characteristics -- delta-delta RLE for timestamps, Gorilla encoding for floats,
dictionary encoding for low-cardinality strings, and more -- typically
achieving 5-20x compression ratios.

### Column families

Column families let you group related fields together so that queries only read
the data they need.
Fields in the same family are stored together on disk.
For wide tables with hundreds of fields, this dramatically reduces I/O.

Use the `::` (double-colon) delimiter in field names to assign fields to a
family.
The portion before `::` is the family name; everything after is the field name.

```txt
metrics,host=sA cpu::usage_user=55.2,cpu::usage_sys=12.1,cpu::usage_idle=32.7 1000000000
metrics,host=sA mem::free=2048i,mem::used=6144i,mem::cached=1024i 1000000000
metrics,host=sA disk::read_bytes=50000i,disk::write_bytes=32000i 1000000000
```

This creates three column families:

| Family | Fields |
|:-------|:-------|
| `cpu` | `usage_user`, `usage_sys`, `usage_idle` |
| `mem` | `free`, `used`, `cached` |
| `disk` | `read_bytes`, `write_bytes` |

When a query references only `mem::free`, the storage layer reads only the
`mem` family block and skips `cpu` and `disk` data entirely.

> [!Note]
> Only the first `::` is significant.
> A field name like `a::b::c` creates family `a` with field `b::c`.

Fields written without `::` are assigned to auto-generated families (named
`__0`, `__1`, etc.), each holding up to 100 fields.
Explicit family names are an excellent way to optimize performance with known
workloads, but they're not required to achieve good results.

### Bounded compaction

The upgraded storage layer organizes compacted data into 24-hour UTC windows
and progresses data through four compaction levels (L1 through L4).
Compaction runs continuously in the background with a byte-based memory budget
(default: 50% of system RAM), so it never causes resource spikes.

Old files are cleaned up after a cooldown period, ensuring query replicas have
time to see new checkpoints before old data is removed.
Failures are automatically retried, and the system is designed to be
self-healing for transient issues.

## Upgrade from Parquet

Existing clusters with Parquet data can upgrade with zero manual migration.
The upgrade is fully automatic and occurs on initial startup.

When you restart a cluster with `--use-pacha-tree`, the system:

1. Detects existing Parquet data and enters hybrid mode.
2. Clears the legacy WAL on ingest nodes and streams Parquet files through a
   conversion pipeline.
3. Integrates converted files into the new storage format through compaction.
4. Automatically transitions once all data is migrated.

During hybrid mode, queries merge results from both the legacy and upgraded
storage layers.
If there is a conflict (same series key and timestamp), the upgraded data takes
precedence.

### Monitor upgrade progress

Use system tables to track upgrade status:

```sql
-- Per-node upgrade status
SELECT * FROM system.upgrade_parquet_node

-- Per-file migration progress
SELECT * FROM system.upgrade_parquet
```

### Configure upgrade behavior

| Option | Description | Default |
|:-------|:------------|:--------|
| `--pt-disable-hybrid-query` | Disable hybrid query mode. Queries return only data from the upgraded storage layer, even during migration. | `false` |
| `--pt-upgrade-poll-interval` | Polling interval for upgrade status monitoring. | `5s` |

## Export to Parquet

Export compacted data as Parquet files for use with external tools like pandas
or DuckDB.

> [!Note]
> Data must be compacted before it can be exported.
> Uncompacted data is not available for export at this time.

### Export workflow

```bash
# Step 1: List available databases
influxdb3 export databases

# Step 2: List tables in a database
influxdb3 export tables -d mydb

# Step 3: List compacted 24-hour windows for a table
influxdb3 export windows -d mydb -t cpu

# Step 4: Export data as Parquet files
influxdb3 export data -d mydb -t cpu -o ./export_output
```

To export specific time windows only:

```bash
influxdb3 export data -d mydb -t cpu -w 2026-01-15,2026-01-16 -o ./export_output
```

## Who should try the preview

Consider enabling the preview in your staging or development environment if
you have workloads with:

- High cardinality or wide tables
- Frequent backfill across time ranges
- Query-heavy access patterns requiring low latency
- Sparse schemas with dynamic column creation
- Resource constraints where bounded memory and CPU usage matter

> [!Important]
> #### Important: New file format
>
> These upgrades use a new columnar file format (`.pt` files).
> When you enable the preview, new data is written in the new format.
> Hybrid query mode (enabled by default) allows querying across both legacy
> Parquet data and new `.pt` data seamlessly.
>
> For the beta, we recommend starting with a fresh setup for
> testing and evaluation rather than converting existing data.

## Bug reports and feedback

To share feedback on the performance upgrade preview:

- Contact [InfluxData support](https://support.influxdata.com)
- Reach out to your InfluxData account team

Your feedback on stability and performance at scale helps shape the future of
InfluxDB 3.

{{< children hlevel="h2" readmore=true hr=true >}}
