---
title: map() function
description: The `map()` function applies a function to each record in the input tables.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/map
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/map/
menu:
  influxdb_2_0_ref:
    name: map
    parent: built-in-transformations
weight: 402
influxdb/v2.0/tags: [exists]
related:
  - /influxdb/v2.0/query-data/flux/conditional-logic/
  - /influxdb/v2.0/query-data/flux/mathematic-operations/
  - /influxdb/v2.0/reference/flux/stdlib/contrib/rows/map/
---

The `map()` function applies a function to each record in the input tables.
The modified records are assigned to new tables based on the group key of the input table.
The output tables are the result of applying the map function to each record of the input tables.

When the output record contains a different value for the group key, the record is regrouped into the appropriate table.
When the output record drops a column that was part of the group key, that column is removed from the group key.

_**Function type:** Transformation_

```js
map(fn: (r) => ({ _value: r._value * r._value }))
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/influxdb/v2.0/reference/flux/language/data-model/#match-parameter-names).
{{% /note %}}

### fn

A single argument function to apply to each record.
The return value must be a record.

_**Data type:** Function_

{{% note %}}
Records evaluated in `fn` functions are represented by `r`, short for "record" or "row".
{{% /note %}}

## Important notes

#### Preserve columns

By default, `map()` drops any columns that:

1. Are not part of the input table's group key.
2. Are not explicitly mapped in the `map()` function.

This often results in the `_time` column being dropped.
To preserve the `_time` column and other columns that do not meet the criteria above,
use the `with` operator to map values in the `r` record.
The `with` operator updates a column if it already exists,
creates a new column if it doesn't exist, and includes all existing columns in
the output table.

```js
map(fn: (r) => ({ r with newColumn: r._value * 2 }))
```

## Examples

###### Square the value of each record

```js
from(bucket:"example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
  |> range(start:-12h)
  |> map(fn: (r) => ({ r with _value: r._value * r._value}))
```

###### Create a new table with new format

```js
from(bucket:"example-bucket")
    |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_system"
    )
    |> range(start:-12h)
    // create a new table by copying each row into a new format
    |> map(fn: (r) => ({
      time: r._time,
      app_server: r.host
    }))
```

###### Add new columns and preserve existing columns
```js
from(bucket:"example-bucket")
    |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_system"
    )
    |> range(start:-12h)
    // create a new table by copying each row into a new format
    |> map(fn: (r) => ({
      r with
      app_server: r.host,
      valueInt: int(v: r._value)
    }))
```
