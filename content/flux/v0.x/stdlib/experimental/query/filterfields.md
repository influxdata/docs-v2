---
title: query.filterFields() function
description: >
  The `query.filterFields()` function filters input data by field.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/filterfields/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/filterfields/
menu:
  flux_0_x_ref:
    name: query.filterFields
    parent: query
weight: 401
flux/v0.x/tags: [transformations, filters]
introduced: 0.60.0
---

The `query.filterFields()` function filters input data by field.

```js
import "experimental/query"

query.filterFields(
  fields: ["exampleField1", "exampleField2"]
)
```

## Parameters

### fields {data-type="array of strings"}
Fields to filter by.
Must be exact string matches.

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
[contains()](/flux/v0.x/stdlib/universe/contains/)  
[filter()](/flux/v0.x/stdlib/universe/filter/)  
[length()](/flux/v0.x/stdlib/universe/length/)  
