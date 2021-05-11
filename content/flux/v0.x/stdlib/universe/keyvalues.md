---
title: keyValues() function
description: The `keyValues()` function returns a table with the input table's group key plus two columns, _key and _value, that correspond to unique column + value pairs from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/keyvalues
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/keyvalues/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keyvalues/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/keyvalues/
menu:
  flux_0_x_ref:
    name: keyValues
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements, InfluxQL – SHOW MEASUREMENTS
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys, InfluxQL – SHOW FIELD KEYS
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW TAG KEYS
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-values, InfluxQL – SHOW TAG VALUES
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-serie, InfluxQL – SHOW SERIES
introduced: 0.13.0
---

The `keyValues()` function returns a table with the input table's group key plus two columns,
`_key` and `_value`, that correspond to unique column + value pairs from the input table.

```js
keyValues(keyColumns: ["usage_idle", "usage_user"])
```

<!--
```js
// OR

keyValues(fn: (schema) => schema.columns |> filter(fn: (r) =>  r.label =~ /usage_.*/))
``` -->

## Parameters

<!--
{{% note %}}
`keyColumns` and `fn` are mutually exclusive. Only one may be used at a time.
{{% /note %}}
-->

### keyColumns {data-type="array of strings"}

A list of columns from which values are extracted.
All columns indicated must be of the same type.
Each input table must have all of the columns listed by the `keyColumns` parameter.

<!--
### fn {data-type="function"}

Function used to identify a set of columns.
All columns indicated must be of the same type.

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

## Additional requirements

- Only one of `keyColumns` or `fn` may be used in a single call.
- All columns indicated must be of the same type.
- Each input table must have all of the columns listed by the `keyColumns` parameter.
-->

## Examples

##### Get key values from explicitly defined columns

```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(keyColumns: ["usage_idle", "usage_user"])
```

<!--
##### Get key values from columns matching a regular expression

```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(fn: (schema) => schema.columns |> filter(fn: (r) =>  r.label =~ /usage_.*/))
```
 -->
