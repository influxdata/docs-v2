---
title: hourSelection() function
description: >
  The `hourSelection()` function retains all rows with time values in a specified hour range.
  Hours are specified in military time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/hourselection
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/hourselection/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/hourselection/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/hourselection/
menu:
  flux_0_x_ref:
    name: hourSelection
    parent: universe
weight: 102
flux/v0.x/tags: [transformations, date/time]
introduced: 0.39.0
---

The `hourSelection()` function retains all rows with time values in a specified hour range.

```js
hourSelection(
  start: 9,
  stop: 17,
  timeColumn: "_time"
)
```

## Parameters

### start {data-type="int"}
({{< req >}})
The first hour of the hour range (inclusive).
Hours range from `[0-23]`.

### stop {data-type="int"}
({{< req >}})
The last hour of the hour range (inclusive).
Hours range from `[0-23]`.

### timeColumn {data-type="string"}
The column that contains the time value.
Default is `"_time"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
The following example uses [`generate.from()`](/flux/v0.x/stdlib/generate/from/)
to generate sample data and show how `covariance()` transforms data.

#### Filter by business hours
```js
import "generate"

data = generate.from(
  count: 8,
  fn: (n) => n * n,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-02T00:00:00Z
)
  
data 
  |> hourSelection(start: 9, stop: 17)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |      0 |
| 2021-01-01T03:00:00Z |      1 |
| 2021-01-01T06:00:00Z |      4 |
| 2021-01-01T09:00:00Z |      9 |
| 2021-01-01T12:00:00Z |     16 |
| 2021-01-01T15:00:00Z |     25 |
| 2021-01-01T18:00:00Z |     36 |
| 2021-01-01T21:00:00Z |     49 |

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T09:00:00Z |      9 |
| 2021-01-01T12:00:00Z |     16 |
| 2021-01-01T15:00:00Z |     25 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
