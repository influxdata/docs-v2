---
title: experimental.alignTime() function
description: >
  The `experimental.alignTime()` function aligns input tables to a common start time.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/aligntime/
  - /influxdb/cloud/reference/flux/stdlib/experimental/aligntime/
menu:
  flux_0_x_ref:
    name: experimental.alignTime
    parent: experimental
weight: 302
flux/v0.x/tags: [transformations, date/time]
introduced: 0.66.0
---

The `experimental.alignTime()` function aligns input tables to a common start time.

```js
import "experimental"

experimental.alignTime(
  alignTo: 1970-01-01T00:00:00.000000000Z
)
```

## Parameters

### alignTo {data-type="time"}
The **UTC time** to align tables to.
Default is `1970-01-01T00:00:00Z`.

## Examples

### Compare values month-over-month
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -12mo)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> window(every: 1mo)
  |> experimental.alignTime()
```

**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 32.1   |
| 2020-01-02T00:00:00Z | 32.9   |
| 2020-01-03T00:00:00Z | 33.2   |
| 2020-01-04T00:00:00Z | 34.0   |
| 2020-02-01T00:00:00Z | 38.3   |
| 2020-02-02T00:00:00Z | 38.4   |
| 2020-02-03T00:00:00Z | 37.8   |
| 2020-02-04T00:00:00Z | 37.5   |

**The following functions:**

1. Window data by calendar month creating two separate tables (one for January and one for February).
2. Align tables to `2020-01-01T00:00:00Z`.

```js
//...
  |> window(every: 1mo)
  |> alignTime(alignTo: 2020-01-01T00:00:00Z)
```

**And output:**

{{< flex >}}
{{% flex-content %}}
| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 32.1   |
| 2020-01-02T00:00:00Z | 32.9   |
| 2020-01-03T00:00:00Z | 33.2   |
| 2020-01-04T00:00:00Z | 34.0   |
{{% /flex-content %}}
{{% flex-content %}}
| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 38.3   |
| 2020-01-02T00:00:00Z | 38.4   |
| 2020-01-03T00:00:00Z | 37.8   |
| 2020-01-04T00:00:00Z | 37.5   |
{{% /flex-content %}}
{{< /flex >}}

Each output table represents data from a calendar month.
When visualized, data is still grouped by month, but timestamps are aligned to a
common start time and values can be compared by time.
