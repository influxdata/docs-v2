---
title: InfluxDB design principles
description: >
  Principles and tradeoffs related to InfluxDB design.
weight: 104
menu:
  influxdb_2_0_ref:
    parent: Key concepts
    name: Design principles
influxdb/v2.0/tags: [key concepts, design principles]
---

InfluxDB implements optimal design principles for time series data. Some of these design principles may have associated tradeoffs in performance.

- [Time-ordered data](#time-ordered-data)
- [Strict update and delete permissions](#strict-update-and-delete-permissions)
- [Handle read and write queries first](#handle-read-and-write-queries-first)
- [Schemaless design](#schemaless-design)
- [Datasets over individual points](#datasets-over-individual-points)
- [Duplicate data](#duplicate-data)

## Time-ordered data

To improve performance, data is written in time-ascending order.

## Strict update and delete permissions

To increase query and write performance, InfluxDB tightly restricts **update** and **delete** permissions. Time series data is predominantly new data that is never updated. Deletes generally only affect data that isn't being written to, and contentious updates never occur.

## Handle read and write queries first

InfluxDB prioritizes read and write requests over strong consistency. InfluxDB returns results when a query is executed. Any transactions that affect the queried data are processed subsequently to ensure that data is eventually consistency. Therefore, if the ingest rate is high (multiple writes per ms), query results may not include the most recent data.

## Schemaless design

InfluxDB uses a schemaless design to better manage discontinuous data. Time series data are often ephemeral, meaning the data appears for a few hours and then go away. For example, a new host that gets started and reports for a while and then gets shut down.

## Datasets over individual points

Because the data set is more important than an individual point, InfluxDB implements powerful tools to aggregate data and handle large data sets. Points are differentiated by timestamp and series, so don’t have IDs in the traditional sense.

## Duplicate data

To simplify conflict resolution and increase write performance, InfluxDB assumes data sent multiple times is duplicate data. Identical points aren't stored twice. If a new field value is submitted for a point, InfluxDB updates the point with the most recent field value. In rare circumstances, data may be overwritten. Learn more about [duplicate points](/influxdb/v2.0/write-data/best-practices/duplicate-points/).
