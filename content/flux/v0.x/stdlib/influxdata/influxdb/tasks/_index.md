---
title: tasks package
description: >
  The `tasks` package provides tools for working with InfluxDB tasks.
menu:
  flux_0_x_ref:
    name: tasks 
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/tasks
weight: 31
cascade:

  introduced: 0.84.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-tasks/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-tasks/
related:
  - /{{< latest "influxdb" >}}/process-data/get-started/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/tasks/tasks.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `tasks` package provides tools for working with InfluxDB tasks.
Import the `influxdata/influxdb/tasks` package:

```js
import "influxdata/influxdb/tasks"
```



## Options

```js
option tasks.lastSuccessTime = _zeroTime
```
 
### lastSuccessTime

`lastSuccessTime` is the last time this task ran successfully.




## Functions

{{< children type="functions" show="pages" >}}
