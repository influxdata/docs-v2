---
title: range() function
description: The `range()` function filters records based on time bounds.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/range
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/range/
menu:
  influxdb_2_0_ref:
    name: range
    parent: built-in-transformations
weight: 402
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/data_exploration/#the-where-clause, InfluxQL – WHERE
---

The `range()` function filters records based on time bounds.
Each input table's records are filtered to contain only records that exist within the time bounds.
Records with a `null` value for their time are filtered.
Each input table's group key value is modified to fit within the time bounds.
Tables where all records exists outside the time bounds are filtered entirely.

_**Function type:** Transformation_  
_**Output data type:* Record_

```js
range(start: -15m, stop: now())
```

## Parameters

### start
The earliest time to include in results.
Results **include** points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

_**Data type:** Duration | Time | Integer_

### stop
The latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.
Defaults to `now()`.

_**Data type:** Duration | Time | Integer_

{{% note %}}
Time values in Flux must be in [RFC3339 format](/influxdb/v2.0/reference/flux/language/types#timestamp-format).
{{% /note %}}

## Examples

###### Time range relative to now
```js
from(bucket:"example-bucket")
  |> range(start: -12h)
  // ...
```

###### Relative time range
```js
from(bucket:"example-bucket")
  |> range(start: -12h, stop: -15m)
  // ...
```

###### Absolute time range
```js
from(bucket:"example-bucket")
  |> range(start: 2018-05-22T23:30:00Z, stop: 2018-05-23T00:00:00Z)
  // ...
```

###### Absolute time range with Unix timestamps
```js
from(bucket:"example-bucket")
  |> range(start: 1527031800, stop: 1527033600)
  // ...
```
