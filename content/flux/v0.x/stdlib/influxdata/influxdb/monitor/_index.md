---
title: Flux InfluxDB monitor package
list_title: monitor package
description: >
  The InfluxDB `monitor` package provides tools for monitoring and alerting with InfluxDB.
  Import the `influxdata/influxdb/monitor` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/monitor/
  - /influxdb/v2.0/reference/flux/stdlib/monitor/
  - /influxdb/cloud/reference/flux/stdlib/monitor/
menu:
  flux_0_x_ref:
    name: monitor
    parent: influxdb-pkg
weight: 202
flux/v0.x/tags: [functions, monitor, alerts, package]
introduced: 0.39.0
---

The Flux `monitor` package provides tools for monitoring and alerting with InfluxDB.
Import the `influxdata/influxdb/monitor` package:

```js
import "influxdata/influxdb/monitor"
```

## Options
The `monitor` packages provides the following options:

```js
import "influxdata/influxdb/monitor"

option monitor.write = (tables=<-) => tables |> experimental.to(bucket: bucket)
option monitor.log = (tables=<-) => tables |> experimental.to(bucket: bucket)
```

### write {data-type="function"}
Function option that defines how check statuses are written to InfluxDB.
Default is:

```js
(tables=<-) => tables |> experimental.to(bucket: bucket)
```

### log {data-type="function"}
Function option that defines how notification event logs are written to InfluxDB.
Default is:

```js
(tables=<-) => tables |> experimental.to(bucket: bucket)
```

## Functions
{{< children type="functions" show="pages" >}}
