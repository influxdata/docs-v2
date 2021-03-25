---
title: distinct() function
description: The `distinct()` function returns the unique values for a given column.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/selectors/distinct
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/selectors/distinct/
menu:
  influxdb_cloud_ref:
    name: distinct
    parent: built-in-selectors
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#distinct, InfluxQL – DISTINCT()
---

The `distinct()` function returns the unique values for a given column.
The `_value` of each output record is set to the distinct value in the specified column.
`null` is considered its own distinct value if it is present.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
distinct(column: "host")
```

{{% warn %}}
#### Empty tables
`distinct()` drops empty tables.
{{% /warn %}}

## Parameters

### column
Column on which to track unique values.

_**Data type:** string_

## Examples
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> distinct(column: "host")
```
