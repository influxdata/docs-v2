---
title: View tasks
seotitle: View created tasks that process data in InfluxDB
description: >
  How to view all created data processing tasks using the InfluxDB user interface
  or the `influx` command line interface.
menu:
  v2_0:
    name: View tasks
    parent: Manage tasks
weight: 202
---

## View tasks in the InfluxDB UI
Click the **Tasks** icon in the left navigation to view the lists of tasks.

{{< nav-icon "tasks" >}}

### Filter the list of tasks

1. Click the **Show Inactive** {{< icon "toggle" >}} toggle to include or exclude
   inactive tasks in the list.
2. Enter text in the **Filter tasks** field to search for tasks by name or label.
3. Click on the heading of any column to sort by that field.

## View tasks with the influx CLI
Use the `influx task find` command to return a list of created tasks.

```sh
influx task find
```

#### Filter tasks using the CLI
Other filtering options such as filtering by organization or user,
or limiting the number of tasks returned, are available.
See the [`influx task find` documentation](/v2.0/reference/cli/influx/task/find)
for information about other available flags.
