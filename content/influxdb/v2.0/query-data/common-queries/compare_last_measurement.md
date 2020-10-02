---
title: Compare the last measurement to a mean stored in another bucket
seotitle: Compare the last measurement to a mean stored in another bucket
description: >
  .
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Compare the last measurement to another bucket's mean
    parent: Common queries
weight: 104
---
Useful for writing to a bucket and using as a threshold check. Get the last value in the means bucket, compare it to the last value in your main bucket, use `join()` to combine the results, and use `map()` to calculate the differences.

```
means = from(bucket: "weekly_means")
|> range(start: 2019-09-01T00:00:00Z)
|> last()
|> keep(columns: ["_value", "location"])

latest = from(bucket: "noaa")
|> range(start: 2019-09-01T00:00:00Z)
|> filter(fn: (r) => r._measurement == "average_temperature")
|> last()
|> keep(columns: ["_value", "location"])

join(tables: {mean: means, reading: latest}, on: ["location"])
|> map(fn: (r) => ({r with deviation: r._value_reading - r._value_mean}))
```

|#group   |false  |false|false       |false              |false                         |true                          |
|---------|-------|-----|------------|-------------------|------------------------------|------------------------------|
|#datatype|string |long |double      |double             |double                        |string                        |
|#default |_result|     |            |                   |                              |                              |
|         |result |table|_value_mean |_value_reading     |deviation                     |location                      |
|         |       |0    |79.82710622710623|89                 |9.172893772893772             |coyote_creek                  |
|         |       |1    |80.20451339915374|85                 |4.79548660084626              |santa_monica                  |
