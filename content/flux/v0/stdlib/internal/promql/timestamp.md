---
title: promql.timestamp() function
description: >
  `promql.timestamp()` implements functionality equivalent to
  [PromQL's `timestamp()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#timestamp).
menu:
  flux_v0_ref:
    name: promql.timestamp
    parent: internal/promql
    identifier: internal/promql/timestamp
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L230-L230

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.timestamp()` implements functionality equivalent to
[PromQL's `timestamp()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#timestamp).

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(<-tables: stream[{A with _value: float}]) => stream[{A with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Defaults is piped-forward data (`<-`).




## Examples

### Convert timestamps into seconds since the Unix epoch

```js
import "internal/promql"
import "sampledata"

sampledata.float()
    |> promql.timestamp()

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

| _time                | *tag | _value     |
| -------------------- | ---- | ---------- |
| 2021-01-01T00:00:00Z | t1   | 1609459200 |
| 2021-01-01T00:00:10Z | t1   | 1609459210 |
| 2021-01-01T00:00:20Z | t1   | 1609459220 |
| 2021-01-01T00:00:30Z | t1   | 1609459230 |
| 2021-01-01T00:00:40Z | t1   | 1609459240 |
| 2021-01-01T00:00:50Z | t1   | 1609459250 |

| _time                | *tag | _value     |
| -------------------- | ---- | ---------- |
| 2021-01-01T00:00:00Z | t2   | 1609459200 |
| 2021-01-01T00:00:10Z | t2   | 1609459210 |
| 2021-01-01T00:00:20Z | t2   | 1609459220 |
| 2021-01-01T00:00:30Z | t2   | 1609459230 |
| 2021-01-01T00:00:40Z | t2   | 1609459240 |
| 2021-01-01T00:00:50Z | t2   | 1609459250 |

{{% /expand %}}
{{< /expand-wrapper >}}
