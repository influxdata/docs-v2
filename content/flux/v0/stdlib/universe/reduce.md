---
title: reduce() function
description: >
  `reduce()` aggregates rows in each input table using a reducer function (`fn`).
menu:
  flux_v0_ref:
    name: reduce
    parent: universe
    identifier: universe/reduce
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.23.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2196-L2200

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`reduce()` aggregates rows in each input table using a reducer function (`fn`).

The output for each table is the group key of the table with columns
corresponding to each field in the reducer record.
If the reducer record contains a column with the same name as a group key column,
the group key column’s value is overwritten, and the outgoing group key is changed.
However, if two reduced tables write to the same destination group key, the
function returns an error.

### Dropped columns
`reduce()` drops any columns that:

- Are not part of the input table’s group key.
- Are not explicitly mapped in the `identity` record or the reducer function (`fn`).

##### Function type signature

```js
(<-tables: stream[B], fn: (accumulator: A, r: B) => A, identity: A) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### fn
({{< req >}})
Reducer function to apply to each row record (`r`).

The reducer function accepts two parameters:
- **r**: Record representing the current row.
- **accumulator**: Record returned from the reducer function's operation on
the previous row.

### identity
({{< req >}})
Record that defines the reducer record and provides initial values
for the reducer operation on the first row.

May be used more than once in asynchronous processing use cases.
The data type of values in the identity record determine the data type of
output values.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Compute the sum of the value column](#compute-the-sum-of-the-value-column)
- [Compute the sum and count in a single reducer](#compute-the-sum-and-count-in-a-single-reducer)
- [Compute the product of all values](#compute-the-product-of-all-values)
- [Calculate the average of all values](#calculate-the-average-of-all-values)

### Compute the sum of the value column

```js
import "sampledata"

sampledata.int()
    |> reduce(fn: (r, accumulator) => ({sum: r._value + accumulator.sum}), identity: {sum: 0})

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

| *tag | sum  |
| ---- | ---- |
| t1   | 51   |

| *tag | sum  |
| ---- | ---- |
| t2   | 53   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Compute the sum and count in a single reducer

```js
import "sampledata"

sampledata.int()
    |> reduce(
        fn: (r, accumulator) => ({sum: r._value + accumulator.sum, count: accumulator.count + 1}),
        identity: {sum: 0, count: 0},
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

| *tag | count  | sum  |
| ---- | ------ | ---- |
| t1   | 6      | 51   |

| *tag | count  | sum  |
| ---- | ------ | ---- |
| t2   | 6      | 53   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Compute the product of all values

```js
import "sampledata"

sampledata.int()
    |> reduce(fn: (r, accumulator) => ({prod: r._value * accumulator.prod}), identity: {prod: 1})

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

| *tag | prod    |
| ---- | ------- |
| t1   | -142800 |

| *tag | prod   |
| ---- | ------ |
| t2   | -56316 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the average of all values

```js
import "sampledata"

sampledata.int()
    |> reduce(
        fn: (r, accumulator) =>
            ({
                count: accumulator.count + 1,
                total: accumulator.total + r._value,
                avg: float(v: accumulator.total + r._value) / float(v: accumulator.count + 1),
            }),
        identity: {count: 0, total: 0, avg: 0.0},
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

| *tag | avg  | count  | total  |
| ---- | ---- | ------ | ------ |
| t1   | 8.5  | 6      | 51     |

| *tag | avg               | count  | total  |
| ---- | ----------------- | ------ | ------ |
| t2   | 8.833333333333334 | 6      | 53     |

{{% /expand %}}
{{< /expand-wrapper >}}
