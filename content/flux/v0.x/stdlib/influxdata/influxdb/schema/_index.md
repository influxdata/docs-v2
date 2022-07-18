---
title: schema package
description: >
  The `schema` package provides functions for exploring your InfluxDB data schema.
menu:
  flux_0_x_ref:
    name: schema 
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/schema
weight: 31
cascade:

  introduced: 0.88.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/
append:
  block: warn
  content: |
    #### Not supported in the Flux REPL
    `schema` functions can retrieve schema information when executed within
    the context of InfluxDB, but not from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/schema/schema.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `schema` package provides functions for exploring your InfluxDB data schema.
Import the `influxdata/influxdb/schema` package:

```js
import "influxdata/influxdb/schema"
```




## Functions

{{< children type="functions" show="pages" >}}
