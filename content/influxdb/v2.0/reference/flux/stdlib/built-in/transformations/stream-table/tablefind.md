---
title: tableFind() function
description: >
  The `tableFind()` function extracts the first table in a stream of tables whose
  group key values match a predicate. If no table is found, the function errors.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/
menu:
  influxdb_2_0_ref:
    name: tableFind
    parent: Stream & table
weight: 501
related:
  - /influxdb/v2.0/query-data/flux/scalar-values/
---

The `tableFind()` function extracts the first table in a stream of tables whose
group key values match a predicate. If no table is found, the function errors.

_**Function type:** Stream and table_  

```js
tableFind(fn: (key) => key._field == "fieldName")
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/influxdb/v2.0/reference/flux/language/data-model/#match-parameter-names).
{{% /note %}}

### fn

A predicate function for matching keys in a table's group key.
`tableFind` returns the first table that resolves as `true`.
Expects a `key` argument that represents a group key in the input stream.

_**Data type:** Function_

##### Example fn function

```js
(key) => key._field == "fieldName"
```

## Example

```js
t = from(bucket:"example-bucket")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> tableFind(fn: (key) => key._field == "usage_idle")

// t represents the first table in a stream whose group key
// contains "_field" with a value of "usage_idle".
```

{{% note %}}
You can use `t` from the example above as input for [`getColumn()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/getcolumn/)
and [`getRecord()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/getrecord/).
{{% /note %}}
