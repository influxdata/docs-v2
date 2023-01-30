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

Selector functions are unique to InfluxDB. They behave like aggregate functions in that they take a row of data and compute it down to a single value.  However, selectors are unique in that they return a **time value** in addition to the computed value. In short, selectors retrun an aggreagetd value along with a timestamp. 

Selector functions must be computed using two separate function calls, one for the value and one for time.

Rather than return a value they return a struct.  

The arguments are column to operate on and the second is the time column. 


<!-- Selector functions are unique to time series databases.  Like aggregate functions, selector functions are used to reduce the size of your results set.  Unlike aggregates, which return a single modified value based on an aggregate condition, selectors can return multiple rows of values.  For example, selector_min and selector_max can return multiple values if the value is a tie.  Selectors also allow you to group aggregate values by time. -->

### The SELECTOR_MIN() function

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

### The SELECTOR_MAX() function

### The SELECTOR_FIRST() function

### The SELECTOR_LAST() function

The SELECTOR_LAST function returns the last value of a selected column and the timestamp. If there are multiple rows with the maximum timestamp value, the value is arbitrary.

```sql
SELECT 
SELECTOR_LAST(degrees, time)['time'],
SELECTOR_LAST(degrees, time)['value']
FROM h2o_temperature
WHERE time >= timestamp '2019-09-15T00:00:00Z' AND time <= timestamp '2019-09-19T00:00:00Z'
```

Results:

| time            | value |
| :----------------------- | :---- |
| 2019-09-17T16:24:00.000Z | 63    |

