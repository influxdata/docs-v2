---
title: keyValues() function
description: The `keyValues()` function returns a table with the input table's group key plus two columns, _key and _value, that correspond to unique column + value pairs from the input table.
aliases:
  - /v2.0/reference/flux/functions/transformations/keyvalues
menu:
  v2_0_ref:
    name: keyValues
    parent: built-in-transformations
weight: 401
---

The `keyValues()` function returns a table with the input table's group key plus two columns,
`_key` and `_value`, that correspond to unique column + value pairs from the input table.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
keyValues(keyColumns: ["usage_idle", "usage_user"])

// OR

keyValues(fn: (schema) => schema.columns |> filter(fn: (r) =>  r.label =~ /usage_.*/))
```

## Parameters

{{% note %}}
`keyColumns` and `fn` are mutually exclusive. Only one may be used at a time.
{{% /note %}}

### keyColumns
A list of columns from which values are extracted.
All columns indicated must be of the same type.
Each input table must have all of the columns listed by the `keyColumns` parameter.

_**Data type:** Array of strings_

### fn
Function used to identify a set of columns.
All columns indicated must be of the same type.

_**Data type:** Function_

## Additional requirements

- Only one of `keyColumns` or `fn` may be used in a single call.
- All columns indicated must be of the same type.
- Each input table must have all of the columns listed by the `keyColumns` parameter.

## Examples

##### Get key values from explicitly defined columns
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(keyColumns: ["usage_idle", "usage_user"])
```

##### Get key values from columns matching a regular expression
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(fn: (schema) => schema.columns |> filter(fn: (r) =>  r.label =~ /usage_.*/))
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW MEASUREMENTS](https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration/#show-measurements)  
[SHOW FIELD KEYS](https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration/#show-field-keys)  
[SHOW TAG KEYS](https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration/#show-tag-keys)  
[SHOW TAG VALUES](https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration/#show-tag-values)  
[SHOW SERIES](https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration/#show-series)  
