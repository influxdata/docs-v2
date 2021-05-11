---
title: experimental.stddev() function
description: >
  The `experimental.stddev()` function computes the standard deviation of non-null
  values in the `_value` column for each input table.
menu:
  flux_0_x_ref:
    name: experimental.stddev
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/stddev/
  - /influxdb/cloud/reference/flux/stdlib/experimental/stddev/
related:
  - /flux/v0.x/stdlib/universe/stddev/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#stddev, InfluxQL – STDDEV()
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

The `experimental.stddev()` function computes the standard deviation of non-null
values in the `_value` column for each input table.

```js
import "experimental"

experimental.stddev(mode: "sample")
```

## Parameters

### mode {data-type="string"}
The standard deviation mode or type of standard deviation to calculate.
Defaults to `"sample"`.

**Available options:**

- [sample](#sample)
- [population](#population)

##### sample
Calculate the sample standard deviation where the data is considered to be part of a larger population.

##### population
Calculate the population standard deviation where the data is considered a population of its own.

## Examples
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> experimental.stddev()
```
