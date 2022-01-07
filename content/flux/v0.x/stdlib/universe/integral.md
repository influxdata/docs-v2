---
title: integral() function
description: The `integral()` function computes the area under the curve per unit of time of subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/integral
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/integral/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/integral/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/integral/
menu:
  flux_0_x_ref:
    name: integral
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#integral, InfluxQL – INTEGRAL()
  - /flux/v0.x/stdlib/experimental/integral/
introduced: 0.7.0
---

The `integral()` function computes the area under the curve per [`unit`](#unit) of time of subsequent non-null records.
`integral()` requires `_start` and `_stop` columns that are part of the [group key](/flux/v0.x/get-started/data-model/#group-key).
The curve is defined using `_time` as the domain and record values as the range.
_`integral()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

_**Output data type:** Float_

```js
integral(
  unit: 10s,
  column: "_value",
  timeColumn: "_time",
  interpolate: ""
)
```

## Parameters

### unit {data-type="duration"}
({{< req >}})
Time duration used when computing the integral.

### column {data-type="string"}
Column on which to operate.
Defaults to `"_value"`.

### timeColumn {data-type="string"}
Column that contains time values to use in the operation.
Defaults to `"_time"`.

### interpolate {data-type="string"}
Type of interpolation to use.
Defaults to `""`.

Use one of the following interpolation options:

- _empty string for no interpolation_
- linear

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

#### Calculate the integral
```js
import "sampledata"

sampledata.int()
  |> range(start: sampledata.start, stop: sampledata.stop)
  |> integral(unit:10s)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}

##### Input data
{{% flux/sample set="int" includeRange=true %}}

##### Output data
| _start               | _stop                | tag | _value |
| :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1  |   50.0 |

| _start               | _stop                | tag | _value |
| :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2  |     43 |

{{% /expand %}}
{{< /expand-wrapper >}}


#### Calculate the integral with linear interpolation
```js
import "sampledata"

sampledata.int(includeNull: true)
  |> range(start: sampledata.start, stop: sampledata.stop)
  |> integral(unit:10s, interpolate: "linear")
```

{{% expand "View input and output" %}}

##### Input data
{{% flux/sample set="int" includeNull=true includeRange=true %}}

##### Output data
| _start               | _stop                | tag | _value |
| :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1  |   25.0 |

| _start               | _stop                | tag | _value |
| :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2  |   32.5 |

{{% /expand %}}
