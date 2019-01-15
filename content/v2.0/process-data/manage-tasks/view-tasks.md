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

```sh
influx task find -i task-id -n user-id --limit=100 --org-id=organization-id
```
