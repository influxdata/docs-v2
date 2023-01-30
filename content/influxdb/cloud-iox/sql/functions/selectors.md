---
title: SQL selector functions
list_title: Selector functions
description: >
  Select data with SQL selector functions.
menu:
  influxdb_cloud_iox:
    name: Selectors
    parent: SQL functions
weight: 220
---

SQL selector functions are designed to work with time series data.
They behave similar to aggregate functions in that they take a row of data and compute it down to a single value.

However, selectors are unique in that they return a **time value** in addition to the computed value. In short, selectors retrun an aggreagetd value along with a timestamp. 

## How selector functions work

Each selector function returns a Rust _struct_ (similar to a JSON object)
representing a single time and value from the specified column in the each group.
What time and value get returned depend on the logic in the selector function.
For example, `selector_first` returns the value of specified column in the first row of the group.
`selector_max` returns the maximum value of the specified column in the group.

#### Selector struct schema

The struct returned from a selector function has two properties:

- **time**: `time` value in the selected row
- **value**: value of the specified column in the selected row

```js
{time: 2023-01-01T00:00:00Z, value: 72.1}
```



### SELECTOR_MIN()

The SELECTOR_MIN() function returns the smallest value of a selected column and a timestamp. 

Examples:

```sql
SELECT 
  SELECTOR_MIN(water_level, time)['value'],
  SELECTOR_MIN(water_level, time)['time'],
FROM h2o_feet
```
Results:

| time                     | value |
| :----------------------- | :---- |
| 2019-08-28T14:30:00.000Z | -0.61 |

### SELECTOR_MAX()

### SELECTOR_FIRST()

### SELECTOR_LAST()

The SELECTOR_LAST function returns the last value of a selected column and the timestamp. If there are multiple rows with the maximum timestamp value, the value is arbitrary.

```sql
SELECT 
  SELECTOR_LAST(degrees, time)['time'],
  SELECTOR_LAST(degrees, time)['value']
FROM h2o_temperature
WHERE time >= timestamp '2019-09-15T00:00:00Z' AND time <= timestamp '2019-09-19T00:00:00Z'
```

Results:

| time                     | value |
| :----------------------- | :---- |
| 2019-09-17T16:24:00.000Z | 63    |

