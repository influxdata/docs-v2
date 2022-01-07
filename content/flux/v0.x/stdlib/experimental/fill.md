---
title: experimental.fill() function
description: >
  The `experimental.fill()` function replaces all null values in the `_value`
  column with a non-null value.
menu:
  flux_0_x_ref:
    name: experimental.fill
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/fill/
  - /influxdb/cloud/reference/flux/stdlib/experimental/fill/
related:
  - /influxdb/v2.0/query-data/flux/fill/
  - /flux/v0.x/stdlib/universe/fill
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#group-by-time-intervals-and-fill, InfluxQL – FILL
flux/v0.x/tags: [transformations]
introduced: 0.112.0
---

The `experimental.fill()` function replaces all null values in the `_value`
column with a non-null value.

```js
import "experimental"

experimental.fill(value: 0.0)

// OR

experimental.fill(usePrevious: true)
```

## Parameters

{{% note %}}
`value` and `usePrevious` are mutually exclusive.
{{% /note %}}

### value {data-type="string, bool, int, uint, float, time"}
Value to replace null values with.
Data type must match the type of the `_value` column.

### usePrevious {data-type="bool"}
When `true`, replaces null values with the value of the previous non-null row.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

- [Fill null values with a specified non-null value](#fill-null-values-with-a-specified-non-null-value)
- [Fill null values with the previous non-null value](#fill-null-values-with-the-previous-non-null-value)

---

#### Fill null values with a specified non-null value
```js
import "experimental"

data
  |> experimental.fill(value: 0.0)
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T00:01:00Z |        |
| 2021-01-01T00:02:00Z | 2.3    |
| 2021-01-01T00:03:00Z |        |
| 2021-01-01T00:04:00Z | 2.8    |
| 2021-01-01T00:05:00Z | 1.1    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T00:01:00Z | 0.0    |
| 2021-01-01T00:02:00Z | 2.3    |
| 2021-01-01T00:03:00Z | 0.0    |
| 2021-01-01T00:04:00Z | 2.8    |
| 2021-01-01T00:05:00Z | 1.1    |
{{% /flex-content %}}
{{< /flex >}}

---

#### Fill null values with the previous non-null value
```js
import "experimental"

data
  |> experimental.fill(usePrevious: true)
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T00:01:00Z |        |
| 2021-01-01T00:02:00Z | 2.3    |
| 2021-01-01T00:03:00Z |        |
| 2021-01-01T00:04:00Z | 2.8    |
| 2021-01-01T00:05:00Z | 1.1    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T00:01:00Z | 1.2    |
| 2021-01-01T00:02:00Z | 2.3    |
| 2021-01-01T00:03:00Z | 2.3    |
| 2021-01-01T00:04:00Z | 2.8    |
| 2021-01-01T00:05:00Z | 1.1    |
{{% /flex-content %}}
{{< /flex >}}
