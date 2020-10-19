---
title: Count unique values for a column
seotitle: Count unique values for a column
description: >
  .
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Count unique values
    parent: Common queries
weight: 104
---

Drop all the data except the column you are interested in: in this case, the `location` column.

This example uses the [`unique()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/), removes the grouping, then uses the [`count()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/count/).

```
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
|> keep(columns: ["location"])
|> unique(column: "location")
|> group(columns: [])
|> count(column: "location")
```

|#group   |false  |false|false       |
|---------|-------|-----|------------|
|#datatype|string |long |long        |
|#default |_result|     |            |
|         |result |table|location    |
|         |       |0    |2           |
