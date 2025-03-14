---
title: Data ingest lifecycle best practices
description: >
  Best practices for managing the lifecycle of data ingested into InfluxDB.
menu:
  influxdb3_clustered:
    name: Data ingest lifecycle
    parent: write-best-practices
weight: 204
---

Data ingested into InfluxDB must conform to the retention period of the database
in which it is stored.
Points with timestamps outside of the retention period are no longer queryable,
but may still have references maintained in
[Object storage](/influxdb3/clustered/reference/internals/storage-engine/#object-store)
or the [Catalog](/influxdb3/clustered/reference/internals/storage-engine/#catalog),
resulting in an increase in operational overhead and cost.
To reduce these factors, it is important to manage the lifecycle of ingested data.

Use the following best practices to manage the lifecycle of data in your
InfluxDB cluster:

- [Use appropriate retention periods](#use-appropriate-retention-periods)
- [Tune garbage collection](#tune-garbage-collection)

## Use appropriate retention periods

When [creating or updating a database](/influxdb3/clustered/admin/databases/#create-a-database),
use a retention period that is appropriate for your requirements.
Storing data longer than is required adds unnecessary operational cost to your
InfluxDB cluster.

## Tune garbage collection

Once data falls outside of a database's retention period, the garbage collection
service can remove all artifacts associated with the data from the Catalog store and Object store.
Tune the garbage collector cutoff period to ensure that data is removed in a timely manner.

Use the following environment variables to tune the garbage collector:

- `INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF`: the age at which Parquet files not
  referenced in the Catalog store become eligible for deletion from Object storage.
  The default is `30d`.
- `INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF`: how long to retain rows in the Catalog store
  that reference Parquet files marked for deletion. The default is `30d`.

These values tune how aggressive the garbage collector can be. A shorter duration
value means that files can be removed at a faster pace.

> [!Warning]
> To ensure there is a grace period before files and references are removed, the
> minimum garbage collector (GC) object store and Parquet file cutoff time is
> three hours (`3h`).

We recommend setting these options to a value aligned to your organization's
backup and recovery strategy.
For example, a value of `6h` (6 hours) would be appropriate for running a lean
Catalog that only maintains references to recent data and does not require backups.

### Use case examples

Use the following scenarios as a guide for different use cases:

{{< expand-wrapper >}}
{{% expand "Leading edge data with no backups" %}}

When only the most recent data is important and backups are not required, use a
very low cutoff point for the garbage collector.
Using a low value means that the garbage collection service will promptly delete
files from the Object store and remove  associated rows from the Catalog store.
This results in a lean Catalog with lower operational overhead and less files
in the Object store.

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # ...
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h'
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h'
```

{{% /expand %}}

{{% expand "Custom backup window _with_ object storage versioning" %}}

When backups are required and you are leveraging the versioning capability of your
Object store (provided by your object store provider), use a low cutoff point
for the garbage collector service. Your object versioning policy ensures expired
files are kept for the specified backup window time.

Object versioning maintains Parquet files in Object storage after data expires,
but allows the Catalog store to remove references to the Parquet files.
Non-current objects should be configured to be expired as soon as possible, but
retained long enough to satisfy your organization's backup policy.

The following illustrates an [AWS S3 lifecycle rule](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
that expires non-current objects after 90 days:

```json
{
    "Rules": [
        {
            "ID": "my-lifecycle-rule",
            "Filter": {
                "Prefix": ""
            },
            "Status": "Enabled",
            "NoncurrentVersionExpiration": {
                "NoncurrentDays": 90
            }
        }
    ]
}
```

Set the `garbage-collector` to use low cutoff points.
The following example uses `6h`:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # ...
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h'
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h'
```
{{% /expand %}}

{{% expand "Custom backup window _without_ object storage versioning" %}}

If you cannot make use of object versioning policies but still requires a backup
window, configure the garbage collector to retain Parquet files for as long as
your backup period requires.

This will likely result in higher operational costs as the Catalog store maintains
more references to associated Parquet files and the Parquet files persist for
longer in the Object store.

> [!Note]
> If possible, we recommend using object versioning.

The following example sets the garbage collector cutoffs to `100d`:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # ...
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '100d'
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '100d'
```
{{% /expand %}}
{{< /expand-wrapper >}}
