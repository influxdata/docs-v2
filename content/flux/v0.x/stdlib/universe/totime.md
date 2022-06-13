---
title: toTime() function
description: The `toTime()` function converts all values in the `_value` column to times.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/totime
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/totime/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/totime/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/totime/
menu:
  flux_0_x_ref:
    name: toTime
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/time/
  - /flux/v0.x/stdlib/universe/time/
introduced: 0.7.0
---

The `toTime()` function converts all values in the `_value` column to times.

```js
toTime()
```

{{% note %}}
To convert values in a column other than `_value`, use `map()` and `time()`
as shown in [this example](/flux/v0.x/stdlib/universe/time/#convert-all-values-in-a-column-to-time-values).
{{% /note %}}

##### Supported data types

- string ([RFC3339 timestamp](/influxdb/cloud/reference/glossary/#rfc3339-timestamp))
- int
- uint

{{% note %}}
`toTime()` treats all numeric input values as nanosecond epoch timestamps.
{{% /note %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Convert an integer value column to a time column
```js
import "sampledata"

data = sampledata.int()
    |> map(fn: (r) => ({r with _value: r._value * 1000000000}))

data
    |> toTime()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | tag |      _value |
| :------------------- | :-- | ----------: |
| 2021-01-01T00:00:00Z | t1  | -2000000000 |
| 2021-01-01T00:00:10Z | t1  | 10000000000 |
| 2021-01-01T00:00:20Z | t1  |  7000000000 |
| 2021-01-01T00:00:30Z | t1  | 17000000000 |
| 2021-01-01T00:00:40Z | t1  | 15000000000 |
| 2021-01-01T00:00:50Z | t1  |  4000000000 |

| _time                | tag |      _value |
| :------------------- | :-- | ----------: |
| 2021-01-01T00:00:00Z | t2  | 19000000000 |
| 2021-01-01T00:00:10Z | t2  |  4000000000 |
| 2021-01-01T00:00:20Z | t2  | -3000000000 |
| 2021-01-01T00:00:30Z | t2  | 19000000000 |
| 2021-01-01T00:00:40Z | t2  | 13000000000 |
| 2021-01-01T00:00:50Z | t2  |  1000000000 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | tag |               _value |
| :------------------- | :-- | -------------------: |
| 2021-01-01T00:00:00Z | t1  | 1969-12-31T23:59:58Z |
| 2021-01-01T00:00:10Z | t1  | 1970-01-01T00:00:10Z |
| 2021-01-01T00:00:20Z | t1  | 1970-01-01T00:00:07Z |
| 2021-01-01T00:00:30Z | t1  | 1970-01-01T00:00:17Z |
| 2021-01-01T00:00:40Z | t1  | 1970-01-01T00:00:15Z |
| 2021-01-01T00:00:50Z | t1  | 1970-01-01T00:00:04Z |

| _time                | tag |               _value |
| :------------------- | :-- | -------------------: |
| 2021-01-01T00:00:00Z | t2  | 1970-01-01T00:00:19Z |
| 2021-01-01T00:00:10Z | t2  | 1970-01-01T00:00:04Z |
| 2021-01-01T00:00:20Z | t2  | 1969-12-31T23:59:57Z |
| 2021-01-01T00:00:30Z | t2  | 1970-01-01T00:00:19Z |
| 2021-01-01T00:00:40Z | t2  | 1970-01-01T00:00:13Z |
| 2021-01-01T00:00:50Z | t2  | 1970-01-01T00:00:01Z |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
