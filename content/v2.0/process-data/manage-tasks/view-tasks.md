---
title: View tasks
seotitle: View created tasks that process data in InfluxDB
description: >
  How to view all created data processing tasks using the InfluxDB user interface
  or the 'influx' command line interface.
v2.0/tags: [tasks]
menu:
  v2_0:
    name: View tasks
    parent: Manage tasks
weight: 202
---

## View tasks in the InfluxDB UI
Click the **Tasks** icon in the left navigation to view the lists of tasks.

{{< img-hd src="/img/tasks-icon.png" alt="Tasks Icon" />}}

### Filter the list of tasks

1. Enable the **Show Inactive** option to include inactive tasks in the list.
2. Enter text in the **Filter tasks by name** field to search for tasks by name.
3. Select an organization from the **All Organizations** dropdown to filter the list by organization.
4. Click on the heading of any column to sort by that field.

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
