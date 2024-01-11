---
title: Manage data partitioning
seotitle: Manage data partitioning on disk
description: >
  Customize your partitioning strategy to optimize query performance for your
  specific schema and workload.
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 103
influxdb/cloud-dedicated/tags: [storage]
related:
  - /influxdb/cloud-dedicated/reference/internals/storage-engine/
---

When writing data to {{< product-name >}}, the InfluxDB v3 storage engine stores
data in the [Object storage](/influxdb/cloud-dedicated/reference/internals/storage-engine/#object-storage)
in [Apache Parquet](https://parquet.apache.org/) format.
Each Parquet file represents a _partition_--a logical grouping of data.
By default, InfluxDB partitions data by measurement and day.
{{< product-name >}} lets you customize the partitioning strategy to partition
by tag values and different time intervals.
Customize your partitioning strategy to optimize query performance for your
specific schema and workload.

<!-- Partitioning by tags or different time intervals will improve query performance,
but there are some side effects to consider.

Partitions help the query engine to identify what files on disk actually contain
queried data and only read those files in the process of returning results. -->

## Partition keys

- The partition key unique identifies a partition.
- Data is partitioned by measurement/table, but the measurement is not part of the partition key

## Partitions in the query life cycle

When querying data:

1.  The [Catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog)
    provides the v3 query engine ([Querier](/influxdb/cloud-dedicated/reference/internals/storage-engine/#querier))
    with the locations of partitions that contain the queried time series data.
2.  The query engine reads all rows in the returned partitions to identify what
    rows match the logic in the query and should be included in the query result.
  
The faster the query engine can identify what partitions to read and then read
the data in those partitions, the more performant your queries are.

_For more information about the query lifecycle, see
[InfluxDB v3 query life cycle](/influxdb/cloud-dedicated/reference/internals/storage-engine/#query-life-cycle)._

##### Query example

Consider the following query that selects everything in the `home` measurement
with the `Kitchen` value for the `room` tag:

```sql
SELECT *
FROM home
WHERE
  time >= now() - INTERVAL '1 week'
  AND room = 'Kitchen'
```

Using the default partitioning strategy (measurement and day), the query engine
reads 8 separate partitions (one partition for today and one for each of the
last seven days) and scans all rows in those partitions to identify what rows
contain the `Kitchen` value for the `room` tag.

- {{< datetime/current-date trimTime=true >}}
- {{< datetime/current-date offset=-1 trimTime=true >}}
- {{< datetime/current-date offset=-2 trimTime=true >}}
- {{< datetime/current-date offset=-3 trimTime=true >}}
- {{< datetime/current-date offset=-4 trimTime=true >}}
- {{< datetime/current-date offset=-5 trimTime=true >}}
- {{< datetime/current-date offset=-6 trimTime=true >}}
- {{< datetime/current-date offset=-7 trimTime=true >}}

But if the database is partitioned by measurement, room, and week, the query
engine only needs to read two partitions (one for this week and one for last week)
since everything in those partitions

- Kitchen | {{< datetime/current-date trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-1 trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-2 trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-3 trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-4 trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-5 trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-6 trimTime=true >}}
- Kitchen | {{< datetime/current-date offset=-7 trimTime=true >}}


<!-- Notes from cut, but should be included -->
It does this by structuring data on disk in a way that allows the InfluxDB query
engine to more efficiently identify what Parquet files contain the
queried data.

When querying data, the InfluxDB Catalog provides the query engine with the
physical location of data requested
<!-- End notes -->



### Advantages

- Improve query performance
- Customize storage strategy specific to your workload

### Disadvantages

- Increased load on the Catalog as more references to Parquet files are stored
- Increased load on the Compactor as it has to compact more Parquet files

### Limitations

- You have to define custom partitions before you ingest data.
- Can partition by up to eight dimensions, including time.

## Partition templates

A partition template is the naming convention used for partitions
associated with a given database that also specifies how data is partitioned.
The default partition template partitions data by measurement and calendar day:

```
%Y-%m-%d
```

{{% influxdb/custom-timestamps %}}

##### Home sensor data line protocol

```text
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
```

Default partitioning:

- 2022-01-01

Custom partitioning:

```
influxctl database create \
  --template-tag room
```

- Living Room | 2022-01-01
- Kitchen | 2022-01-01

{{% /influxdb/custom-timestamps %}}
