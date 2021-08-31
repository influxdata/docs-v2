---
title: cumulativeSum() function
description: The `cumulativeSum()` function computes a running sum for non-null records in the table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/cumulativesum
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/cumulativesum/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/cumulativesum/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/cumulativesum/
menu:
  flux_0_x_ref:
    name: cumulativeSum
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/cumulativesum/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#cumulative-sum, InfluxQL – CUMULATIVE_SUM()
introduced: 0.7.0
---

The `cumulativeSum()` function computes a running sum for non-null records in the table.
The output table schema will be the same as the input table.

_**Output data type:** Float_

```js
cumulativeSum(columns: ["_value"])
```

## Parameters

### columns {data-type="array of strings"}
A list of columns on which to operate.
Defaults to `["_value"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

data = sampledata.string()

data
  |> cumulativeSum()
```
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:10Z | t1  |      8 |
| 2021-01-01T00:00:20Z | t1  |     15 |
| 2021-01-01T00:00:30Z | t1  |     32 |
| 2021-01-01T00:00:40Z | t1  |     47 |
| 2021-01-01T00:00:50Z | t1  |     51 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:10Z | t2  |     23 |
| 2021-01-01T00:00:20Z | t2  |     20 |
| 2021-01-01T00:00:30Z | t2  |     39 |
| 2021-01-01T00:00:40Z | t2  |     52 |
| 2021-01-01T00:00:50Z | t2  |     53 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
