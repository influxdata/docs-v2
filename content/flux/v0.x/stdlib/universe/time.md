---
title: time() function
description: The `time()` function converts a single value to a time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/time/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/time/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/time/
menu:
  flux_0_x_ref:
    name: time
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/time/
  - /flux/v0.x/stdlib/universe/totime/
introduced: 0.7.0
---

The `time()` function converts a value to a [time value](/flux/v0.x/data-types/basic/time/).

```js
time(v: "2016-06-13T17:43:50.1004002Z")
```

## Parameters

### v {data-type="string, int, uint"}
The value to convert.
String values must be formatted as [RFC3339 timestamps](/influxdb/cloud/reference/glossary/#rfc3339-timestamp).

{{% note %}}
`time()` assumes all numeric input values are nanosecond epoch timestamps.
{{% /note %}}

## Examples

- [Convert a string to a time value](#convert-a-string-to-a-time-value)
- [Convert an integer to a time value](#convert-an-integer-to-a-time-value)
- [Convert all values in a column to time values](#convert-all-values-in-a-column-to-time-values)

#### Convert a string to a time value
```js
time(v: "2021-01-01T00:00:00Z")

// Returns 2021-01-01T00:00:00Z (time)
```

#### Convert an integer to a time value
```js
int(v: 609459200000000000)

// Returns 2021-01-01T00:00:00Z
```

#### Convert all values in a column to time values
If updating values in the `_value` column, use [`toTime()`](/flux/v0.x/stdlib/universe/totime/).
To update values in columns other than `_value`:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `time()` to update the value of a column.

{{% flux/sample-example-intro %}}

```js
import "sampledata"

data = sampledata.int()
  |> map(fn: (r) => ({ r with _value: r._value * 1000000000 }))
  |> rename(columns: {_value: "foo"})

data
  |> map(fn:(r) => ({ r with foo: time(v: r.foo) }))
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                                             | tag |         foo |
| :------------------------------------------------ | :-- | ----------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t1  | -2000000000 |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t1  | 10000000000 |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t1  |  7000000000 |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  | 17000000000 |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  | 15000000000 |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t1  |  4000000000 |

| _time                                             | tag |         foo |
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
| _time                                             | tag | foo                                               |
| :------------------------------------------------ | :-- | :------------------------------------------------ |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t1  | {{% nowrap %}}1969-12-31T23:59:58Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:10Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:07Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:17Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:15Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t1  | {{% nowrap %}}1970-01-01T00:00:04Z{{% /nowrap %}} |

| _time                                             | tag | foo                                               |
| :------------------------------------------------ | :-- | :------------------------------------------------ |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:19Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:10Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:04Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:20Z{{% /nowrap %}} | t2  | {{% nowrap %}}1969-12-31T23:59:57Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:30Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:19Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:40Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:13Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T00:00:50Z{{% /nowrap %}} | t2  | {{% nowrap %}}1970-01-01T00:00:01Z{{% /nowrap %}} |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
