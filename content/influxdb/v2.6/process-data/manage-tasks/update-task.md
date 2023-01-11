---
title: Update a task
seotitle: Update a task for processing data in InfluxDB
description: >
  Update a data processing task in InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_6:
    name: Update a task
    parent: Manage tasks
weight: 204
related:
  - /influxdb/v2.6/reference/cli/influx/task/update
---

## Update a task in the InfluxDB UI
1. In the navigation menu on the left, select **Tasks**.

    {{< nav-icon "tasks" "v2" >}}

2. Find the task you would like to edit and click the **{{< icon "settings" >}}** icon located far right of the task name.
3. Click **Edit**.
4. Click **{{< caps >}}Save{{< /caps >}}** in the upper right.

#### Update a task Flux script
1. In the list of tasks, click the **Name** of the task you want to update.
2. In the left panel, modify the task options.
3. In the right panel, modify the task script.
4. Click **{{< caps >}}Save{{< /caps >}}** in the upper right.

#### Update the status of a task
In the list of tasks, click the {{< icon "toggle" >}} toggle to the left of the
task you want to activate or inactivate.

#### Update a task description
1. In the list of tasks, hover over the name of the task you want to update.
2. Click the pencil icon {{< icon "pencil" >}}.
3. Click outside of the field or press `RETURN` to update.

## Update a task with the influx CLI
Use the `influx task update` command to update or change the status of an existing task.

_This command requires a task ID, which is available in the output of `influx task list`._

#### Update a task Flux script
Pass the file path of your updated Flux script to the `influx task update` command
with the ID of the task you want to update.
Modified [task options](/influxdb/v2.6/process-data/task-options) defined in the Flux
script are also updated.

```sh
# Syntax
influx task update -i <task-id> -f </path/to/updated-task-script>
```

```sh
# Example
influx task update -i 0343698431c35000 -f /tasks/cq-mean-1h.flux
```

#### Update the status of a task
Pass the ID of the task you want to update to the `influx task update`
command with the `--status` flag.

_Possible arguments of the `--status` flag are `active` or `inactive`._

```sh
# Syntax
influx task update -i <task-id> --status < active | inactive >
```

```sh
# Example
influx task update -i 0343698431c35000 --status inactive
```

## Update a task with the InfluxDB API
Use the [`/tasks/TASK_ID`
InfluxDB API endpoint](/influxdb/v2.6/api/#operation/PatchTasksID) to update properties of a task.

{{< api-endpoint method="PATCH" endpoint="http://localhost:8086/api/v2/tasks/TASK_ID" >}}

In your request, pass the task ID and an object that contains the updated key-value pairs.
To activate or inactivate a task, set the `status` property.
`"status": "inactive"` cancels scheduled runs and prevents manual runs of the task.
_To find the task ID, see [how to view tasks](/influxdb/v2.6/process-data/manage-tasks/view-tasks/)._

Once InfluxDB applies the update, it cancels all previously scheduled runs of the task.
