---
title: Compare the last measurement to another bucket's mean
seotitle: Compare the last measurement to a mean stored in another bucket
description: >
  This example is useful for writing a mean to a bucket and using it as a threshold check.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Compare the last measurement to another bucket's mean
    parent: Common queries
weight: 104
---


This example is useful for writing a mean to a bucket and using it as a threshold check. It compares the last measurement to a mean stored in another bucket by doing the following:
  - Gets the last value in the `means` bucket
  - Compares it to the last value in the main bucket
  - Uses [`join()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/join/) to combine the result
  - Uses [`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/) to calculate the differences

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
