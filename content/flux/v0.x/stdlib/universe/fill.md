---
title: fill() function
description: The `fill()` function replaces all null values in an input stream and replace them with a non-null value.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/fill
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/fill/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/fill/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/fill/
menu:
  flux_0_x_ref:
    name: fill
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/fill/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#group-by-time-intervals-and-fill, InfluxQL – FILL
introduced: 0.14.0
---

The `fill()` function replaces all null values in an input stream with a non-null value.
The output stream is the same as the input stream with all null values replaced in the specified column.

```js
fill(column: "_value", value: 0.0)

// OR

fill(column: "_value", usePrevious: true)
```

## Parameters

### column {data-type="string"}
The column in which to replace null values. Defaults to `"_value"`.

### value {data-type="string, bool, int, uint, float, duration, time"}
The constant value to use in place of nulls.
The value type must match the value type of the `column`.

### usePrevious {data-type="bool"}
When `true`, assigns the value set in the previous non-null row.

{{% note %}}
Cannot be used with `value`.
{{% /note %}}

## Examples

##### Fill null values with a specified non-null value
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> fill(value: 0.0)
```

##### Fill null values with the previous non-null value
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> fill(usePrevious: true)
```
