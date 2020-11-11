---
title: cumulativeSum() function
description: The `cumulativeSum()` function computes a running sum for non-null records in the table.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/cumulativesum
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/cumulativesum/
menu:
  influxdb_cloud_ref:
    name: cumulativeSum
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/query-data/flux/cumulativesum/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#cumulative-sum, InfluxQL – CUMULATIVE_SUM()
---

The `cumulativeSum()` function computes a running sum for non-null records in the table.
The output table schema will be the same as the input table.

_**Function type:** Transformation  
_**Output data type:** Float_

```js
cumulativeSum(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to operate.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "disk" and
    r._field == "used_percent"
  )
  |> cumulativeSum(columns: ["_value"])
```
