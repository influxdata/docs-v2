---
title: Delete a task
seotitle: Delete a task for processing data in InfluxDB
description: >
  How to delete a task in InfluxDB using the InfluxDB user interface or using
  the 'influx' command line interface.
v2.0/tags: [tasks]
menu:
  v2_0:
    name: Delete a task
    parent: Manage tasks
    weight: 4
---

## Delete a task in the InfluxDB UI
1. Click the **Tasks** icon in the left navigation menu.

    {{< img-hd src="/img/tasks-icon.png" alt="Tasks Icon" />}}

2. In the list of tasks, hover over the task you would like to delete.
3. Click **Delete** on the far right.
4. Click **Confirm**.


## Delete a task with the influx CLI
Use the `influx task delete` command to delete a task.

_This command requires a task ID, which is available in the output of `influx task find`._

```sh
# Pattern
influx task delete -i <task-id>

# Example
influx task delete -i 0343698431c35000
```
