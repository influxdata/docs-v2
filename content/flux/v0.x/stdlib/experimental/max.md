---
title: experimental.max() function
description: >
  The `experimental.max()` function returns the record with the highest value in the
  `_value` column for each input table.
menu:
  flux_0_x_ref:
    name: experimental.max
    parent: experimental
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/max/
  - /influxdb/cloud/reference/flux/stdlib/experimental/max/
weight: 302
related:
  - /{{< latest "influxdb" >}}/reference/flux/stdlib/built-in/transformations/selectors/max
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#max, InfluxQL – MAX()
flux/v0.x/tags: [transformations, selectors]
introduced: 0.112.0
---

The `experimental.max()` function returns the record with the highest value in the
`_value` column for each input table.

```js
import "experimental"

experimental.max()
```

{{% warn %}}
#### Empty tables
`experimental.max()` drops empty tables.
{{% /warn %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is pipe-forwarded data.

## Examples
```js
import "experimental"

data
  |> experimental.max()
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T00:01:00Z | 0.6    |
| 2021-01-01T00:02:00Z | 2.3    |
| 2021-01-01T00:03:00Z | 0.9    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:02:00Z | 2.3    |
{{% /flex-content %}}
{{< /flex >}}
