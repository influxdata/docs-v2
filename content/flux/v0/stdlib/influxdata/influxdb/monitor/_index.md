---
title: monitor package
description: >
  The `monitor` package provides tools for monitoring and alerting with InfluxDB.
menu:
  flux_v0_ref:
    name: monitor 
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/monitor
weight: 31
cascade:

  introduced: 0.39.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/monitor/monitor.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `monitor` package provides tools for monitoring and alerting with InfluxDB.
Import the `influxdata/influxdb/monitor` package:

```js
import "influxdata/influxdb/monitor"
```

## Constants

```js
monitor.bucket = "_monitoring"
monitor.levelCrit = "crit"
monitor.levelInfo = "info"
monitor.levelOK = "ok"
monitor.levelUnknown = "unknown"
monitor.levelWarn = "warn"
```

- **monitor.bucket** is the default bucket to store InfluxDB monitoring data in.
- **monitor.levelCrit** is the string representation of the "crit" level.
- **monitor.levelInfo** is the string representation of the "info" level.
- **monitor.levelOK** is the string representation of the "ok" level.
- **monitor.levelUnknown** is the string representation of the an unknown level.
- **monitor.levelWarn** is the string representation of the "warn" level.

## Options

```js
option monitor.log = (tables=<-) => tables |> experimental.to(bucket: bucket)

option monitor.write = (tables=<-) => tables |> experimental.to(bucket: bucket)
```
 
### log

`log` persists notification events to an InfluxDB bucket.


### write

`write` persists check statuses to an InfluxDB bucket.



## Functions

{{< children type="functions" show="pages" >}}
