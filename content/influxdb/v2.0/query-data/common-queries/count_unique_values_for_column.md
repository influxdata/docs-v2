---
title: Count unique values
description: >
  Count the number of unique values in a specified column.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Count unique values
    parent: Common queries
weight: 104
---

Use the [`unique()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/) to return unique values in a specified column. Use the [`count()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/count/) to count the number of unique values.

The following example uses the Sample NOAA weather data to identify and count unique locations data was collected from. It first uses `group()` to ungroup data and return results in a single table.

```js
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
  |> group()
  |> unique(column: "location")
  |> count(column: "location")
```

### Example results

| location  |
| ---------:|
| 2         |
