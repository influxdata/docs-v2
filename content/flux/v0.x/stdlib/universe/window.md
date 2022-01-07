---
title: window() function
description: The `window()` function groups records based on a time value.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/window
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/window/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/window/
menu:
  flux_0_x_ref:
    name: window
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/window-aggregate/
  - /flux/v0.x/stdlib/built-in/universe/aggregatewindow/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY time()
introduced: 0.7.0
---

The `window()` function groups records based on a time value.
The function calculates time windows and stores window bounds in the `_start`
and `_stop` columns.
`_start` and `_stop` values are assigned to rows based on the `_time` value.

A single input row may be placed into zero or more output tables depending on
the parameters passed into the `window()` function.

```js
window(
  every: 5m,
  period: 5m,
  offset: 12h,
  timeColumn: "_time",
  startColumn: "_start",
  stopColumn: "_stop",
  location: "UTC",
  createEmpty: false
)
```

## Parameters

{{% note %}}
#### Calendar months and years
`every`, `period`, and `offset` support all [valid duration units](/flux/v0.x/spec/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.

#### Window by week
When windowing by week (`1w`), weeks are determined using the 
**Unix epoch (1970-01-01T00:00:00Z UTC)**. The Unix epoch was on a Thursday, so
all calculated weeks begin on Thursday.
{{% /note %}}

### every {data-type="duration"}
Duration of time between windows.
Defaults to `period` value.

### period {data-type="duration"}
Duration of the window.
Period is the length of each interval.
It can be negative, indicating the start and stop boundaries are reversed.
Defaults to `every` value.

### offset {data-type="duration"}
Offset is the duration by which to shift the window boundaries.
It can be negative, indicating that the offset goes backwards in time.
Defaults to 0, which will align window end boundaries with the `every` duration.

### timeColumn {data-type="string"}
The column containing time.
Defaults to `"_time"`.

### startColumn {data-type="string"}
The column containing the window start time.
Defaults to `"_start"`.

### stopColumn {data-type="string"}
The column containing the window stop time.
Defaults to `"_stop"`.

### location {data-type="string"}
Location used to determine timezone.
Default is the [`location` option](/flux/v0.x/stdlib/universe/#location).

_Flux uses the timezone database (commonly referred to as "tz" or "zoneinfo")
provided by the operating system._

### createEmpty {data-type="bool"}
Specifies whether empty tables should be created.
Defaults to `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Window data into 30 second intervals](#window-data-into-30-second-intervals)
- [Window every 20 seconds covering 40 second periods](#window-every-20-seconds-covering-40-second-periods)
- [Window by calendar month](#window-by-calendar-month)

#### Window data into 30 second intervals
```js
import "sampledata"

data = sampledata.int()
  |> range(start: sampledata.start, stop: sampledata.stop)
 
data 
  |> window(every: 30s)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}

##### Input data
{{% flux/sample set="int" includeRange=true %}}

##### Output data
| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:20Z | t1  |      7 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1  |      4 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:30Z | 2021-01-01T00:00:20Z | t2  |     -3 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:30Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2  |      1 |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Window every 20 seconds covering 40 second periods
```js
import "sampledata"

data = sampledata.int()
  |> range(start: sampledata.start, stop: sampledata.stop)
 
data 
  |> window(every: 20s, period: 40s)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}

##### Input data
{{% flux/sample set="int" includeRange=true %}}

##### Output data
| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:10Z | t1  |     10 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:30Z | t1  |     17 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1  |      4 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t1  |      4 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:20Z | 2021-01-01T00:00:10Z | t2  |      4 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:00:40Z | 2021-01-01T00:00:30Z | t2  |     19 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:20Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2  |      1 |

| _start               | _stop                | _time                | tag | _value |
| :------------------- | :------------------- | :------------------- | :-- | -----: |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:40Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | t2  |      1 |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Window by calendar month
The following example uses [`generate.from`](/flux/v0.x/stdlib/generate/from/)
to illustrate windowing by calendar month.

```js
import "generate"

timeRange = {start: 2021-01-01T00:00:00Z, stop: 2021-04-01T00:00:00Z}

data = generate.from(
    count: 6,
    fn: (n) => n + n,
    start: timeRange.start,
    stop: timeRange.stop
  )
  |> range(start: timeRange.start, stop: timeRange.stop)

data
  |> window(every: 1mo)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}

##### Input data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-01-01T00:00:00Z |      0 |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-01-16T00:00:00Z |      2 |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-01-31T00:00:00Z |      4 |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-02-15T00:00:00Z |      6 |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-02T00:00:00Z |      8 |
| 2021-01-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-17T00:00:00Z |     10 |

##### Output data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-01T00:00:00Z |      0 |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-16T00:00:00Z |      2 |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-31T00:00:00Z |      4 |

| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-15T00:00:00Z |      6 |

| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-03-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-02T00:00:00Z |      8 |
| 2021-03-01T00:00:00Z | 2021-04-01T00:00:00Z | 2021-03-17T00:00:00Z |     10 |

{{% /expand %}}
{{< /expand-wrapper >}}
