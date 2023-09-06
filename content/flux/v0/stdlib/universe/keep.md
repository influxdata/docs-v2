---
title: keep() function
description: >
  `keep()` returns a stream of tables containing only the specified columns.
menu:
  flux_v0_ref:
    name: keep
    parent: universe
    identifier: universe/keep
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1251-L1254

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`keep()` returns a stream of tables containing only the specified columns.

Columns in the group key that are not specifed in the `columns` parameter or
identified by the `fn` parameter are removed from the group key and dropped
from output tables. `keep()` is the inverse of `drop()`.

##### Function type signature

```js
(<-tables: stream[A], ?columns: [string], ?fn: (column: string) => bool) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### columns

Columns to keep in output tables. Cannot be used with `fn`.



### fn

Predicate function that takes a column name as a parameter (column) and
returns a boolean indicating whether or not the column should be kept in
output tables. Cannot be used with `columns`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Keep a list of columns](#keep-a-list-of-columns)
- [Keep columns matching a predicate](#keep-columns-matching-a-predicate)

### Keep a list of columns

```js
import "sampledata"

sampledata.int()
    |> keep(columns: ["_time", "_value"])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

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

| _time                | _value  |
| -------------------- | ------- |
| 2021-01-01T00:00:00Z | -2      |
| 2021-01-01T00:00:10Z | 10      |
| 2021-01-01T00:00:20Z | 7       |
| 2021-01-01T00:00:30Z | 17      |
| 2021-01-01T00:00:40Z | 15      |
| 2021-01-01T00:00:50Z | 4       |
| 2021-01-01T00:00:00Z | 19      |
| 2021-01-01T00:00:10Z | 4       |
| 2021-01-01T00:00:20Z | -3      |
| 2021-01-01T00:00:30Z | 19      |
| 2021-01-01T00:00:40Z | 13      |
| 2021-01-01T00:00:50Z | 1       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Keep columns matching a predicate

```js
import "sampledata"

sampledata.int()
    |> keep(fn: (column) => column =~ /^_?t/)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

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

| _time                | *tag |
| -------------------- | ---- |
| 2021-01-01T00:00:00Z | t1   |
| 2021-01-01T00:00:10Z | t1   |
| 2021-01-01T00:00:20Z | t1   |
| 2021-01-01T00:00:30Z | t1   |
| 2021-01-01T00:00:40Z | t1   |
| 2021-01-01T00:00:50Z | t1   |

| _time                | *tag |
| -------------------- | ---- |
| 2021-01-01T00:00:00Z | t2   |
| 2021-01-01T00:00:10Z | t2   |
| 2021-01-01T00:00:20Z | t2   |
| 2021-01-01T00:00:30Z | t2   |
| 2021-01-01T00:00:40Z | t2   |
| 2021-01-01T00:00:50Z | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
