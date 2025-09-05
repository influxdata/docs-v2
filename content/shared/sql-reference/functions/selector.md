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

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_min` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT
  location,
  selector_min(temp_min, time)['time'] AS time,
  selector_min(temp_min, time)['value'] AS min_temp
FROM
  weather
GROUP BY
  location
```

| location      | time                | min_temp |
+---------------+---------------------+----------+
| Concord       | 2022-01-02T00:00:00 | 28.0     |
| Hayward       | 2021-01-26T00:00:00 | 32.0     |
| San Francisco | 2022-01-02T00:00:00 | 35.0     |

{{% /expand %}}
{{< /expand-wrapper >}}

### selector_max

Returns the largest value of a selected column and a timestamp.

```sql
selector_max(expression, timestamp)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_max` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT
  location,
  selector_max(temp_max, time)['time'] AS time,
  selector_max(temp_max, time)['value'] AS max_temp
FROM
  weather
GROUP BY
  location
```

| location      | time                | max_temp |
| :------------ | :------------------ | -------: |
| Concord       | 2020-09-07T00:00:00 |    112.0 |
| Hayward       | 2022-09-06T00:00:00 |    107.0 |
| San Francisco | 2020-09-06T00:00:00 |    102.0 |

{{% /expand %}}
{{< /expand-wrapper >}}

### selector_first

Returns the first value ordered by time ascending.

```sql
selector_first(expression, timestamp)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_first` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT
  location,
  selector_first(precip, time)['time'] AS time,
  selector_first(precip, time)['value'] AS first_precip
FROM
  (SELECT * FROM weather WHERE precip > 0)
GROUP BY
  location
```

| location      | time                | first_precip |
| :------------ | :------------------ | -----------: |
| Concord       | 2020-01-08T00:00:00 |         0.01 |
| Hayward       | 2020-01-09T00:00:00 |         0.17 |
| San Francisco | 2020-01-07T00:00:00 |         0.03 |

{{% /expand %}}
{{< /expand-wrapper >}}

### selector_last

Returns the last value ordered by time ascending.

```sql
selector_last(expression, timestamp)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of string or
  arithmetic operators.
- **timestamp**: Time expression.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `selector_last` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT
  location,
  selector_last(precip, time)['time'] AS time,
  selector_last(precip, time)['value'] AS last_precip
FROM
  (SELECT * FROM weather WHERE precip > 0)
GROUP BY
  location
```

| location      | time                | last_precip |
| :------------ | :------------------ | ----------: |
| Concord       | 2022-12-31T00:00:00 |        3.04 |
| Hayward       | 2022-12-31T00:00:00 |        4.34 |
| San Francisco | 2022-12-31T00:00:00 |        3.67 |

{{% /expand %}}
{{< /expand-wrapper >}}
