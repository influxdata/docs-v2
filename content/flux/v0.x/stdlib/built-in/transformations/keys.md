---
title: keys() function
description: >
  The `keys()` function outputs the group key of input tables.
  For each input table, it outputs a table with the same group key columns, plus a
  _value column containing the labels of the input table's group key.  
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/keys
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/keys/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keys/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/keys/
menu:
  flux_0_x_ref:
    name: keys
    parent: built-in-transformations
weight: 402
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements, InfluxQL – SHOW MEASUREMENTS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys, InfluxQL – SHOW FIELD KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW TAG KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW SERIES
introduced: 0.13.0
---

The `keys()` function outputs the group key of input tables.
For each input table, it outputs a table with the same group key columns, plus a
`_value` column containing the labels of the input table's group key.
Each row in an output table contains the group key value and the label of one column in the group key of the input table.
Each output table has the same number of rows as the size of the group key of the input table.

_**Function type:** Transformation_

```js
keys(column: "_value")
```

## Parameters

### column
The name of the output column in which to store the group key labels.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> keys(column: "keys")
```

##### Return every possible key in a single table
```js
from(bucket: "example-bucket")
    |> range(start: -30m)
    |> keys()
    |> keep(columns: ["_value"])
    |> group()
    |> distinct()
```
