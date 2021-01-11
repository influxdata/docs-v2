---
title: query.filterFields() function
description: >
  The `query.filterFields()` function filters input data by field.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/filterfields/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/filterfields/
menu:
  influxdb_2_0_ref:
    name: query.filterFields
    parent: Query
weight: 401
---

The `query.filterFields()` function filters input data by field.

_**Function type:** Transformation_

```js
import "experimental/query"

query.filterFields(
  fields: ["exampleField1", "exampleField2"]
)
```

## Parameters

### fields
Fields to filter by.
Must be exact string matches.

_**Data type:** Array of strings_

## Examples

```js
import "experimental/query"

query.fromRange(bucket: "telegraf", start: -1h)
  |> query.filterFields(
    fields: ["used_percent", "available_percent"]
  )
```

## Function definition
```js
package query

filterFields = (tables=<-, fields=[]) =>
  if length(arr: fields) == 0 then
    tables
  else
    tables
      |> filter(fn: (r) => contains(value: r._field, set: fields))
```

_**Used functions:**_  
[contains()](/influxdb/v2.0/reference/flux/stdlib/built-in/tests/contains/)  
[filter()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/)  
[length()](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/length/)  
