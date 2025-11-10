
Use [SQL window functions](/influxdb3/version/reference/sql/functions/window/) to compare values across different rows in your time series data.
Window functions like [`LAG`](/influxdb3/version/reference/sql/functions/window/#lag) and [`LEAD`](/influxdb3/version/reference/sql/functions/window/#lead) let you access values from previous or subsequent rows without using self-joins, making it easy to calculate changes over time.

Common use cases for comparing values include:

- Calculating the difference between the current value and a previous value
- Computing rate of change or percentage change
- Detecting significant changes or anomalies
- Comparing values at specific time intervals

**To compare values across rows:**

1. Use a [window function](/influxdb3/version/reference/sql/functions/window/) such as `LAG` or `LEAD` with an `OVER` clause.
2. Include a `PARTITION BY` clause to group data by tags (like `room` or `sensor_id`).
3. Include an `ORDER BY` clause to define the order for comparisons (typically by `time`).
4. Use arithmetic operators to calculate differences, ratios, or percentage changes.

## Examples of comparing values

> [!Note]
> #### Sample data
>
> The following examples use the
> [Home sensor sample data](/influxdb3/version/reference/sample-data/#home-sensor-data).
> To run the example queries and return results,
> [write the sample data](/influxdb3/version/reference/sample-data/#write-home-sensor-data-to-influxdb)
> to your {{% product-name %}} database before running the example queries.

- [Calculate the difference from the previous value](#calculate-the-difference-from-the-previous-value)
- [Calculate the percentage change](#calculate-the-percentage-change)
- [Compare values at regular intervals](#compare-values-at-regular-intervals)
- [Compare values with exact time offsets](#compare-values-with-exact-time-offsets)

### Calculate the difference from the previous value

Use the `LAG` function to access the value from the previous row and calculate the difference.
This is useful for detecting changes over time.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  temp - LAG(temp, 1) OVER (
    PARTITION BY room
    ORDER BY time
  ) AS temp_change
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | temp_change |
|:--------------------|:------------|-----:|------------:|
| 2022-01-01T08:00:00 | Kitchen     | 21.0 | NULL        |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 | 2.0         |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 | -0.3        |
| 2022-01-01T08:00:00 | Living Room | 21.1 | NULL        |
| 2022-01-01T09:00:00 | Living Room | 21.4 | 0.3         |
| 2022-01-01T10:00:00 | Living Room | 21.8 | 0.4         |

{{% /influxdb/custom-timestamps %}}

The first row in each partition returns `NULL` for `temp_change` because there's no previous value.
To use a default value instead of `NULL`, provide a third argument to `LAG`:

```sql
LAG(temp, 1, 0) -- Returns 0 if no previous value exists
```

### Calculate the percentage change

Calculate the percentage change between the current value and a previous value by dividing the difference by the previous value.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  ROUND(
    ((temp - LAG(temp, 1) OVER (PARTITION BY room ORDER BY time)) /
     LAG(temp, 1) OVER (PARTITION BY room ORDER BY time)) * 100,
    2
  ) AS percent_change
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | percent_change |
|:--------------------|:------------|-----:|---------------:|
| 2022-01-01T08:00:00 | Kitchen     | 21.0 | NULL           |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 | 9.52           |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 | -1.30          |
| 2022-01-01T08:00:00 | Living Room | 21.1 | NULL           |
| 2022-01-01T09:00:00 | Living Room | 21.4 | 1.42           |
| 2022-01-01T10:00:00 | Living Room | 21.8 | 1.87           |

{{% /influxdb/custom-timestamps %}}

### Compare values at regular intervals

For regularly spaced time series data (like hourly readings), use `LAG` with an offset parameter to compare values from a specific number of rows back.

The following query compares each temperature reading with the reading from one hour earlier (assuming hourly data):

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  LAG(temp, 1) OVER (
    PARTITION BY room
    ORDER BY time
  ) AS temp_1h_ago,
  temp - LAG(temp, 1) OVER (
    PARTITION BY room
    ORDER BY time
  ) AS hourly_change
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T12:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | temp_1h_ago | hourly_change |
|:--------------------|:------------|-----:|------------:|--------------:|
| 2022-01-01T08:00:00 | Kitchen     | 21.0 | NULL        | NULL          |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 | 21.0        | 2.0           |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 | 23.0        | -0.3          |
| 2022-01-01T11:00:00 | Kitchen     | 22.4 | 22.7        | -0.3          |
| 2022-01-01T08:00:00 | Living Room | 21.1 | NULL        | NULL          |
| 2022-01-01T09:00:00 | Living Room | 21.4 | 21.1        | 0.3           |
| 2022-01-01T10:00:00 | Living Room | 21.8 | 21.4        | 0.4           |
| 2022-01-01T11:00:00 | Living Room | 22.2 | 21.8        | 0.4           |

{{% /influxdb/custom-timestamps %}}

### Compare values with exact time offsets

For irregularly spaced time series data or when you need to compare values from an exact time offset (like exactly 1 hour ago, not just the previous row), use a self-join with interval arithmetic.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  current.time,
  current.room,
  current.temp AS current_temp,
  previous.temp AS temp_1h_ago,
  current.temp - previous.temp AS hourly_diff
FROM home AS current
LEFT JOIN home AS previous
  ON current.room = previous.room
  AND previous.time = current.time - INTERVAL '1 hour'
WHERE
  current.time >= '2022-01-01T08:00:00Z'
  AND current.time < '2022-01-01T12:00:00Z'
ORDER BY current.room, current.time
```

| time                | room        | current_temp | temp_1h_ago | hourly_diff |
|:--------------------|:------------|-------------:|------------:|------------:|
| 2022-01-01T08:00:00 | Kitchen     | 21.0         | NULL        | NULL        |
| 2022-01-01T09:00:00 | Kitchen     | 23.0         | 21.0        | 2.0         |
| 2022-01-01T10:00:00 | Kitchen     | 22.7         | 23.0        | -0.3        |
| 2022-01-01T11:00:00 | Kitchen     | 22.4         | 22.7        | -0.3        |
| 2022-01-01T08:00:00 | Living Room | 21.1         | NULL        | NULL        |
| 2022-01-01T09:00:00 | Living Room | 21.4         | 21.1        | 0.3         |
| 2022-01-01T10:00:00 | Living Room | 21.8         | 21.4        | 0.4         |
| 2022-01-01T11:00:00 | Living Room | 22.2         | 21.8        | 0.4         |

{{% /influxdb/custom-timestamps %}}

This self-join approach works when:

- Your data points don't fall at regular intervals
- You need to compare against a specific time offset regardless of when the previous data point occurred
- You want to ensure the comparison is against a value from exactly 1 hour ago (or any other specific interval)
