---
title: tasks.lastSuccess() function
description: >
  `tasks.lastSuccess()` returns the time of the last successful run of the InfluxDB task
  or the value of the `orTime` parameter if the task has never successfully run.
menu:
  flux_v0_ref:
    name: tasks.lastSuccess
    parent: influxdata/influxdb/tasks
    identifier: influxdata/influxdb/tasks/lastSuccess
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/tasks/tasks.flux#L52-L52

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tasks.lastSuccess()` returns the time of the last successful run of the InfluxDB task
or the value of the `orTime` parameter if the task has never successfully run.



##### Function type signature

```js
(orTime: A) => time where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### orTime
({{< req >}})
Default time value returned if the task has never successfully run.




## Examples

### Return the time an InfluxDB task last succesfully ran

```js
import "influxdata/influxdb/tasks"

tasks.lastSuccess(orTime: 2020-01-01T00:00:00Z)

```

