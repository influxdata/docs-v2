InfluxQL is designed for working with time series data and includes features specifically for working with time.
You can review the following ways to work with time and timestamps in your InfluxQL queries:

- [Time syntax](#time-syntax)
  - [Add and subtract time values](#add-and-subtract-time-values)
- [Query time range](#query-time-range)
  - [Supported operators](#supported-operators)
- [Query examples](#query-examples)
- [Time zone clause](#time-zone-clause)
- [Notable behaviors](#notable-behaviors)
  - [Cannot query multiple time ranges](#cannot-query-multiple-time-ranges)
  - [Querying future data with a `GROUP BY time()` clause](#querying-future-data-with-a-group-by-time-clause)
  - [Cannot use parameters for durations](#cannot-use-parameters-for-durations)

## Time syntax

InfluxQL supports the following timestamp literal syntaxes:

```sql
'2006-01-02T15:04:05.00Z' -- RFC3339 date-time string
'2006-01-02 15:04:05.00'  -- RFC3339-like date-time string
1136189045000000000       -- Unix nanosecond epoch time
1136189045s               -- Unix epoch time
```

- **RFC3339 date-time string**:
  [String literal](/influxdb/version/reference/influxql/#strings) using
  the RFC3339 timestamp format, `YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`.
- **RFC3339-like date-time string**:
  [String literal](/influxdb/version/reference/influxql/#strings) using
  the RFC3339-like timestamp format, `YYYY-MM-DD HH:MM:SS.nnnnnnnnn`.
- **Unix nanosecond epoch time**:
  [Integer](/influxdb/version/reference/influxql/#integers) that
  represents the number of nanoseconds elapsed since the
  [Unix epoch](/influxdb/version/reference/glossary/#unix-epoch).
- **Unix epoch time**:
  [Duration literal](/influxdb/version/reference/influxql/#durations)
  that represents the number of specified time units elapsed since the
  [Unix epoch](/influxdb/version/reference/glossary/#unix-epoch).
  _[View supported duration units](/influxdb/version/reference/influxql/#durations)_.

##### Supported timestamp values

|             |            RFC3339             | Unix nanosecond time |
| ----------- | :----------------------------: | -------------------: |
| **Maximum** | 2262-04-11T23:47:16.854775807Z |  9223372036854775807 |
| **Minimum** | 1677-09-21T00:12:43.145224193Z | -9223372036854775807 |

### Add and subtract time values

Timestamp values support addition and subtraction operations with
[duration literals](/influxdb/version/reference/influxql/#durations).
Add (`+`) or subtract (`-`) a duration to or from a timestamp to return an
updated timestamp.

```sql
'2023-01-01T00:00:00Z' + 2h -- Resolves to 2023-01-01T02:00:00Z
'2023-01-01 00:00:00' - 20h -- Resolves to 2022-12-31T04:00:00Z
1672531200000000000 + 1y    -- Resolves to 2024-01-01T00:00:00Z
```

> [!Important]
> InfluxQL requires a whitespace between the `+` operators `-` and the duration literal.

## Query time range

To specify the time range of a query, use conditional expressions in the
[`WHERE` clause](/influxdb/version/reference/influxql/where/) that
compare the value of the `time` column to an absolute timestamp or a relative
timestamp.

- **Absolute time range**: Define query time bounds with timestamp literals

  ```sql
  WHERE time >= '2023-01-01T00:00:00Z' AND time <= '2023-07-01T00:00:00Z'
  WHERE time >= '2023-01-01 00:00:00' AND time <= '2023-07-01 00:00:00'
  WHERE time >= 1672531200000000000 AND time <= 1688169600000000000
  WHERE time >= 1672531200s and time <= 1688169600000ms
  ```

- **Relative time range**: Define query time bounds with a duration literal
  added to or subtracted from timestamp literals.

  > [!Tip]
  > Use `now()` to return the current system time (UTC).

  ```sql
  -- Query data from the last day
  WHERE time >= now() - 1d

  -- Query data from the previous week
  WHERE time >= now() - 1w AND time <= now() - 2w

  -- Query data relative to a specific time
  WHERE time >= '2023-01-01' - 1w AND time <= '2023-01-01' + 1w
  ```

### Supported operators

Conditional expressions with time operands support the following comparison operators:

| Operator | Meaning                  |
|:--------:|:-------                  |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |

> [!Important]
> InfluxQL supports the `AND` logical operator to define query time bounds, but
> does not support using the `OR` logical operator to query multiple time ranges.

## Query examples

The following examples use the
[Home sensor sample dataset](/influxdb/version/reference/sample-data/#home-sensor-data).

{{< expand-wrapper >}}

{{% expand "Specify a time range with RFC3339 date-time strings" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Specify a time range with RFC3339-like date-time strings" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01 08:00:00'
  AND time <= '2022-01-01 12:00:00'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Specify a time range with nanosecond epoch timestamps" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= 1641024000000000000
  AND time <= 1641038400000000000
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Specify a time range with second-precision epoch timestamps" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= 1641024000s
  AND time <= 1641038400s
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Specify a time range relative to a timestamp" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT * FROM home WHERE time >= '2022-01-01T20:00:00Z' - 2h
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T18:00:00Z |  18 | 36.9 | Kitchen     | 23.3 |
| 2022-01-01T18:00:00Z |   9 | 36.2 | Living Room | 22.8 |
| 2022-01-01T19:00:00Z |  22 | 36.6 | Kitchen     | 23.1 |
| 2022-01-01T19:00:00Z |  14 | 36.3 | Living Room | 22.5 |
| 2022-01-01T20:00:00Z |  26 | 36.5 | Kitchen     | 22.7 |
| 2022-01-01T20:00:00Z |  17 | 36.4 | Living Room | 22.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Specify a time range relative to now" %}}

```sql
SELECT * FROM home WHERE time >= now() - 2h
```

{{% /expand %}}
{{< /expand-wrapper >}}

## Time zone clause

By default, InfluxDB stores and returns timestamps in UTC.
Use the time zone clause and the `tz()` function to apply a time zone offset to
UTC times and return timestamps in the specified time zone including any applicable
seasonal offset such as Daylight Savings Time (DST) or British Summer Time (BST).

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause] tz('time_zone')
```

- **time_zone**: Time zone string literal to adjust times to.
  Uses time zone names defined in the
  [Internet Assigned Numbers Authority time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

### Time zone example

{{< expand-wrapper >}}

{{% expand "Return the UTC offset for Chicago's time zone" %}}
{{% influxdb/custom-timestamps %}}

The following example uses the
[Home sensor sample dataset](/influxdb/version/reference/sample-data/#home-sensor-data).

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
tz('America/Chicago')
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}} 

| time                      |  co |  hum | room    | temp |
| :------------------------ | --: | ---: | :------ | ---: |
| 2022-01-01T02:00:00-06:00 |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T03:00:00-06:00 |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T04:00:00-06:00 |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T05:00:00-06:00 |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T06:00:00-06:00 |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{< /expand-wrapper >}}

## Notable behaviors

- [Cannot query multiple time ranges](#cannot-query-multiple-time-ranges)
- [Querying future data with a `GROUP BY time()` clause](#querying-future-data-with-a-group-by-time-clause)
- [Cannot use parameters for durations](#cannot-use-parameters-for-durations)

### Cannot query multiple time ranges

InfluxDB does not support using `OR` in the `WHERE` clause to query multiple time ranges.
For example, the following query returns no results:

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  (time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T10:00:00Z')
  OR (time >= '2022-01-01T18:00:00Z' AND time <= '2022-01-01T20:00:00Z')
```

{{% /influxdb/custom-timestamps %}}

### Querying future data with a `GROUP BY time()` clause

Queries that do not specify time bounds in the `WHERE` clause and do not include
a `GROUP BY time()` clause use the [minimum and maximum timestamps](#supported-timestamp-values)
as the default time range.
If the query includes a `GROUP BY time()` clause, the default time range is
between `1677-09-21T00:12:43.145224193Z` and
[`now()`](/influxdb/version/reference/influxql/functions/date-time/#now).

To query data with timestamps that occur in the future (after `now()`),
provide an explicit upper bound in the `WHERE` clause.

### Cannot use parameters for durations

Currently, InfluxDB doesn't support using parameters for durations in
[parameterized queries](/influxdb/version/query-data/influxql/parameterized-queries/).
