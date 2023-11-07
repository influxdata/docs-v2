---
title: difference() function
description: >
  `difference()` returns the difference between subsequent values.
menu:
  flux_v0_ref:
    name: difference
    parent: universe
    identifier: universe/difference
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.1
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L375-L384

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`difference()` returns the difference between subsequent values.

### Subtraction rules for numeric types
- The difference between two non-null values is their algebraic difference;
  or `null`, if the result is negative and `nonNegative: true`;
- `null` minus some value is always `null`;
- Some value `v` minus `null` is `v` minus the last non-null value seen
  before `v`; or `null` if `v` is the first non-null value seen.
- If `nonNegative` and `initialZero` are set to `true`, `difference()`
  returns the difference between `0` and the subsequent value.
  If the subsequent value is less than zero, `difference()` returns `null`.

### Output tables
For each input table with `n` rows, `difference()` outputs a table with
`n - 1` rows.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?columns: [string],
    ?initialZero: bool,
    ?keepFirst: bool,
    ?nonNegative: bool,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### nonNegative

Disallow negative differences. Default is `false`.

When `true`, if a value is less than the previous value, the function
assumes the previous value should have been a zero.

### columns

List of columns to operate on. Default is `["_value"]`.



### keepFirst

Keep the first row in each input table. Default is `false`.

If `true`, the difference of the first row of each output table is null.

### initialZero

Use zero (0) as the initial value in the difference calculation
when the subsequent value is less than the previous value and `nonNegative` is
`true`. Default is `false`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate the difference between subsequent values](#calculate-the-difference-between-subsequent-values)
- [Calculate the non-negative difference between subsequent values](#calculate-the-non-negative-difference-between-subsequent-values)
- [Calculate the difference between subsequent values with null values](#calculate-the-difference-between-subsequent-values-with-null-values)
- [Keep the first value when calculating the difference between values](#keep-the-first-value-when-calculating-the-difference-between-values)

### Calculate the difference between subsequent values

```js
import "sampledata"

sampledata.int()
    |> difference()

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
| 2021-01-01T00:00:10Z | 12      | t1   |
| 2021-01-01T00:00:20Z | -3      | t1   |
| 2021-01-01T00:00:30Z | 10      | t1   |
| 2021-01-01T00:00:40Z | -2      | t1   |
| 2021-01-01T00:00:50Z | -11     | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | -15     | t2   |
| 2021-01-01T00:00:20Z | -7      | t2   |
| 2021-01-01T00:00:30Z | 22      | t2   |
| 2021-01-01T00:00:40Z | -6      | t2   |
| 2021-01-01T00:00:50Z | -12     | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the non-negative difference between subsequent values

```js
import "sampledata"

sampledata.int()
    |> difference(nonNegative: true)

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
| 2021-01-01T00:00:10Z | 12      | t1   |
| 2021-01-01T00:00:20Z |         | t1   |
| 2021-01-01T00:00:30Z | 10      | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z |         | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z |         | t2   |
| 2021-01-01T00:00:20Z |         | t2   |
| 2021-01-01T00:00:30Z | 22      | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z |         | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the difference between subsequent values with null values

```js
import "sampledata"

sampledata.int(includeNull: true)
    |> difference()

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:20Z | 9       | t1   |
| 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z | -3      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z |         | t2   |
| 2021-01-01T00:00:20Z | -7      | t2   |
| 2021-01-01T00:00:30Z | 22      | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z | -18     | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Keep the first value when calculating the difference between values

```js
import "sampledata"

sampledata.int()
    |> difference(keepFirst: true)

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
| 2021-01-01T00:00:00Z |         | t1   |
| 2021-01-01T00:00:10Z | 12      | t1   |
| 2021-01-01T00:00:20Z | -3      | t1   |
| 2021-01-01T00:00:30Z | 10      | t1   |
| 2021-01-01T00:00:40Z | -2      | t1   |
| 2021-01-01T00:00:50Z | -11     | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:10Z | -15     | t2   |
| 2021-01-01T00:00:20Z | -7      | t2   |
| 2021-01-01T00:00:30Z | 22      | t2   |
| 2021-01-01T00:00:40Z | -6      | t2   |
| 2021-01-01T00:00:50Z | -12     | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
