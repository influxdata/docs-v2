---
title: Run a task
seotitle: Run an InfluxDB task
description: >
  Run a data processing task using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_0:
    name: Run a task
    parent: Manage tasks
weight: 203
related:
  - /influxdb/v2.0/reference/cli/influx/task/run
  - /influxdb/v2.0/reference/cli/influx/task/retry
---

InfluxDB data processing tasks generally run in defined intervals or at a specific time,
however, you can manually run a task from the InfluxDB user interface (UI) or the
`influx` command line interface (CLI).

## Run a task from the InfluxDB UI
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Hover over the task you want to run and click the **{{< icon "gear" >}}** icon.
3. Select **Run Task**.

## Run a task with the influx CLI
Use the `influx task run retry` command to run a task.

{{% note %}}
To run a task from the `influx` CLI, the task must have already run at least once.
{{% /note %}}

```sh
# List all tasks to find the ID of the task to run
influx task list

# Use the task ID to list previous runs of the task
influx task run list --task-id=0000000000000000

# Use the task ID and run ID to retry a run
influx task run retry --task-id=0000000000000000 --run-id=0000000000000000
```
