---
title: query.filterFields() function
description: >
  `query.filterFields()` filters input data by field.
menu:
  flux_0_x_ref:
    name: query.filterFields
    parent: experimental/query
    identifier: experimental/query/filterFields
weight: 201
flux/v0.x/tags: [transformations, filters]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/query/from.flux#L82-L86

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`query.filterFields()` filters input data by field.



##### Function type signature

```js
query.filterFields = (<-table: stream[{B with _field: A}], ?fields: [A]) => stream[{B with _field: A}] where A: Nullable
```

## Parameters

### fields


Fields to filter by. Default is `[]`.

### table


Input data. Default is piped-forward data (`<-`).


## Examples


### Query specific fields from InfluxDB

```js
import "experimental/query"

query.fromRange(bucket: "telegraf", start: -1h)
    |> query.filterFields(fields: ["used_percent", "available_percent"])
```

