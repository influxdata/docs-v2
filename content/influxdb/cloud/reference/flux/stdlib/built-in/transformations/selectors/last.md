---
title: last() function
description: The `last()` function selects the last non-null record from an input table.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/selectors/last
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/selectors/last/
menu:
  influxdb_cloud_ref:
    name: last
    parent: built-in-selectors
weight: 501
related:
  - /influxdb/cloud/query-data/flux/first-last/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#last, InfluxQL – LAST()
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
