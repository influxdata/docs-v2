---
title: Downsample data
seotitle: Downsample data in an InfluxDB task
description: placeholder
menu:
  v2_0:
    name: Downsample data
    parent: Common tasks
    weight: 4
---

**Requirements:**

- Data source
- Some type of aggregation
- and a `to` statement


```js
option task = {
  name: "cqinterval15m",
  every: 1w,
}

data = from(bucket: "telegraf")
  |> range(start: -task.every * 2)
  |> filter(fn: (r) => r._measurement == "cpu")

downsampleHourly = (table=<-) =>
  table
    |> aggregateWindow(fn: mean, every: 1h)
    |> set(key: "_measurement", value: "cpu_1h" )
    |> to(bucket: "telegraf_downsampled")

downsampleHourly(data)

```
