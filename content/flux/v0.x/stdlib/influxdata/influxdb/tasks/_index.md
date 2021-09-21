---
title: Flux InfluxDB `tasks` package
list_title: tasks package
description: >
  The Flux InfluxDB `tasks` package provides options and functions for working with
  [InfluxDB tasks](/influxdb/cloud/process-data/get-started/).
  Import the `influxdata/influxdb/tasks` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-tasks/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-tasks/
menu:
  flux_0_x_ref:
    name: tasks
    parent: influxdb-pkg
weight: 202
flux/v0.x/tags: [functions, tasks, package]
related:
  - /{{< latest "influxdb" >}}/process-data/get-started/
introduced: 0.84.0
---

The Flux InfluxDB `tasks` package provides options and functions for working with
[InfluxDB tasks](/influxdb/cloud/process-data/get-started/).
Import the `influxdata/influxdb/tasks` package:

```js
import "influxdata/influxdb/tasks"
```

## Options
The `influxdata/influxdb/tasks` package provides the following options:

```js
import "influxdata/influxdb/tasks"

option tasks.lastSuccessTime = 0000-01-01T00:00:00Z
```

### lastSuccessTime {data-type="time"}
Define the time of the last successful task run.
_Only use this option to override the time of the last successful run provided by
the InfluxDB task engine._

## Functions

{{< children type="functions" show="pages" >}}
