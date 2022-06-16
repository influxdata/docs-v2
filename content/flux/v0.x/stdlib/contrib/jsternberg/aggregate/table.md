---
title: aggregate.table() function
description: >
  `aggregate.table()` will aggregate columns and create tables with a single
  row containing the aggregated value.
menu:
  flux_0_x_ref:
    name: aggregate.table
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/table
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L49-L49

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.table()` will aggregate columns and create tables with a single
row containing the aggregated value.



##### Function type signature

```js
aggregate.table = (<-tables: stream[B], columns: A) => stream[C] where A: Record, B: Record, C: Record
```

## Parameters

### tables


Input data. Default is piped-forward data (`<-`).

### columns

({{< req >}})
Columns to aggregate and which aggregate method to use.Columns is a record where the key is a column name and the value is an aggregate record.
   The aggregate record is composed of at least the following required attributes:
       - **column**: Input column name (string).
       - **init**: A function to compute the initial state of the
           output. This can return either the final aggregate or a
           temporary state object that can be used to compute the
           final aggregate. The `values` parameter will always be a
           non-empty array of values from the specified column.
           For example: `(values) => state`.
       - **reduce**: A function that takes in another buffer of values
           and the current state of the aggregate and computes
           the updated state.
           For example: `(values, state) => state`.
       - **compute**: A function that takes the state and computes the final
           aggregate. For example, `(state) => value`.
       - **fill**: The value passed to `fill()`. If present, the fill value
           determines what the aggregate does when there are no values.
           This can either be a value or one of the predefined
           identifiers of `null` or `none`.
           This value must be the same type as the value return from
           `compute`.


## Examples


### Compute the min of a specific column

```js
import "sampledata"
import "contrib/jsternberg/aggregate"

sampledata.float()
    |> aggregate.table(columns: {"min_bottom_degrees": aggregate.min(column: "_value")})
```

#### Input data

| *tag | min_bottom_degrees  |
| ---- | ------------------- |
| t1   | -2.18               |

| *tag | min_bottom_degrees  |
| ---- | ------------------- |
| t2   | -3.75               |


#### Output data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |

