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

InfluxDB Clustered automatically stores snapshots of the InfluxDB Catalog store that
you can use to restore your cluster to a previous state. The snapshotting
functionality is optional and is disabled by default.
Enable snapshots to ensure you can recover
in case of emergency.

With InfluxDB Clustered snapshots enabled, each hour, InfluxDB uses the `pg_dump`
utility included with the InfluxDB Garbage collector to export an SQL blob or
“snapshot” from the InfluxDB Catalog store to the Object store.
The Catalog store is a PostgreSQL-compatible relational database that stores metadata
for your time series data, such as schema data types, Parquet file locations, and more.

The Catalog store snapshots act as recovery points for your InfluxDB cluster that
reference all Parquet files that existed in the Object store at the time of the
snapshot. When a snapshot is restored to the Catalog store, the Compactor
“[soft deletes](#soft-delete)” any Parquet files not listed in the snapshot.

> [!Note]
> InfluxDB won't [hard delete](#hard-delete) Parquet files listed in _any_ hourly or daily snapshot.
> 
> For example, if you have Parquet files A, B, C, and D, and you restore to a
> snapshot that includes B and C, but not A and D, then A and D are soft-deleted, but remain in object
> storage until they are no longer referenced in any Catalog store snapshot.
- [Soft delete](#soft-delete)
- [Hard delete](#hard-delete)
- [Recovery Point Objective (RPO)](#recovery-point-objective-rpo)
- [Recovery Time Objective (RTO)](#recovery-time-objective-rto)
- [Data written just before a snapshot may not be present after restoring](#data-written-just-before-a-snapshot-may-not-be-present-after-restoring)
- [Recommendations](#recommendations)
  - [Automate object synchronization to an external S3-compatible bucket](#automate-object-synchronization-to-an-external-s3-compatible-bucket)
  - [Enable short-term object versioning](#enable-short-term-object-versioning)
- [Configure snapshots](#configure-snapshots)
  - [Environment Variables](#environment-variables)
- [Verify snapshots](#verify-snapshots)
- [Restore to a recovery point](#restore-to-a-recovery-point)
- [Resources](#resources)
  - [prep_pg_dump.awk](#prep_pg_dumpawk)

## Soft delete

A _soft delete_ refers to when, on compaction, the Compactor sets a `deleted_at`
timestamp on the Parquet file entry in the Catalog.
The Parquet file is no
longer queryable, but remains intact in the object store.

> [!Note]
> Soft deletes are a mechanism of the {{% product-name %}} Catalog, not of the
> underlying object storage provider. Soft deletes do not modify objects in the
> object store; only Catalog entries that reference objects in the object store.

## Hard delete

A _hard delete_ refers to when a Parquet file is actually deleted from object
storage and no longer exists.

## Recovery Point Objective (RPO)

RPO is the maximum amount of data loss (based on time) allowed after a disruptive event.
It indicates how much time can pass between data snapshots before data is considered lost if a disaster occurs.

The InfluxDB Clustered snapshot strategy RPO allows for the following maximum data loss:

- 1 hour for hourly snapshots _(up to the configured hourly snapshot expiration)_  
- 1 day for daily snapshots _(up to the configured daily snapshot expiration)_
 
 ## Recovery Time Objective (RTO)

RTO is the maximum amount of downtime allowed for an InfluxDB cluster after a failure.
RTO varies depending on the size of your Catalog store, network speeds
between the client machine and the Catalog store, cluster load, the status
of your underlying hosting provider, and other factors.

## Data written just before a snapshot may not be present after restoring

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
in case your Object store becomes unavailable. Recovery point snapshots only
back up the InfluxDB Catalog store. If data referenced in a Catalog store snapshot does not
exist in the Object store, the recovery process does not restore the missing data.

### Enable short-term object versioning

If your object storage provider supports it, consider enabling short-term
object versioning on your Object store--for example, 1-2 days to protect against errant writes or deleted objects.
With object versioning enabled, as objects are updated, the object store
retains distinct versions of each update that can be used to “rollback” newly
written or updated Parquet files to previous versions.
Keep in mind, storing versioned objects
does add to object storage costs.

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
                  INFLUXDB_IOX_CREATE_CATALOG_BACKUP_DATA_SNAPSHOT_FILES: 'true'
                  INFLUXDB_IOX_DELETE_USING_CATALOG_BACKUP_DATA_SNAPSHOT_FILES: 'true'
                  INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS: '30d'
                  INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS: '90d'
                  INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '30d'
```

### Environment Variables

#### INFLUXDB_IOX_CREATE_CATALOG_BACKUP_DATA_SNAPSHOT_FILES

Enable hourly Catalog store snapshotting. The default is `'false'`. Set to `'true'`:

```yaml
INFLUXDB_IOX_CREATE_CATALOG_BACKUP_DATA_SNAPSHOT_FILES: 'true'
```

#### INFLUXDB_IOX_DELETE_USING_CATALOG_BACKUP_DATA_SNAPSHOT_FILES

Enable a snapshot check when deleting files to ensure the Garbage Collector does
not remove Parquet files from the object store that are associated with existing
snapshots. The default is `'false'`. Set to `'true'`:

```yaml
INFLUXDB_IOX_DELETE_USING_CATALOG_BACKUP_DATA_SNAPSHOT_FILES: 'true'
```

> [!Note]
> #### Storage utilization and costs
> 
> Enabling this setting retains Parquet files referenced in snapshots, increasing
> object storage utilization and costs. The longer you retain snapshots, the more
> storage space and costs you incur.

> [!Caution]
> If set to `false` (the default), the Garbage Collector may delete Parquet
> files needed for snapshot restoration, making recovery points unusable.

#### INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS

After this duration of time, the Garbage Collector deletes _hourly_ snapshots,
allowing the Garbage Collector to [hard-delete](#hard-delete) Parquet files from the object
store and the Catalog. The default is `30d`. The recommended range for snapshots is between
`1d` and `30d`:

```yaml
INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS: '30d'
```

#### INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS

After this duration of time, the Garbage Collector deletes _daily_ snapshots,
allowing the Garbage Collector to [hard-delete](#hard-delete) Parquet files from the object
store and the Catalog. The default is `90d`. The recommended range is between
`3d` and `90d`.

> [!Important]
> Daily snapshots must expire after hourly backups
> Make sure to set `INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS` to a value greater than
> `INFLUXDB_IOX_KEEP_HOURLY_CATALOG_BACKUP_FILE_LISTS`.

```yaml
INFLUXDB_IOX_KEEP_DAILY_CATALOG_BACKUP_FILE_LISTS: '90d'
```

#### INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF

The duration of time after a Parquet file is no longer referenced in the Catalog
or included in any snapshots after which the Garbage Collector removes the
Parquet file from the Object store. The default is `30d`:

```yaml
INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '30d'
```

For an in-depth explanation of the recommended value, see the
[data lifecycle garbage tuning best practices](/influxdb3/clustered/write-data/best-practices/data-lifecycle/#tune-garbage-collection)
and [use case examples](/influxdb3/clustered/write-data/best-practices/data-lifecycle/#use-case-examples).

## Verify snapshots

InfluxDB Clustered stores hourly and daily snapshots in the
`/catalog_backup_file_lists` path in object storage. After enabling snapshots,
use clients provided by
your object storage provider to ensure that snapshots are written to the object store.

Hourly snapshots are taken at _approximately_ the beginning of each hour
(≈1:00, ≈2:00, ≈3:00, etc.). After you enable snapshotting, the first snapshot is
written on or around the beginning of the next hour.

## Restore to a recovery point

Use the following process to restore your InfluxDB cluster to a recovery point
using Catalog store snapshots:

> [!Warning]
> 
> #### Use the same InfluxDB Clustered version used to generate the snapshot
>
> When restoring an InfluxDB cluster to a recovery point, use the same version
> of InfluxDB Clustered used to generate the Catalog store snapshot.
> You may need to [downgrade to a previous version](/influxdb3/clustered/admin/upgrade/)
> before restoring.

1.  **Install prerequisites:**  

    - `kubectl` CLI for managing your Kubernetes deployment.  
    - `psql` CLI configured with your Data Source Name and credentials for interacting with the PostgreSQL-compatible Catalog store database.
    - A client from your object storage provider for interacting with your InfluxDB cluster's Object store.

2.  **Retrieve the recovery point snapshot from your object store.**

    InfluxDB Clustered stores hourly and daily snapshots in the
    `/catalog_backup_file_lists` path in object storage. Download the snapshot
    that you would like to use as the recovery point. If your primary Object
    store is unavailable, download the snapshot from your replicated Object store.

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
    gunzip pg_dump.gz
    cat pg_dump | prep_pg_dump.awk > snapshot.sql
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
        spec:
          pause: true
        # ...
        ```

    2.  Apply the change to your cluster:

        <!-- pytest.mark.skip -->

        ```bash
        kubectl apply --filename myinfluxdb.yml --namespace influxdb
        ```

5.  **Disable all InfluxDB Clustered components _except the Catalog_**

    > [!Important]
    > #### Critical shutdown sequence
    >
    > You must scale down components in the correct order and wait for each group
    > to fully shut down before proceeding. Scaling down the catalog before
    > ingesters have finished shutting down can cause WAL contents to survive
    > through the restore, leading to data inconsistency and undefined behavior.
    >
    > #### Clusters under load may take longer to shut down
    >
    > If the cluster is under load, some pods may take longer to shut down.
    > For example, Ingester pods must flush their Write-Ahead Logs (WAL) before
    > shutting down.

    1. Before scaling down, record the current number of replicas for each component
       to restore them to the correct scale later. 
       {{< expand-wrapper >}}
       {{% expand "Get the number of replicas for each pod" %}}
  ```bash
  echo "GC: $(kubectl get deployment global-gc -n influxdb -o jsonpath='{.spec.replicas}')"
  echo "Router: $(kubectl get deployment global-router -n influxdb -o jsonpath='{.spec.replicas}')"
  echo "Querier: $(kubectl get deployment iox-shared-querier -n influxdb -o jsonpath='{.spec.replicas}')"
  echo "Compactor: $(kubectl get statefulset iox-shared-compactor -n influxdb -o jsonpath='{.spec.replicas}')"
  echo "Ingester: $(kubectl get statefulset iox-shared-ingester -n influxdb -o jsonpath='{.spec.replicas}')"
  echo "Catalog: $(kubectl get statefulset iox-shared-catalog -n influxdb -o jsonpath='{.spec.replicas}')"
  ```
       {{% /expand %}}
       {{< /expand-wrapper >}}

    1. **Scale down non-critical components first**

       Use the `kubectl scale` command to scale these components down to zero replicas:

       <!-- pytest.mark.skip -->
           
       ```bash
       kubectl scale --namespace influxdb --replicas=0 deployment/global-gc
       kubectl scale --namespace influxdb --replicas=0 deployment/global-router
       kubectl scale --namespace influxdb --replicas=0 deployment/iox-shared-querier
       kubectl scale --namespace influxdb --replicas=0 statefulset/iox-shared-compactor
       ```

    2. **Scale down ingesters and wait for complete shutdown**

       Scale down the ingesters and wait for all ingester pods to fully shut down:

       <!-- pytest.mark.skip -->
           
       ```bash
       kubectl scale --namespace influxdb --replicas=0 statefulset/iox-shared-ingester
       ```


       Verify that all non-Catalog pods have been removed from your cluster.

       <!-- pytest.mark.skip -->
           
       ```bash
       kubectl get pods --namespace influxdb --selector=app=iox-shared-ingester
       ```

       _Once removed_, proceed to the next step.  

6.  **Scale down catalog last**

    _After all other pods are removed_, use the `kubectl scale` command to scale
    your InfluxDB Clustered Catalog down to zero replicas:

    <!-- pytest.mark.skip -->

    ```bash
    kubectl scale --namespace influxdb --replicas=0 statefulset/iox-shared-catalog
    ```

    Verify that the Catalog pod has been removed from your cluster:

    <!-- pytest.mark.skip -->
        
    ```bash
    kubectl get pods --namespace influxdb --selector=app=iox-shared-catalog
    ```

    _Once removed_, proceed to the next step.

7.  **Restore the SQL snapshot to the Catalog**

    Use `psql` to restore the recovery point snapshot to your InfluxDB Catalog--for example:

    <!-- pytest.mark.skip -->

    ```bash
    psql CATALOG_DSN < snapshot.sql
    ```

    The exact `psql` command depends on your PostgreSQL-compatible database
    provider, their authentication requirements, and the database’s DSN.

8.  **Scale InfluxDB Clustered components back up**

    > [!Important]
    > **Critical startup sequence**
    >
    > When bringing services back online, start components in the correct order
    > and wait for each critical component group to be fully ready before
    > proceeding. This prevents temporary errors and ensures a clean startup.

    Use the `kubectl scale` command to scale your InfluxDB Clustered components
    back up to their original number of replicas. Perform the scaling operations
    on components _in reverse order of shutdown_.

    > [!Note]
    > **Recommended startup sequence**
    >
    > For optimal cluster initialization and to prevent startup errors, wait for
    > at least 2 catalog pods to be fully ready, then wait for at least 2 ingester
    > pods to be fully ready before scaling up the remaining components.
    
    1. **Scale catalog and wait for readiness**

       _Replace the number of replicas with the [original values](#get-the-number-of-replicas-for-each-pod) you noted when scaling down._
       <!-- pytest.mark.skip -->
       
       ```bash
       kubectl scale --namespace influxdb --replicas=3 statefulset/iox-shared-catalog
       kubectl get pods --namespace influxdb --selector=app=iox-shared-catalog --watch
       ```
       
       Wait until at least 2 catalog pods show `Running` status with `2/2` in the READY column.
       
    2. **Scale ingesters and wait for readiness**

       _Replace the number of replicas with the [original values](#get-the-number-of-replicas-for-each-pod) you noted when scaling down._
       <!-- pytest.mark.skip -->
       
       ```bash
       kubectl scale --namespace influxdb --replicas=3 statefulset/iox-shared-ingester
       kubectl get pods --namespace influxdb --selector=app=iox-shared-ingester --watch
       ```
       
       Wait until at least 2 ingester pods show `Running` status and are ready.

    3. **Scale remaining components**

       After you have scaled the catalog and ingesters and verified they are stable, scale the remaining components.

       _Replace the number of replicas with the [original values](#get-the-number-of-replicas-for-each-pod) you noted when scaling down._
       <!-- pytest.mark.skip -->

       ```bash
       kubectl scale --namespace influxdb --replicas=1 statefulset/iox-shared-compactor
       kubectl scale --namespace influxdb --replicas=2 deployment/iox-shared-querier
       kubectl scale --namespace influxdb --replicas=3 deployment/global-router
       kubectl scale --namespace influxdb --replicas=1 deployment/global-gc
       ```

9. **Verify the restore**

    Verify that all InfluxDB Clustered pods are running:

    <!-- pytest.mark.skip -->
        
    ```bash
    kubectl get pods --namespace influxdb
    ```

    All pods should show `Running` status and be ready.

10. **Restart the kubit operator**

    1.  In your `AppInstance` resource, set `pause` to `false` or remove the
        `pause` field:   

        ```yaml
        apiVersion: kubecfg.dev/v1alpha1
        kind: AppInstance
        metadata:
          name: influxdb
          namespace: influxdb
        spec:
          pause: false
        # ...
        ```

    2.  Apply the change to resume the `kubit` operator:

        <!-- pytest.mark.skip -->

        ```bash
        kubectl apply --filename myinfluxdb.yml --namespace influxdb
        ```

Your InfluxDB cluster is now restored to the recovery point.
When the Garbage Collector runs, it identifies what Parquet files are not
associated with the recovery point and [soft deletes](#soft-delete) them.

> [!Note]
> **Post-restore verification**
>
> After the restore completes, monitor your cluster logs and verify that:
> - All pods are running and ready
> - No error messages related to WAL inconsistencies appear
> - Write and query operations function correctly
> - The Garbage Collector operates normally

## Resources

### prep\_pg\_dump.awk

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
