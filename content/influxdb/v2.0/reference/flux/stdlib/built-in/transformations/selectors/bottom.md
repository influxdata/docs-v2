---
title: bottom() function
description: The `bottom()` function sorts a table by columns and keeps only the bottom n records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/bottom
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/bottom/
menu:
  influxdb_2_0_ref:
    name: bottom
    parent: built-in-selectors
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#bottom, InfluxQL – BOTTOM()
---

The `bottom()` function sorts a table by columns and keeps only the bottom `n` records.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
bottom(n:10, columns: ["_value"])
```

{{% warn %}}
#### Empty tables
`bottom()` drops empty tables.
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
  |> bottom(n:10)
```

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, columns=["_value"], tables=<-) =>
  tables
    |> sort(columns:columns, desc:desc)
    |> limit(n:n)

bottom = (n, columns=["_value"], tables=<-) =>
  _sortLimit(n:n, columns:columns, desc:false)
```
