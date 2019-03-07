---
title: Create a task
seotitle: Create a task for processing data in InfluxDB
description: >
  How to create a task that processes data in InfluxDB using the InfluxDB user
  interface or the 'influx' command line interface.
menu:
  v2_0:
    name: Create a task
    parent: Manage tasks
weight: 201
---

InfluxDB provides multiple ways to create tasks both in the InfluxDB user interface (UI)
and the `influx` command line interface (CLI).

_This article assumes you have already [written a task](/v2.0/process-data/write-a-task)._

## Create a task in the InfluxDB UI
The InfluxDB UI provides multiple ways to create a task:

- [Create a task from the Data Explorer](#create-a-task-from-the-data-explorer)
- [Create a task in the Task UI](#create-a-task-in-the-task-ui)
- [Import a task](#import-a-task)

### Create a task from the Data Explorer
1. Click on the **Data Explorer** icon in the left navigation menu.

    {{< nav-icon "data-explorer" >}}

2. Building a query and click **Save As** in the upper right.
3. Select the **Task** option.
4. Specify the task options. See [Task options](/v2.0/process-data/task-options)
   for detailed information about each option.
5. Click **Save as Task**.

{{< img-hd src="/img/data-explorer-save-as-task.png" title="Add a task from the Data Explorer"/>}}

### Create a task in the Task UI
1. Click on the **Tasks** icon in the left navigation menu.

    {{< nav-icon "tasks" >}}

2. Click **+ Create Task** in the upper right.
3. In the left panel, specify the task options.
   See [Task options](/v2.0/process-data/task-options)for detailed information about each option.
4. In the right panel, enter your task script.
5. Click **Save** in the upper right.

{{< img-hd src="/img/tasks-create-edit.png" title="Create a task" />}}

### Import a task
1. Click on the **Tasks** icon in the left navigation menu.

    {{< nav-icon "tasks" >}}
    
2. Click **Import** in the upper right.
3. Drag and drop or select a file to upload.
4. Click **Upload Task**.

## Create a task using the influx CLI
Use `influx task create` command to create a new task.
It accepts either a file path or raw Flux.

###### Create a task using a file
```sh
# Pattern
influx task create --org <org-name> @</path/to/task-script>

# Example
influx task create --org my-org @/tasks/cq-mean-1h.flux
```

###### Create a task using raw Flux
```sh
influx task create --org my-org - # <return> to open stdin pipe

options task = {
  name: "task-name",
  every: 6h
}

# ... Task script ...

# <ctrl-d> to close the pipe and submit the command
```
