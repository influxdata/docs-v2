---
title: SQL selector functions
list_title: Selector functions
description: >
  Select data with SQL selector functions.
menu:
  influxdb_cloud_serverless:
    name: Selector
    parent: sql-functions
weight: 302
related:
  - /influxdb/cloud-serverless/query-data/sql/aggregate-select/
---

SQL selector functions are designed to work with time series data.
They behave similarly to aggregate functions in that they take a collection of
data and return a single value.
However, selectors are unique in that they return a _struct_ that contains
a **time value** in addition to the computed value.

- [How do selector functions work?](#how-do-selector-functions-work)
- [Selector functions](#selector-functions)
  - [selector_min](#selector_min)
  - [selector_max](#selector_max)
  - [selector_first](#selector_first)
  - [selector_last](#selector_last)

## How do selector functions work?

Each selector function returns an [Arrow _struct_](https://arrow.apache.org/docs/format/Columnar.html#struct-layout)
(similar to a JSON object) representing a single time and value from the
specified column in the each group.
What time and value get returned depend on the logic in the selector function.
For example, `selector_first` returns the value of specified column in the first row of the group.
`selector_max` returns the maximum value of the specified column in the group.

### Selector struct schema

The struct returned from a selector function has two properties:

- **time**: `time` value in the selected row
- **value**: value of the specified column in the selected row

```js
{time: 2023-01-01T00:00:00Z, value: 72.1}
```

### Selector functions in use

In your `SELECT` statement, execute a selector function and use bracket notation
to reference properties of the [returned struct](#selector-struct-schema) to
populate the column value:

```sql
SELECT
  selector_first(temp, time)['time'] AS time,
  selector_first(temp, time)['value'] AS temp,
  room
FROM home
GROUP BY room
```

## Selector functions

- [selector_min](#selector_min)
- [selector_max](#selector_max)
- [selector_first](#selector_first)
- [selector_last](#selector_last)

### selector_min

Returns the smallest value of a selected column and a timestamp.

```sql
selector_min(expression, timestamp)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_min` query example" %}}

```sql
SELECT 
  selector_min(water_level, time)['time'] AS time,
  selector_min(water_level, time)['value'] AS water_level
FROM h2o_feet
```

| time                 | water_level |
| :------------------- | ----------: |
| 2019-08-28T14:30:00Z |       -0.61 |

{{% /expand %}}
{{< /expand-wrapper >}}

### selector_max

Returns the largest value of a selected column and a timestamp.

```sql
selector_max(expression, timestamp)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_max` query example" %}}

```sql
SELECT 
  selector_max(water_level, time)['time'] AS time,
  selector_max(water_level, time)['value'] AS water_level
FROM h2o_feet
```

| time                 | water_level |
| :------------------- | ----------: |
| 2019-08-28T07:24:00Z |       9.964 |

{{% /expand %}}
{{< /expand-wrapper >}}

### selector_first

Returns the first value ordered by time ascending.

```sql
selector_first(expression, timestamp)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_first` query example" %}}

```sql
SELECT 
  selector_first(water_level, time)['time'] AS time,
  selector_first(water_level, time)['value'] AS water_level
FROM h2o_feet
```

| time                 | water_level |
| :------------------- | ----------: |
| 2019-08-28T07:24:00Z |       9.964 |

{{% /expand %}}
{{< /expand-wrapper >}}

### selector_last

Returns the last value ordered by time ascending.

```sql
selector_last(expression, timestamp)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_last` query example" %}}

```sql
SELECT 
  selector_last(water_level, time)['time'] AS time,
  selector_last(water_level, time)['value'] AS water_level
FROM h2o_feet
```

| time                 | water_level |
| :------------------- | ----------: |
| 2019-09-17T21:42:00Z |       4.938 |

{{% /expand %}}
{{< /expand-wrapper >}}
