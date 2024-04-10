---
title: View information about your cluster
seotitle: View information about Cloud Dedicated cluster
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 105
---

- Overview
  - Query system tables

{{% warn %}}
WARNING!

Usage of InfluxDB 3.0 system tables may have performance impacts on
production usage while system tables are being accessed.

Furthermore, system tables are not part of InfluxDB's stable API (ie the
available system tables and their columns may change from one release to the
next).
{{% /warn %}}

1. If you haven't already, install **`influxctl` v2.7.2+**.
2. Use the `influxctl query` command with the `--enable-system-tables` flag

## Query examples

<!--------------- UPDATE THE DATE BELOW AS EXAMPLES ARE UPDATED --------------->

{{% warn %}}
#### System tables may change

System tables are not part of InfluxDB's stable API and may change with new releases.
The provided query examples are valid as of **April 10, 2024**.
{{% /warn %}}

<!--------------- UPDATE THE DATE ABOVE AS EXAMPLES ARE UPDATED --------------->

#### View partition templates of all tables

```sql
SELECT * FROM system.tables
```

#### View the partition template of a specific table

```sql
SELECT * FROM system.tables WHERE table_name = 'TABLE_NAME'
```

#### View the number of partitions per table

```sql
SELECT COUNT(*) FROM system.partitions GROUP BY table_name
```

#### View the number of partitions for specific table table

```sql
SELECT COUNT(*) FROM system.partitions WHERE table_name = 'TABLE_NAME'
```
