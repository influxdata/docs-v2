---
title: drop() function
description: >
  `drop()` removes specified columns from a table.
menu:
  flux_v0_ref:
    name: drop
    parent: universe
    identifier: universe/drop
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L462-L465

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`drop()` removes specified columns from a table.

Columns are specified either through a list or a predicate function.
When a dropped column is part of the group key, it is removed from the key.
If a specified column is not present in a table, the function returns an error.

##### Function type signature

```js
(<-tables: stream[A], ?columns: [string], ?fn: (column: string) => bool) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### columns

List of columns to remove from input tables. Mutually exclusive with `fn`.



### fn

Predicate function with a `column` parameter that returns a boolean
value indicating whether or not the column should be removed from input tables.
Mutually exclusive with `columns`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Drop a list of columns](#drop-a-list-of-columns)
- [Drop columns matching a predicate](#drop-columns-matching-a-predicate)

### Drop a list of columns

```js
import "sampledata"

sampledata.int()
    |> drop(columns: ["_time", "tag"])

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

| _value  |
| ------- |
| -2      |
| 10      |
| 7       |
| 17      |
| 15      |
| 4       |
| 19      |
| 4       |
| -3      |
| 19      |
| 13      |
| 1       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Drop columns matching a predicate

```js
import "sampledata"

sampledata.int()
    |> drop(fn: (column) => column =~ /^t/)

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
