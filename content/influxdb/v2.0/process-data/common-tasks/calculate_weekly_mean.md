---
title: Calculate a weekly mean
description: >
  Calculate a weekly mean and add it to a new bucket.
menu:
  influxdb_2_0:
    name: Calculate a weekly mean
    parent: Common tasks
weight: 202
influxdb/v2.0/tags: [tasks]
---

{{% note %}}
This example uses [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

This example calculates a temperature weekly mean and stores it in a separate bucket.

The following query:
  -  Uses [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/) to filter the `average_temperature` measurement.
  - Uses [`range()`](/{{< latest "flux" >}}/stdlib/universe/range/) to define a time range.
  - Uses [`aggregateWindow()`](/{{< latest "flux" >}}/stdlib/universe/aggregatewindow/) to group average temperature by week and compute the mean.
  - Sends the weekly mean to a new bucket (`weekly_means`)

```js
option task = {
  name: "weekly-means",
  every: 1w,
}

from(bucket: "noaa")
  |> filter(fn: (r) => r._measurement == "average_temperature")
  |> range(start: 2019-09-01T11:24:00Z)
  |> aggregateWindow(every:  1w, fn: mean)
  |> to(bucket: "weekly_means")
```
### Example results

| _start               | _stop                | _field  | _measurement        | location     | _value            | _time                |
|:------               |:-----                |:------  |:------------        |:--------     | ------:           |:-----                |
| 2019-09-01T11:24:00Z | 2020-10-19T20:39:49Z | degrees | average_temperature | coyote_creek | 80.31005917159763 | 2019-09-05T00:00:00Z |
| 2019-09-01T11:24:00Z | 2020-10-19T20:39:49Z | degrees | average_temperature | coyote_creek | 79.8422619047619  | 2019-09-12T00:00:00Z |
| 2019-09-01T11:24:00Z | 2020-10-19T20:39:49Z | degrees | average_temperature | coyote_creek | 79.82710622710623 | 2019-09-19T00:00:00Z |

| _start               | _stop                | _field  | _measurement        | location     | _value            | _time                |
|:------               |:-----                |:------  |:------------        |:--------     | ------:           |:-----                |
| 2019-09-01T11:24:00Z | 2020-10-19T20:39:49Z | degrees | average_temperature | santa_monica | 80.19952494061758 | 2019-09-05T00:00:00Z |
| 2019-09-01T11:24:00Z | 2020-10-19T20:39:49Z | degrees | average_temperature | santa_monica | 80.01964285714286 | 2019-09-12T00:00:00Z |
| 2019-09-01T11:24:00Z | 2020-10-19T20:39:49Z | degrees | average_temperature | santa_monica | 80.20451
