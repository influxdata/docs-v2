---
title: timeShift() function
description: The `timeShift()` function adds a fixed duration to time columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/shift
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/shift
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/timeshift/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timeshift/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/timeshift/
menu:
  flux_0_x_ref:
    name: timeShift
    parent: universe
weight: 102
flux/v0.x/tags: [transformations, date/time]
introduced: 0.7.0
---

The `timeShift()` function adds a fixed duration to time columns.
The output table schema is the same as the input table.
If the time is `null`, the time will continue to be `null`.

```js
timeShift(duration: 10h, columns: ["_start", "_stop", "_time"])
```

## Parameters

### duration {data-type="duration"}
({{< req >}})
The amount of time to add to each time value.
May be a negative duration.

### columns {data-type="array of strings"}
The list of all columns to be shifted.
Default is `["_start", "_stop", "_time"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Shift timestamps forward in time](#shift-timestamps-forward-in-time)
- [Shift timestamps backward in time](#shift-timestamps-backward-in-time)

#### Shift timestamps forward in time
```js
import "sampledata"

sampledata.int()
  |> timeShift(duration: 12h)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T12:00:00Z | t1  |     -2 |
| 2021-01-01T12:00:10Z | t1  |     10 |
| 2021-01-01T12:00:20Z | t1  |      7 |
| 2021-01-01T12:00:30Z | t1  |     17 |
| 2021-01-01T12:00:40Z | t1  |     15 |
| 2021-01-01T12:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T12:00:00Z | t2  |     19 |
| 2021-01-01T12:00:10Z | t2  |      4 |
| 2021-01-01T12:00:20Z | t2  |     -3 |
| 2021-01-01T12:00:30Z | t2  |     19 |
| 2021-01-01T12:00:40Z | t2  |     13 |
| 2021-01-01T12:00:50Z | t2  |      1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Shift timestamps backward in time
```js
import "sampledata"

sampledata.int()
  |> timeShift(duration: -12h)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2020-12-31T12:00:00Z | t1  |     -2 |
| 2020-12-31T12:00:10Z | t1  |     10 |
| 2020-12-31T12:00:20Z | t1  |      7 |
| 2020-12-31T12:00:30Z | t1  |     17 |
| 2020-12-31T12:00:40Z | t1  |     15 |
| 2020-12-31T12:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2020-12-31T12:00:00Z | t2  |     19 |
| 2020-12-31T12:00:10Z | t2  |      4 |
| 2020-12-31T12:00:20Z | t2  |     -3 |
| 2020-12-31T12:00:30Z | t2  |     19 |
| 2020-12-31T12:00:40Z | t2  |     13 |
| 2020-12-31T12:00:50Z | t2  |      1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
