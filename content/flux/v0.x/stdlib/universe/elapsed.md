---
title: elapsed() function
description: The `elapsed()` function returns the time between subsequent records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/elapsed/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/elapsed/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/elapsed/
menu:
  flux_0_x_ref:
    name: elapsed
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/contrib/tomhollingworth/events/duration/
introduced: 0.36.0
---

The `elapsed()` function returns the time between subsequent records.
Given an input table, `elapsed()` returns the same table without the first record
(as elapsed time is not defined) and an additional column containing the elapsed time.

```js
elapsed(
  unit: 1s,
  timeColumn: "_time",
  columnName: "elapsed"
)
```

_`elapsed()` returns an errors if the `timeColumn` is not present in the input table._

## Parameters

### unit {data-type="duration"}
The unit time to returned.
_Default is `1s`._

### timeColumn {data-type="string"}
The column to use to compute the elapsed time.
_Default is `"_time"`._

### columnName {data-type="string"}
The column to store elapsed times.
_Default is `"elapsed"`._

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Calculate the time between points in seconds
```js
import "sampledata"

sampledata.int()
	|> elapsed(unit: 1s)
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value | elapsed |
| :------------------- | :-- | -----: | ------: |
| 2021-01-01T00:00:10Z | t1  |     10 |      10 |
| 2021-01-01T00:00:20Z | t1  |      7 |      10 |
| 2021-01-01T00:00:30Z | t1  |     17 |      10 |
| 2021-01-01T00:00:40Z | t1  |     15 |      10 |
| 2021-01-01T00:00:50Z | t1  |      4 |      10 |

| _time                | tag | _value | elapsed |
| :------------------- | :-- | -----: | ------: |
| 2021-01-01T00:00:10Z | t2  |      4 |      10 |
| 2021-01-01T00:00:20Z | t2  |     -3 |      10 |
| 2021-01-01T00:00:30Z | t2  |     19 |      10 |
| 2021-01-01T00:00:40Z | t2  |     13 |      10 |
| 2021-01-01T00:00:50Z | t2  |      1 |      10 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
