---
title: columns() function
description: >
  The `columns()` function lists the column labels of input tables.
  For each input table, it outputs a table with the same group key columns,
  plus a new column containing the labels of the input table's columns.  
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/columns
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/columns/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/columns/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/columns/
menu:
  influxdb_2_0_ref:
    name: columns
    parent: built-in-transformations
weight: 402
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements, InfluxQL – SHOW MEASUREMENTS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys, InfluxQL – SHOW FIELD KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW TAG KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW SERIES
introduced: 0.14.0
---

The `columns()` function lists the column labels of input tables.
For each input table, it outputs a table with the same group key columns,
plus a new column containing the labels of the input table's columns.
Each row in an output table contains the group key value and the label of one column of the input table.
Each output table has the same number of rows as the number of columns of the input table.

_**Function type:** Transformation_

```js
columns(column: "_value")
```

## Parameters

### column
The name of the output column in which to store the column labels.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> columns(column: "labels")
```

##### Get every possible column label in a single table
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> columns()
  |> keep(columns: ["_value"])
  |> group()
  |> distinct()
```
