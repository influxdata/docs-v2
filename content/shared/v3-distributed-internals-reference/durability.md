## How data flows through {{% product-name %}}

When data is written to {{% product-name %}}, it progresses through multiple stages to ensure durability, optimized performance and storage, and efficient querying. Configuration options at each stage affect system behavior, balancing reliability and resource usage.

{{< svg "/static/svgs/v3-storage-architecture.svg" >}}

<span class="caption">Figure: Write request, response, and ingest flow for {{% product-name %}}</span>

- [How data flows through {{% product-name %}}](#how-data-flows-through--product-name-)
- [Data ingest](#data-ingest)
  1. [Write validation](#write-validation)
  2. [Write-ahead log (WAL) persistence](#write-ahead-log-wal-persistence)
- [Data storage](#data-storage)
- [Data deletion](#data-deletion)
- [Backups](#backups)
- [Recovery](#recovery)

## Data ingest

1. [Write validation and memory buffer](#write-validation-and-memory-buffer)
2. [Write-ahead log (WAL) persistence](#write-ahead-log-wal-persistence)

### Write validation

The [Router](/influxdb3/version/reference/internals/storage-engine/#router) validates incoming data to prevent malformed or unsupported data from entering the system.
{{% product-name %}} writes accepted data to multiple write-ahead-log (WAL) files on local
storage on the [Ingester](/influxdb3/version/reference/internals/storage-engine/#ingester) node before acknowledging the write request.
The Ingester holds the data in memory to ensure leading edge data is available for querying.

### Write-ahead log (WAL) persistence 

The Ingester persists the contents of
the WAL to Parquet files in object storage and updates the [Catalog](/influxdb3/version/reference/internals/storage-engine/#catalog) to
reference the newly created Parquet files.
{{% hide-in "clustered" %}}
Parquet data files in object storage are redundantly stored on multiple devices
across a minimum of three availability zones in a cloud region.
{{% /hide-in %}}

If an Ingester node is gracefully shut down (for example, during a new software deployment), it flushes the contents of the WAL to the Parquet files before shutting down.
{{% product-name %}} retains WALs until the data is persisted to Parquet files in object storage.

## Data storage

In {{< product-name >}}, all measurements are stored in
[Apache Parquet](https://parquet.apache.org/) files that represent a
point-in-time snapshot of the data. The Parquet files are immutable and are
never replaced nor modified. Parquet files are stored in object storage and
referenced in the [Catalog](/influxdb3/version/reference/internals/storage-engine/#catalog), which InfluxDB uses to find the appropriate Parquet files for a particular set of data.

## Data deletion

When data is deleted or expires (reaches the database's [retention period](/influxdb3/version/reference/internals/data-retention/#database-retention-period)), InfluxDB performs the following steps:

1. Marks the associated Parquet files as deleted in the catalog.
2. Filters out data marked for deletion from all queries.
{{% hide-in "clustered" %}}3. Retains Parquet files marked for deletion in object storage for approximately 30 days after the youngest data in the file ages out of retention.{{% /hide-in %}}

## Backups

{{< product-name >}} implements the following data backup strategies:

- **Backup of WAL file**: The WAL file is written on locally attached storage.
  If an ingester process fails, the new ingester simply reads the WAL file on
  startup and continues normal operation. WAL files are maintained until their
  contents have been written to the Parquet files in object storage.
  For added protection, ingesters can be configured for write replication, where
  each measurement is written to two different WAL files before acknowledging
  the write.

- **Backup of Parquet files**: Parquet files are stored in object storage {{% hide-in "clustered" %}}where
  they are redundantly stored on multiple devices across a minimum of three
  availability zones in a cloud region. Parquet files associated with each
  database are kept in object storage for the duration of database retention period
  plus an additional time period (approximately 30 days).{{% /hide-in %}}

- **Backup of catalog**: InfluxData keeps a transaction log of all recent updates
  to the [InfluxDB catalog](/influxdb3/version/reference/internals/storage-engine/#catalog) and generates a daily backup of
  the catalog. {{% hide-in "clustered" %}}Backups are preserved for at least 30 days in object storage across a minimum of three availability zones.{{% /hide-in %}}

{{% hide-in "clustered" %}}
## Recovery

InfluxData can perform the following recovery operations:

- **Recovery after ingester failure**: If an ingester fails, a new ingester is
  started up and reads from the WAL file for the recently ingested data.

- **Recovery of Parquet files**: {{< product-name >}} uses the provided object
  storage data durability to recover Parquet files.

- **Recovery of the catalog**: InfluxData can restore the [Catalog](/influxdb3/version/reference/internals/storage-engine/#catalog) to
  the most recent daily backup and then reapply any transactions
  that occurred since the interruption.
{{% /hide-in %}}
