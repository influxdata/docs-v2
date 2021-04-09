---
title: experimental.min() function
description: >
  The `experimental.min()` function returns the record with the lowest value in
  the `_value` column for each input table.
menu:
  influxdb_2_0_ref:
    name: experiental.min
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/min/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#min, InfluxQL – MIN()
introduced: 0.112.0
---

The `experimental.min()` function returns the record with the lowest value in
the `_value` column for each input table.

_**Function type:** Selector_

```js
import "experimental"

experimental.min()
```

{{% warn %}}
#### Empty tables
`experimental.min()` drops empty tables.
{{% /warn %}}

## Parameters

### tables
Input data.
Default is pipe-forwarded data.

_**Data type:** String_

## Examples
```js
import "experimental"

data
  |> experimental.min()
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
| 2021-01-01T00:01:00Z | 0.6    |
{{% /flex-content %}}
{{< /flex >}}