---
title: distinct() function
description: The `distinct()` function returns the unique values for a given column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/distinct
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/distinct/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/distinct/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/distinct/
menu:
  flux_0_x_ref:
    name: distinct
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#distinct, InfluxQL – DISTINCT()
introduced: 0.7.0
---

The `distinct()` function returns the unique values for a given column.
The `_value` of each output record is set to the distinct value in the specified column.
`null` is considered its own distinct value if it is present.

_**Output data type:** Record_

```js
distinct(column: "host")
```

{{% warn %}}
#### Empty tables
`distinct()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
Column on which to track unique values.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> distinct(column: "host")
```
