---
title: Process Data with InfluxDB tasks
seotitle: Process Data with InfluxDB tasks
description: >
  InfluxDB's task engine runs scheduled Flux tasks that process and analyze data.
  This collection of articles provides information about creating and managing InfluxDB tasks.
menu:
  v2_0:
    name: Process data
    weight: 5
---

InfluxDB's _**task engine**_ is designed for processing and analyzing data.
A task is a scheduled Flux query that take a stream of input data, modify or
analyze it in some way, then perform an action.
Examples include data downsampling, anomaly detection _(Coming)_, alerting _(Coming)_, etc.

{{% note %}}
Tasks are a replacement for InfluxDB v1.x's continuous queries.
{{% /note %}}

The following articles explain how to configure and build tasks using the InfluxDB user interface (UI)
and via raw Flux scripts with the `influx` command line interface (CLI).
They also provide examples of commonly used tasks.

[Write a task](/v2.0/process-data/write-a-task)  
[Manage Tasks](/v2.0/process-data/manage-tasks)  
[Common Tasks](/v2.0/process-data/common-tasks)  
[Task Options](/v2.0/process-data/task-options)
