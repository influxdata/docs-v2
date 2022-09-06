---
title: polyline.rdp() function
description: >
  `polyline.rdp()` applies the Ramer Douglas Peucker (RDP) algorithm to input data to downsample curves composed
  of line segments into visually indistinguishable curves with fewer points.
menu:
  flux_0_x_ref:
    name: polyline.rdp
    parent: experimental/polyline
    identifier: experimental/polyline/rdp
weight: 201
flux/v0.x/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/polyline/polyline.flux#L66-L75

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`polyline.rdp()` applies the Ramer Douglas Peucker (RDP) algorithm to input data to downsample curves composed
of line segments into visually indistinguishable curves with fewer points.



##### Function type signature

```js
(
    <-tables: stream[A],
    ?epsilon: float,
    ?retention: float,
    ?timeColumn: string,
    ?valColumn: string,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### valColumn

Column with Y axis values of the given curve. Default is `_value`.



### timeColumn

Column with X axis values of the given curve. Default is `_time`.



### epsilon

Maximum tolerance value that determines the amount of compression.

Epsilon should be greater than `0.0`.

### retention

Percentage of points to retain after downsampling.

Retention rate should be between `0.0` and `100.0`.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Downsample data using the RDP algorithm](#downsample-data-using-the-rdp-algorithm)
- [Downsample the data using the epsilon value 1.5](#downsample-the-data-using-the-epsilon-value-15)
- [Downsample the data using a retention rate of 90%](#downsample-the-data-using-a-retention-rate-of-90)

### Downsample data using the RDP algorithm

When using `polyline.rdp()`, leave both `epsilon` and `retention` unspecified
to automatically calculate the maximum tolerance beyond which producing a
visually indistinguishable curve is not be possible.

```js
import "experimental/polyline"

data
    |> polyline.rdp()
```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value              |
| -------------------- | ------------------- |
| 2022-08-29T17:57:00Z | 10.56555566168836   |
| 2022-08-29T17:57:10Z | -29.76098586714259  |
| 2022-08-29T17:57:20Z | -67.50435038579738  |
| 2022-08-29T17:57:30Z | -16.758669047964453 |
| 2022-08-29T17:57:40Z | -47.25865245658065  |
| 2022-08-29T17:57:50Z | 66.16082461651365   |
| 2022-08-29T17:58:00Z | -0.9179216017921821 |
| 2022-08-29T17:58:10Z | -56.89169240573004  |
| 2022-08-29T17:58:20Z | 11.358605472976624  |
| 2022-08-29T17:58:30Z | 28.71147881415803   |
| 2022-08-29T17:58:40Z | -30.928830759588756 |
| 2022-08-29T17:58:50Z | -22.411848631056067 |
| 2022-08-29T17:59:00Z | 17.05503606764129   |
| 2022-08-29T17:59:10Z | 9.834382683760559   |
| 2022-08-29T17:59:20Z | -12.62058579127679  |
| 2022-08-29T17:59:30Z | -44.44668391211515  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2022-08-29T17:57:00Z | 10.56555566168836   |
| 2022-08-29T17:57:10Z | -29.76098586714259  |
| 2022-08-29T17:57:20Z | -67.50435038579738  |
| 2022-08-29T17:57:30Z | -16.758669047964453 |
| 2022-08-29T17:57:40Z | -47.25865245658065  |
| 2022-08-29T17:57:50Z | 66.16082461651365   |
| 2022-08-29T17:58:00Z | -0.9179216017921821 |
| 2022-08-29T17:58:10Z | -56.89169240573004  |
| 2022-08-29T17:58:20Z | 11.358605472976624  |
| 2022-08-29T17:58:30Z | 28.71147881415803   |
| 2022-08-29T17:58:40Z | -30.928830759588756 |
| 2022-08-29T17:58:50Z | -22.411848631056067 |
| 2022-08-29T17:59:00Z | 17.05503606764129   |
| 2022-08-29T17:59:10Z | 9.834382683760559   |
| 2022-08-29T17:59:20Z | -12.62058579127679  |
| 2022-08-29T17:59:30Z | -44.44668391211515  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Downsample the data using the epsilon value 1.5

```js
import "experimental/polyline"

data
    |> polyline.rdp(epsilon: 1.5)

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value              |
| -------------------- | ------------------- |
| 2022-08-29T17:57:00Z | 10.56555566168836   |
| 2022-08-29T17:57:10Z | -29.76098586714259  |
| 2022-08-29T17:57:20Z | -67.50435038579738  |
| 2022-08-29T17:57:30Z | -16.758669047964453 |
| 2022-08-29T17:57:40Z | -47.25865245658065  |
| 2022-08-29T17:57:50Z | 66.16082461651365   |
| 2022-08-29T17:58:00Z | -0.9179216017921821 |
| 2022-08-29T17:58:10Z | -56.89169240573004  |
| 2022-08-29T17:58:20Z | 11.358605472976624  |
| 2022-08-29T17:58:30Z | 28.71147881415803   |
| 2022-08-29T17:58:40Z | -30.928830759588756 |
| 2022-08-29T17:58:50Z | -22.411848631056067 |
| 2022-08-29T17:59:00Z | 17.05503606764129   |
| 2022-08-29T17:59:10Z | 9.834382683760559   |
| 2022-08-29T17:59:20Z | -12.62058579127679  |
| 2022-08-29T17:59:30Z | -44.44668391211515  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2022-08-29T17:57:00Z | 10.56555566168836   |
| 2022-08-29T17:57:20Z | -67.50435038579738  |
| 2022-08-29T17:57:30Z | -16.758669047964453 |
| 2022-08-29T17:57:40Z | -47.25865245658065  |
| 2022-08-29T17:57:50Z | 66.16082461651365   |
| 2022-08-29T17:58:00Z | -0.9179216017921821 |
| 2022-08-29T17:58:10Z | -56.89169240573004  |
| 2022-08-29T17:58:20Z | 11.358605472976624  |
| 2022-08-29T17:58:30Z | 28.71147881415803   |
| 2022-08-29T17:58:40Z | -30.928830759588756 |
| 2022-08-29T17:58:50Z | -22.411848631056067 |
| 2022-08-29T17:59:00Z | 17.05503606764129   |
| 2022-08-29T17:59:10Z | 9.834382683760559   |
| 2022-08-29T17:59:20Z | -12.62058579127679  |
| 2022-08-29T17:59:30Z | -44.44668391211515  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Downsample the data using a retention rate of 90%

```js
import "experimental/polyline"

data
    |> polyline.rdp(retention: 90.0)

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value              |
| -------------------- | ------------------- |
| 2022-08-29T17:57:00Z | 10.56555566168836   |
| 2022-08-29T17:57:10Z | -29.76098586714259  |
| 2022-08-29T17:57:20Z | -67.50435038579738  |
| 2022-08-29T17:57:30Z | -16.758669047964453 |
| 2022-08-29T17:57:40Z | -47.25865245658065  |
| 2022-08-29T17:57:50Z | 66.16082461651365   |
| 2022-08-29T17:58:00Z | -0.9179216017921821 |
| 2022-08-29T17:58:10Z | -56.89169240573004  |
| 2022-08-29T17:58:20Z | 11.358605472976624  |
| 2022-08-29T17:58:30Z | 28.71147881415803   |
| 2022-08-29T17:58:40Z | -30.928830759588756 |
| 2022-08-29T17:58:50Z | -22.411848631056067 |
| 2022-08-29T17:59:00Z | 17.05503606764129   |
| 2022-08-29T17:59:10Z | 9.834382683760559   |
| 2022-08-29T17:59:20Z | -12.62058579127679  |
| 2022-08-29T17:59:30Z | -44.44668391211515  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2022-08-29T17:57:00Z | 10.56555566168836   |
| 2022-08-29T17:57:20Z | -67.50435038579738  |
| 2022-08-29T17:57:30Z | -16.758669047964453 |
| 2022-08-29T17:57:40Z | -47.25865245658065  |
| 2022-08-29T17:57:50Z | 66.16082461651365   |
| 2022-08-29T17:58:00Z | -0.9179216017921821 |
| 2022-08-29T17:58:10Z | -56.89169240573004  |
| 2022-08-29T17:58:20Z | 11.358605472976624  |
| 2022-08-29T17:58:30Z | 28.71147881415803   |
| 2022-08-29T17:58:40Z | -30.928830759588756 |
| 2022-08-29T17:58:50Z | -22.411848631056067 |
| 2022-08-29T17:59:00Z | 17.05503606764129   |
| 2022-08-29T17:59:10Z | 9.834382683760559   |
| 2022-08-29T17:59:30Z | -44.44668391211515  |

{{% /expand %}}
{{< /expand-wrapper >}}
