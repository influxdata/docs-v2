---
title: Find and count unique values
description: >
  Count the number of unique values in a specified column.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Count unique values
    parent: Common queries
weight: 104
---

The following examples use the Sample NOAA weather data to identify and count unique locations data was collected from.

## Find unique values

Use the [`unique()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/) to return unique values in a specified column.

```js
import "experimental/csv"

csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
  |> keep(columns: ["location"])
  |> unique(column: "location")
```

### Example results
|result |table|location    |
| -----:| ---:| ------:    |
|       |0    |coyote_creek|
|       |1    |santa_monica|

## Count unique values

This example uses [`count()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/count/) to count the number of unique values. It first uses `group()` to ungroup data and return results in a single table.

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
