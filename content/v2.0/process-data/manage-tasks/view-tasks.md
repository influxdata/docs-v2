---
title: View tasks in InfluxDB
seotitle: View created tasks that process data in InfluxDB
description: >
  How to view all created data processing tasks using the InfluxDB user interface
  or the 'influx' command line interface.
menu:
  v2_0:
    name: View tasks
    parent: Manage tasks
    weight: 2
---

## View tasks in the InfluxDB UI


## View tasks with the `influx` CLI
Use the `influx task find` command to return a list of created tasks.

```sh
influx task find
```

_Other filtering options such as filtering by organization or user, or limiting the number of tasks returned are available.
See the [`influx task find` documentation](#) for information about other available flags._
