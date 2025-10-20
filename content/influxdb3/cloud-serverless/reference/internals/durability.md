---
title: InfluxDB Cloud Serverless data durability
description: >
  InfluxDB Cloud Serverless replicates all time series data in the storage tier across
  multiple availability zones within a cloud region and automatically creates backups
  that can be used to restore data in the event of a node failure or data corruption.
weight: 102
menu:
  influxdb3_cloud_serverless:
    name: Data durability
    parent: InfluxDB Cloud internals
influxdb3/cloud-serverless/tags: [backups, internals]
related:
  - https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html, AWS S3 Data Durabililty
---

{{< product-name >}} writes data to multiple Write-Ahead-Log (WAL) files on local
storage and retains WALs until the data is persisted to Parquet files in object storage.
Parquet data files in object storage are redundantly stored on multiple devices
across a minimum of three availability zones in a cloud region.

## Data storage

In {{< product-name >}}, all measurements are stored in
[Apache Parquet](https://parquet.apache.org/) files that represent a
point-in-time snapshot of the data. The Parquet files are immutable and are
never replaced nor modified. Parquet files are stored in object storage.

<span id="influxdb-catalog"></span>
The _InfluxDB catalog_ is a relational, PostgreSQL-compatible database that
contains references to all Parquet files in object storage and is used as an
index to find the appropriate Parquet files for a particular set of data.

### Data deletion

When data is deleted or when the retention period is reached for data within
a database, the associated Parquet files are marked as deleted _in the catalog_,
but the actual Parquet files are _not removed from object storage_.
All queries filter out data that has been marked as deleted.
Parquet files remain in object storage for approximately 100 days after the
youngest data in the Parquet file ages out of retention.

## Data ingest

When data is written to {{< product-name >}}, the data is first written to a
Write-Ahead-Log (WAL) on locally attached storage on the ingester node before
the write request is acknowledged. After acknowledging the write request, the
ingester holds the data in memory temporarily and then writes the contents of
the WAL to Parquet files in object storage and updates the InfluxDB catalog to
reference the newly created Parquet files. If an ingester is gracefully shut
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
  plus an additional time period (approximately 100 days).

- **Backup of catalog**: InfluxData keeps a transaction log of all recent updates
  to the [InfluxDB catalog](#influxdb-catalog) and generates a daily backup of
  the catalog. Backups are preserved for at least 100 days in object storage across a minimum
  of three availability zones.

## Recovery

InfluxData can perform the following recovery operations:

- **Recovery after ingester failure**: If an ingester fails, a new ingester is
  started up and reads from the WAL file for the recently ingested data.

- **Recovery of Parquet files**: {{< product-name >}} uses the provided object
  storage data durability to recover Parquet files.

- **Recovery of the catalog**: InfluxData can restore the InfluxDB catalog to
  the most recent daily backup of the catalog and then reapply any transactions
  that occurred since the interruption.
  