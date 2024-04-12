---
title: Data ingest lifecycle best practices
seotitle: InfluxDB best practices for data ingest lifecycle management
description: >
  Best practices for managing the lifecycle of data ingested into InfluxDB.
menu:
  influxdb_clustered:
    name: Data ingest lifecycle
    weight: 201
    parent: write-best-practices
---

Data ingested into InfluxDB must conform to the retention period set on the database.
Any data which lies outside of this retention period is no longer considered for retrieval by a query, but can have references maintained in object storage or the Postgres catalog, causing an increase in operational overhead and drive higher costs.

In order to reduce these factors, it is important to manage the lifecycle of ingested data. You can achieve this by following the best practices below:

- Use a retention policy which is appropriate for your requirements.
- Tune the garbage collector cutoff period to ensure that data is removed in a timely manner.

### Garbage collector tuning

Once data falls outside of the retention period it can now be removed by the garbage collector service.

There are two variables which tune this process:

- `INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF`: the age at which a parquet file not referenced in the catalog becomes eligible for deletion from object storage. The default is `30d`.
- `INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF`: defines how long to retain the row referencing a parquet file in the catalog once marked for deletion. The default is `30d`.

Our recommendation is to keep these values aligned and you should set these to a value which matches your organisation's backup and recovery strategy.

For example a value of `6h` (6 hours) would be appropriate for running a lean catalog that only maintains references to recent data.
The assumption here is no backup requirement.

Use the following scenarios as a guide for different use cases:

{{% expand "Leading edge data, no backups" %}}

When only the most recent data is important and backups are not required, you can utilise a very low cutoff point for the garbage collector.

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # Surrounding configuration parameters have been snipped for brevity
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h',
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h',
```

Using a low value here means that the garbage collector service will promptly delete files from the configured object store and remove rows from the catalog.
Resulting in a lean catalog with minimal operational overhead.

{{% /expand %}}

{{% expand "Custom Backup Window - Using S3 Versioning" %}}

In this scenario, we maintain a low cutoff point for the garbage collector service, and make use of an object versioning policy to ensure expired files are kept for the specified backup window time.

Object versioning is used to maintain the files for a longer duration, whilst allowing the catalog to no longer maintain their references.

Noncurrent objects should be configured to be expried as soon as possible, but retained long enough to satisfy your organisation's backup policy.

For example, an [AWS S3 lifecycle rule](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) to expire non-current objects after 90 days will look like the following:

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

The tuning of the `garbage-collector` is shown below:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # Surrounding configuration parameters have been snipped for brevity
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h',
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h',
```
{{% /expand %}}

{{% expand "Custom Backup Window - No S3 Versioning" %}}

If your organisation cannot make use of S3 versioning policies but still requires a backup window, you must configure the garbage collector to retain the files for as long as your backup period requires.

If possible, using S3 versioning is preferred.

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # Surrounding configuration parameters have been snipped for brevity
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '100d',
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '100d',
```

Keep in mind that this may incur more cost in both the catalog and object store in use, as they are maintaining references and retaining a much greater number of files respectively.

{{% /expand %}}
