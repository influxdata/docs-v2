---
title: Task configuration options
seotitle: InfluxDB task configuration options
description: placeholder
menu:
  v2_0:
    name: Task options
    parent: Process data
    weight: 5
---

Task options define specific information about the task and are specified in your
Flux script or in the InfluxDB user interface (UI).
The following task options are available:

- [name](#name)
- [every](#every)
- [cron](#cron)
- [offset](#offset)
- [concurrency](#concurrency)
- [retry](#retry)

{{% note %}}
`every` and `cron` are mutually exclusive, but at least one is required.
{{% /note %}}

## name
The name of the task.
If no name is specified, the generated task ID is used.

_**Data type:** String_

```js
options task = {
  // ...
  name: "taskName",
}
```

## every
The interval at which the task runs.

_**Data type:** Duration_

```js
options task = {
  every: 1h,
}
```

## cron
The cron schedule on which the task runs. Cron execution is based on system time.

_**Data type:** String_

```js
options task = {
  cron: "0 * * * *",
}
```

## offset
Delays the execution of the task but preserves the original time range.
For example, if a task is to run on the hour, a `10m` offset will delay it to 10
minutes after the hour, but all time ranges defined in the task are relative to
the specified execution time.
A common use case is to allow late data to come in before executing the task.

_**Data type:** Duration_

```js
options task = {
  // ...
  offset: "0 * * * *",
}
```

## concurrency
The number task executions that can run concurrently.
If the concurrency limit is reached, all subsequent executions of the task are be queued
until other running task executions complete.

_**Data type:** Integer_

```js
options task = {
  // ...
  concurrency: 2,
}
```

## retry
The number of times to retry the task before it is considered as having failed.

_**Data type:** Integer_

```js
options task = {
  // ...
  retry: 2,
}
```
