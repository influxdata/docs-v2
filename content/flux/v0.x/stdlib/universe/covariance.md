---
title: covariance() function
description: The `covariance()` function computes the covariance between two columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/covariance
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/covariance/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/covariance/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/covariance/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/covariance/
menu:
  flux_0_x_ref:
    name: covariance
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/cov/
introduced: 0.7.0
---

The `covariance()` function computes the covariance between two columns.
 
_**Output data type:** Float_

```js
covariance(columns: ["column_x", "column_y"], pearsonr: false, valueDst: "_value")
```

## Parameters

### columns {data-type="array of strings"}
({{< req >}}) A list of **two columns** on which to operate.

### pearsonr {data-type="bool"}
Normalized results to the Pearson R coefficient.
Default is `false`.

### valueDst {data-type="string"}
The column into which the result will be placed.
Defaults to `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
The following example uses [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to generate sample data and show how `covariance()` transforms data.

```js
import "generate"

data = generate.from(count: 5, fn: (n) => n * n, start: 2021-01-01T00:00:00Z,stop: 2021-01-01T00:01:00Z  ) 
  |> toFloat()
  |> map(fn: (r) => ({_time: r._time, x: r._value, y: r._value * r._value / 2.0}))
 
data
  |> covariance(columns: ["x", "y"])
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
| _time                |    x |     y |
| :------------------- | ---: | ----: |
| 2021-01-01T00:00:00Z |  0.0 |   0.0 |
| 2021-01-01T00:00:12Z |  1.0 |   0.5 |
| 2021-01-01T00:00:24Z |  4.0 |   8.0 |
| 2021-01-01T00:00:36Z |  9.0 |  40.5 |
| 2021-01-01T00:00:48Z | 16.0 | 128.0 |

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _value |
| -----: |
| 345.75 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
