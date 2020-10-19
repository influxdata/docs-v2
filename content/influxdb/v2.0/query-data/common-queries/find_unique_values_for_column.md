---
title: Find unique values for a column
seotitle: Find unique values for a column
description: >
  .
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Find unique values
    parent: Common queries
weight: 103
---

Drop all the data except the column you are interested in, and use the [`unique()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/) to find unique values.

```
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
|> keep(columns: ["location"])
|> unique(column: "location")
```

|#group   |false  |false|true        |
|---------|-------|-----|------------|
|#datatype|string |long |string      |
|#default |_result|     |            |
|         |result |table|location    |
|         |       |0    |coyote_creek|
|         |       |1    |santa_monica|
