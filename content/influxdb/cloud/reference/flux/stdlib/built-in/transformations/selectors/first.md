---
title: first() function
description: The `first()` function selects the first non-null record from an input table.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/selectors/first
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/selectors/first/
menu:
  influxdb_cloud_ref:
    name: first
    parent: built-in-selectors
weight: 501
related:
  - /influxdb/cloud/query-data/flux/first-last/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#first, InfluxQL – FIRST()
---

The `first()` function selects the first non-null record from an input table.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
first()
```

{{% warn %}}
#### Empty tables
`first()` drops empty tables.
{{% /warn %}}

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> first()
```
