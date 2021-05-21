---
title: Flux data model
description: >
  ...
menu:
  flux_0_x:
    name: Data model
    parent: Get started
weight: 101
---


At its core, Flux is designed to operate on tables of data.

- Table
  - Column
  - Row
- Stream of tables
  - Group key (a group key is applied to a entire stream, each table has a unique group key)

### Stream of tables
A **stream of tables** is a collection tables returned from a data source and piped-forward
into other transformations.

### Table
#### Group key

#### Table grouping example
The tables below represent data returned from InfluxDB with the following schema:

- `example` measurement
- `loc` tag with two values
- `sensorID` tag with two values
- `temp` and `hum` fields

By default, InfluxDB returns data grouped by [series](/influxdb/v2.0/reference/glossary/#series)
(common measurement, tag set, and field key).
To modify the group key and see how the sample data is partitioned into new tables,
select columns to group by:

{{< flux/group-key-demo >}}

### Column
### Row


{{% note %}}
The flux data model is not tied to the queried data source.
Queried sources return data structured into columnar tables.
What columns are returned and how tables are structured depends on the queried data source.
{{% /note %}}

{{< page-nav prev="/flux/v0.x/get-started/" next="/flux/v0.x/get-started/data-model/" >}}