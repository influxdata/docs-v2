---
title: Update a task
seotitle: Update a task for processing data in InfluxDB
description: >
  How to update a task that processes data in InfluxDB using the InfluxDB user
  interface or the 'influx' command line interface.
menu:
  v2_0:
    name: Update a task
    parent: Manage tasks
    weight: 3
---

## Update a task in the InfluxDB UI


## Update a task with the `influx` CLI
Use the `influx task update` command to update or change the status of an existing tasks.
It requires a task ID which is available in the output of `influx task find`.

###### Update a task's Flux script
```sh
# Pattern
influx task update -i <task-id> @/path/to/updated-task-script

# Example
influx task update -i 0343698431c35000 @/tasks/cq-mean-1h.flux
```

###### Update the status of a task
```sh
# Pattern
influx task update -i <task-id> --status < active | inactive >

# Example
influx task update -i 0343698431c35000 --status inactive
```
