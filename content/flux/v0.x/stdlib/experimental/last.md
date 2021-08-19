---
title: experimental.last() function
description: >
  The `experimental.last()` function returns the last record with a non-null
  value in the `_value` column.
menu:
  flux_0_x_ref:
    name: experimental.last
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/last/
  - /influxdb/cloud/reference/flux/stdlib/experimental/last/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/first-last/
  - /flux/v0.x/stdlib/universe/last
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#last, InfluxQL – LAST()
flux/v0.x/tags: [transformations, selectors]
introduced: 0.112.0
---

The `experimental.last()` function returns the last record with a non-null
value in the `_value` column.

```js
import "experimental"

experimental.last()
```

{{% warn %}}
#### Empty tables
`experimental.last()` drops empty tables.
{{% /warn %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

#### Return the last non-null value
```js
import "experimental"

data
  |> experimental.last()
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
| 2021-01-01T00:03:00Z | 0.9    |
{{% /flex-content %}}
{{< /flex >}}
