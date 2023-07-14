---
title: Manage databases
seotitle: Manage databases in InfluxDB Cloud Dedicated
description: >
  Manage databases in your InfluxDB Cloud Dedicated cluster.
  A database is a named location where time series data is stored.
  Each InfluxDB database has a retention period, which defines the maximum age
  of data stored in the database.
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 101
influxdb/cloud-dedicated/tags: [databases]
---

An InfluxDB database is a named location where time series data is stored.
Each InfluxDB database has a [retention period](#retention-periods).

{{% note %}}
**If coming from InfluxDB v1**, the concepts of databases and retention policies
have been combined into a single concept--database. Retention policies are no
longer part of the InfluxDB data model. However, InfluxDB Cloud Dedicated does
support InfluxQL, which requires databases and retention policies.
See [InfluxQL DBRP naming convention](/influxdb/cloud-dedicated/admin/databases/create/#influxql-dbrp-naming-convention).

**If coming from InfluxDB v2 or InfluxDB Cloud**, _database_ and _bucket_ are synonymous.
{{% /note %}}

## Retention periods

A database **retention period** is the maximum age of data stored in the database.
The age of data is determined by the timestamp associated with each point.
When a point's timestamp is beyond the retention period (relative to now), the
point is marked for deletion and is removed from the database the next time the
retention enforcement service runs.

The _minimum_ retention period for and InfluxDB database is 1 hour.
The _maximum_ retention period is infinite meaning data does not expire and will
never be removed by the retention enforcement service.

{{% warn %}}
#### Retention periods cannot be updated

Retention periods cannot be changed after a database is created.
To move to a different retention period, create a new database with the retention
period you want and migrate existing data to the new database.
{{% /warn %}}

---

{{< children hlevel="h2" readmore=true hr=true >}}
