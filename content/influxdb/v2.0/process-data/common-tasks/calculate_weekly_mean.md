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

Calculate a weekly mean and store it in a separate bucket.

This example groups average temperature by week and computes the mean using the [`aggregateWindow()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/), then sends it to a new bucket (`weekly_means`).

This article uses [NOAA water database data](https://influx-testdata.s3.amazonaws.com/noaa.csv) and the experimental [`csv.from()` function](/influxdb/v2.0/reference/flux/stdlib/experimental/csv/from/).

```js
import "experimental/csv"

option task = {
  name: "weekly-means",
  every: 1w,
}

csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
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
