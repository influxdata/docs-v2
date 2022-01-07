---
title: View tasks
seotitle: View created tasks that process data in InfluxDB
description: >
  View existing data processing tasks using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb_2_0:
    name: View tasks
    parent: Manage tasks
weight: 202
related:
  - /influxdb/v2.0/reference/cli/influx/task/list
---

## View tasks in the InfluxDB UI
Click the **Tasks** icon in the left navigation to view the lists of tasks.

{{< nav-icon "tasks" "v2" >}}

### Filter the list of tasks

1. Click the **Show Inactive** {{< icon "toggle" "v2" >}} toggle to include or exclude
   inactive tasks in the list.
2. Enter text in the **Filter tasks** field to search for tasks by name or label.
3. Click the heading of any column to sort by that field.

## View tasks with the influx CLI
Use the `influx task list` command to return a list of created tasks.

```sh
influx task list
```

#### Filter tasks using the CLI
Other filtering options such as filtering by organization or user,
or limiting the number of tasks returned, are available.
See the [`influx task list` documentation](/influxdb/v2.0/reference/cli/influx/task/list)
for information about other available flags.
