---
title: pearsonr() function
description: The `pearsonr()` function computes the Pearson R correlation coefficient between two streams by first joining the streams, then performing the covariance operation normalized to compute R.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/pearsonr
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/pearsonr/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/pearsonr/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pearsonr/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/pearsonr/
menu:
  flux_0_x_ref:
    name: pearsonr
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `pearsonr()` function computes the Pearson R correlation coefficient between two streams
by first joining the streams, then performing the covariance operation normalized to compute R.

_**Output data type:** Float_

```js
pearsonr(x: stream1, y: stream2, on: ["_time", "_field"])
```

## Parameters

### x {data-type="stream of tables"}
First input stream used in the operation.

### y {data-type="stream of tables"}
Second input stream used in the operation.

### on {data-type="array of strings"}
List of columns to join on.

## Examples
The following example uses [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to generate sample data and show how `pearsonr()` transforms data.

```js
import "generate"

stream1 = generate.from(
  count: 5,
  fn: (n) => n * n,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-01T00:01:00Z
) |> toFloat()

stream2 = generate.from(
  count: 5,
  fn: (n) => n * n * n / 2,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-01T00:01:00Z
) |> toFloat()

pearsonr(x: stream1, y: stream2, on: ["_time"])
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}

#### Input data
{{< flex >}}
{{% flex-content %}}
##### stream1
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |    0.0 |
| 2021-01-01T00:00:12Z |    1.0 |
| 2021-01-01T00:00:24Z |    4.0 |
| 2021-01-01T00:00:36Z |    9.0 |
| 2021-01-01T00:00:48Z |   16.0 |
{{% /flex-content %}}
{{% flex-content %}}
##### stream2
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |    0.0 |
| 2021-01-01T00:00:12Z |    0.0 |
| 2021-01-01T00:00:24Z |    4.0 |
| 2021-01-01T00:00:36Z |   13.0 |
| 2021-01-01T00:00:48Z |   32.0 |
{{% /flex-content %}}
{{< /flex >}}

#### Output data
|             _value |
| -----------------: |
| 0.9856626734271221 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
pearsonr = (x,y,on) =>
  cov(x:x, y:y, on:on, pearsonr:true)
```
