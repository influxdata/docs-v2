---
title: distinct() function
description: The `distinct()` function returns the unique values for a given column.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors/distinct
menu:
  v2_0_ref:
    name: distinct
    parent: built-in-selectors
weight: 501
---

The `distinct()` function returns the unique values for a given column.
`null` is considered its own distinct value if it is present.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
distinct(column: "host")
```

## Parameters

### column
Column on which to track unique values.

_**Data type:** string_

## Examples
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> distinct(column: "host")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[DISTINCT()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#distinct)
