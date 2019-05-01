---
title: count() function
description: The `count()` function outputs the number of non-null records in a column.
aliases:
  - /v2.0/reference/flux/functions/transformations/aggregates/count
menu:
  v2_0_ref:
    name: count
    parent: built-in-aggregates
weight: 501
---

The `count()` function outputs the number of records in a column.
It counts both null and non-null records.

_**Function type:** Aggregate_  
_**Output data type:** Integer_

```js
count(column: "_value")
```

## Parameters

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type: String**_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count()
```

```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count(column: "_value")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[COUNT()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#count)
