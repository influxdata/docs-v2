---
title: last() function
description: The `last()` function selects the last non-null record from an input table.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors/last
  - /v2.0/reference/flux/functions/built-in/transformations/selectors/last/
menu:
  influxdb_2_0_ref:
    name: last
    parent: built-in-selectors
weight: 501
related:
  - /influxdb/v2.0/query-data/flux/first-last/
  - https://docs.influxdata.com/influxdb/latest/query_language/functions/#last, InfluxQL – LAST()
---

The `last()` function selects the last non-null record from an input table.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
last()
```

{{% warn %}}
#### Empty tables
`last()` drops empty tables.
{{% /warn %}}

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
