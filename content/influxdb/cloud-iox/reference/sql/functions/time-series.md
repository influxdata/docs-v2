---
title: SQL time and date functions
list_title: Time and date functions
description: >
  Use time and date functions to work with time values and time series data.
menu:
  influxdb_cloud_iox:
    name: Time series
    parent: sql-functions    
weight: 305
---

InfluxDB's SQL implementation supports time functions and functions specifically designed for working with time series data. 

- [now](#now)
- [date_bin](#date_bin)
- [date_trunc](#date_trunc)  
- [date_part](#date_part)

### now

Use the NOW() function to query data with timestamps relative to the server's current timestamp.  

```sql 
(time >= now() - interval <'insert_interval')
```

{{< expand-wrapper >}}
{{% expand "View `now` query example" %}}

```sql
SELECT "water_level", "time"
FROM h2o_feet
WHERE time <= now() - interval '12 minutes'
```

Results:

| time                     | water_level |
| :----------------------- | :---------- |
| 2019-09-05T00:00:00.000Z | 7.848       |
| 2019-09-05T00:06:00.000Z | 7.986       |
| 2019-09-05T00:12:00.000Z | 8.114       |

{{% /expand %}}
{{< /expand-wrapper >}}

### date_bin

The `date_bin` function "bins" the input timestamp into a specified time interval.  

```sql
date_binN(INTERVAL <'insert_interval'>, expression, TIMESTAMP '<rfc3339_date_time_string>')
```

##### Arguments:

- **interval**: Span of time to bin or window by.
- **expression**: Column to operate on.  
- **timestamp**: Starting point used to determine window boundaries.

The following intervals are supported:

 - seconds
 - minutes
 - hours 
 - days 
 - weeks
 - months 
 - years

{{< expand-wrapper >}}
{{% expand "View `date_bin` query example" %}}

```sql
SELECT date_bin(INTERVAL '1 day', time, TIMESTAMP '2019-01-01 00:00:00Z') AS time, AVG("water_level") as water_level_avg
FROM "h2o_feet"
WHERE time >= timestamp '2019-09-10T00:00:00Z' AND time <= timestamp '2019-09-20T00:00:00Z'
GROUP BY 1
ORDER BY 1 DESC
```

Results:

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

The `date_trunc()` function truncates a timestamp value based on the specified part of the date.  

```sql

date_trunc('precision', expression) 
```

##### Arguments:

- **precision**: Desired time precision.
- **expression**: Column to operate on.  

The following precision is supported:  

 - year
 - month
 - week
 - day
 - hour
 - minute
 - second
 - millisecond 
 - nanosecond

{{< expand-wrapper >}}
{{% expand "View `date_trunc` query examples" %}}

```sql
SELECT
  avg(water_level) AS level,
  date_trunc('hour',time) AS "hour"
FROM "h2o_feet"
WHERE time >= timestamp '2019-09-10T00:00:00Z' AND time <= timestamp '2019-09-12T00:00:00Z'
GROUP BY hour
ORDER BY hour
```
Results:

| hour                     | level              |
| :----------------------- | :----------------- |
| 2019-09-10T00:00:00.000Z | 3.7248000000000006 |
| 2019-09-10T01:00:00.000Z | 3.8561499999999995 |
| 2019-09-10T02:00:00.000Z | 4.5405999999999995 |
| 2019-09-10T03:00:00.000Z | 5.5548072072500005 |
| 2019-09-10T04:00:00.000Z | 6.433900000000001  |
| 2019-09-10T05:00:00.000Z | 6.810949999999998  |


```sql
SELECT
	mean(water_level) as level,
    date_trunc('week',time) AS "week"
FROM
	"h2o_feet"
WHERE time >= timestamp '2019-08-01T00:00:00Z' AND time <= timestamp '2019-10-31T00:00:00Z'
GROUP BY week
ORDER BY week
```
Results:

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

The `date_part()` function is used to query for subfields from a date or time value and returns the specified part of the date as an integer.

```sql
date_part('field', source)
```
##### Arguments:

- **field**: The field to extract. Must be a string value.
- **source**: A temporal expression that evaluates to `timestamp`, `time` or `interval`.

The field values supported include:

 - year
 - month
 - week
 - day
 - hour
 - minute
 - second
 - millisecond 
 - nanosecond
 - dow
 - doy


{{< expand-wrapper >}}
{{% expand "View `date_part` query example" %}}

```sql
SELECT date_part('hour', TIMESTAMP '2019-08-01T10:00:00Z') hour, 
  "level description", 
  "location",
  time
FROM "h2o_feet"
WHERE time >= timestamp '2019-08-01T00:00:00Z' AND time <= timestamp '2019-10-31T00:00:00Z'
ORDER BY time
```

| hour | level description    | location     | time                     |
| :--- | :------------------- | :----------- | :----------------------- |
| 10   | below 3 feet         | santa_monica | 2019-08-17T00:00:00.000Z |
| 10   | between 6 and 9 feet | coyote_creek | 2019-08-17T00:00:00.000Z |
| 10   | below 3 feet         | santa_monica | 2019-08-17T00:06:00.000Z | 

{{% /expand %}}
{{< /expand-wrapper >}}


