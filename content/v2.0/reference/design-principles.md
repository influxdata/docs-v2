---
title: InfluxDB design principles
description: >
  Principles and tradeoffs related to InfluxDB design.
weight: 7
menu:
  v2_0_ref:
    name: Design principles
v2.0/tags: [InfluxDB design principles]
---

InfluxDB 2.0 implements optimal design principles for time series data. Some of these design principles may have associated tradeoffs in performance.

| Design principle | Tradeoff|
|:---|:----------|
|To simplify conflict resolution and increase write performance, InfluxDB assumes data sent multiple times is duplicate data.|Duplicate data isn’t stored. In rare circumstances, data may be overwritten.|
|To increase query and write performance, InfluxDB restricts access to update and delete data. Time series data is predominantly new data that is never updated. Deletes are almost always of data that isn't being written to, and contentious updates never occur.|Update and delete functionality is significantly restricted.|
|To significantly improve performance, data is written in time-ascending order.|Writing points with random times (or in non-ascending order) is not performant.|
|Writing and querying the data is more important than having a strongly consistent view. Multiple clients can writes InfluxDB at high loads.|Query returns may not include the most recent points if database is under heavy load.|
|To better manage discontinuous data,  InfluxDB uses a schemaless design. Many time series are ephemeral. There are often time series that appear only for a few hours and then go away, for example, a new host that gets started and reports for a while and then gets shut down.|A few database functions aren’t supported, for example, no cross table joins.|
Because the data set is more important than an individual point, InfluxDB implements powerful tools to aggregate data and handle large data sets.|Points are differentiated by timestamp and series, so don’t have IDs in the traditional sense.|
