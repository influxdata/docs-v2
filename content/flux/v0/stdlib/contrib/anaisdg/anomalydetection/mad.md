---
title: anomalydetection.mad() function
description: >
  `anomalydetection.mad()` uses the median absolute deviation (MAD) algorithm to detect anomalies in a data set.
menu:
  flux_v0_ref:
    name: anomalydetection.mad
    parent: contrib/anaisdg/anomalydetection
    identifier: contrib/anaisdg/anomalydetection/mad
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/anaisdg/anomalydetection/mad.flux#L38-L73

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`anomalydetection.mad()` uses the median absolute deviation (MAD) algorithm to detect anomalies in a data set.

Input data requires `_time` and `_value` columns.
Output data is grouped by `_time` and includes the following columns of interest:

- **\_value**: difference between of the original `_value` from the computed MAD
  divided by the median difference.
- **MAD**: median absolute deviation of the group.
- **level**: anomaly indicator set to either `anomaly` or `normal`.

##### Function type signature

```js
(<-table: stream[B], ?threshold: A) => stream[{C with level: string, _value_diff_med: D, _value_diff: D, _value: D}] where A: Comparable + Equatable, B: Record, D: Comparable + Divisible + Equatable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### threshold

Deviation threshold for anomalies.



### table

Input data. Default is piped-forward data (`<-`).




## Examples

### Use the MAD algorithm to detect anomalies

```js
import "contrib/anaisdg/anomalydetection"
import "sampledata"

sampledata.float()
    |> anomalydetection.mad(threshold: 1.0)

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

| MAD       | *_time               | _value  | _value_diff  | _value_diff_med  | level   | tag  |
| --------- | -------------------- | ------- | ------------ | ---------------- | ------- | ---- |
| 16.330839 | 2021-01-01T00:00:00Z | 1       | 11.015       | 11.015           | anomaly | t1   |
| 16.330839 | 2021-01-01T00:00:00Z | 1       | 11.015       | 11.015           | anomaly | t2   |

| MAD      | *_time               | _value             | _value_diff        | _value_diff_med  | level   | tag  |
| -------- | -------------------- | ------------------ | ------------------ | ---------------- | ------- | ---- |
| 4.410735 | 2021-01-01T00:00:10Z | 0.9999999999999999 | 2.9749999999999996 | 2.975            | normal  | t1   |
| 4.410735 | 2021-01-01T00:00:10Z | 1.0000000000000002 | 2.9750000000000005 | 2.975            | anomaly | t2   |

| MAD     | *_time               | _value  | _value_diff  | _value_diff_med  | level   | tag  |
| ------- | -------------------- | ------- | ------------ | ---------------- | ------- | ---- |
| 8.22843 | 2021-01-01T00:00:20Z | 1       | 5.55         | 5.55             | anomaly | t1   |
| 8.22843 | 2021-01-01T00:00:20Z | 1       | 5.55         | 5.55             | anomaly | t2   |

| MAD                | *_time               | _value             | _value_diff        | _value_diff_med    | level   | tag  |
| ------------------ | -------------------- | ------------------ | ------------------ | ------------------ | ------- | ---- |
| 1.6605119999999987 | 2021-01-01T00:00:30Z | 0.9999999999999984 | 1.1199999999999974 | 1.1199999999999992 | normal  | t1   |
| 1.6605119999999987 | 2021-01-01T00:00:30Z | 1.0000000000000016 | 1.120000000000001  | 1.1199999999999992 | anomaly | t2   |

| MAD                | *_time               | _value  | _value_diff        | _value_diff_med    | level   | tag  |
| ------------------ | -------------------- | ------- | ------------------ | ------------------ | ------- | ---- |
| 1.0155810000000007 | 2021-01-01T00:00:40Z | 1       | 0.6850000000000005 | 0.6850000000000005 | anomaly | t1   |
| 1.0155810000000007 | 2021-01-01T00:00:40Z | 1       | 0.6850000000000005 | 0.6850000000000005 | anomaly | t2   |

| MAD                | *_time               | _value             | _value_diff        | _value_diff_med    | level   | tag  |
| ------------------ | -------------------- | ------------------ | ------------------ | ------------------ | ------- | ---- |
| 1.9051409999999995 | 2021-01-01T00:00:50Z | 1                  | 1.2849999999999997 | 1.2849999999999997 | anomaly | t1   |
| 1.9051409999999995 | 2021-01-01T00:00:50Z | 1.0000000000000002 | 1.285              | 1.2849999999999997 | anomaly | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
