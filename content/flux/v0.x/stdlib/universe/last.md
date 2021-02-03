---
title: last() function
description: The `last()` function selects the last non-null record from an input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/last
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/last/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/last/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/last/
menu:
  flux_0_x_ref:
    name: last
    parent: universe
weight: 102
flux/v0.x/tags: [selectors]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/first-last/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#last, InfluxQL – LAST()
introduced: 0.7.0
---

The `last()` function selects the last non-null record from an input table.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
last(column: "_value")
```

{{% warn %}}
#### Empty tables
`last()` drops empty tables.
{{% /warn %}}

## Parameters

### column
Column used to verify the existence of a value.
If this column is _null_ in the last record, `last()` returns the previous
record with a non-null value.
Default is `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> last()
```
