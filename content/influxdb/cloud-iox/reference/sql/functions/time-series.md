---
title: SQL time series functions
list_title: Time series functions
description: >
  Use functions unique to working with time series data.
menu:
  influxdb_cloud_iox:
    name: Time series
    parent: sql-functions    
weight: 305
---

InfluxDB IOx 
There are several functions specifically designed for working with time series data.  

## The NOW() function

The `NOW` function returns the current date and time.  Use the NOW() function to query data with timestamps relative to the server's current timestamp.  

Note that the return type timestamp looks like this: `2023-01-30T20:48:52.722Z`. The timezone is the server's location.

NOW() function basic syntax:

```
(time >= now() - interval <'insert_interval')
```

#### Example

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

The query returns `water level` in 12 minutes intervals.

## The DATE_BIN() function

The `DATE_BIN` function "bins" the input timestamp into a specified time interval.  DATE_BIN basic syntax looks like this:

```sql
DATE_BIN(INTERVAL <'insert_interval'>, time, TIMESTAMP '<rfc3339_date_time_string>')
```

The first argument is the interval you want to bin or window by. The second argument is the time value, and can also be a column to operate on.  The third argument is the starting point used to determine window boundaries.

Supported intervals include seconds, minutes, hours, days, months and years.  

#### Examples

```sql
SELECT DATE_BIN(INTERVAL '1 day', time, TIMESTAMP '2022-01-01 00:00:00Z') AS time, AVG("water_level")  as water_level_avg
FROM "h2o_feet"
WHERE time >= timestamp '2019-09-10T00:00:00Z' AND time <= timestamp '2019-09-20T00:00:00Z'
GROUP BY 1
ORDER BY 1 DESC
```

Results:

| time                     | water_level_avg    |
| :----------------------- | :----------------- |
| 2019-09-17T00:00:00.000Z | 4.3642002317349045 |
| 2019-09-16T00:00:00.000Z | 4.605945251510415  |
| 2019-09-15T00:00:00.000Z | 4.680911918172915  |
| 2019-09-14T00:00:00.000Z | 4.85976073572917   |
| 2019-09-13T00:00:00.000Z | 4.911743186958335  |
| 2019-09-12T00:00:00.000Z | 4.766101201200004  |
| 2019-09-11T00:00:00.000Z | 4.657891084837502  |
| 2019-09-10T00:00:00.000Z | 4.608416685452088  |
| 2019-09-09T00:00:00.000Z | 3.77               |

The query returns the timestamp and the average water level for each day within the specified time period.

## The DATE_TRUNC() function

The DATE_TRUNC() function truncates a timestamp value based on the specified part of the date.  

The precision supported includes:

 - year
 - month
 - week
 - day
 - hour
 - minute
 - second
 - millisecond 
 - nanosecond

The first argument specifies the desired precision and the second argument is the time value.  The second arument is the column name. 

```sql

-- Basic syntax:
DATE_TRUNC('precision', column) 

-- Example:
DATE_TRUNC('minute',time) AS "minute"

```
#### Examples

```sql
SELECT
  AVG(water_level) AS level,
  DATE_TRUNC('hour',time) AS "hour"
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

The query returns the hourly average `water_level` for the specified time range. Note that the timestamp is also in hour, not nanosecond, format. This is a partial data set.


```sql
SELECT
	MEAN(water_level) as level,
    DATE_TRUNC('week',time) AS "week"
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


The query returns the weekly mean `water_level` for the specified time range.  


### The DATE_PART() function

The DATE_PART() function is used to query for subfields from a date or time value and returns the specified part of the date as an integer.

The precision supported includes:

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

```sql

--Basic syntax
DATE_PART(field, source)

--Examples
SELECT date_part('hour', TIMESTAMP '2020-03-18 10:21:45') h,
       date_part('minute', TIMESTAMP '2020-03-18 10:21:45') m,
       date_part('second', TIMESTAMP '2020-03-18 10:21:45') s;
```

#### Example

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

<!-- ## The TIME_BUCKET_GAPFILL function (not working for Jan 31 release)


```sql
SELECT time_bucket_gapfill('1 day', time, TIMESTAMP '2022-01-01 00:00:00Z') as day,
"degrees", "location", "time"
FROM "h2o_temperature"
GROUP BY 1,2
ORDER BY 1,2
``` -->

