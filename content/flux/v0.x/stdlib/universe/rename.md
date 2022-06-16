---
title: rename() function
description: >
  `rename()` renames columns in a table.
menu:
  flux_0_x_ref:
    name: rename
    parent: universe
    identifier: universe/rename
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2193-L2197

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`rename()` renames columns in a table.

If a column in group key is renamed, the column name in the group key is updated.

##### Function type signature

```js
rename = (<-tables: stream[B], ?columns: A, ?fn: (column: string) => string) => stream[C] where A: Record, B: Record, C: Record
```

## Parameters

### columns


Record that maps old column names to new column names.

### fn


Function that takes the current column name (`column`) and returns a
new column name.

### tables


Input data. Default is piped-forward data (`<-`).


## Examples


### Map column names to new column names

```js
import "sampledata"

sampledata.int()
    |> rename(columns: {tag: "uid", _value: "val"})
```

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | val  | *uid |
| -------------------- | ---- | ---- |
| 2021-01-01T00:00:00Z | -2   | t1   |
| 2021-01-01T00:00:10Z | 10   | t1   |
| 2021-01-01T00:00:20Z | 7    | t1   |
| 2021-01-01T00:00:30Z | 17   | t1   |
| 2021-01-01T00:00:40Z | 15   | t1   |
| 2021-01-01T00:00:50Z | 4    | t1   |

| _time                | val  | *uid |
| -------------------- | ---- | ---- |
| 2021-01-01T00:00:00Z | 19   | t2   |
| 2021-01-01T00:00:10Z | 4    | t2   |
| 2021-01-01T00:00:20Z | -3   | t2   |
| 2021-01-01T00:00:30Z | 19   | t2   |
| 2021-01-01T00:00:40Z | 13   | t2   |
| 2021-01-01T00:00:50Z | 1    | t2   |


### Rename columns using a function

```js
import "sampledata"

sampledata.int()
    |> rename(fn: (column) => "${column}_new")
```

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time_new            | _value_new  | *tag_new |
| -------------------- | ----------- | -------- |
| 2021-01-01T00:00:00Z | -2          | t1       |
| 2021-01-01T00:00:10Z | 10          | t1       |
| 2021-01-01T00:00:20Z | 7           | t1       |
| 2021-01-01T00:00:30Z | 17          | t1       |
| 2021-01-01T00:00:40Z | 15          | t1       |
| 2021-01-01T00:00:50Z | 4           | t1       |

| _time_new            | _value_new  | *tag_new |
| -------------------- | ----------- | -------- |
| 2021-01-01T00:00:00Z | 19          | t2       |
| 2021-01-01T00:00:10Z | 4           | t2       |
| 2021-01-01T00:00:20Z | -3          | t2       |
| 2021-01-01T00:00:30Z | 19          | t2       |
| 2021-01-01T00:00:40Z | 13          | t2       |
| 2021-01-01T00:00:50Z | 1           | t2       |

