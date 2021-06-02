---
title: experimental.max() function
description: >
  The `experimental.max()` function returns the record with the highest value in the
  `_value` column for each input table.
menu:
  influxdb_2_0_ref:
    name: experimental.max
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/max
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#max, InfluxQL – MAX()
introduced: 0.112.0
---

The `experimental.max()` function returns the record with the highest value in the
`_value` column for each input table.

_**Function type:** Selector_

```js
import "experimental"

experimental.max()
```

{{% warn %}}
#### Empty tables
`experimental.max()` drops empty tables.
{{% /warn %}}

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
