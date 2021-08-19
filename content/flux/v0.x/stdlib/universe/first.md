---
title: first() function
description: The `first()` function selects the first non-null record from an input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/first
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/first/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/first/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/first/
menu:
  flux_0_x_ref:
    name: first
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/first-last/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#first, InfluxQL – FIRST()
introduced: 0.7.0
---

The `first()` function selects the first non-null record from an input table.

_**Output data type:** Record_

```js
first()
```

{{% warn %}}
#### Empty tables
`first()` drops empty tables.
{{% /warn %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
