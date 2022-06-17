---
title: Delete a task
seotitle: Delete a task for processing data in InfluxDB
description: >
  Delete a task from InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_1:
    name: Delete a task
    parent: Manage tasks
weight: 206
related:
  - /influxdb/v2.1/reference/cli/influx/task/delete
---

## Delete a task in the InfluxDB UI
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. Find the task you want to delete and click the **{{< icon "delete" >}}** icon located far right of the task name.
3. Click **{{< caps >}}Confirm{{< /caps >}}**.

## Delete a task with the influx CLI
Use the `influx task delete` command to delete a task.

_This command requires a task ID, which is available in the output of `influx task list`._

```sh
# Syntax
influx task delete -i <task-id>

# Example
influx task delete -i 0343698431c35000
```
