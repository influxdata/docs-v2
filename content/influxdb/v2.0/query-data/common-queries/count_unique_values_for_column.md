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

{{% note %}}
This example uses [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

The following examples identify and count unique locations that data was collected from.

## Find unique values

This example uses [`csv.from()`](influxdb/v2.0/reference/flux/stdlib/csv/from/), [`keep()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keep/), and [`unique()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/) to return unique values in a specified column.

```js
import "experimental/csv"

csv.from(bucket: "noaa")
  |> keep(columns: ["location"])
  |> unique(column: "location")
```

### Example results
|result |table|location    |
| -----:| ---:| ------:    |
|       |0    |coyote_creek|
|       |1    |santa_monica|

## Count unique values

This example uses [`csv.from()`](influxdb/v2.0/reference/flux/stdlib/csv/from/), [`keep()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keep/), [`unique()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/), and then [`count()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/count/) to count the number of unique values. It first uses `group()` to ungroup data and return results in a single table.

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
