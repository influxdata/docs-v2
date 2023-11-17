---
title: experimental.stddev() function
description: >
  `experimental.stddev()` returns the standard deviation of non-null values in the `_value`
  column for each input table.
menu:
  flux_v0_ref:
    name: experimental.stddev
    parent: experimental
    identifier: experimental/stddev
weight: 101
flux/v0/tags: [transformations, aggregates]
introduced: 0.107.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L975-L978

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.stddev()` returns the standard deviation of non-null values in the `_value`
column for each input table.

## Standard deviation modes
The following modes are available when calculating the standard deviation of data.

##### sample
Calculate the sample standard deviation where the data is considered to be
part of a larger population.

##### population
Calculate the population standard deviation where the data is considered a
population of its own.

##### Function type signature

```js
(<-tables: stream[{A with _value: float}], ?mode: string) => stream[{A with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### mode

Standard deviation mode or type of standard deviation to calculate.
Default is `sample`.

**Available options**:
- sample
- population

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the standard deviation in input tables

```js
import "experimental"
import "sampledata"

sampledata.float()
    |> experimental.stddev()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| *tag | _value            |
| ---- | ----------------- |
| t1   | 7.263244454099008 |

| *tag | _value           |
| ---- | ---------------- |
| t2   | 9.85926704510364 |

{{% /expand %}}
{{< /expand-wrapper >}}
