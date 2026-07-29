<!--  -->
{{% show-in "core" %}}
{{% product-name %}} always writes and stores data using the Parquet
storage engine—see [Data durability](/influxdb3/core/reference/internals/durability/)
for how data flows from write to Parquet persistence.
InfluxDB 3 Enterprise also offers an upgraded storage engine as an
alternative; {{% product-name %}} does not include it.
{{% /show-in %}}

{{% show-in "enterprise" %}}
> [!Important]
> #### The upgraded storage engine is the default for new clusters
> New {{% product-name %}} clusters default to the upgraded storage
> engine—no flag is required.
> Clusters that started on 3.10 or earlier keep the Parquet engine until you
> run the storage engine upgrade by restarting the cluster with
> [`--upgrade-pacha-tree`](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree).

## What is the storage engine upgrade?

{{% product-name %}} includes major upgrades to the storage layer that
improve how data is written, stored, compressed, compacted, and queried.
These upgrades touch every layer of the storage path—from a new on-disk
file format to how fields are organized into column families and how
compaction manages resources (see
[Upgraded storage engine compaction](/influxdb3/enterprise/reference/internals/durability/#upgraded-storage-engine-compaction)
for the compaction model).

## Why these upgrades

The existing InfluxDB 3 storage layer uses [Apache Parquet](https://parquet.apache.org/)
and is optimized for analytical workloads.
Customers running high-cardinality, wide-schema, and query-intensive
workloads need better single-series query performance, more predictable
resource usage, and the schema flexibility that made InfluxDB v1 and v2
popular.
These upgrades extend the storage layer to support those workloads while
maintaining full compatibility with InfluxDB 3's data model and query
languages.

Key improvements include:

- **Faster single-series queries**: Optimized for highly selective
  time-series queries.
- **Resource usage**: Bounded CPU and memory during persistence and
  compaction, using a fixed memory budget instead of unbounded growth
  during heavy ingestion or compaction.
- **Wide-and-sparse table support**: Schemas with up to millions of columns
  and dynamic schema evolution without full-table rewrites.
- **Column families**: Group related fields together on disk, so queries
  only read the data they need.
- **Bulk data export**: Export compacted data as Parquet files for use with
  external tools.
- **Automatic Parquet upgrade**: Existing data migrates automatically;
  hybrid query mode covers reads during the transition.

## Run the storage engine upgrade

New clusters use the upgraded storage engine by default and do not need any
flag.

For clusters that started on 3.10 or earlier (Parquet engine), run the
storage engine upgrade by including the `--upgrade-pacha-tree` flag in your
[`influxdb3 serve` startup command](/influxdb3/enterprise/get-started/setup/):

```bash { callout="--upgrade-pacha-tree" }
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --upgrade-pacha-tree
```

You can also trigger the upgrade with an environment variable:

```bash
export INFLUXDB3_UPGRADE_PACHA_TREE=true
influxdb3 serve ...
```

> [!Note]
>
> #### Upgrading the storage engine
>
> The `--use-pacha-tree` flag and the `INFLUXDB3_USE_PACHA_TREE` and
> `INFLUXDB3_ENTERPRISE_USE_PACHA_TREE` environment variables are
> deprecated.
> They are still accepted and start the same migration, but the server
> logs a deprecation warning at startup.

See [Storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/)
for tuning options, or
[Query system data](/influxdb3/enterprise/admin/query-system-data/#query-storage-engine-tables)
for system tables and telemetry.

> [!Warning]
>
> #### Existing clusters with Parquet data
>
> On clusters with existing Parquet data, running the storage engine upgrade
> **automatically converts Parquet files to `.pt` format** on startup, which
> consumes additional CPU and memory while the migration runs.
> Queries continue to work normally during this period.
> See [Upgrade from Parquet](#upgrade-from-parquet) for details.
>
> Before you upgrade a production cluster, test the storage engine upgrade in
> a staging or test environment first.

## What's changed

These upgrades touch every layer of the storage path—from the on-disk file
format to how data is compressed and organized.

### New file format

Data is stored in a new columnar file format (`.pt` files) optimized for
time-series workloads.
All data within a file is sorted by column family key,
[series key](/influxdb3/enterprise/reference/glossary/#series-key), and
timestamp, which enables efficient compaction, querying, and filtering.

The format uses type-specific compression algorithms that adapt to data
characteristics—delta-delta RLE for timestamps, Gorilla encoding for
floats, dictionary encoding for low-cardinality strings, and more.

### Column families

Column families let you group related fields together so that queries only
read the data they need.
Fields in the same family are stored together on disk.
For wide tables with hundreds of fields, this dramatically reduces I/O.

When writing [line protocol](/influxdb3/enterprise/reference/line-protocol/),
use the `::` (double-colon) delimiter in field names to assign fields to a
family.
The portion before `::` is the family name; everything after is the field
name.

```txt
metrics,host=sA cpu::usage_user=55.2,cpu::usage_sys=12.1,cpu::usage_idle=32.7 1000000000
metrics,host=sA mem::free=2048i,mem::used=6144i,mem::cached=1024i 1000000000
metrics,host=sA disk::read_bytes=50000i,disk::write_bytes=32000i 1000000000
```

This creates three column families:

| Family | Fields                                  |
| :----- | :--------------------------------------- |
| `cpu`  | `usage_user`, `usage_sys`, `usage_idle` |
| `mem`  | `free`, `used`, `cached`                |
| `disk` | `read_bytes`, `write_bytes`             |

When a query references only `mem::free`, the storage layer reads only the
`mem` family block and skips `cpu` and `disk` data entirely.

> [!Note]
> Only the first `::` is significant.
> A field name like `a::b::c` creates family `a` with field `b::c`.

Fields written without `::` are assigned to auto-generated families (named
`__0`, `__1`, etc.), each holding up to 100 fields.

## Upgrade from Parquet

Existing clusters with Parquet data can upgrade with zero manual migration.
The upgrade is fully automatic and occurs on initial startup.

When you restart a cluster with `--upgrade-pacha-tree`, the system:

1. Detects existing Parquet data and enters hybrid mode.
2. Clears the legacy WAL on ingest nodes and streams Parquet files through
   a conversion pipeline.
3. Integrates converted files into the new storage format through
   compaction.
4. Automatically transitions once all data is migrated.

During hybrid mode, queries merge results from both the legacy and upgraded
storage layers.
If there is a conflict (same series key and timestamp), the upgraded data
takes precedence.

After the upgrade completes, Parquet engine options remaining in your
configuration—including options you may have relied on long before the
upgrade—no longer have any effect.
On the next server start following completion of the upgrade, each one
logs a warning indicating it can be removed.
Use the startup log as a checklist for cleaning up your configuration.

To monitor upgrade progress, see
[Query system data](/influxdb3/enterprise/admin/query-system-data/#query-storage-engine-tables).

## Downgrade to Parquet

If you need to revert an upgraded cluster back to standard Parquet
storage, use the `influxdb3 downgrade-to-parquet` command.
This command updates the catalog and deletes all files specific to the
upgraded storage engine from object storage.

> [!Note]
>
> #### Downgrade impacts
>
> The downgrade deletes all `.pt` files, including data written
> after the upgrade.
> **Only data that existed before the upgrade (original Parquet files) is
> preserved.**
> You can run the storage engine upgrade again later by restarting with
> `--upgrade-pacha-tree`.

Before you downgrade:

1. **Stop all nodes** in the cluster before running the downgrade command.
   The command checks for running nodes and refuses to proceed if any are
   active.

   ```bash
   influxdb3 stop node --node-id <NODE_ID>
   ```

2. **Verify table compatibility.**
   The downgrade validates that all tables can be represented in Parquet
   format.
   Tables that exceed the Parquet column limit or contain columns without
   legacy Parquet column IDs block the downgrade.

Use the `--dry-run` flag to preview the downgrade—list files that would be
deleted without making any changes:

```bash
influxdb3 downgrade-to-parquet \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --dry-run
```

Run the downgrade:

```bash
influxdb3 downgrade-to-parquet \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3
```

After the downgrade completes, restart nodes without the
`--upgrade-pacha-tree` flag to resume standard Parquet storage mode.

For all available options, see
[Storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/#downgrade-options).

## Export to Parquet

You can export compacted data as Parquet files for use with external
tools.

> [!Note]
> Data must be compacted before it can be exported.
> Uncompacted data is not available for export at this time.

```bash
# Step 1: List available databases
influxdb3 export databases

# Step 2: List tables in a database
influxdb3 export tables --database mydb

# Step 3: List compacted 24-hour windows for a table
influxdb3 export windows --database mydb --table cpu

# Step 4: Export data as Parquet files
influxdb3 export data \
  --database mydb \
  --table cpu \
  --output-dir ./export_output
```

To export specific time windows only:

```bash
influxdb3 export data \
  --database mydb \
  --table cpu \
  --window 2026-01-15,2026-01-16 \
  --output-dir ./export_output
```

## Who should upgrade existing clusters

New clusters use the upgraded storage engine by default.
If your cluster started on 3.10 or earlier and still runs the Parquet
engine, the storage engine upgrade especially benefits workloads with:

- High cardinality or wide tables
- Frequent backfill across time ranges
- Query-heavy access patterns requiring low latency
- Sparse schemas with dynamic column creation
- Resource constraints where bounded memory and CPU usage matter
{{% /show-in %}}
