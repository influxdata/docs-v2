---
title: experimental.first() function
description: >
  The `experimental.first()` function returns the first record with a non-null
  value in the `_value` column.
menu:
  influxdb_2_0_ref:
    name: experimental.first
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/query-data/flux/first-last/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/first/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#first, InfluxQL – FIRST()
introduced: 0.112.0
---

The `experimental.first()` function returns the first record with a non-null
value in the `_value` column.

_**Function type:** Selector_

```js
import "experimental"

experimental.first()
```

{{% warn %}}
#### Empty tables
`experimental.first()` drops empty tables.
{{% /warn %}}

## Parameters

### tables
Input data.
Default is pipe-forwarded data.

## Examples

#### Return the first non-null value
```js
import "experimental"

data
  |> experimental.first()
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
| 2021-01-01T00:00:00Z | 1.2    |
{{% /flex-content %}}
{{< /flex >}}
