---
title: distinct() function
description: >
  `distinct()` returns all unique values in a specified column.
menu:
  flux_v0_ref:
    name: distinct
    parent: universe
    identifier: universe/distinct
weight: 101
flux/v0/tags: [transformations, selectors]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L425-L425

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`distinct()` returns all unique values in a specified column.

The `_value` of each output record is set to a distinct value in the specified column.
`null` is considered its own distinct value if present.

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### column

Column to return unique values from. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Return distinct values from the _value column](#return-distinct-values-from-the-_value-column)
- [Return distinct values from a non-default column](#return-distinct-values-from-a-non-default-column)
- [Return distinct values from data with null values](#return-distinct-values-from-data-with-null-values)

### Return distinct values from the _value column

```js
import "sampledata"

sampledata.int()
    |> distinct()

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

| *tag | _value  |
| ---- | ------- |
| t1   | -2      |
| t1   | 10      |
| t1   | 7       |
| t1   | 17      |
| t1   | 15      |
| t1   | 4       |

| *tag | _value  |
| ---- | ------- |
| t2   | 19      |
| t2   | 4       |
| t2   | -3      |
| t2   | 13      |
| t2   | 1       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return distinct values from a non-default column

```js
import "sampledata"

sampledata.int()
    |> distinct(column: "tag")

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

| *tag | _value  |
| ---- | ------- |
| t1   | t1      |

| *tag | _value  |
| ---- | ------- |
| t2   | t2      |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return distinct values from data with null values

```js
import "sampledata"

sampledata.int(includeNull: true)
    |> distinct()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *tag | _value  |
| ---- | ------- |
| t1   | -2      |
| t1   |         |
| t1   | 7       |
| t1   | 4       |

| *tag | _value  |
| ---- | ------- |
| t2   |         |
| t2   | 4       |
| t2   | -3      |
| t2   | 19      |
| t2   | 1       |

{{% /expand %}}
{{< /expand-wrapper >}}
