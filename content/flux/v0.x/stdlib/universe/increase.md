---
title: increase() function
description: >
  The `increase()` function calculates the cumulative sum of **non-negative** differences
  between subsequent values.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/increase
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/increase/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/increase/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/increase/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/increase/
menu:
  flux_0_x_ref:
    name: increase
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/increase/
introduced: 0.71.0
---

The `increase()` function calculates the cumulative sum of **non-negative** differences
between subsequent values.
A main use case is tracking changes in counter values which may wrap over time
when they hit a threshold or are reset.
In the case of a wrap/reset, we can assume that the absolute delta between two
points will be at least their non-negative difference.

_**Function type:** Transformation_  
_**Output data type:** Float_

```js
increase(columns: ["_value"])
```

## Parameters

### columns
The columns to use in the operation.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Output tables
For each input table with `n` rows, `derivative()` outputs a table with `n - 1` rows.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -24h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "n_users"
  )
  |> increase()
```

{{< flex >}}
{{% flex-content %}}
Given the following input table:

| _time | _value |
| ----- | ------ |
| 00001 | 1      |
| 00002 | 5      |
| 00003 | 3      |
| 00004 | 4      |
{{% /flex-content %}}
{{% flex-content %}}
`increase()` produces the following table:

| _time | _value |
| ----- | ------ |
| 00002 | 4      |
| 00003 | 4      |
| 00004 | 5      |
{{% /flex-content %}}
{{< /flex >}}

## Function definition
```js
increase = (tables=<-, column="_value") =>
	tables
		|> difference(nonNegative: true, column:column)
		|> cumulativeSum()
```
