---
title: Calculate a weekly mean and add it to a new bucket
seotitle: Calculate a weekly mean and add it to a new bucket
description: >
  Compare values to a historical mean.
menu:
  influxdb_2_0:
    name: Calculate a weekly mean
    parent: Common tasks
weight: 202
influxdb/v2.0/tags: [tasks]
---

Calculate a weekly mean and add it to a new bucket, enabling you to compare values to a historical mean. This example groups average temperature by week and computes the mean using the [`window()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/) and [`mean()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mean/), then sends it to a new bucket (`weekly_means`).


```
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
|> filter(fn: (r) => r._measurement == "average_temperature")
|> range(start: 2019-09-01T11:24:00Z)
|> window(every: 1w)
|> mean()
|> rename(columns: {_stop: "_time"})
|> to(bucket: "weekly_means")
```

|#group   |false  |false|true        |true               |true                          |true                          |true                |false |
|---------|-------|-----|------------|-------------------|------------------------------|------------------------------|--------------------|------|
|#datatype|string |long |dateTime:RFC3339|dateTime:RFC3339   |string                        |string                        |string              |double|
|#default |to6    |     |            |                   |                              |                              |                    |      |
|         |result |table|_start      |_time              |_field                        |_measurement                  |location            |_value|
|         |       |0    |2019-09-01T11:24:00Z|2019-09-05T00:00:00Z|degrees                       |average_temperature           |coyote_creek        |80.31005917159763|
|         |       |1    |2019-09-01T11:24:00Z|2019-09-05T00:00:00Z|degrees                       |average_temperature           |santa_monica        |80.19952494061758|
|         |       |2    |2019-09-05T00:00:00Z|2019-09-12T00:00:00Z|degrees                       |average_temperature           |coyote_creek        |79.8422619047619|
|         |       |3    |2019-09-05T00:00:00Z|2019-09-12T00:00:00Z|degrees                       |average_temperature           |santa_monica        |80.01964285714286|
|         |       |4    |2019-09-12T00:00:00Z|2019-09-19T00:00:00Z|degrees                       |average_temperature           |coyote_creek        |79.82710622710623|
|         |       |5    |2019-09-12T00:00:00Z|2019-09-19T00:00:00Z|degrees                       |average_temperature           |santa_monica        |80.20451339915374|
