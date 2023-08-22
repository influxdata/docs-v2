---
title: Process data with InfluxDB tasks
seotitle: Process data with InfluxDB tasks
description: >
  InfluxDB's task engine runs scheduled Flux tasks that process and analyze data.
  This collection of articles provides information about creating and managing InfluxDB tasks.
menu:
  influxdb_2_7:
    name: Process data
weight: 6
influxdb/v2.7/tags: [tasks]
related:
  - /resources/videos/influxdb-tasks/
---

Process and analyze your data with tasks in the InfluxDB **task engine**.
Use tasks (scheduled Flux queries)
to input a data stream and then analyze, modify, and act on the data accordingly.

Discover how to create and manage tasks using the InfluxDB user interface (UI)
the `influx` command line interface (CLI), and the InfluxDB `/api/v2` API.
Find examples of data downsampling and other common tasks.

{{% note %}}
Tasks replace InfluxDB v1.x continuous queries.
{{% /note %}}

{{< children >}}
