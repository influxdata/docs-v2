---
title: cov() function
description: The `cov()` function computes the covariance between two streams by first joining the streams, then performing the covariance operation.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/cov
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/cov/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/cov/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/cov/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/cov/
menu:
  flux_0_x_ref:
    name: cov
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `cov()` function computes the covariance between two streams by first joining the streams,
then performing the covariance operation.


```js
cov(x: table1, y: table2, on: ["_time", "_field"], pearsonr: false)
```

## Parameters

### x {data-type="stream of tables"}
({{< req >}})
First input stream used to calculate the covariance.
Values in the `_value` columns must be [float values](/flux/v0.x/data-types/basic/float/).

### y {data-type="stream of tables"}
({{< req >}})
Second input stream used to calculate the covariance.
Values in the `_value` columns must be [float values](/flux/v0.x/data-types/basic/float/).

### on {data-type="array of strings"}
({{< req >}})
List of columns to join on.

### pearsonr {data-type="bool"}
Normalize results to the Pearson R coefficient.
Default is `false`.

## Examples
The following example uses [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to generate sample data and show how `cov()` transforms data.

```js
import "generate"

table1 = generate.from(
  count: 5,
  fn: (n) => n * n,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-01T00:01:00Z
) |> toFloat()

table2 = generate.from(
  count: 5,
  fn: (n) => n * n * n / 2,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-01T00:01:00Z
) |> toFloat()

cov(x: table1, y: table2, on: ["_time"])
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}

#### Input data
{{< flex >}}
{{% flex-content %}}
##### table1
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |    0.0 |
| 2021-01-01T00:00:12Z |    1.0 |
| 2021-01-01T00:00:24Z |    4.0 |
| 2021-01-01T00:00:36Z |    9.0 |
| 2021-01-01T00:00:48Z |   16.0 |
{{% /flex-content %}}
{{% flex-content %}}
##### table2
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
| _value |
| -----: |
|  87.75 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
cov = (x,y,on,pearsonr=false) =>
  join( tables:{x:x, y:y}, on:on )
    |> covariance(pearsonr:pearsonr, columns:["_value_x","_value_y"])
```
