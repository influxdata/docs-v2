---
title: influxql package
description: >
  The `influxql` package provides constants for working with InfluxQL.
menu:
  flux_v0_ref:
    name: influxql 
    parent: internal
    identifier: internal/influxql
weight: 21
cascade:

  introduced: 0.60.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/influxql/influxql.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `influxql` package provides constants for working with InfluxQL.

## Constants

```js
influxql.epoch = 1970-01-01T00:00:00Z
influxql.maxTime = 2262-04-11T23:47:16.854775806Z
influxql.minTime = 1677-09-21T00:12:43.145224194Z
```

- **influxql.epoch** is the absolute time that all InfluxQL time and duration values use as a zero reference.
- **influxql.maxTime** is the latest time InfluxQL can represent.
- **influxql.minTime** is the earliest time InfluxQL can represent.

