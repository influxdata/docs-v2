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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/polyline/polyline.flux#L71-L80

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
- [Downsample data using the RDP algorithm with an epsilon of 1.5](#downsample-data-using-the-rdp-algorithm-with-an-epsilon-of-15)
- [Downsample data using the RDP algorithm with a retention rate of 90%](#downsample-data-using-the-rdp-algorithm-with-a-retention-rate-of-90)

### Downsample data using the RDP algorithm

When using `polyline.rdp()`, leave both `epsilon` and `retention` unspecified
to automatically calculate the maximum tolerance for producing a visually
indistinguishable curve.

```js
import "experimental/polyline"

data
    |> polyline.rdp()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value              |
| -------------------- | ------------------- |
| 2023-02-23T17:53:50Z | 10.56555566168836   |
| 2023-02-23T17:54:00Z | -29.76098586714259  |
| 2023-02-23T17:54:10Z | -67.50435038579738  |
| 2023-02-23T17:54:20Z | -16.758669047964453 |
| 2023-02-23T17:54:30Z | -47.25865245658065  |
| 2023-02-23T17:54:40Z | 66.16082461651365   |
| 2023-02-23T17:54:50Z | -0.9179216017921821 |
| 2023-02-23T17:55:00Z | -56.89169240573004  |
| 2023-02-23T17:55:10Z | 11.358605472976624  |
| 2023-02-23T17:55:20Z | 28.71147881415803   |
| 2023-02-23T17:55:30Z | -30.928830759588756 |
| 2023-02-23T17:55:40Z | -22.411848631056067 |
| 2023-02-23T17:55:50Z | 17.05503606764129   |
| 2023-02-23T17:56:00Z | 9.834382683760559   |
| 2023-02-23T17:56:10Z | -12.62058579127679  |
| 2023-02-23T17:56:20Z | -44.44668391211515  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2023-02-23T17:53:50Z | 10.56555566168836   |
| 2023-02-23T17:54:00Z | -29.76098586714259  |
| 2023-02-23T17:54:10Z | -67.50435038579738  |
| 2023-02-23T17:54:20Z | -16.758669047964453 |
| 2023-02-23T17:54:30Z | -47.25865245658065  |
| 2023-02-23T17:54:40Z | 66.16082461651365   |
| 2023-02-23T17:54:50Z | -0.9179216017921821 |
| 2023-02-23T17:55:00Z | -56.89169240573004  |
| 2023-02-23T17:55:10Z | 11.358605472976624  |
| 2023-02-23T17:55:20Z | 28.71147881415803   |
| 2023-02-23T17:55:30Z | -30.928830759588756 |
| 2023-02-23T17:55:40Z | -22.411848631056067 |
| 2023-02-23T17:55:50Z | 17.05503606764129   |
| 2023-02-23T17:56:00Z | 9.834382683760559   |
| 2023-02-23T17:56:10Z | -12.62058579127679  |
| 2023-02-23T17:56:20Z | -44.44668391211515  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Downsample data using the RDP algorithm with an epsilon of 1.5

```js
import "experimental/polyline"

data
    |> polyline.rdp(epsilon: 1.5)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value              |
| -------------------- | ------------------- |
| 2023-02-23T17:53:50Z | 10.56555566168836   |
| 2023-02-23T17:54:00Z | -29.76098586714259  |
| 2023-02-23T17:54:10Z | -67.50435038579738  |
| 2023-02-23T17:54:20Z | -16.758669047964453 |
| 2023-02-23T17:54:30Z | -47.25865245658065  |
| 2023-02-23T17:54:40Z | 66.16082461651365   |
| 2023-02-23T17:54:50Z | -0.9179216017921821 |
| 2023-02-23T17:55:00Z | -56.89169240573004  |
| 2023-02-23T17:55:10Z | 11.358605472976624  |
| 2023-02-23T17:55:20Z | 28.71147881415803   |
| 2023-02-23T17:55:30Z | -30.928830759588756 |
| 2023-02-23T17:55:40Z | -22.411848631056067 |
| 2023-02-23T17:55:50Z | 17.05503606764129   |
| 2023-02-23T17:56:00Z | 9.834382683760559   |
| 2023-02-23T17:56:10Z | -12.62058579127679  |
| 2023-02-23T17:56:20Z | -44.44668391211515  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2023-02-23T17:53:50Z | 10.56555566168836   |
| 2023-02-23T17:54:10Z | -67.50435038579738  |
| 2023-02-23T17:54:20Z | -16.758669047964453 |
| 2023-02-23T17:54:30Z | -47.25865245658065  |
| 2023-02-23T17:54:40Z | 66.16082461651365   |
| 2023-02-23T17:54:50Z | -0.9179216017921821 |
| 2023-02-23T17:55:00Z | -56.89169240573004  |
| 2023-02-23T17:55:10Z | 11.358605472976624  |
| 2023-02-23T17:55:20Z | 28.71147881415803   |
| 2023-02-23T17:55:30Z | -30.928830759588756 |
| 2023-02-23T17:55:40Z | -22.411848631056067 |
| 2023-02-23T17:55:50Z | 17.05503606764129   |
| 2023-02-23T17:56:00Z | 9.834382683760559   |
| 2023-02-23T17:56:10Z | -12.62058579127679  |
| 2023-02-23T17:56:20Z | -44.44668391211515  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Downsample data using the RDP algorithm with a retention rate of 90%

```js
import "experimental/polyline"

data
    |> polyline.rdp(retention: 90.0)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value              |
| -------------------- | ------------------- |
| 2023-02-23T17:53:50Z | 10.56555566168836   |
| 2023-02-23T17:54:00Z | -29.76098586714259  |
| 2023-02-23T17:54:10Z | -67.50435038579738  |
| 2023-02-23T17:54:20Z | -16.758669047964453 |
| 2023-02-23T17:54:30Z | -47.25865245658065  |
| 2023-02-23T17:54:40Z | 66.16082461651365   |
| 2023-02-23T17:54:50Z | -0.9179216017921821 |
| 2023-02-23T17:55:00Z | -56.89169240573004  |
| 2023-02-23T17:55:10Z | 11.358605472976624  |
| 2023-02-23T17:55:20Z | 28.71147881415803   |
| 2023-02-23T17:55:30Z | -30.928830759588756 |
| 2023-02-23T17:55:40Z | -22.411848631056067 |
| 2023-02-23T17:55:50Z | 17.05503606764129   |
| 2023-02-23T17:56:00Z | 9.834382683760559   |
| 2023-02-23T17:56:10Z | -12.62058579127679  |
| 2023-02-23T17:56:20Z | -44.44668391211515  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2023-02-23T17:53:50Z | 10.56555566168836   |
| 2023-02-23T17:54:10Z | -67.50435038579738  |
| 2023-02-23T17:54:20Z | -16.758669047964453 |
| 2023-02-23T17:54:30Z | -47.25865245658065  |
| 2023-02-23T17:54:40Z | 66.16082461651365   |
| 2023-02-23T17:54:50Z | -0.9179216017921821 |
| 2023-02-23T17:55:00Z | -56.89169240573004  |
| 2023-02-23T17:55:10Z | 11.358605472976624  |
| 2023-02-23T17:55:20Z | 28.71147881415803   |
| 2023-02-23T17:55:30Z | -30.928830759588756 |
| 2023-02-23T17:55:40Z | -22.411848631056067 |
| 2023-02-23T17:55:50Z | 17.05503606764129   |
| 2023-02-23T17:56:00Z | 9.834382683760559   |
| 2023-02-23T17:56:20Z | -44.44668391211515  |

{{% /expand %}}
{{< /expand-wrapper >}}
