---
title: group() function
description: The `group()` function groups records based on their values for specific columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/group
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/group/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/group/
menu:
  flux_0_x_ref:
    name: group
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/group-data/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY
introduced: 0.7.0
---

The `group()` function groups records based on their values for specific columns.
It produces tables with new group keys based on provided properties.
Specify an empty array of columns to ungroup data or merge all input tables into a single output table.

```js
group(columns: ["host", "_measurement"], mode:"by")

// OR

group(columns: ["_time"], mode:"except")

// OR

group()
```

{{% warn %}}
#### Group does not guarantee sort order
`group()` does not guarantee the sort order of output records.
To ensure data is sorted correctly, use [`sort()`](/flux/v0.x/stdlib/universe/sort/)
after `group()`.

```js
data
  |> group()
  |> sort(columns: ["_time"])
```
{{% /warn %}}

## Parameters

### columns {data-type="array of strings"}
List of columns to use in the grouping operation.
Defaults to `[]`.

### mode {data-type="string"}
The mode used to group columns.

The following options are available:

- by
- except

Defaults to `"by"`.

#### by
Groups records by columns defined in the [`columns`](#columns) parameter.

#### except
Groups records by all columns **except** those defined in the [`columns`](#columns) parameter.

## Examples

###### Group by host and measurement
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> group(columns: ["host", "_measurement"])
```

###### Group by everything except time
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> group(columns: ["_time"], mode: "except")
```

###### Ungroup data
```js
// Merge all tables into a single table
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> group()
```
