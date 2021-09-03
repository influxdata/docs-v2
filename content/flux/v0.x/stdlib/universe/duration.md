---
title: duration() function
description: The `duration()` function converts a single value to a duration.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/duration/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/duration/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/duration/
menu:
  flux_0_x_ref:
    name: duration
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/duration/
introduced: 0.7.0
---

The `duration()` function converts a single value to a duration.

_**Output data type:** Duration_

```js
duration(v: "1m")
```

## Parameters

### v {data-type="string, int, uint"}
({{< req >}})
Value to convert.

{{% note %}}
`duration()` assumes **numeric** input values are **nanoseconds**.
**String** input values must use [duration literal representation](/flux/v0.x/spec/lexical-elements/#duration-literals).
{{% /note %}}

## Examples

- [Convert an integer to a duration](#convert-an-integer-to-a-duration)
- [Convert a string to a duration](#convert-a-string-to-a-duration)
- [Convert values in a column to durations](#convert-values-in-a-column-to-durations)

#### Convert an integer to a duration
```js
duration(v: 120000000)
// Returns 120ms
```

#### Convert a string to a duration
```js
duration(v: "12h30m")
// Returns 12h30m
```

#### Convert values in a column to durations
The following example uses [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to generate sample data and show how to iterate over values in a stream of tables
and convert them to duration values.

{{% note %}}
Flux does not support duration column types.
This example converts an integer to a duration and stores the value as a string.
{{% /note %}}

```js
import "generate"

data = generate.from(
  count: 5,
  fn: (n) => (n + 1) * 3600000000000,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-01T05:00:00Z,
)

data
  |> map(fn:(r) => ({ r with _value: string(v: duration(v: r._value)) }))
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
| _time                |         _value |
| :------------------- | -------------: |
| 2021-01-01T00:00:00Z |  3600000000000 |
| 2021-01-01T01:00:00Z |  7200000000000 |
| 2021-01-01T02:00:00Z | 10800000000000 |
| 2021-01-01T03:00:00Z | 14400000000000 |
| 2021-01-01T04:00:00Z | 18000000000000 |

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |     1h |
| 2021-01-01T01:00:00Z |     2h |
| 2021-01-01T02:00:00Z |     3h |
| 2021-01-01T03:00:00Z |     4h |
| 2021-01-01T04:00:00Z |     5h |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
