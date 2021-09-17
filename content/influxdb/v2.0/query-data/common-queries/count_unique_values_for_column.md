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
These examples use [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

The following examples identify and count unique locations that data was collected from.

## Find unique values

This query:

  - Uses [`group()`](/{{< latest "flux" >}}/stdlib/universe/group/) to ungroup data and return results in a single table.
  - Uses [`keep()`](/{{< latest "flux" >}}/stdlib/universe/keep/) and [`unique()`](/{{< latest "flux" >}}/stdlib/universe/unique/) to return unique values in the specified column.

```js
from(bucket: "noaa")
  |> range(start: -30d)
  |> group()
  |> keep(columns: ["location"])
  |> unique(column: "location")
```

### Example results
| location     |
|:--------     |
| coyote_creek |
| santa_monica |

## Count unique values

This query:

  - Uses [`group()`](/{{< latest "flux" >}}/stdlib/universe/group/) to ungroup data and return results in a single table.
  - Uses [`keep()`](/{{< latest "flux" >}}/stdlib/universe/keep/), [`unique()`](/{{< latest "flux" >}}/stdlib/universe/unique/), and then [`count()`](/{{< latest "flux" >}}/stdlib/universe/count/) to count the number of unique values.

```js
from(bucket: "noaa")
  |> group()
  |> unique(column: "location")
  |> count(column: "location")
```

### Example results

| location  |
| ---------:|
| 2         |
