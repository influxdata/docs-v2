---
title: map() function
description: >
  `map()` iterates over and applies a function to input rows.
menu:
  flux_v0_ref:
    name: map
    parent: universe
    identifier: universe/map
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1749-L1749

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`map()` iterates over and applies a function to input rows.

Each input row is passed to the `fn` as a record, `r`.
Each `r` property represents a column key-value pair.
Output values must be of the following supported column types:

- float
- integer
- unsigned integer
- string
- boolean
- time

### Output data
Output tables are the result of applying the map function (`fn`) to each
record of the input tables. Output records are assigned to new tables based
on the group key of the input stream.
If the output record contains a different value for a group key column, the
record is regrouped into the appropriate table.
If the output record drops a group key column, that column is removed from
the group key.

#### Preserve columns
`map()` drops any columns that are not mapped explicitly by column label or
implicitly using the `with` operator in the `fn` function.
The `with` operator updates a record property if it already exists, creates
a new record property if it doesn’t exist, and includes all existing
properties in the output record.

```no_run
data
    |> map(fn: (r) => ({ r with newColumn: r._value * 2 }))
```

##### Function type signature

```js
(<-tables: stream[A], fn: (r: A) => B, ?mergeKey: bool) => stream[B]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### fn
({{< req >}})
Single argument function to apply to each record.
The return value must be a record.



### mergeKey

_(Deprecated)_ Merge group keys of mapped records. Default is `false`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Square the value in each row](#square-the-value-in-each-row)
- [Create a new table with new columns](#create-a-new-table-with-new-columns)
- [Add new columns and preserve existing columns](#add-new-columns-and-preserve-existing-columns)

### Square the value in each row

```js
import "sampledata"

sampledata.int()
    |> map(fn: (r) => ({r with _value: r._value * r._value}))

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 4       | t1   |
| 2021-01-01T00:00:10Z | 100     | t1   |
| 2021-01-01T00:00:20Z | 49      | t1   |
| 2021-01-01T00:00:30Z | 289     | t1   |
| 2021-01-01T00:00:40Z | 225     | t1   |
| 2021-01-01T00:00:50Z | 16      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 361     | t2   |
| 2021-01-01T00:00:10Z | 16      | t2   |
| 2021-01-01T00:00:20Z | 9       | t2   |
| 2021-01-01T00:00:30Z | 361     | t2   |
| 2021-01-01T00:00:40Z | 169     | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Create a new table with new columns

```js
import "sampledata"

sampledata.int()
    |> map(
        fn: (r) => ({time: r._time, source: r.tag, alert: if r._value > 10 then true else false}),
    )

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

| time                 | source  | alert  |
| -------------------- | ------- | ------ |
| 2021-01-01T00:00:00Z | t1      | false  |
| 2021-01-01T00:00:10Z | t1      | false  |
| 2021-01-01T00:00:20Z | t1      | false  |
| 2021-01-01T00:00:30Z | t1      | true   |
| 2021-01-01T00:00:40Z | t1      | true   |
| 2021-01-01T00:00:50Z | t1      | false  |
| 2021-01-01T00:00:00Z | t2      | true   |
| 2021-01-01T00:00:10Z | t2      | false  |
| 2021-01-01T00:00:20Z | t2      | false  |
| 2021-01-01T00:00:30Z | t2      | true   |
| 2021-01-01T00:00:40Z | t2      | true   |
| 2021-01-01T00:00:50Z | t2      | false  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Add new columns and preserve existing columns

Use the `with` operator on the `r` record to preserve columns not directly
operated on by the map operation.

```js
import "sampledata"

sampledata.int()
    |> map(fn: (r) => ({r with server: "server-${r.tag}", valueFloat: float(v: r._value)}))

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

| _time                | _value  | server    | *tag | valueFloat  |
| -------------------- | ------- | --------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | -2      | server-t1 | t1   | -2          |
| 2021-01-01T00:00:10Z | 10      | server-t1 | t1   | 10          |
| 2021-01-01T00:00:20Z | 7       | server-t1 | t1   | 7           |
| 2021-01-01T00:00:30Z | 17      | server-t1 | t1   | 17          |
| 2021-01-01T00:00:40Z | 15      | server-t1 | t1   | 15          |
| 2021-01-01T00:00:50Z | 4       | server-t1 | t1   | 4           |

| _time                | _value  | server    | *tag | valueFloat  |
| -------------------- | ------- | --------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | 19      | server-t2 | t2   | 19          |
| 2021-01-01T00:00:10Z | 4       | server-t2 | t2   | 4           |
| 2021-01-01T00:00:20Z | -3      | server-t2 | t2   | -3          |
| 2021-01-01T00:00:30Z | 19      | server-t2 | t2   | 19          |
| 2021-01-01T00:00:40Z | 13      | server-t2 | t2   | 13          |
| 2021-01-01T00:00:50Z | 1       | server-t2 | t2   | 1           |

{{% /expand %}}
{{< /expand-wrapper >}}
