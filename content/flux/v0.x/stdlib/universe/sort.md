---
title: sort() function
description: The `sort()` function orders the records within each table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/sort
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/sort/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/sort/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/sort/
menu:
  flux_0_x_ref:
    name: sort
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/sort-limit/
introduced: 0.7.0
---

The `sort()` function orders the records within each table.
One output table is produced for each input table.
The output tables will have the same schema as their corresponding input tables.

#### Sorting with null values
When sorting, `null` values will always be first.
When `desc: false`, nulls are less than every other value.
When `desc: true`, nulls are greater than every value.

```js
sort(columns: ["_value"], desc: false)
```

## Parameters

### columns {data-type="array of strings"}
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

### desc {data-type="bool"}
Sort results in descending order.
Default is `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```
