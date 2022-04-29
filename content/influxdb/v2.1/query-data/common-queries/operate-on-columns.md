---
title: Operate on columns
description: >
  Find and count unique values, recalculate the `_value` column, and use values to calculate a new column.
influxdb/v2.1/tags: [queries]
aliases: 
  - /influxdb/v2.1/query-data/common-queries/count_unique_values_for_column/
  - /influxdb/v2.1/query-data/common-queries/recalculate_value_column/
  - /influxdb/v2.1/query-data/common-queries/calculate_new_column/
menu:
  influxdb_2_1:
    name: Operate on columns
    parent: Common queries
weight: 100  
---

Use the following common queries to operate on columns:

- [Find and count unique values in a column](#find-and-count-unique-values-in-a-column)
- [Recalculate the _values column](#recalculate-the-_values-column)
- [Calculate a new column](#calculate-a-new-column)

{{% note %}}
These examples use [NOAA water sample data](/influxdb/v2.1/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

## Find and count unique values in a column

Find and count the number of unique values in a specified column.
The following examples find and count unique locations where data was collected.

### Find unique values

This query:

  - Uses [`group()`](/{{< latest "flux" >}}/stdlib/universe/group/) to ungroup data and return results in a single table.
  - Uses [`keep()`](/{{< latest "flux" >}}/stdlib/universe/keep/) and [`unique()`](/{{< latest "flux" >}}/stdlib/universe/selectors/unique/) to return unique values in the specified column.

```js
from(bucket: "noaa")
    |> range(start: 2019-08-17)
    |> keep(columns: ["location"])
    |> group()
    |> unique(column: "location")
```

#### Example results
| location     |
|:--------     |
| coyote_creek |
| santa_monica |

### Count unique values

This query:

- Uses [`group()`](/{{< latest "flux" >}}/stdlib/universe/group/) to ungroup data and return results in a single table.
- Uses [`keep()`](/{{< latest "flux" >}}/stdlib/universe/keep/), [`unique()`](/{{< latest "flux" >}}/stdlib/universe/unique/), and then [`count()`](/{{< latest "flux" >}}/stdlib/universe/count/) to count the number of unique values.

```js
from(bucket: "noaa")
    |> range(start: 2019-08-17)
    |> keep(columns: ["location"])
    |> group()
    |> unique(column: "location")
    |> count(column: "location")
```

#### Example results

| location  |
| ---------:|
| 2         |


## Recalculate the _values column

To recalculate the `_value` column, use the `with` operator in [`map()`](/{{< latest "flux" >}}/stdlib/universe/map/) to overwrite the existing `_value` column.

The following query:

  - Uses [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/) to filter the `average_temperature` measurement.
  - Uses [`map()`](/{{< latest "flux" >}}/stdlib/universe/map/) to convert Fahrenheit temperature values into Celsius.

```js

from(bucket: "noaa")
    |> range(start: 2019-08-17)
    |> filter(fn: (r) => r._measurement == "average_temperature")
    |> map(fn: (r) => ({r with _value: (float(v: r._value) - 32.0) * 5.0 / 9.0} ))
```

| _field  | _measurement        | _start               | _stop                | _time                | location     | _value             |
|:------  |:------------        |:------               |:-----                |:-----                |:--------     | ------:            |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:00:00Z | coyote_creek | 27.77777777777778  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:06:00Z | coyote_creek | 22.77777777777778  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:12:00Z | coyote_creek | 30                 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:18:00Z | coyote_creek | 31.666666666666668 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:24:00Z | coyote_creek | 25                 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:30:00Z | coyote_creek | 21.11111111111111  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:36:00Z | coyote_creek | 28.88888888888889  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:42:00Z | coyote_creek | 24.444444444444443 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:48:00Z | coyote_creek | 29.444444444444443 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:54:00Z | coyote_creek | 26.666666666666668 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T01:00:00Z | coyote_creek | 21.11111111111111  |
| •••     | •••                 | •••                  | •••                  | •••                  | •••          | •••                |

## Calculate a new column

To use values in a row to calculate and add a new column, use `map()`.
This example below converts temperature from Fahrenheit to Celsius and maps the Celsius value to a new `celsius` column.

The following query:

  - Uses [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/) to filter the `average_temperature` measurement.
  - Uses [`map()`](/{{< latest "flux" >}}/stdlib/universe/map/) to create a new column calculated from existing values in each row.

```js
from(bucket: "noaa")
    |> range(start: 2019-08-17)
    |> filter(fn: (r) => r._measurement == "average_temperature")
    |> map(fn: (r) => ({r with celsius: (r._value - 32.0) * 5.0 / 9.0}))
```

#### Example results

| _start               | _stop                | _field  | _measurement        | location     | _time                | _value | celsius |
|:------               |:-----                |:------: |:------------:       |:--------:    |:-----                | ------:| -------:|
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:00:00Z | 82     | 27.78   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:06:00Z | 73     | 22.78   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:12:00Z | 86     | 30.00   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:18:00Z | 89     | 31.67   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:24:00Z | 77     | 25.00   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:30:00Z | 70     | 21.11   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:36:00Z | 84     | 28.89   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:42:00Z | 76     | 24.44   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:48:00Z | 85     | 29.44   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:54:00Z | 80     | 26.67   |
| •••                  | •••                  | •••     | •••                 | •••          | •••                  | •••    | •••     |
