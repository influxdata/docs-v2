---
title: Task configuration options
seotitle: InfluxDB task configuration options
description: >
  Task options define specific information about a task such as its name,
  the schedule on which it runs, execution delays, and others.
menu:
  influxdb_2_0:
    name: Task options
    parent: Process data
weight: 105
influxdb/v2.0/tags: [tasks, flux]
---

Task options define specific information about a task.
They are set in a Flux script or in the InfluxDB user interface (UI).
The following task options are available:

- [name](#name)
- [every](#every)
- [cron](#cron)
- [offset](#offset)
- [concurrency](#concurrency)

{{% note %}}
`every` and `cron` are mutually exclusive, but at least one is required.
{{% /note %}}

## name
The name of the task. _**Required**_.

_**Data type:** String_

```js
option task = {
  name: "taskName",
  // ...
}
```

## every

The interval at which the task runs.

This option also determines when the task first starts to run, depending on the specified time.

For example, if you save or schedule a task at 2:30 and specify the task should run every hour (`1h`), the task first executes at 3:00pm, and subsequently every hour after that.
option task = {name: "aggregation", every: 1h}

Likewise, if you schedule the following task at 2:30.05 pm and specify the task should run every minute (`1m`), the task first executes at 2:31.00pm, and subsequently every minute after that.
option task = {name: "aggregation", every: 1m}

_**Data type:** Duration_

```js
option task = {
  // ...
  every: 1h,
}
```

{{% note %}}
In the InfluxDB UI, the **Interval** field sets this option.
{{% /note %}}

## cron
The [cron expression](https://en.wikipedia.org/wiki/Cron#Overview) that
defines the schedule on which the task runs.
Cron scheduling is based on system time.

_**Data type:** String_

```js
option task = {
  // ...
  cron: "0 * * * *",
}
```

## offset

Delays the execution of the task but preserves the original time range.
For example, if a task is to run on the hour, a `10m` offset will delay it to 10
minutes after the hour, but all time ranges defined in the task are relative to
the specified execution time.
A common use case is offsetting execution to account for data that may arrive late.

_**Data type:** Duration_

```js
option task = {
  // ...
  offset: 10m,
}
```

## concurrency
The number task of executions that can run concurrently.
If the concurrency limit is reached, all subsequent executions are queued until
other running task executions complete.

_**Data type:** Integer_

```js
option task = {
  // ...
  concurrency: 2,
}
```
