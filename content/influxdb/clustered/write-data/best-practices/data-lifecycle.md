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
Any data which lies outside of this retention period is no longer considered for retrieval by a query, but can have references maintained as in object storage or the Postgres catalog, causing an increase in operational overhead and drive higher costs.

In order to reduce these factors, it is important to manage the lifecycle of data ingested into InfluxDB. You can achieve this by following the best practices below:

- Use a retention policy which is appropriate for your requirements.
- Tune the garbage collector cutoff period to ensure that data is removed in a timely manner.
- Enable versioning in your object store and use lifecycle rules to expire old data.

### Garbage collector tuning

Once data falls outside of the retention period it now has the potential to be removed by the garbage collector.

There are two variables which tune this process:

- `INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF`: defines when objects are deleted from object storage. The default is `30d`.
- `INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF`: defines when a row can be deleted from the catalog. The default is `30d`.

You may set them to a value that is appropriate for your use case, for example a value of `6h` (6 hours) would be appropriate for maintaining a lean catalog that only maintains references to recent data.

Our recommendation is to keep these values aligned.

### Lifecycle rules

**We highly recommend that you use object versioning if you are expiring data using lifecycle rules.**

You can use lifecycle rules to ensure that old versions of data are not kept around any longer than necessary - this could cause a significant increase in storage costs over a long period.

We recommend that you use lifecycle rules to expire data after a set period of time, which is appropriate to your organisation.

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
