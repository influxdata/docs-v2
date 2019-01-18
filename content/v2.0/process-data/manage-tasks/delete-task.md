---
title: Delete a task
seotitle: Delete a task for processing data in InfluxDB
description: >
  How to delete a task in InfluxDB using the InfluxDB user interface or using
  the 'influx' command line interface.
menu:
  v2_0:
    name: Delete a task
    parent: Manage tasks
    weight: 4
---

## Delete a task in the InfluxDB UI


## Delete a task with the `influx` CLI
Use the `influx task delete` command to delete a task.
It requires a task ID, which is available in the output of `influx task find`.

```sh
# Pattern
influx task delete -i <task-id>

# Example
influx task delete -i 0343698431c35000
```
