---
title: Manage data partitioning
seotitle: Manage data partitioning on disk
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 103
influxdb/cloud-dedicated/tags: [storage]
related:
  - /influxdb/cloud-dedicated/reference/internals/storage-engine/
---

When writing data to {{< product-name >}}, the InfluxDB v3 storage engine
stores data on disk as Parquet files, each representing a _partition_.
An InfluxDB partition contains time series data related by measurement, time,
and optionally tag values.
Partitions help the query engine to identify what files on disk actually contain
queried data and only read those files in the process of returning results.

By default, InfluxDB partitions data by measurement and day.
{{< product-name >}} lets you customize the partitioning strategy to partition
both by tag values and different time intervals.
Partitioning by tags or smaller time intervals will improve query performance,
but there are some side effects to consider.

## The query life-cycle

1.  A client sends a query request to InfluxDB.
2.  The query engine receives the query request and builds a query plan.
3.  The query engine queries the Ingesters (write path) to:

    - ensure the schema assumed by the query plan matches the schema of written data.
    - include the most recently written (leading edge) data in query results.

4.  The query engine queries the Catalog to identify the physical location of the queried data.
5.  The query engine reads the files containing the queried data and scans each
    row to find those that match the logic defined in the query plan.
6.  The query engine returns the data specified in the query and performs any
    additional operations specified in the query plan.
7.  The query engine returns the query result to the client.

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

You have to define custom partitions before you ingest data.

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
