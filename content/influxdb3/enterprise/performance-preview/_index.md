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
  - /influxdb3/enterprise/performance-preview/configure/
  - /influxdb3/enterprise/performance-preview/monitor/
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
These upgrades touch every layer of the storage path—from a new on-disk file
format to how fields are organized into column families and how compaction
manages resources.

## Why these upgrades

The existing InfluxDB 3 storage layer uses [Apache Parquet](https://parquet.apache.org/)
and is optimized for analytical workloads.
Customers running high-cardinality, wide-schema, and query-intensive workloads
need better single-series query performance, more predictable resource usage,
and the schema flexibility that made InfluxDB v1 and v2 popular.
These upgrades extend the storage layer to support those workloads while
maintaining full compatibility with InfluxDB 3's data model and query languages.

Key improvements include:

- **Faster single-series queries**: Single-digit millisecond response times
  for highly selective time-series queries.
- **Consistent resource usage**: Bounded CPU and memory during persistence
  and compaction, eliminating spikes during heavy ingestion or compaction bursts.
- **Wide-and-sparse table support**: Schemas with up to millions of columns
  and dynamic schema evolution without expensive rewrites.
- **Column families**: Group related fields for efficient compression and I/O,
  so queries only read the data they need.
- **Bulk data export**: Export compacted data as Parquet files for use with
  external tools.
- **Automatic Parquet upgrade**: Seamlessly migrate existing data with
  hybrid query mode during the transition.

## Enable the preview

Include the `--use-pacha-tree` flag in your
[`influxdb3 serve` startup command](/influxdb3/enterprise/get-started/setup/):

{{< code-callout "--use-pacha-tree" >}}
```bash
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --use-pacha-tree
```
{{< /code-callout >}}

You can also enable the preview with an environment variable:

```bash
export INFLUXDB3_ENTERPRISE_USE_PACHA_TREE=true
influxdb3 serve ...
```

The `--use-pacha-tree` flag exposes additional configuration options prefixed
with `--pt-`.
See [Configure the preview](/influxdb3/enterprise/performance-preview/configure/)
for tuning options, or
[Monitor the preview](/influxdb3/enterprise/performance-preview/monitor/)
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

These upgrades touch every layer of the storage path—from the on-disk file
format to how data is compressed, organized, and compacted.

### New file format

Data is stored in a new columnar file format (`.pt` files) optimized for
time-series workloads.
All data within a file is sorted by column family key,
[series key](/influxdb3/enterprise/reference/glossary/#series-key), and
timestamp, which enables efficient compaction, querying, and filtering.

The format uses type-specific compression algorithms that adapt to data
characteristics—delta-delta RLE for timestamps, Gorilla encoding for floats,
dictionary encoding for low-cardinality strings, and more—typically
achieving 5-20x compression ratios.

### Column families

Column families let you group related fields together so that queries only read
the data they need.
Fields in the same family are stored together on disk.
For wide tables with hundreds of fields, this dramatically reduces I/O.

When writing [line protocol](/influxdb3/enterprise/reference/line-protocol/), use the `::` (double-colon) delimiter in field
names to assign fields to a family.
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

Incoming writes are buffered in the WAL, flushed to snapshots, and then merged
into [Gen0 files](/influxdb3/enterprise/performance-preview/configure/#gen0).
The upgraded storage layer organizes compacted data into 24-hour UTC windows
and progresses Gen0 files through four [compaction levels (L1 through L4)](/influxdb3/enterprise/performance-preview/configure/#l1-l4-level-tuning).
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

## Downgrade to Parquet

If you need to revert from the performance preview back to standard Parquet
storage, use the `influxdb3 downgrade-to-parquet` command.
This command updates the catalog and deletes all PachaTree-specific files from
object storage.

> [!Note]
> #### Downgrade impacts
>
> The downgrade deletes all `.pt` files, including data written
> after the upgrade.
> **Only data that existed before the upgrade (original Parquet files) is preserved.**
> You can re-enable the preview later by restarting with `--use-pacha-tree`.

### Before you downgrade

1. **Stop all nodes** in the cluster before running the downgrade command.
   The command checks for running nodes and refuses to proceed if any are active.

   ```bash
   influxdb3 stop node --node-id <NODE_ID>
   ```

2. **Verify table compatibility.**
   The downgrade validates that all tables can be represented in Parquet format.
   Tables that exceed the Parquet column limit or contain columns without legacy
   Parquet column IDs block the downgrade.

### Preview the downgrade

Use the `--dry-run` flag to list files that would be deleted without making
any changes:

```bash
influxdb3 downgrade-to-parquet \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --dry-run
```

### Run the downgrade

```bash
influxdb3 downgrade-to-parquet \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3
```

After the downgrade completes, restart nodes without the `--use-pacha-tree` flag
to resume standard Parquet storage mode.

For all available options, see
[Downgrade options](/influxdb3/enterprise/performance-preview/configure/#downgrade-options).

## Export to Parquet

You can export compacted data as Parquet files for use with external tools.

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
