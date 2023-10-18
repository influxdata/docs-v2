---
title: v1 package
description: >
  The `v1` package provides tools for managing data from an InfluxDB v1.x database or
  structured using the InfluxDB v1 data structure.
menu:
  flux_v0_ref:
    name: v1 
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/v1
weight: 31
cascade:

  introduced: 0.16.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `v1` package provides tools for managing data from an InfluxDB v1.x database or
structured using the InfluxDB v1 data structure.
Import the `influxdata/influxdb/v1` package:

```js
import "influxdata/influxdb/v1"
```

### Deprecated functions
In Flux 0.88.0, the following v1 package functions moved to
the InfluxDB schema package. These functions are still available in the v1
package for backwards compatibility, but are deprecated in favor of the
schema package.

- `v1.fieldKeys()`
- `v1.fieldsAsCols()`
- `v1.measurementFieldKeys()`
- `v1.measurements()`
- `v1.measurementTagKeys()`
- `v1.measurementTagValues()`
- `v1.tagKeys()`
- `v1.tagValues()`


## Functions

{{< children type="functions" show="pages" >}}
