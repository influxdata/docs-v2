
Use [SQL window functions](/influxdb3/version/reference/sql/functions/window/) to compare values across different rows in your time series data.
Window functions like [`LAG`](/influxdb3/version/reference/sql/functions/window/#lag) and [`LEAD`](/influxdb3/version/reference/sql/functions/window/#lead) let you access values from previous or subsequent rows without using self-joins, making it easy to calculate changes over time.

Common use cases for comparing values include:

- Calculating the difference between the current value and a previous value
- Computing rate of change or percentage change
- Detecting significant changes or anomalies
- Comparing values at specific time intervals
- Handling counter metrics that reset to zero

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
> {{% influxdb3/home-sample-link %}}.
> To run the example queries and return results,
> [write the sample data](/influxdb3/version/reference/sample-data/#write-home-sensor-data-to-influxdb)
> to your {{% product-name %}} database before running the example queries.

- [Calculate the difference from the previous value](#calculate-the-difference-from-the-previous-value)
- [Calculate the percentage change](#calculate-the-percentage-change)
- [Compare values at regular intervals](#compare-values-at-regular-intervals)
- [Compare values with exact time offsets](#compare-values-with-exact-time-offsets)
- [Handle counter metrics and resets](#handle-counter-metrics-and-resets)
  - [Calculate non-negative differences (counter rate)](#calculate-non-negative-differences-counter-rate)
  - [Calculate cumulative counter increase](#calculate-cumulative-counter-increase)
  - [Aggregate counter increases by time interval](#aggregate-counter-increases-by-time-interval)

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

## Handle counter metrics and resets

Counter metrics track cumulative values that increase over time, such as total requests, bytes transferred, or errors.
Unlike gauge metrics (which can go up or down), counters typically only increase, though they may reset to zero when a service restarts.

Use [`GREATEST`](/influxdb3/version/reference/sql/functions/conditional/#greatest) with `LAG` to handle counter resets by treating negative differences as zero.

> [!Note]
> #### InfluxDB 3 SQL and counter metrics
>
> InfluxDB 3 SQL doesn't provide built-in equivalents to Flux's `increase()`
> or InfluxQL's `NON_NEGATIVE_DIFFERENCE()` functions.
> Use the patterns shown below to achieve similar results.

### Calculate non-negative differences (counter rate)

Calculate the increase between consecutive counter readings, treating negative differences (counter resets) as zero.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  host,
  requests,
  LAG(requests) OVER (PARTITION BY host ORDER BY time) AS prev_requests,
  GREATEST(
    requests - LAG(requests) OVER (PARTITION BY host ORDER BY time),
    0
  ) AS requests_increase
FROM metrics
WHERE host = 'server1'
ORDER BY time
```

| time                | host    | requests | prev_requests | requests_increase |
|:--------------------|:--------|----------|---------------|------------------:|
| 2024-01-01T00:00:00 | server1 | 1000     | NULL          | 0                 |
| 2024-01-01T01:00:00 | server1 | 1250     | 1000          | 250               |
| 2024-01-01T02:00:00 | server1 | 1600     | 1250          | 350               |
| 2024-01-01T03:00:00 | server1 | 50       | 1600          | 0                 |
| 2024-01-01T04:00:00 | server1 | 300      | 50            | 250               |

{{% /influxdb/custom-timestamps %}}

`LAG(requests)` retrieves the previous counter value, `requests - LAG(requests)` calculates the difference, and `GREATEST(..., 0)` returns 0 for negative differences (counter resets).
`PARTITION BY host` ensures comparisons are only within the same host.

### Calculate cumulative counter increase

Calculate the total increase in a counter over time, handling resets.
Use a Common Table Expression (CTE) to first calculate the differences, then sum them.

{{% influxdb/custom-timestamps %}}

```sql
WITH counter_diffs AS (
  SELECT
    time,
    host,
    requests,
    GREATEST(
      requests - LAG(requests) OVER (PARTITION BY host ORDER BY time),
      0
    ) AS requests_increase
  FROM metrics
  WHERE host = 'server1'
)
SELECT
  time,
  host,
  requests,
  SUM(requests_increase) OVER (PARTITION BY host ORDER BY time) AS cumulative_increase
FROM counter_diffs
ORDER BY time
```

| time                | host    | requests | cumulative_increase |
|:--------------------|:--------|----------|--------------------:|
| 2024-01-01T00:00:00 | server1 | 1000     | 0                   |
| 2024-01-01T01:00:00 | server1 | 1250     | 250                 |
| 2024-01-01T02:00:00 | server1 | 1600     | 600                 |
| 2024-01-01T03:00:00 | server1 | 50       | 600                 |
| 2024-01-01T04:00:00 | server1 | 300      | 850                 |

{{% /influxdb/custom-timestamps %}}

The CTE computes non-negative differences for each row, then `SUM(requests_increase) OVER (...)` creates a running total.
The cumulative increase continues to grow despite the counter reset at 03:00.

### Aggregate counter increases by time interval

Calculate the total increase in a counter for each time interval (for example, hourly totals).

{{% influxdb/custom-timestamps %}}

```sql
WITH counter_diffs AS (
  SELECT
    DATE_BIN(INTERVAL '1 hour', time) AS time_bucket,
    host,
    requests,
    GREATEST(
      requests - LAG(requests) OVER (PARTITION BY host ORDER BY time),
      0
    ) AS requests_increase
  FROM metrics
)
SELECT
  time_bucket,
  host,
  SUM(requests_increase) AS total_increase
FROM counter_diffs
WHERE requests_increase > 0
GROUP BY time_bucket, host
ORDER BY host, time_bucket
```

| time_bucket         | host    | total_increase |
|:--------------------|:--------|---------------:|
| 2024-01-01T01:00:00 | server1 | 250            |
| 2024-01-01T02:00:00 | server1 | 350            |
| 2024-01-01T04:00:00 | server1 | 250            |
| 2024-01-01T01:00:00 | server2 | 400            |
| 2024-01-01T02:00:00 | server2 | 500            |
| 2024-01-01T03:00:00 | server2 | 300            |
| 2024-01-01T04:00:00 | server2 | 400            |

{{% /influxdb/custom-timestamps %}}

The CTE calculates differences for each row.
`DATE_BIN()` assigns each timestamp to a 1-hour interval, `SUM(requests_increase)` aggregates all increases within each interval, and `WHERE requests_increase > 0` filters out zero increases (first row and counter resets).
