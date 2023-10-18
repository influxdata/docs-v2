---
title: count() function
description: >
  `count()` returns the number of records in each input table.
menu:
  flux_v0_ref:
    name: count
    parent: universe
    identifier: universe/count
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L163-L163

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`count()` returns the number of records in each input table.

The function counts both null and non-null records.

#### Empty tables
`count()` returns `0` for empty tables.
To keep empty tables in your data, set the following parameters for the
following functions:

| Function            | Parameter           |
| :------------------ | :------------------ |
| `filter()`          | `onEmpty: "keep"`   |
| `window()`          | `createEmpty: true` |
| `aggregateWindow()` | `createEmpty: true` |

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Column to count values in and store the total count.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Count the number of records in each input table](#count-the-number-of-records-in-each-input-table)
- [Count the number of records with a specific value](#count-the-number-of-records-with-a-specific-value)

### Count the number of records in each input table

```js
import "sampledata"

sampledata.string()
    |> count()

```


### Count the number of records with a specific value

1. Use `filter()` to filter data by the specific value you want to count.
2. Use `count()` to count the number of rows in the table.

```js
import "sampledata"

data =
    sampledata.int()
        |> filter(fn: (r) => r._value > 10)

data
    |> count()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |


#### Output data

| *tag | _value  |
| ---- | ------- |
| t1   | 2       |

| *tag | _value  |
| ---- | ------- |
| t2   | 3       |

{{% /expand %}}
{{< /expand-wrapper >}}
