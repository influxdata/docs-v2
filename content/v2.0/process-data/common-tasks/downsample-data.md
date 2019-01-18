---
title: Downsample data with InfluxDB
seotitle: Downsample data in an InfluxDB task
description: placeholder
menu:
  v2_0:
    name: Downsample data
    parent: Common tasks
    weight: 4
---

- Talk about Continuous Queries

**Requirements:**

- A "source" bucket
- A "destination" bucket
- Some type of aggregation
- and a `to` statement

- You can't write data into the same bucket you're reading from
- A two buckets
- `to()` requires a bucket AND org


```js
option task = {
  name: "cqinterval15m",
  every: 1w,
}

data = from(bucket: "telegraf")
  |> range(start: -task.every * 2)
  |> filter(fn: (r) => r._measurement == "cpu")

downsampleHourly = (tables=<-) =>
  tables
    |> aggregateWindow(fn: mean, every: 1h)
    |> set(key: "_measurement", value: "cpu_1h" )
    |> to(bucket: "telegraf_downsampled", org: "my-org")

downsampleHourly(data)
```
