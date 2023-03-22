---
title: SQL time and date functions
list_title: Time and date functions
description: >
  Use time and date functions to work with time values and time series data.
menu:
  influxdb_cloud_iox:
    name: Time and date
    parent: sql-functions    
weight: 305
---

InfluxDB's SQL implementation supports time and date functions that are useful when working with time series data. 

- [now](#now)
- [date_bin](#date_bin)
- [date_trunc](#date_trunc)  
- [date_part](#date_part)
- [extract](#extract)
- [to_timestamp](#to_timestamp)
- [to_timestamp_millis](#to_timestamp_millis)
- [to_timestamp_micros](#to_timestamp_micros)
- [to_timestamp_seconds](#to_timestamp_seconds)
- [from_unixtime](#from_unixtime)

### now

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

### date_bin

Calculates time intervals and returns the start of the interval nearest to the specified timestamp.
Use `date_bin` to downsample time series data by grouping rows into time-based "bins" or "windows"
and applying an aggregate or selector function to each window.

For example, if you "bin" or "window" data into 15 minute intervals, an input timestamp of `2023-01-01T18:18:18Z` will be updated to the start time of the 15 minute bin it is in: `2023-01-01T18:15:00Z`.

```sql
date_bin(interval, expression, origin-timestamp)
```

##### Arguments:

- **interval**: Bin interval.
- **expression**: Column or timestamp literal to operate on.  
- **timestamp**: Starting point used to determine bin boundaries.

The following intervals are supported:

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
GROUP BY date_bin(INTERVAL '1 day', time, TIMESTAMP '1970-01-01 00:00:00Z')
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

### date_trunc

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
    
- **expression**: Column or timestamp literal to operate on.  

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

### date_part

Returns the specified part of the date as an integer.

```sql
date_part(part, expression)
```

##### Arguments:

- **part**: Part of the date to return.
  The follow date parts are supported:

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
    
- **expression**: Column or timestamp literal to operate on.

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

### extract

Returns a sub-field from a time value as an integer.
Similar to `date_part`, but with different arguments. 

```sql
extract(field FROM source)
```

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

### to_timestamp

Converts a value to RFC3339 nanosecond timestamp format (`YYYY-MM-DDT00:00:00.000000000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as [Unix nanosecond timestamps](/influxdb/cloud-iox/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 nanosecond timestamp.

```sql
to_timestamp(expression)
```

##### Arguments:

- **expression**: Column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp` query example" %}}

```sql
SELECT to_timestamp(time) 
FROM h2o_feet
LIMIT 1
```

| totimestamp(cpu.time)    |
| :----------------------- |
| 2019-08-27T00:00:00.000Z |

{{% /expand %}}
{{< /expand-wrapper >}}

### to_timestamp_millis

Converts a value to RFC3339 millisecond timestamp format (`YYYY-MM-DDT00:00:00.000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as [Unix nanosecond timestamps](/influxdb/cloud-iox/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_millis(expression) 
```

##### Arguments:

- **expression**: Column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_millis` query example" %}}

```sql
SELECT
  to_timestamp_millis(time) 
FROM 
  h2o_temperature
LIMIT 1
```

Results
| totimestampmillis(cpu.time) |
| :-------------------------- |
| 2023-02-08T17:25:18.864Z    |

{{% /expand %}}
{{< /expand-wrapper >}}

### to_timestamp_micros

Converts a value to RFC3339 microsecond timestamp format (`YYYY-MM-DDT00:00:00.000000Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as [Unix nanosecond timestamps](/influxdb/cloud-iox/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_micros(expression)
```

##### Arguments:

- **expression**: Column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_micros` query example" %}}

```sql
SELECT
  to_timestamp_micros(time)
FROM 
  cpu
LIMIT 1
```

| totimestampmicros(cpu.time) |
| :-------------------------- |
| 2023-02-08T19:21:10.000Z    |
{{% /expand %}}
{{< /expand-wrapper >}}


### to_timestamp_seconds

Converts a value to RFC3339 second timestamp format (`YYYY-MM-DDT00:00:00Z`).
Supports timestamp, integer, and unsigned integer types as input.
Integers and unsigned integers are parsed as [Unix nanosecond timestamps](/influxdb/cloud-iox/reference/glossary/#unix-timestamp)
and return the corresponding RFC3339 timestamp.

```sql
to_timestamp_seconds(expression) 
```

##### Arguments:

- **expression**: Column or literal value to operate on.

{{< expand-wrapper >}}
{{% expand "View `to_timestamp_seconds` query example" %}}

```sql
SELECT
  to_timestamp_seconds(time)
FROM 
  cpu
LIMIT 1;
```

| totimestampseconds(cpu.time) |
| :--------------------------- |
| 2023-02-08T17:21:10          |

{{% /expand %}}
{{< /expand-wrapper >}}


### from_unixtime

Converts an integer to RFC3339 timestamp format (`YYYY-MM-DDT00:00:00.000000000Z`).
Input is parsed as a [Unix nanosecond timestamp](/influxdb/cloud-iox/reference/glossary/#unix-timestamp)
and returns the corresponding RFC3339 timestamp.

```sql
from_unixtime(expression)
```

##### Arguments:

- **expression**: Column or integer literal to operate on.

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