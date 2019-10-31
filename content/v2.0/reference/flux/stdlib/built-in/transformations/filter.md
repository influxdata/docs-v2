---
title: filter() function
description: The `filter()` function filters data based on conditions defined in a predicate function (fn).
aliases:
  - /v2.0/reference/flux/functions/transformations/filter
  - /v2.0/reference/flux/functions/built-in/transformations/filter/
menu:
  v2_0_ref:
    name: filter
    parent: built-in-transformations
weight: 401
v2.0/tags: [exists]
---

The `filter()` function filters data based on conditions defined in a predicate function ([`fn`](#fn)).
The output tables have the same schema as the corresponding input tables.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
filter(fn: (r) => r._measurement == "cpu")
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/v2.0/reference/flux/language/data-model/#match-parameter-names).
{{% /note %}}

### fn

A single argument predicate function that evaluates true or false.
Records are passed to the function.
Those that evaluate to true are included in the output tables.
Records that evaluate to _null_ or false are not included in the output tables.

_**Data type:** Function_

{{% note %}}
Objects evaluated in `fn` functions are represented by `r`, short for "record" or "row".
{{% /note %}}

## Examples

##### Filter based on measurement, field, and tag
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
```

##### Filter out null values
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) => exists r._value )
```

##### Filter values based on thresholds
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) => r._value > 50.0 and r._value < 65.0 )
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:

[SELECT](https://docs.influxdata.com/influxdb/latest/query_language/data_exploration/#the-basic-select-statement)
