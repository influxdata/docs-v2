---
title: Update a task
seotitle: Update a task for processing data in InfluxDB
description: >
  Update a data processing task in InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  v2_0:
    name: Update a task
    parent: Manage tasks
weight: 204
---

## Update a task in the InfluxDB UI
To view your tasks, click the **Tasks** icon in the left navigation menu.

{{< nav-icon "tasks" >}}

#### Update a task's Flux script
1. In the list of tasks, click the **Name** of the task you want to update.
2. In the left panel, modify the task options.
3. In the right panel, modify the task script.
4. Click **Save** in the upper right.

{{< img-hd src="/img/2-0-tasks-create-edit.png" alt="Update a task" />}}

#### Update the status of a task
In the list of tasks, click the {{< icon "toggle" >}} toggle to the left of the
task you want to activate or inactivate.

#### Update a task's description
1. In the list of tasks, click the task you want to update.

## Update a task with the influx CLI
Use the `influx task update` command to update or change the status of an existing task.

_This command requires a task ID, which is available in the output of `influx task find`._

#### Update a task's Flux script
Pass the file path of your updated Flux script to the `influx task update` command
with the ID of the task you want to update.
Modified [task options](/v2.0/process-data/task-options) defined in the Flux
script are also updated.

```sh
# Pattern
influx task update -i <task-id> @/path/to/updated-task-script

# Example
influx task update -i 0343698431c35000 @/tasks/cq-mean-1h.flux
```

#### Update the status of a task
Pass the ID of the task you want to update to the `influx task update`
command with the `--status` flag.

_Possible arguments of the `--status` flag are `active` or `inactive`._

```sh
# Pattern
influx task update -i <task-id> --status < active | inactive >

# Example
influx task update -i 0343698431c35000 --status inactive
```
