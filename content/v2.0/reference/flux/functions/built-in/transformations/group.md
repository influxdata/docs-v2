---
title: group() function
description: The `group()` function groups records based on their values for specific columns.
aliases:
  - /v2.0/reference/flux/functions/transformations/group
menu:
  v2_0_ref:
    name: group
    parent: built-in-transformations
weight: 401
---

The `group()` function groups records based on their values for specific columns.
It produces tables with new group keys based on provided properties.
Specify an empty array of columns to ungroup data or merge all input tables into a single output table.

_**Function type:** Transformation_

```js
group(columns: ["host", "_measurement"], mode:"by")

// OR

group(columns: ["_time"], mode:"except")

// OR

group()
```

## Parameters

### columns
List of columns to use in the grouping operation.
Defaults to `[]`.

_**Data type:** Array of strings_

### mode
The mode used to group columns.

_**Data type:** String_

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

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[GROUP BY](https://docs.influxdata.com/influxdb/latest/query_language/data_exploration/#the-group-by-clause) _(similar but different)_
