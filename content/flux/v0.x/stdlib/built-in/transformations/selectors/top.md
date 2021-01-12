---
title: top() function
description: The `top()` function sorts a table by columns and keeps only the top n records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/top
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/top/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/top/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/top/
menu:
  flux_0_x_ref:
    name: top
    parent: built-in-selectors
weight: 501
introduced: 0.7.0
---

The `top()` function sorts a table by columns and keeps only the top `n` records.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
top(n:10, columns: ["_value"])
```

{{% warn %}}
#### Empty tables
`top()` drops empty tables.
{{% /warn %}}

## Parameters

### n
Number of records to return.

_**Data type:** Integer_

### columns
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> top(n:10)
```

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, columns=["_value"], tables=<-) =>
  tables
    |> sort(columns:columns, desc:desc)
    |> limit(n:n)

top = (n, columns=["_value"], tables=<-) => _sortLimit(n:n, columns:columns, desc:true)
```
