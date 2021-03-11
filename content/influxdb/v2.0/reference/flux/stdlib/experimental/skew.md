---
title: experimental.skew() function
description: >
  The `experimental.skew()` function outputs the skew of non-null values in the
  `_value` column for each input table.
menu:
  influxdb_2_0_ref:
    name: experimental.skew
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/skew/
---

The `experimental.skew()` function outputs the skew of non-null values in the
`_value` column for each input table as a float.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
import "experimental"

experimental.skew()
```

## Examples
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
  |> experimental.skew()
```
