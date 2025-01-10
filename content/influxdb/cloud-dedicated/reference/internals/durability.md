---
title: InfluxDB Cloud Dedicated data durability
description: >
  InfluxDB Cloud Dedicated replicates all time series data in the storage tier across
  multiple availability zones within a cloud region and automatically creates backups
  that can be used to restore data in the event of a node failure or data corruption.
weight: 102
menu:
  influxdb_cloud_dedicated:
    name: Data durability
    parent: InfluxDB internals
influxdb/cloud-dedicated/tags: [backups, internals]
related:
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html, AWS S3 Data Durabililty
  - /influxdb/cloud-dedicated/reference/internals/storage-engine/
---

{{< product-name >}} writes data to multiple Write-Ahead-Log (WAL) files on local
storage and retains WALs until the data is persisted to Parquet files in object storage.
Parquet data files in object storage are redundantly stored on multiple devices
across a minimum of three availability zones in a cloud region.

## Data storage

In {{< product-name >}}, all measurements are stored in
[Apache Parquet](https://parquet.apache.org/) files that represent a
point-in-time snapshot of the data. The Parquet files are immutable and are
never replaced nor modified. Parquet files are stored in object storage and
referenced in the [Catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog), which InfluxDB uses to find the appropriate Parquet files for a particular set of data.

### Data deletion

When data is deleted or expires (reaches the database's [retention period](/influxdb/cloud-dedicated/reference/internals/data-retention/#database-retention-period)), InfluxDB performs the following steps:

1. Marks the associated Parquet files as deleted in the catalog.
2. Filters out data marked for deletion from all queries.
3. Retains Parquet files marked for deletion in object storage for approximately 30 days after the youngest data in the file ages out of retention.

## Data ingest

When data is written to {{< product-name >}}, InfluxDB first writes the data to a
Write-Ahead-Log (WAL) on locally attached storage on the [Ingester](/influxdb/cloud-dedicated/reference/internals/storage-engine/#ingester) node before
acknowledging the write request. After acknowledging the write request, the
Ingester holds the data in memory temporarily and then writes the contents of
the WAL to Parquet files in object storage and updates the [Catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog) to
reference the newly created Parquet files. If an Ingester node is gracefully shut
down (for example, during a new software deployment), it flushes the contents of
the WAL to the Parquet files before shutting down.

## Backups

{{< product-name >}} implements the following data backup strategies:

- **Backup of WAL file**: The WAL file is written on locally attached storage.
  If an ingester process fails, the new ingester simply reads the WAL file on
  startup and continues normal operation. WAL files are maintained until their
  contents have been written to the Parquet files in object storage.
  For added protection, ingesters can be configured for write replication, where
  each measurement is written to two different WAL files before acknowledging
  the write.

- **Backup of Parquet files**: Parquet files are stored in object storage where
  they are redundantly stored on multiple devices across a minimum of three
  availability zones in a cloud region. Parquet files associated with each
  database are kept in object storage for the duration of database retention period
  plus an additional time period (approximately 30 days).

- **Backup of catalog**: InfluxData keeps a transaction log of all recent updates
  to the [InfluxDB catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog) and generates a daily backup of
  the catalog. Backups are preserved for at least 30 days in object storage across a minimum
  of three availability zones.

## Recovery

InfluxData can perform the following recovery operations:

- **Recovery after ingester failure**: If an ingester fails, a new ingester is
  started up and reads from the WAL file for the recently ingested data.

- **Recovery of Parquet files**: {{< product-name >}} uses the provided object
  storage data durability to recover Parquet files.

- **Recovery of the catalog**: InfluxData can restore the [Catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog) to
  the most recent daily backup and then reapply any transactions
  that occurred since the interruption.
