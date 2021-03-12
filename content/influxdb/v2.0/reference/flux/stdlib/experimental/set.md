---
title: experimental.set() function
description: >
  The `experimental.set()` function sets multiple static column values on all records.
menu:
  influxdb_2_0_ref:
    name: experimental.set
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/
---

The `experimental.set()` function sets multiple static column values on all records.
If a column already exists, the function updates the existing value.
If a column does not exist, the function adds it with the specified value.

_Once sufficiently vetted, `experimental.set()` will replace the existing
[`set()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/)._

_**Function type:** Transformation_

```js
import "experimental"

experimental.set(
  o: {column1: "value1", column2: "value2"}
)
```

## Parameters

### o
A record that defines the columns and values to set.
The key of each key-value pair defines the column name.
The value of each key-value pair defines the column value.

_**Data type:** Record_

## Examples

### Set values for multiple columns

##### Example input table
| _time                | _field | _value |
|:-----                |:------ | ------:|
| 2019-09-16T12:00:00Z | temp   | 71.2   |
| 2019-09-17T12:00:00Z | temp   | 68.4   |
| 2019-09-18T12:00:00Z | temp   | 70.8   |

##### Example query
```js
import "experimental"

data
  |> experimental.set(
    o: {
      _field: "temperature",
      unit: "°F",
      location: "San Francisco"
    }
  )
```

##### Example output table
| _time                | _field      | _value | unit | location      |
|:-----                |:------      | ------:|:----:| --------      |
| 2019-09-16T12:00:00Z | temperature | 71.2   | °F   | San Francisco |
| 2019-09-17T12:00:00Z | temperature | 68.4   | °F   | San Francisco |
| 2019-09-18T12:00:00Z | temperature | 70.8   | °F   | San Francisco |
