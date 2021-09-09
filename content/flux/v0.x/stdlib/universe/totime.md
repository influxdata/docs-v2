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
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
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
  |> map(fn: (r) => ({ r with _value: r._value * 1000000000 }))

data
  |> toTime()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                                             | tag |      _value |
| :------------------------------------------------ | :-- | ----------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t1  | -2000000000 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t1  | 10000000000 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t1  |  7000000000 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  | 17000000000 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  | 15000000000 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t1  |  4000000000 |

| _time                                             | tag |      _value |
| :------------------------------------------------ | :-- | ----------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  | 19000000000 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t2  |  4000000000 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t2  | -3000000000 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  | 19000000000 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t2  | 13000000000 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t2  |  1000000000 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                                             | tag |                                            _value |
| :------------------------------------------------ | :-- | ------------------------------------------------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t1  | {{% nowrap %}}1969-12-31T23:59:58Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:10Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:07Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:17Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:15Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:04Z{{% /nowrap %}} |

| _time                                             | tag |                                            _value |
| :------------------------------------------------ | :-- | ------------------------------------------------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:19Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:04Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t2  | {{% nowrap %}}1969-12-31T23:59:57Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:19Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:13Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:01Z{{% /nowrap %}} |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
toTime = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: time(v:r._value) }))
```
