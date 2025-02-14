---
title: Back up and restore your cluster
seotitle: Back up and restore your InfluxDB cluster
description: >
  Use InfluxDB Clustered Catalog snapshots to keep necessary data in object
  storage and restore to a recovery point in case of emergency.
menu:
  influxdb3_clustered:
    name: Backup and restore
    parent: Administer InfluxDB Clustered
weight: 105
influxdb3/clustered/tags: [backup, restore]
---

InfluxDB Clustered automatically stores snapshots of the InfluxDB Catalog that
you can use to restore your cluster to a previous state. The snapshotting
functionality is optional and is disabled by default. To ensure you can recover
in case of emergency, we recommend enabling snapshots.

With InfluxDB Clustered snapshots enabled, each hour, InfluxDB uses the `pg_dump`
utility included with the InfluxDB Garbage Collector to export an SQL blob or
“snapshot” from the InfluxDB Catalog and store it in the object store.
The Catalog is a PostgreSQL-compatible relational database that stores metadata
for your time series data, such as schema data types, Parquet file locations, and more.

The Catalog snapshots act as recovery points for your InfluxDB cluster that
reference all Parquet files that existed in the object store at the time of the
snapshot. When a snapshot is restored to the Catalog, the Compactor
“[soft deletes](#soft-delete)” any Parquet files not listed in the snapshot.

> [!Note]
> If a Parquet file is listed as part of *any* hourly or daily snapshot,
> InfluxDB never removes the Parquet file from the object store (also known as a
> “[hard delete](#hard-delete)”).
> 
> For example–if you have Parquet files A, B, C, and D, and you restore to a
> snapshot that includes B and C, A and D are soft-deleted, but remain in object
> storage until they are no longer referenced in any Catalog snapshot.

- [RPO and RTO](#rpo-and-rto)
- [Things to know](#things-to-know)
  - [Data written just before a snapshot may not be present after restoring](#data-written-just-before-a-snapshot-may-not-be-present-after-restoring)
- [Recommendations](#recommendations)
  - [Automate object synchronization to an external S3-compatible bucket](#automate-object-synchronization-to-an-external-s3-compatible-bucket)
  - [Enable short-term object versioning](#enable-short-term-object-versioning)
- [Configure snapshots](#configure-snapshots)
  - [Environment Variables](#environment-variables)
- [Verify snapshots](#verify-snapshots)
- [Restore to a recovery point](#restore-to-a-recovery-point)
- [Definitions](#definitions)
- [Resources](#resources)
  - [*prep_pg_dump.awk*](#preppgdumpawk)

## RPO and RTO

With the InfluxDB Clustered snapshot strategy, you can expect the following:

- [**Recovery Point Objective (RPO)**](#recovery-point-objective-rpo):  
  - 1 hour for hourly snapshots *(up to the configured hourly snapshot expiration)*  
  - 1 day for daily snapshots *(up to the configured daily snapshot expiration)*  
- [**Recovery Time Objective (RTO)**](#recovery-time-objective-rto):
  *RTO varies depending on the size of the Catalog database, network speeds
  between the client machine and the Catalog database, cluster load, the status
  of your underlying hosting provider, and other factors.*

## Things to know

### Data written just before a snapshot may not be present after restoring

Due to the variability of flushing data from Ingesters into Parquet files, data
written in the last few minutes before a snapshot may not be included.
This variability is typically less than 15 minutes, but is per table.
This means that one table may have data written up to the timestamp of the
snapshot, while another may not have data written in the 15 minutes prior to the
snapshot. All data written more than 15 minutes prior to a snapshot should be
present after restoring to that snapshot.

## Recommendations

### Automate object synchronization to an external S3-compatible bucket

Syncing objects to an external S3-compatible bucket ensures an up-to-date backup
in case your object store becomes unavailable. Recovery point snapshots only
back up the InfluxDB Catalog. If data referenced in a Catalog snapshot does not
exist in the object store, the recovery process does not restore the missing data.

### Enable short-term object versioning

If your object storage provider supports it, we recommend enabling short-term
object versioning on your object store. As objects are updated, the object store
retains distinct versions of each update which can be used to “rollback” newly
written or updated Parquet files to previous versions. Storing versioned objects
does add to object storage costs, but keeping versioned objects for 1-2 days
provides a short buffer to protect against potential errant writes or deleted objects.

## Configure snapshots

Use the available environment variables to enable and configure hourly Catalog
snapshots in your InfluxDB cluster. Add these environment variables to the
Garbage Collector configuration in your `AppInstance` resource:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    spec:
      components:
        garbage-collector:
          template:
            containers:
              iox:
                env:
                  INFLUXDB_IOX_CREATE_CATALOG_BACKUP_DATA_SNAPSHOT_FILES: true
                  INFLUXDB_IOX_DELETE_USING_CATALOG_BACKUP_DATA_SNAPSHOT_FILES: true
                  INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS: '30d'
                  INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS: '90d'
                  INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '14d'
```

### Environment Variables

#### INFLUXDB_IOX_CREATE_CATALOG_BACKUP_DATA_SNAPSHOT_FILES

Enable hourly Catalog snapshotting. The default is `false`. **Set to `true`**.

#### INFLUXDB_IOX_DELETE_USING_CATALOG_BACKUP_DATA_SNAPSHOT_FILES

Enable a snapshot check when deleting files to ensure the Garbage Collector does
not remove Parquet files from the object store that are associated with existing
snapshots. The default is `false`. **Set to `true`**.

> [!Caution]
> If set to `false` with snapshots enabled, the Garbage Collector does not check
> to see if a Parquet file is associated with existing snapshots before removing
> the Parquet file from the object store. This could result in deleting Parquet
> files needed to restore the cluster to a recovery point.

#### INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS

After this duration of time, the Garbage Collector deletes *hourly* snapshots,
allowing the Garbage Collector to hard-delete Parquet files from the object
store and the Catalog.  The default is `30d`. The recommended range is between
`1d` and `30d`.

#### INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS

After this duration of time, the Garbage Collector deletes *daily* snapshots,
allowing the Garbage Collector to hard-delete Parquet files from the object
store and the Catalog. The default is `90d`. The recommended range is between
`3d` and `90d`.

> [!Note]
> Daily snapshots must expire after hourly backups.
> `INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS` must be greater than
> `INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS`.

#### INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF

The duration of time after a Parquet file is no longer referenced in the Catalog
or included in any snapshots after which the Garbage Collector removes the
Parquet file from the Object store. The default is `14d`. The recommended range
is between `6h` and `14d`.

## Verify snapshots

InfluxDB Clustered stores hourly and daily snapshots in the
`/catalog_backup_file_lists` path in object storage. After enabling snapshots,
ensure that snapshots are written to the object store using clients provided by
your object storage provider.

Hourly snapshots are taken at *approximately* the beginning of each hour
(≈1:00, ≈2:00, ≈3:00, etc.). After enabling snapshotting, the first snapshot is
written on or around the beginning of the next hour.

## Restore to a recovery point

Use the following process to restore your InfluxDB cluster to a recovery point
using Catalog snapshots:

1.  **Install prerequisites:**  

    - `kubectl` CLI for managing your Kubernetes deployment.  
    - `psql` CLI to interact with the PostgreSQL-compatible Catalog database with
      the appropriate Data Source Name (DSN) and connection credentials.  
    - A client to interact with your InfluxDB cluster’s object store.
      Supported clients depend on your object storage provider.

2.  **Retrieve the recovery point snapshot from your object store.**

    InfluxDB Clustered stores hourly and daily snapshots in the
    `/catalog_backup_file_lists` path in object storage. Download the snapshot
    that you would like to use as the recovery point. If your primary object
    store is unavailable, download the snapshot from your replicated object store.

    > [!Important]
    > When creating and storing a snapshot, the last artifact created is the
    > snapshot’s bloom filter. To ensure the snapshot is complete, make sure that
    > the bloom filter file (`bloom.bin.gz`) exists before downloading the snapshot. 
   
3.  **Prepare your snapshot file for the restore process.**

    InfluxDB Clustered snapshot `pg_dump` files are compressed text files
    containing SQL that restore the contents of the Catalog. Because your Catalog
    has existing data, you need to update the snapshot to prepend `CREATE`
    statements with `DROP` statements. The result is a slightly modified `pg_dump`
    SQL file that you can use to restore your non-empty Catalog.

    > [!Note]
    > If restoring to a new cluster, you do not need to update the `pg_dump`
    > snapshot file.

    Use the `prep_pg_dump.awk` script provided [below](#prep_pg_dump.awk) to
    process your `pg_dump` file. For example:

    <!-- pytest.mark.skip -->

    ```bash
    $ gunzip pg_dump.gz
    $ cat pg_dump | prep_pg_dump.awk > snapshot.sql
    ```

4.  **Pause the kubit operator**

    The `kubit` operator validates cluster sizing and prevents you from disabling
    InfluxDB Clustered components. By pausing the `kubit` operator, you can
    disable InfluxDB components and safely perform the restore operation.

    1.  In your `AppInstance` resource, set `pause` to `true`.

        ```yml
        apiVersion: kubecfg.dev/v1alpha1
        kind: AppInstance
        metadata:
          name: influxdb
          namespace: influxdb
        pause: true
        # ...
        ```

    2.  Apply the change to your cluster:

        <!-- pytest.mark.skip -->

        ```bash
        kubectl apply --filename myinfluxdb.yml --namespace influxdb
        ```

5.  **Disable InfluxDB Clustered components**

    Use the `kubectl scale` command to scale InfluxDB Clustered components down
    to zero replicas:

    <!-- pytest.mark.skip -->
        
    ```bash
    $ kubectl scale --namespace influxdb --replicas=0 deployment/global-gc
    $ kubectl scale --namespace influxdb --replicas=0 deployment/global-router
    $ kubectl scale --namespace influxdb --replicas=0 deployment/iox-shared-querier
    $ kubectl scale --namespace influxdb --replicas=0 statefulset/iox-shared-compactor
    $ kubectl scale --namespace influxdb --replicas=0 statefulset/iox-shared-ingester
    $ kubectl scale --namespace influxdb --replicas=0 statefulset/iox-shared-catalog
    ```

    > [!Note]
    > If the cluster is under load, some pods may take longer to shut down.
    > For example, Ingester pods must flush their Write-Ahead Logs (WAL) before
    > shutting down.

    Verify that pods have been removed from your cluster.   

6.  **Restore the SQL snapshot to the Catalog**

    Use `psql` to restore the recovery point snapshot to your InfluxDB Catalog. For example:

    <!-- pytest.mark.skip -->

    ```bash
    psql CATALOG_DSN < snapshot.sql
    ```

    The exact `psql` command depends on your PostgreSQL-compatible database
    provider, their authentication requirements, and the database’s DSN.   

7.  **Restart InfluxDB Clustered components**

    1.  In your `AppInstance` resource, set `pause` to `false` or remove the `pause`:   

        ```yaml
        apiVersion: kubecfg.dev/v1alpha1
        kind: AppInstance
        metadata:
          name: influxdb
          namespace: influxdb
        pause: false
        # ...
        ```

    2.  Apply the change to resume the `kubit` operator and scale InfluxDB
        Clustered components to the number of replicas defined for each in your
        `AppInstance` resource:

        ```bash
        kubectl apply --filename myinfluxdb.yml --namespace influxdb
        ```

    3.  Verify that InfluxDB Clustered pods start running again.

Your InfluxDB cluster is now restored to the recovery point.
When the Garbage Collector runs, it identifies what Parquet files are not
associated with the recovery point and [soft deletes](#soft-delete) them.

## Definitions

### Soft delete

A soft delete refers to when, on compaction, the Compactor sets a `deleted_at` timestamp on the Parquet file entry in the Catalog. The Parquet file is no longer queryable, but remains intact in the object store. 

### Hard delete

A hard delete refers to when a Parquet file is actually deleted from object storage and no longer exists.

### Recovery Point Objective (RPO)

The maximum amount of data (based on time) that can be lost after a disruptive event. RPO indicates how much time can pass between data snapshots before data is considered lost if a disaster occurs.

### Recovery Time Objective (RTO)

The maximum amount of time that an InfluxDB cluster can be down after a failure.

## Resources

### *prep\_pg\_dump.awk*

{{% truncate %}}
<!-- pytest.mark.skip -->

```awk
#!/usr/bin/env awk -f

# Data Snapshots in IOx use pg_dump in text output format, which is simply sql. We can apply the
# pg_dump using our standard permissions, without the need for special database create permission.
# Even a new cluster which you think is empty likely has some tables populated. For ease of
# restoring the pg_dump, this script inserts DROP statements before each CREATE statement to handle
# restoring to a non-empty catalog.
#
# The intended use of this script is to modify the pg_dump output with drop statements so it can
# be applied to a non-empty catalog.
#
# WARNING: The resulting sql is destructive. Prior catalog contents are removed and replaced with
#          what's in the pg_dump.
#
# Example use:
#    gunzip pg_dump.gz
#    cat pg_dump | prep_pg_dump.awk > clean_and_restore.sql
#    psql CATALOG_DSN < clean_and_restore.sql


BEGIN {
    print "-- Modified pg_dump text output with DROP statements"
}

# Function to clean up names (dropping trailing semicolon so CASCADE is included in the DROP command)
function clean_name(name) {
    gsub(/[";]/, "", name)
    return name
}

# Match CREATE TABLE statements and insert DROP TABLE
/^[[:space:]]*CREATE[[:space:]]+TABLE[[:space:]]+/ {
    table_name = clean_name($3)
    print "DROP TABLE IF EXISTS " table_name " CASCADE;"
    print
    next
}

# Match CREATE SCHEMA statements and insert DROP SCHEMA
/^[[:space:]]*CREATE[[:space:]]+SCHEMA[[:space:]]+/ {
    schema_name = clean_name($3)
    print "DROP SCHEMA IF EXISTS " schema_name " CASCADE;"
    print
    next
}

# Match CREATE SEQUENCE statements and insert DROP SEQUENCE
/^[[:space:]]*CREATE[[:space:]]+SEQUENCE[[:space:]]+/ {
    sequence_name = clean_name($3)
    print "DROP SEQUENCE IF EXISTS " sequence_name " CASCADE;"
    print
    next
}

# Match CREATE VIEW statements and insert DROP VIEW
/^[[:space:]]*CREATE[[:space:]]+VIEW[[:space:]]+/ {
    view_name = clean_name($3)
    print "DROP VIEW IF EXISTS " view_name " CASCADE;"
    print
    next
}

# Match CREATE FUNCTION statements and insert DROP FUNCTION
/^[[:space:]]*CREATE[[:space:]]+FUNCTION[[:space:]]+/ {
    function_name = clean_name($3)
    print "DROP FUNCTION IF EXISTS " function_name " CASCADE;"
    print
    next
}

# Match CREATE INDEX statements and insert DROP INDEX
/^[[:space:]]*CREATE[[:space:]]+INDEX[[:space:]]+/ {
    index_name = clean_name($3)
    print "DROP INDEX IF EXISTS " index_name " CASCADE;"
    print
    next
}

# Pass through all other lines
{
    print
}
```
{{% /truncate %}}
