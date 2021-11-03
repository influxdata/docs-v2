---
title: Update a task
seotitle: Update a task for processing data in InfluxDB
description: >
  Update a data processing task in InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_0:
    name: Update a task
    parent: Manage tasks
weight: 204
related:
  - /influxdb/v2.0/reference/cli/influx/task/update
---

## Update a task in the InfluxDB UI
Click the **Tasks** icon in the left navigation to view the lists of tasks.

{{< nav-icon "tasks" >}}

Click the name of a task to update it.

#### Update a task Flux script
1. In the list of tasks, click the **Name** of the task you want to update.
2. In the left panel, modify the task options.
3. In the right panel, modify the task script.
4. Click **Save** in the upper right.


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
Modified [task options](/influxdb/v2.0/process-data/task-options) defined in the Flux
script are also updated.

```sh
# Syntax
influx task update -i <task-id> -f </path/to/updated-task-script>

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

# Example
influx task update -i 0343698431c35000 --status inactive
```
