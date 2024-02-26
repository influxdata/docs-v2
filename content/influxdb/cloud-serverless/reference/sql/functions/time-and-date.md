---
title: SQL time and date functions
list_title: Time and date functions
description: >
  Use time and date functions to work with time values and time series data.
menu:
  influxdb_cloud_serverless:
    name: Time and date
    parent: sql-functions    
weight: 305
---

InfluxDB's SQL implementation supports time and date functions that are useful when working with time series data. 

- [current_date](#current_date)
- [current_time](#current_time)
- [date_bin](#date_bin)
- [date_bin_gapfill](#date_bin_gapfill)
- [date_trunc](#date_trunc)
- [datetrunc](#datetrunc)
- [date_part](#date_part)
- [datepart](#datepart)
- [extract](#extract)
- [from_unixtime](#from_unixtime)
- [now](#now)
- [to_timestamp](#to_timestamp)
- [to_timestamp_millis](#to_timestamp_millis)
- [to_timestamp_micros](#to_timestamp_micros)
- [to_timestamp_seconds](#to_timestamp_seconds)

## current_date

Returns the current UTC date.

{{% note %}}
`current_date` returns a `DATE32` Arrow type, which isn't supported by InfluxDB.
To use with InfluxDB, [cast the return value to a timestamp](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-a-timestamp-type).
{{% /note %}}

The `current_date()` return value is determined at query time and will return
the same date, no matter when in the query plan the function executes.

```
current_date()
```

{{< expand-wrapper >}}
{{% expand "View `current_date` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

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

{{% note %}}
`current_date` returns a `TIME64` Arrow type, which isn't supported by InfluxDB.
To use with InfluxDB, [cast the return value to a string](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-a-string-type).
{{% /note %}}

The `current_time()` return value is determined at query time and will return the same time,
no matter when in the query plan the function executes.

```
current_time()
```

{{< expand-wrapper >}}
{{% expand "View `current_time` query example" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT
  time,
  temp,
  current_time()::STRING AS current_time
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

## date_bin

Calculates time intervals and returns the start of the interval nearest to the specified timestamp.
Use `date_bin` to downsample time series data by grouping rows into time-based "bins" or "windows"
and applying an aggregate or selector function to each window.

For example, if you "bin" or "window" data into 15 minute intervals, an input timestamp of `2023-01-01T18:18:18Z` will be updated to the start time of the 15 minute bin it is in: `2023-01-01T18:15:00Z`.

```sql
date_bin(interval, expression[, origin_timestamp])
```

##### Arguments:

- **interval**: Bin interval.
- **expression**: Time expression to operate on.
  Can be a constant, column, or function.
- **origin_timestamp**: Starting point used to determine bin boundaries.
  _Default is the Unix epoch._

The following intervals are supported:

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

Use `date_bin_gapfill` with [`interpolate`](/influxdb/cloud-serverless/reference/sql/functions/misc/#interpolate)
or [`locf`](/influxdb/cloud-serverless/reference/sql/functions/misc/#locf) to
[fill gaps in data]()
at specified time intervals.

```sql
date_bin_gapfill(interval, expression[, origin_timestamp])
```

{{% note %}}
`date_bin_gapfill` requires [time bounds](/influxdb/cloud-serverless/query-data/sql/basic-query/#query-data-within-time-boundaries)
in the `WHERE` clause.
{{% /note %}}

##### Arguments:

- **interval**: Bin interval.
- **expression**: Time expression to operate on.
  Can be a constant, column, or function.
- **origin_timestamp**: Starting point used to determine bin boundaries.
  _Default is the Unix epoch._

The following intervals are supported:

- nanoseconds
- microseconds
- milliseconds
- seconds
- minutes
- hours
- days
- weeks

<!-- https://github.com/influxdata/influxdb_iox/issues/9958 tracks adding this --> 
The following intervals are not currently supported:
- months
- years
- century


##### Related functions

[interpolate](/influxdb/cloud-serverless/reference/sql/functions/misc/#interpolate),
[locf](/influxdb/cloud-serverless/reference/sql/functions/misc/#locf)

{{< expand-wrapper >}}
{{% expand "View `date_bin_gapfill` query examples" %}}

_The following examples use the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

- [Use date_bin_gapfill to insert rows when no rows exists](#use-date_bin_gapfill-to-insert-rows-when-no-rows-exists)
- [Use date_bin_gapfill to fill gaps in data](#use-date_bin_gapfill-to-fill-gaps-in-data)

#### Use date_bin_gapfill to insert rows when no rows exists

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

#### Use date_bin_gapfill to fill gaps in data

Use `interpolate` and `locf` to fill the null values in rows inserted by
`date_bin_gapfill`.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[interpolate](#)
[locf](#)
{{% /tabs %}}
{{% tab-content %}}

The example below uses [`interpolate`](/influxdb/cloud-serverless/reference/sql/functions/misc/#interpolate)
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

The example below uses [`locf`](/influxdb/cloud-serverless/reference/sql/functions/misc/#locf)
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
  - doy _(day of the year)_

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
  - doy _(day of the year)_

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
Input is parsed as a [Unix nanosecond timestamp](/influxdb/cloud-serverless/reference/glossary/#unix-timestamp)
and returns the corresponding RFC3339 timestamp.

```sql
from_unixtime(expression)
```

##### Arguments:

- **expression**: Integer expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.

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

## now

Returns the current UTC timestamp.

The `now()` return value is determined at query time and will return the same timestamp,
no matter when in the query plan the function executes.

```sql 
now()
```

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

## to_timestamp

Converts a value to RFC3339 timestamp format (`YYYY-MM-DDT00:00:00Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix nanosecond timestamps](/influxdb/cloud-serverless/reference/glossary/#unix-timestamp)
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

## to_timestamp_millis

Converts a value to RFC3339 millisecond timestamp format (`YYYY-MM-DDT00:00:00.000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix millisecond timestamps](/influxdb/cloud-serverless/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_millis(expression[, ..., format_n])
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
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

## to_timestamp_micros

Converts a value to RFC3339 microsecond timestamp format (`YYYY-MM-DDT00:00:00.000000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix microsecond timestamps](/influxdb/cloud-serverless/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_micros(expression[, ..., format_n])
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
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

## to_timestamp_nanos

Converts a value to RFC3339 nanosecond timestamp format (`YYYY-MM-DDT00:00:00.000000000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as
[Unix nanosecond timestamps](/influxdb/cloud-serverless/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_nanos(expression[, ..., format_n])
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
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
[Unix second timestamps](/influxdb/cloud-serverless/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_seconds(expression[, ..., format_n]) 
```

##### Arguments:

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
- **format_n**: [Rust strftime](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
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
