---
title: Write a task
seotitle: Write a task that processes data in InfluxDB
description: placeholder
menu:
  v2_0:
    name: Write a task
    parent: Process data
    weight: 1
---

Tasks are essentially Flux scripts with a "destination."
This destination could be


**Requirements:**

- Task options / scheduler block
- Data source
- Some type of aggregation
- and a `to` statement

```js
option task = {
    name: "cqinterval15m",
    every: 1h,
    offset: 15m ,
    concurrency: 4,
    retry: 5
}
```

```js
option task = {
    name: "cqinterval15m",
    cron: "0 0 * * *",
    offset: 15m ,
    concurrency: 4,
    retry: 5
}
```

## Task configuration options

### name
I think it might even be optional
if you dont specify one i think we just put in some default name.

_**Data type:** String_

### every
Defines the inteveral at which the task will run.

_**Data type:** Duration_

_Cannot be used with `cron`_

### cron
- The cron schedule.
- Based on system time.
_**Data type:** String_

_Cannot be used with `every`_

### offset
is so you can allow for data to come in off scheduler. so if you want a task to run on the hour `cron: "0 * * * *"` but your data might come in 10 min late you could say `offset: 15m`

_**Data type:** Duration_

### concurrency
how many concurrent runs of a task can happen at once.. say your schedule is `every: 1s` but it takes 10 sec to complete. you can set a concurrency that will allow that to happen and not just queue up.

_**Data type:** Integer_

### retry
is a int, the number of times to retry before we assume failure.

_**Data type:** Integer_
