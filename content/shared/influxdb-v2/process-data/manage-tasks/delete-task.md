---
title: Delete a task
seotitle: Delete a task for processing data in InfluxDB
description: >
  Delete a task from InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_v2:
    name: Delete a task
    parent: Manage tasks
weight: 206
related:
  - /influxdb/v2/reference/cli/influx/task/delete
---

## Delete a task in the InfluxDB UI
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" >}}

2. In the list of tasks, hover over the task you want to delete.
3. Click **Delete** on the far right.
4. Click **Confirm**.

## Delete a task with the influx CLI
Use the `influx task delete` command to delete a task.

```sh
# Syntax
influx task delete -i <task-id>

# Example
influx task delete -i 0343698431c35000
```

_To find the task ID, see [how to view tasks](/influxdb/v2/process-data/manage-tasks/view-tasks/)_

## Delete a task using the InfluxDB API

Use the [`/tasks/TASK_ID` InfluxDB API endpoint](/influxdb/v2/api/#operation/DeleteTasksID) to delete a task and all associated records (task runs, logs, and labels).

{{< api-endpoint method="DELETE" endpoint="http://localhost:8086/api/v2/tasks/TASK_ID" api-ref="/influxdb/v2/api/#operation/DeleteTasksID" >}}

_To find the task ID, see [how to view tasks](/influxdb/v2/process-data/manage-tasks/view-tasks/)_

Once the task is deleted, InfluxDB cancels all scheduled runs of the task.

If you want to disable a task instead of delete it, see how to
[update the task status](/influxdb/v2/process-data/manage-tasks/update-task/) to `inactive`.
