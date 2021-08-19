---
title: sample() function
description: The `sample()` function selects a subset of the records from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/sample
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/sample/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/sample/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/sample/
menu:
  flux_0_x_ref:
    name: sample
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sample, InfluxQL – SAMPLE()
introduced: 0.7.0
---

The `sample()` function selects a subset of the records from the input table.

```js
sample(n:5, pos: -1)
```

{{% warn %}}
#### Empty tables
`sample()` drops empty tables.
{{% /warn %}}

## Parameters

### n {data-type="int"}
({{< req >}})
Sample every Nth element.

### pos {data-type="int"}
The position offset from the start of results where sampling begins.
`pos` must be less than `n`.
If `pos` is less than 0, a random offset is used.
Default is `-1` (random offset).

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1d)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> sample(n: 5, pos: 1)
```
