---
title: fill() function
description: The `fill()` function replaces all null values in an input stream and replace them with a non-null value.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/fill
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/fill/
menu:
  influxdb_cloud_ref:
    name: fill
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/query-data/flux/fill/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#group-by-time-intervals-and-fill, InfluxQL – FILL
---

The `fill()` function replaces all null values in an input stream with a non-null value.
The output stream is the same as the input stream with all null values replaced in the specified column.

_**Function type:** Transformation_  

```js
fill(column: "_value", value: 0.0)

// OR

fill(column: "_value", usePrevious: true)
```

## Parameters

### column
The column in which to replace null values. Defaults to `"_value"`.

_**Data type:** String_

### value
The constant value to use in place of nulls.
The value type must match the value type of the `column`.

_**Data type:** Boolean | Integer | UInteger | Float | String | Time | Duration_

### usePrevious
When `true`, assigns the value set in the previous non-null row.

{{% note %}}
Cannot be used with `value`.
{{% /note %}}

_**Data type:** Boolean_


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
