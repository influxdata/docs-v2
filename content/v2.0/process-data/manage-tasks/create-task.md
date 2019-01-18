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
    weight: 1
---

_This article assumes you have already [written a task](/v2.0/process-data/write-a-task)._

## Create a task in the InfluxDB UI

- From the data Explorer
- From the task UI

## Create a task with the `influx` CLI
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
