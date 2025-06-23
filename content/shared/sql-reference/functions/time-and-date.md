The {{< product-name >}} SQL implementation supports time and date functions
that are useful when working with time series data. 

- [current_date](#current_date)
- [current_time](#current_time)
- [current_timestamp](#current_timestamp)
- [date_bin](#date_bin)
- [date_bin_gapfill](#date_bin_gapfill)
- [date_bin_wallclock](#date_bin_wallclock)
- [date_bin_wallclock_gapfill](#date_bin_wallclock_gapfill)
- [date_trunc](#date_trunc)
- [datetrunc](#datetrunc)
- [date_format](#date_format)
- [date_part](#date_part)
- [datepart](#datepart)
- [extract](#extract)
- [from_unixtime](#from_unixtime)
- [make_date](#make_date)
- [now](#now)
- [today](#today)
- [to_char](#to_char)
- [to_date](#to_date)
- [to_local_time](#to_local_time)
- [to_timestamp](#to_timestamp)
- [to_timestamp_micros](#to_timestamp_micros)
- [to_timestamp_millis](#to_timestamp_millis)
- [to_timestamp_nanos](#to_timestamp_nanos)
- [to_timestamp_seconds](#to_timestamp_seconds)
- [to_unixtime](#to_unixtime)
- [tz](#tz)

## current_date

Returns the current UTC date.

> [!Note]
> `current_date` returns a `DATE32` Arrow type, which isn't supported by InfluxDB.
> To use with InfluxDB, [cast the return value to a timestamp or string](/influxdb/version/query-data/sql/cast-types/).

The `current_date()` return value is determined at query time and returns
the same date, no matter when in the query plan the function executes.

```
current_date()
```

{{< expand-wrapper >}}
{{% expand "View `current_date` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

```sql
SELECT
  time,
  temp,
  current_date()::TIMESTAMP AS current_date
FROM home
WHERE
  time > current_date()::TIMESTAMP - INTERVAL '5 years'
LIMIT 3
```

{{% influxdb/custom-timestamps %}}

| time                 | temp | current_date                  |
| :------------------- | ---: | :---------------------------- |
| 2022-01-01T08:00:00Z |   21 | {{< datetime/current-date >}} |
| 2022-01-01T09:00:00Z |   23 | {{< datetime/current-date >}} |
| 2022-01-01T10:00:00Z | 22.7 | {{< datetime/current-date >}} |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## current_time

Returns the current UTC time.

The `current_time()` return value is determined at query time and returns the same time,
no matter when in the query plan the function executes.

```
current_time()
```

{{< expand-wrapper >}}
{{% expand "View `current_time` query example" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

```sql
SELECT
  time,
  temp,
  current_time() AS current_time
FROM home
LIMIT 3
```

| time                 | temp | current_time                  |
| :------------------- | ---: | :---------------------------- |
| 2022-01-01T08:00:00Z |   21 | {{< datetime/current-time >}} |
| 2022-01-01T09:00:00Z |   23 | {{< datetime/current-time >}} |
| 2022-01-01T10:00:00Z | 22.7 | {{< datetime/current-time >}} |

{{% /expand %}}
{{< /expand-wrapper >}}

## current_timestamp

_Alias of [now](#now)._

## date_bin

Calculates time intervals and returns the start of the interval nearest to the specified timestamp.
Use `date_bin` to downsample time series data by grouping rows into time-based "bins" or "windows"
and applying an aggregate or selector function to each window.

For example, if you "bin" or "window" data into 15-minute intervals, an input timestamp of `2023-01-01T18:18:18Z` will be updated to the start time of the 15-minute bin it is in: `2023-01-01T18:15:00Z`.

```sql
date_bin(interval, expression[, origin_timestamp])
```

##### Arguments:

- **interval**: Bin interval. Supports the following interval units:

  - nanoseconds
  - microseconds
  - milliseconds
  - seconds
  - minutes
  - hours
  - days
  - weeks
  - months
  - years
  - century

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.
- **origin_timestamp**: Starting point used to determine bin boundaries.
  _Default is the Unix epoch._

{{< expand-wrapper >}}
{{% expand "View `date_bin` query example" %}}

The following query returns the daily average of water levels in the queried time range.

```sql
SELECT
  date_bin(INTERVAL '1 day', time, TIMESTAMP '1970-01-01 00:00:00Z') AS time,
  avg("water_level") AS water_level_avg
FROM "h2o_feet"
WHERE
  time >= timestamp '2019-09-10T00:00:00Z'
  AND time <= timestamp '2019-09-20T00:00:00Z'
GROUP BY 1
ORDER BY time DESC
```

| time                     | water_level_avg    |
| :----------------------- | :----------------- |
| 2019-09-17T00:00:00.000Z | 4.370175687443861  |
| 2019-09-16T00:00:00.000Z | 4.6034785848437485 |
| 2019-09-15T00:00:00.000Z | 4.680651501506248  |
| 2019-09-14T00:00:00.000Z | 4.857683652395836  |
| 2019-09-13T00:00:00.000Z | 4.911051520291668  |
| 2019-09-12T00:00:00.000Z | 4.763990784533338  |
| 2019-09-11T00:00:00.000Z | 4.6582452515041695 |
| 2019-09-10T00:00:00.000Z | 4.608425018785421  |

{{% /expand %}}
{{< /expand-wrapper >}}

## date_bin_gapfill

Calculates time intervals and returns the start of the interval nearest to the specified timestamp.
If no rows exist in a time interval, a new row is inserted with a `time` value
set to the interval start time, all columns in the `GROUP BY` clause populated,
and null values in aggregate columns.

Use `date_bin_gapfill` with [`interpolate`](/influxdb/version/reference/sql/functions/misc/#interpolate)
or [`locf`](/influxdb/version/reference/sql/functions/misc/#locf) to
[fill gaps in data](/influxdb/version/query-data/sql/fill-gaps/)
at specified time intervals.

```sql
date_bin_gapfill(interval, expression[, origin_timestamp])
```

> [!Note]
> `date_bin_gapfill` requires [time bounds](/influxdb/version/query-data/sql/basic-query/#query-data-within-time-boundaries)
> in the `WHERE` clause.

##### Arguments:

- **interval**: Bin interval. Supports the following interval units:

  - nanoseconds
  - microseconds
  - milliseconds
  - seconds
  - minutes
  - hours
  - days
  - weeks

<!-- https://github.com/influxdata/influxdb_iox/issues/9958 -->
The following intervals are not currently supported:
  - months
  - years
  - century

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.
- **origin_timestamp**: Starting point used to determine bin boundaries.
  _Default is the Unix epoch._

##### Related functions

[interpolate](/influxdb/version/reference/sql/functions/misc/#interpolate),
[locf](/influxdb/version/reference/sql/functions/misc/#locf)

{{< expand-wrapper >}}
{{% expand "Use `date_bin_gapfill` to insert rows when no rows exists" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_gapfill(INTERVAL '30 minutes', time) as _time,
  room,
  avg(temp) as temp
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY _time, room
```

| _time                | room        | temp |
| :------------------- | :---------- | ---: |
| 2022-01-01T08:00:00Z | Kitchen     |   21 |
| 2022-01-01T08:30:00Z | Kitchen     |      |
| 2022-01-01T09:00:00Z | Kitchen     |   23 |
| 2022-01-01T09:30:00Z | Kitchen     |      |
| 2022-01-01T10:00:00Z | Kitchen     | 22.7 |
| 2022-01-01T08:00:00Z | Living Room | 21.1 |
| 2022-01-01T08:30:00Z | Living Room |      |
| 2022-01-01T09:00:00Z | Living Room | 21.4 |
| 2022-01-01T09:30:00Z | Living Room |      |
| 2022-01-01T10:00:00Z | Living Room | 21.8 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Use `date_bin_gapfill` to fill gaps in data" %}}

Use `interpolate` and `locf` to fill the null values in rows inserted by
`date_bin_gapfill`.

_The following examples use the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[interpolate](#)
[locf](#)
{{% /tabs %}}
{{% tab-content %}}

The example below uses [`interpolate`](/influxdb/version/reference/sql/functions/misc/#interpolate)
to fill null values by interpolating values between non-null values.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_gapfill(INTERVAL '30 minutes', time) as _time,
  room,
  interpolate(avg(temp))
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY _time, room
```

| _time                | room        | AVG(home.temp) |
| :------------------- | :---------- | -------------: |
| 2022-01-01T08:00:00Z | Kitchen     |             21 |
| 2022-01-01T08:30:00Z | Kitchen     |             22 |
| 2022-01-01T09:00:00Z | Kitchen     |             23 |
| 2022-01-01T09:30:00Z | Kitchen     |          22.85 |
| 2022-01-01T10:00:00Z | Kitchen     |           22.7 |
| 2022-01-01T08:00:00Z | Living Room |           21.1 |
| 2022-01-01T08:30:00Z | Living Room |          21.25 |
| 2022-01-01T09:00:00Z | Living Room |           21.4 |
| 2022-01-01T09:30:00Z | Living Room |           21.6 |
| 2022-01-01T10:00:00Z | Living Room |           21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{% tab-content %}}

The example below uses [`locf`](/influxdb/version/reference/sql/functions/misc/#locf)
to fill null values by carrying the last observed value forward.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_gapfill(INTERVAL '30 minutes', time) as _time,
  room,
  locf(avg(temp))
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY _time, room
```

| _time                | room        | AVG(home.temp) |
| :------------------- | :---------- | -------------: |
| 2022-01-01T08:00:00Z | Kitchen     |             21 |
| 2022-01-01T08:30:00Z | Kitchen     |             21 |
| 2022-01-01T09:00:00Z | Kitchen     |             23 |
| 2022-01-01T09:30:00Z | Kitchen     |             23 |
| 2022-01-01T10:00:00Z | Kitchen     |           22.7 |
| 2022-01-01T08:00:00Z | Living Room |           21.1 |
| 2022-01-01T08:30:00Z | Living Room |           21.1 |
| 2022-01-01T09:00:00Z | Living Room |           21.4 |
| 2022-01-01T09:30:00Z | Living Room |           21.4 |
| 2022-01-01T10:00:00Z | Living Room |           21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}

## date_bin_wallclock

Calculates time intervals using the timezone of a specified time value and
returns the start of the interval nearest to the specified timestamp.
Use `date_bin_wallclock` to downsample time series data by grouping rows into
time-based "bins" or "windows" that are based off "wall clock" times in a
specific timezone and applying an aggregate or selector function to each window.

### Time zone shifts

Many regions use time zone shifts (such as daylight saving time (DST)).
If a wall clock time bin starts at a time that does not exist in the specified
time zone, the timestamp is adjusted to the time that is the same offset from
the start of the day in that time zone.

If a wall clock time represents an ambiguous time in the region then the
behavior depends on the size of the specified interval. If the interval is
larger than the difference between the two possible timestamps, then the earlier
timestamp is used. Otherwise, the function uses the timestamp that matches the
UTC offset of the input timestamp.

```sql
date_bin_wallclock(interval, expression[, origin_timestamp])
```

##### Arguments:

- **interval**: Bin interval. Supports the following interval units:

  - nanoseconds
  - microseconds
  - milliseconds
  - seconds
  - minutes
  - hours
  - days
  - weeks

  > [!Note]
  > `date_bin_wallclock` does _not_ support month-, year-, or century-based intervals.

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.
  The output timestamp uses the time zone from this time expression.
- **origin_timestamp**: Starting point used to determine bin boundaries.
  This must be a "wall clock" timestamp (no time zone).
  _Default is the Unix epoch._

  > [!Important]
  >
  > #### Avoid bins in time zone discontinuities
  >
  > [Time zone shifts](#time-zone-shifts) result in _discontinuities_–breaks
  > in the continuity of time intervals (losing an hour or gaining an hour)–that
  > can result in unexpected timestamps when using `date_bin_wallclock`.
  > Avoid using an `interval` and `origin_timestamp` combination that results in a
  > bin falling inside a time discontinuity.
  >
  > As a general rule, use either the default `origin_timestamp` or an origin
  > timestamp with an offset relative to the Unix epoch that is equal to your
  > specified `interval`.
  >
  > {{< expand-wrapper >}}
{{% expand "View time zone discontinuity example" %}}

The following query illustrates how two timestamps, only one minute apart, 
result in timestamps two hours apart when binned across a daylight saving
boundary:

```sql
SELECT
  tz('2020-10-25T02:29:00+01:00', 'Europe/Paris') AS original_time,
  date_bin_wallclock(
    INTERVAL '1 hour',
    tz('2020-10-25T02:29:00+01:00', 'Europe/Paris'),
    '1970-01-01T00:30:00'
  ) AT TIME ZONE 'UTC' AS utc_bin_time
UNION
SELECT
  tz('2020-10-25T02:30:00+01:00', 'Europe/Paris') AS original_time,
  date_bin_wallclock(
    INTERVAL '1 hour',
    tz('2020-10-25T02:30:00+01:00', 'Europe/Paris'),
    '1970-01-01T00:30:00'
  ) AT TIME ZONE 'UTC' AS utc_bin_time
ORDER BY original_time;
```

| original_time             | utc_bin_time         |
| :------------------------ | :------------------- |
| 2020-10-25T02:29:00+01:00 | 2020-10-24T23:30:00Z |
| 2020-10-25T02:30:00+01:00 | 2020-10-25T01:30:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}

{{< expand-wrapper >}}
{{% expand "View `date_bin_wallclock` query example" %}}

The following query uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)
and returns the 12-hour average temperature for each room using times in the
`America/Los_Angeles` time zone.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_wallclock(INTERVAL '12 hours', tz(time, 'America/Los_Angeles')) AS time,
  room,
  avg(temp) AS avg_temp
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T20:00:00Z'
GROUP BY 1, room
```

| time                      | room        |           avg_temp |
| :------------------------ | :---------- | -----------------: |
| 2022-01-01T00:00:00-08:00 | Kitchen     |  22.61666666666667 |
| 2022-01-01T12:00:00-08:00 | Kitchen     |               22.7 |
| 2022-01-01T00:00:00-08:00 | Living Room | 22.166666666666668 |
| 2022-01-01T12:00:00-08:00 | Living Room |               22.2 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## date_bin_wallclock_gapfill

Calculates time intervals using the timezone of a specified time value and
returns the start of the interval nearest to the specified timestamp.
If no rows exist in a time interval, a new row is inserted with a `time` value
set to the interval start time, all columns in the `GROUP BY` clause populated,
and null values in aggregate columns.

Use `date_bin_wallclock_gapfill` with [`interpolate`](/influxdb/version/reference/sql/functions/misc/#interpolate)
or [`locf`](/influxdb/version/reference/sql/functions/misc/#locf) to
[fill gaps in data](/influxdb/version/query-data/sql/fill-gaps/)
at specified time intervals in a specified time zone.

### Time zone shifts

Many regions use time zone shifts (such as daylight saving time (DST)).
If a wall clock time bin starts at a time that does not exist in the specified
time zone, the timestamp is adjusted to the time that is the same offset from
the start of the day in that time zone.

If a wall clock time represents an ambiguous time in the region then the
behavior depends on the size of the specified interval. If the interval is
larger than the difference between the two possible timestamps, then the earlier
timestamp is used. Otherwise, the function uses the timestamp that matches the
UTC offset of the input timestamp.

```sql
date_bin_wallclock_gapfill(interval, expression[, origin_timestamp])
```

> [!Note]
> `date_bin_wallclock_gapfill` requires [time bounds](/influxdb/version/query-data/sql/basic-query/#query-data-within-time-boundaries)
> in the `WHERE` clause.

##### Arguments:

- **interval**: Bin interval. Supports the following interval units:

  - nanoseconds
  - microseconds
  - milliseconds
  - seconds
  - minutes
  - hours
  - days
  - weeks

  > [!Note]
  > `date_bin_wallclock_gapfill` does _not_ support month-, year-, or century-based intervals.

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.
  The output timestamp uses the time zone from this time expression.
- **origin_timestamp**: Starting point used to determine bin boundaries.
  This must be a "wall clock" timestamp (no time zone).
  _Default is the Unix epoch._
  
  > [!Important]
  >
  > #### Avoid bins in time zone discontinuities
  >
  > [Time zone shifts](#time-zone-shifts) result in _discontinuities_–breaks
  > in the continuity of time intervals (losing an hour or gaining an hour)–that
  > can result in unexpected timestamps when using `date_bin_wallclock_gapfill`.
  > Avoid using an `interval` and `origin_timestamp` combination that results in a
  > bin falling inside a time discontinuity.
  >
  > As a general rule, use either the default `origin_timestamp` or an origin
  > timestamp with an offset relative to the Unix epoch that is equal to your
  > specified `interval`.
  >
  > [View time zone discontinuity example](#view-time-zone-discontinuity-example)

##### Related functions

[interpolate](/influxdb/version/reference/sql/functions/misc/#interpolate),
[locf](/influxdb/version/reference/sql/functions/misc/#locf)

{{< expand-wrapper >}}
{{% expand "Use `date_bin_wallclock_gapfill` to insert rows when no rows exists" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_wallclock_gapfill(INTERVAL '30 minutes', tz(time, 'America/Los_Angeles')) as time,
  room,
  avg(temp) as temp
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY 1, room
```

| time                      | room        | temp |
| :------------------------ | :---------- | ---: |
| 2022-01-01T00:00:00-08:00 | Kitchen     |   21 |
| 2022-01-01T00:30:00-08:00 | Kitchen     |      |
| 2022-01-01T01:00:00-08:00 | Kitchen     |   23 |
| 2022-01-01T01:30:00-08:00 | Kitchen     |      |
| 2022-01-01T02:00:00-08:00 | Kitchen     | 22.7 |
| 2022-01-01T00:00:00-08:00 | Living Room | 21.1 |
| 2022-01-01T00:30:00-08:00 | Living Room |      |
| 2022-01-01T01:00:00-08:00 | Living Room | 21.4 |
| 2022-01-01T01:30:00-08:00 | Living Room |      |
| 2022-01-01T02:00:00-08:00 | Living Room | 21.8 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Use `date_bin_wallclock_gapfill` to fill gaps in data" %}}

Use `interpolate` and `locf` to fill the null values in rows inserted by
`date_bin_wallclock_gapfill`.

_The following examples use the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[interpolate](#)
[locf](#)
{{% /tabs %}}
{{% tab-content %}}

The example below uses [`interpolate`](/influxdb/version/reference/sql/functions/misc/#interpolate)
to fill null values by interpolating values between non-null values.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_wallclock_gapfill(INTERVAL '30 minutes', tz(time, 'America/Los_Angeles')) as time,
  room,
  interpolate(avg(temp))
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY 1, room
```

| time                      | room        | interpolate(avg(home.temp)) |
| :------------------------ | :---------- | --------------------------: |
| 2022-01-01T00:00:00-08:00 | Kitchen     |                          21 |
| 2022-01-01T00:30:00-08:00 | Kitchen     |                          22 |
| 2022-01-01T01:00:00-08:00 | Kitchen     |                          23 |
| 2022-01-01T01:30:00-08:00 | Kitchen     |                       22.85 |
| 2022-01-01T02:00:00-08:00 | Kitchen     |                        22.7 |
| 2022-01-01T00:00:00-08:00 | Living Room |                        21.1 |
| 2022-01-01T00:30:00-08:00 | Living Room |                       21.25 |
| 2022-01-01T01:00:00-08:00 | Living Room |                        21.4 |
| 2022-01-01T01:30:00-08:00 | Living Room |                        21.6 |
| 2022-01-01T02:00:00-08:00 | Living Room |                        21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{% tab-content %}}

The example below uses [`locf`](/influxdb/version/reference/sql/functions/misc/#locf)
to fill null values by carrying the last observed value forward.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_wallclock_gapfill(INTERVAL '30 minutes', tz(time, 'America/Los_Angeles')) as time,
  room,
  locf(avg(temp))
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY 1, room
```

| time                      | room        | locf(avg(home.temp)) |
| :------------------------ | :---------- | -------------------: |
| 2022-01-01T00:00:00-08:00 | Kitchen     |                   21 |
| 2022-01-01T00:30:00-08:00 | Kitchen     |                   21 |
| 2022-01-01T01:00:00-08:00 | Kitchen     |                   23 |
| 2022-01-01T01:30:00-08:00 | Kitchen     |                   23 |
| 2022-01-01T02:00:00-08:00 | Kitchen     |                 22.7 |
| 2022-01-01T00:00:00-08:00 | Living Room |                 21.1 |
| 2022-01-01T00:30:00-08:00 | Living Room |                 21.1 |
| 2022-01-01T01:00:00-08:00 | Living Room |                 21.4 |
| 2022-01-01T01:30:00-08:00 | Living Room |                 21.4 |
| 2022-01-01T02:00:00-08:00 | Living Room |                 21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}

## date_trunc

Truncates a timestamp value to a specified precision.  

```sql
date_trunc(precision, expression) 
```

##### Arguments:

- **precision**: Time precision to truncate to.
  The following precisions are supported:

  - year
  - month
  - week
  - day
  - hour
  - minute
  - second

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.

##### Aliases

- `datetrunc`

{{< expand-wrapper >}}
{{% expand "View `date_trunc` query examples" %}}

#### Use date_trunc to return hourly averages

```sql
SELECT
  avg(water_level) AS level,
  date_trunc('hour', time) AS hour
FROM h2o_feet
WHERE
  time >= timestamp '2019-09-10T00:00:00Z'
  AND time <= timestamp '2019-09-12T00:00:00Z'
GROUP BY hour
ORDER BY hour
```

| hour                     | level              |
| :----------------------- | :----------------- |
| 2019-09-10T00:00:00.000Z | 3.7248000000000006 |
| 2019-09-10T01:00:00.000Z | 3.8561499999999995 |
| 2019-09-10T02:00:00.000Z | 4.5405999999999995 |
| 2019-09-10T03:00:00.000Z | 5.5548072072500005 |
| 2019-09-10T04:00:00.000Z | 6.433900000000001  |
| 2019-09-10T05:00:00.000Z | 6.810949999999998  |

#### Use date_trunc to return weekly averages

```sql
SELECT
  mean(water_level) as level,
  date_trunc('week',time) AS week
FROM h2o_feet
WHERE
  time >= timestamp '2019-08-01T00:00:00Z'
  AND time <= timestamp '2019-10-31T00:00:00Z'
GROUP BY week
ORDER BY week
```

| level              | week                     |
| :----------------- | :----------------------- |
| 4.3314415259020835 | 2019-08-12T00:00:00.000Z |
| 4.234838403584523  | 2019-08-19T00:00:00.000Z |
| 4.4184818559633925 | 2019-08-26T00:00:00.000Z |
| 4.405153386766021  | 2019-09-02T00:00:00.000Z |
| 4.725866897257734  | 2019-09-09T00:00:00.000Z |
| 4.499938596774042  | 2019-09-16T00:00:00.000Z |

{{% /expand %}}
{{< /expand-wrapper >}}

## datetrunc

_Alias of [date_trunc](#date_trunc)._

## date_format

_Alias of [to_char](#to_char)._

## date_part

Returns the specified part of the date as an integer.

```sql
date_part(part, expression)
```

##### Arguments:

- **part**: Part of the date to return.
  The following date parts are supported:

  - year
  - month
  - week _(week of the year)_
  - day _(day of the month)_
  - hour
  - minute
  - second
  - millisecond
  - microsecond
  - nanosecond
  - dow _(day of the week)_
  - day _(day of the year)_

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.

##### Aliases

- `datepart`

{{< expand-wrapper >}}
{{% expand "View `date_part` query examples" %}}

```sql
SELECT
  date_part('hour', time) AS hour,
  time,
  "level description", 
  location
FROM h2o_feet
WHERE
  time >= timestamp '2019-08-17T02:54:00Z'
  AND time <= timestamp '2019-08-17T03:06:00Z'
ORDER BY time
```

| hour | time                 | level description    | location     |
| :--: | :------------------- | :------------------- | :----------- |
|  2   | 2019-08-17T02:54:00Z | between 3 and 6 feet | coyote_creek |
|  2   | 2019-08-17T02:54:00Z | between 3 and 6 feet | santa_monica |
|  3   | 2019-08-17T03:00:00Z | between 3 and 6 feet | coyote_creek |
|  3   | 2019-08-17T03:00:00Z | between 3 and 6 feet | santa_monica |
|  3   | 2019-08-17T03:06:00Z | between 3 and 6 feet | coyote_creek |
|  3   | 2019-08-17T03:06:00Z | between 3 and 6 feet | santa_monica |

{{% /expand %}}
{{< /expand-wrapper >}}

## datepart

_Alias of [date_part](#date_part)._

## extract

Returns a sub-field from a time value as an integer.
Similar to `date_part`, but with different arguments. 

```sql
extract(field FROM source)
```

##### Arguments

- **field**: Part or field of the date to return.
  The following date fields are supported:

  - year
  - month
  - week _(week of the year)_
  - day _(day of the month)_
  - hour
  - minute
  - second
  - millisecond
  - microsecond
  - nanosecond
  - dow _(day of the week)_
  - day _(day of the year)_

- **source**: Source time expression to operate on.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `extract` query example" %}}

```sql
SELECT 
  extract(day from time) AS day
FROM 
  h2o_feet 
LIMIT 1
```

| day |
| :-- |
| 25  |

{{% /expand %}}
{{< /expand-wrapper >}}

## from_unixtime

Converts an integer to RFC3339 timestamp format (`YYYY-MM-DDT00:00:00.000000000Z`).
Input is parsed as a [Unix nanosecond timestamp](/influxdb/version/reference/glossary/#unix-timestamp)
and returns the corresponding RFC3339 timestamp.

```sql
from_unixtime(expression)
```

##### Arguments:

- **expression**: Integer expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

##### Related functions

[to_unixtime](#to_unixtime)

{{< expand-wrapper >}}
{{% expand "View `from_unixtime` query example" %}}

```sql
SELECT
  from_unixtime(1672531200000000000) AS RFC3339
```

| RFC3339              |
| :------------------- |
| 2023-01-01T00:00:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}

## make_date

Returns a date using the component parts (year, month, day).

> [!Note]
> `make_date` returns a `DATE32` Arrow type, which isn't supported by InfluxDB.
> To use with InfluxDB, [cast the return value to a timestamp or string](/influxdb/version/query-data/sql/cast-types/).

```sql
make_date(year, month, day)
```

##### Arguments

- **year**: Year to use when making the date.
  Can be a constant, column or function, and any combination of arithmetic operators.
- **month**: Month to use when making the date.
  Can be a constant, column or function, and any combination of arithmetic operators.
- **day**: Day to use when making the date.
  Can be a constant, column or function, and any combination of arithmetic operators

{{< expand-wrapper >}}
{{% expand "View `make_date` query example" %}}

```sql
SELECT make_date(2024, 01, 01)::STRING AS date
```

| date       |
| :--------- |
| 2023-01-01 |

{{% /expand %}}
{{< /expand-wrapper >}}

## now

Returns the current UTC timestamp.

The `now()` return value is determined at query time and returns the same timestamp,
no matter when in the query plan the function executes.

```sql 
now()
```

##### Aliases

- [current_timestamp](#current_timestamp)

{{< expand-wrapper >}}
{{% expand "View `now` query example" %}}

```sql
SELECT
  "water_level",
  "time"
FROM h2o_feet
WHERE
  time <= now() - interval '12 minutes'
```

{{% /expand %}}
{{< /expand-wrapper >}}

## today

_Alias of [current_date](#current_date)._

## to_char

Returns the string representation of a date, time, timestamp, or duration based on
a [Rust Chrono format string](https://docs.rs/chrono/latest/chrono/format/strftime/index.html).

> [!Note]
> Unlike the PostgreSQL `TO_CHAR()` function, this function does not support
> numeric formatting.

```sql
to_char(expression, format)
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function that results in a date, time, timestamp or duration.
- **format**: [Rust Chrono format string](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  to use to convert the expression.

##### Aliases

- [date_format](#date_format)

{{< expand-wrapper >}}
{{% expand "View `to_char` query example" %}}

```sql
SELECT
  to_char('2024-01-01T12:22:01Z'::TIMESTAMP, '%a %e-%b-%Y %H:%M:%S') AS datestring
```

| datestring               |
| :----------------------- |
| Mon  1-Jan-2024 12:22:01 |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_date

Converts a value to a date (`YYYY-MM-DD`).
Supports strings and numeric types as input.
Strings are parsed as `YYYY-MM-DD` unless another format is specified.
Numeric values are interpreted as days since the
[Unix epoch](/influxdb/version/reference/glossary/#unix-epoch).

> [!Note]
> `to_date` returns a `DATE32` Arrow type, which isn't supported by InfluxDB.
> To use with InfluxDB, [cast the return value to a timestamp or string](/influxdb/version/query-data/sql/cast-types/).

```sql
to_date(expression[, ..., format_n])
```

###### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: Optional [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  pattern to use to parse the _string_ expression.
  Formats are attempted in the order that they appear.
  The function returns the timestamp from the first format to parse successfully.
  If no formats parse successfully, the function returns an error.

{{< expand-wrapper >}}
{{% expand "View `to_date` query example" %}}

```sql
SELECT
  to_date('1-Jan-2024', '%e-%b-%Y')::STRING AS date
```

| date       |
| :--------- |
| 2024-01-01 |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_local_time

Converts a timestamp with a timezone to a timestamp without a timezone
(no offset or timezone information). This function accounts for time shifts
like daylight saving time (DST).

> [!Note]
> Use `to_local_time()` with [`date_bin()`](#date_bin) and
> [`date_bin_gapfill`](#date_bin_gapfill) to generate window boundaries based the
> local time zone rather than UTC.

```sql
to_local_time(expression)
```

##### Arguments

- **expression**: Time expression to operate on.
  Can be a constant, column, or function.

{{< expand-wrapper >}}
{{% expand "View `to_local_time` query example" %}}

```sql
SELECT
  to_local_time('2024-01-01 00:00:00'::TIMESTAMP) AS "local time";
```

| local time           |
| :------------------- |
| 2024-01-01T00:00:00Z |

{{% /expand %}}
{{% expand "View `to_local_time` query example with a time zone offset" %}}

```sql
SELECT
  to_local_time((arrow_cast('2024-01-01 00:00:00', 'Timestamp(Nanosecond, Some("UTC"))')) AT TIME ZONE 'America/Los_Angeles') AS "local time"
```

| local time           |
| :------------------- |
| 2023-12-31T16:00:00Z |

{{% /expand %}}
{{% expand "View `to_local_time` query example with `date_bin`" %}}

```sql
SELECT
  date_bin(interval '1 day', time, to_local_time(0::TIMESTAMP)) AT TIME ZONE 'America/Los_Angeles' AS time,
  avg(f1),
  avg(f2)
FROM
  (VALUES (arrow_cast('2024-01-01 12:00:00', 'Timestamp(Nanosecond, Some("UTC"))'), 1.23, 4.56),
          (arrow_cast('2024-01-01 13:00:00', 'Timestamp(Nanosecond, Some("UTC"))'), 2.46, 8.1),
          (arrow_cast('2024-01-01 14:00:00', 'Timestamp(Nanosecond, Some("UTC"))'), 4.81, 16.2)
  ) AS data(time, f1, f2)
GROUP BY 1
```

| time                      |       avg(data.f1) | avg(data.f2) |
| :------------------------ | -----------------: | -----------: |
| 2023-12-31T16:00:00-08:00 | 2.8333333333333335 |         9.62 |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_timestamp

Converts a value to RFC3339 timestamp format (`YYYY-MM-DDT00:00:00Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix nanosecond timestamps](/influxdb/version/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp(expression)
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp` query example" %}}

```sql
SELECT to_timestamp(1704067200000000000)
```

| to_timestamp(Int64(1704067200000000000)) |
| :--------------------------------------- |
| 2024-01-01T00:00:00Z                     |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_timestamp_micros

Converts a value to RFC3339 microsecond timestamp format (`YYYY-MM-DDT00:00:00.000000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix microsecond timestamps](/influxdb/version/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_micros(expression[, ..., format_n])
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: Optional [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  pattern to use to parse the _string_ expression.
  Formats are attempted in the order that they appear.
  The function returns the timestamp from the first format to parse successfully.
  If no formats parse successfully, the function returns an error.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_micros` query example" %}}

```sql
SELECT to_timestamp_micros(1704067200000001)
```

| to_timestamp_micros(Int64(1704067200000001)) |
| :------------------------------------------- |
| 2024-01-01T00:00:00.000001Z                  |
{{% /expand %}}
{{% expand "View `to_timestamp_micros` example with string format parsing" %}}

```sql
SELECT to_timestamp_micros('01:01:59.123456789 01-01-2024', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y') AS microsecond
```

| microsecond                 |
| :-------------------------- |
| 2024-01-01T01:01:59.123456Z |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_timestamp_millis

Converts a value to RFC3339 millisecond timestamp format (`YYYY-MM-DDT00:00:00.000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix millisecond timestamps](/influxdb/version/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_millis(expression[, ..., format_n])
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: Optional [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  pattern to use to parse the _string_ expression.
  Formats are attempted in the order that they appear.
  The function returns the timestamp from the first format to parse successfully.
  If no formats parse successfully, the function returns an error.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_millis` query example" %}}

```sql
SELECT to_timestamp_millis(1704067200001) AS time
```

Results
| to_timestamp_millis(Int64(1704067200001)) |
| :---------------------------------------- |
| 2024-01-01T00:00:00.001Z                  |

{{% /expand %}}
{{% expand "View `to_timestamp_millis` example with string format parsing" %}}

```sql
SELECT to_timestamp_millis('01:01:59.123456789 01-01-2024', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y') AS millisecond
```

| millisecond              |
| :----------------------- |
| 2024-01-01T01:01:59.123Z |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_timestamp_nanos

Converts a value to RFC3339 nanosecond timestamp format (`YYYY-MM-DDT00:00:00.000000000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix nanosecond timestamps](/influxdb/version/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_nanos(expression[, ..., format_n])
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: Optional [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  pattern to use to parse the _string_ expression.
  Formats are attempted in the order that they appear.
  The function returns the timestamp from the first format to parse successfully.
  If no formats parse successfully, the function returns an error.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_nanos` query example" %}}

```sql
SELECT to_timestamp_nanos(1704067200000000001)
```

| to_timestamp_nanos(Int64(1704067200000000001)) |
| :--------------------------------------------- |
| 2024-01-01T00:00:00.000000001Z                 |
{{% /expand %}}
{{% expand "View `to_timestamp_nanos` example with string format parsing" %}}

```sql
SELECT to_timestamp_nanos('01:01:59.123456789 01-01-2024', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y') AS nanosecond
```

| nanosecond                     |
| :----------------------------- |
| 2024-01-01T01:01:59.123456789Z |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_timestamp_seconds

Converts a value to RFC3339 second timestamp format (`YYYY-MM-DDT00:00:00Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix second timestamps](/influxdb/version/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_seconds(expression[, ..., format_n]) 
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: Optional [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  pattern to use to parse the _string_ expression.
  Formats are attempted in the order that they appear.
  The function returns the timestamp from the first format to parse successfully.
  If no formats parse successfully, the function returns an error.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_seconds` query example" %}}

```sql
SELECT to_timestamp_seconds(1704067201)
```

| to_timestamp_seconds(Int64(1704067201)) |
| :-------------------------------------- |
| 2024-01-01T00:00:01Z                    |

{{% /expand %}}
{{% expand "View `to_timestamp_seconds` example with string format parsing" %}}

```sql
SELECT to_timestamp_seconds('01:01:59.123456789 01-01-2024', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y') AS second
```

| second               |
| :------------------- |
| 2024-01-01T01:01:59Z |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_unixtime

Converts a value to seconds since the [Unix epoch](/influxdb/version/reference/glossary/#unix-epoch).
Supports strings, timestamps, and floats as input.
Strings are parsed as [RFC3339Nano timestamps](/influxdb/version/reference/glossary/#rfc3339nano-timestamp) if no
[Rust Chrono format strings](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
are provided.

```sql
to_unixtime(expression[, ..., format_n])
```

##### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: Optional [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
  pattern to use to parse the _string_ expression.
  Formats are attempted in the order that they appear.
  The function returns the timestamp from the first format to parse successfully.
  If no formats parse successfully, the function returns an error.

##### Related functions

[from_unixtime](#from_unixtime)

{{< expand-wrapper >}}
{{% expand "View `to_unixtime` query example" %}}

```sql
SELECT to_unixtime('2024-01-01T01:01:59.123456789Z') AS unixtime
```

| unixtime   |
| :--------- |
| 1704070919 |

{{% /expand %}}
{{% expand "View `to_unixtime` example with string format parsing" %}}

```sql
SELECT
  to_unixtime('01:01:59.123456789 01-01-2024', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y') AS unixtime
```

| unixtime   |
| :--------- |
| 1704070919 |

{{% /expand %}}
{{< /expand-wrapper >}}


## tz

Converts a timestamp to a provided timezone. If the second argument is not provided, it defaults to UTC.

```sql
tz(time_expression[, timezone])
```

##### Arguments

- **time_expression**: time to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **timezone**: [Timezone string](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
  to cast the value into. Default is `'UTC'`.
  The function returns the timestamp cast to the specified timezone.
  If an incorrect timezone string is passed or the wrong datatype is provided, the function returns an error.

{{< expand-wrapper >}}
{{% expand "View `tz` query example" %}}

```sql
SELECT tz('2024-01-01T01:00:00Z', 'America/New_York') AS time_tz
```

| time_tz                  |
| :----------------------- |
| 2024-10-01T02:00:00-04:00|

{{% /expand %}}
{{% expand "View `tz` query example from Getting Started data" %}}

```sql
SELECT tz(time, 'Australia/Sydney') AS time_tz, time FROM home ORDER BY time LIMIT 3;
```

| time_tz                             | time                           |
| :---------------------------------- | ------------------------------ |
| 1970-01-01T10:00:01.728979200+10:00 | 1970-01-01T00:00:01.728979200Z |
| 1970-01-01T10:00:01.728979200+10:00 | 1970-01-01T00:00:01.728979200Z |
| 1970-01-01T10:00:01.728982800+10:00 | 1970-01-01T00:00:01.728982800Z |

{{% /expand %}}
{{< /expand-wrapper >}}

##### Differences between tz and AT TIME ZONE

`tz` and [`AT TIME ZONE`](/influxdb/version/reference/sql/operators/other/#at-time-zone)
differ when the input timestamp **does not** have a timezone.

- When using an input timestamp that does not have a timezone (the default behavior in InfluxDB) with the
  `AT TIME ZONE` operator, the operator returns the the same timestamp, but with a timezone offset
  (also known as the "wall clock" time)--for example:

  ```sql
  '2024-01-01 00:00:00'::TIMESTAMP AT TIME ZONE 'America/Los_Angeles'
  
  -- Returns
  2024-01-01T00:00:00-08:00
  ```

- When using an input timestamp with a timezone, both the `tz()` function and the `AT TIME ZONE`
  operator return the timestamp converted to the time in the specified timezone--for example:

  ```sql
  '2024-01-01T00:00:00-00:00' AT TIME ZONE 'America/Los_Angeles'
  tz('2024-01-01T00:00:00-00:00', 'America/Los_Angeles')
  
  -- Both return
  2023-12-31T16:00:00-08:00
  ```

- `tz()` always converts the input timestamp to the specified time zone.
  If the input timestamp does not have a timezone, the function assumes it is a UTC timestamp--for example:

  ```sql
  tz('2024-01-01 00:00:00'::TIMESTAMP, 'America/Los_Angeles')
  -- Returns
  2023-12-31T16:00:00-08:00
  ```

  ```sql
  tz('2024-01-01T00:00:00+1:00', 'America/Los_Angeles')
  -- Returns
  2023-12-31T15:00:00-08:00
  ```
  
{{< expand-wrapper >}}
{{% expand "View `tz` and `::timestamp` comparison" %}}
```sql
SELECT
  '2024-04-01T00:00:20Z'::timestamp AT TIME ZONE 'Europe/Brussels' as time_timestamp,
  tz('2024-04-01T00:00:20', 'Europe/Brussels') as time_tz;
```
| time_timestamp               | time_tz                    |
| :--------------------------- | :------------------------- |
| 2024-04-01T00:00:20+02:00    | 2024-04-01T02:00:20+02:00  |
{{% /expand %}}
{{< /expand-wrapper >}}
