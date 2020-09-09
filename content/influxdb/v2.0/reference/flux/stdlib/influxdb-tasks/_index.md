---
title: Flux InfluxDB Tasks package
list_title: InfluxDB Tasks package
description: >
  The Flux InfluxDB Tasks package provides options and functions for working with
  [InfluxDB tasks](/influxdb/v2.0/process-data/get-started/).
  Import the `influxdata/influxdb/tasks` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
menu:
  influxdb_2_0_ref:
    name: InfluxDB Tasks
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, tasks, package]
related:
  - /influxdb/v2.0/process-data/get-started/
---

The Flux InfluxDB Tasks package provides options and functions for working with
[InfluxDB tasks](/influxdb/v2.0/process-data/get-started/).
Import the `influxdata/influxdb/tasks` package:

```js
import "influxdata/influxdb/tasks"
```

## Options
The InfluxDB Tasks package provides the following options:

#### lastSuccessTime
Define the time of the last successful task run.
_Only use this option to override the time of the last successful run provided by
the InfluxDB task engine._

```js
import "influxdata/influxdb/tasks"

option tasks.lastSuccessTime = 0000-01-01T00:00:00Z
```

## Functions

{{< children type="functions" show="pages" >}}
