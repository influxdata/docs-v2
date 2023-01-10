---
title: Timestamps and SQL
description: >
  Using timestamps and SQL
menu:
  influxdb_cloud_iox:
    name: Timestamps and SQL
    parent: Explore data using SQL
weight: 290

---

## Working with timestamps in InfluxDB SQL

The following timestamp formats ae supported in InfluxDB SQL:

 - '2022-01-31T06:30:30.123Z' (RFC3339) 
 - '2022-01-31T01:00:00.123-05:00' (RFC3339) 
 - '2022-01-31 01:00:00.123-05:00' (RFCC3339 like)
 - '2022-01-31T06:30:30Z' (RFC3339-like)
 - '2022-01-31 06:30:30.123' (RFC3339-like)
 - '2022-01-31 06:30:30' ((RFC3339-like, no fractional seconds) 
 - 1567296000000000000 (Unix epoch nanosecond)
-  1566176400 (Unix epoch second)

If the timstamp is nativeley suppported, such as RFCC3339 nanosend timestamps, casting is not required. If the timestamp is not natively supported, such as UNIX epoch, then it must be cast using `::timestamp`. Casting to a timstamp is not case sensitive.  

```sql
--RFCC3339 examples
'2019-08-18T01:00:00.123Z'::TIMESTAMP
'2019-08-18T01:00:00.123-05:00'
'2019-08-18 01:00:00.123-05:00'::timestamp
'2019-08-19T00:00:00Z'
'2019-08-18 05:30:00.123'
'2019-08-18 06:30:30'

--Unix epoch examples
1566176400::timestamp
1567296000000000000:TIMESTAMP
```
 
- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

Basic syntax:

```sql
SELECT * 
FROM "measurement" 
WHERE "time" >= 'insert-RFCC3339-timestamp' AND "time" <= 'insert-RFCC3339-timestamp'
```

### Examples

Specify the time column to show the timestamp:

```sql
SELECT degrees, location, time
FROM h2o_temperature
WHERE "location" = 'coyote_creek'
```
| degrees | location     | time                     |
| :------ | :----------- | :----------------------- |
| 60      | coyote_creek | 2019-09-01T00:00:00.000Z |
| 70      | coyote_creek | 2019-09-01T00:06:00.000Z |
| 63      | coyote_creek | 2019-09-01T00:12:00.000Z |
| 68      | coyote_creek | 2019-09-01T00:18:00.000Z |
| 62      | coyote_creek | 2019-09-01T00:24:00.000Z |

Select data within a specified time range using RFCC3339 timestamps

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'santa_monica'
AND "time" >= '2019-08-15T00:00:00Z'::timestamp AND "time" <= '2019-08-19T00:00:00Z'::timestamp 
ORDER BY "water_level"
```
Results:

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-17T13:18:00.000Z | 1.316       |
| below 3 feet      | santa_monica | 2019-08-17T13:12:00.000Z | 1.325       |
| below 3 feet      | santa_monica | 2019-08-17T12:54:00.000Z | 1.329       |
| below 3 feet      | santa_monica | 2019-08-17T13:00:00.000Z | 1.332       |
| below 3 feet      | santa_monica | 2019-08-17T12:36:00.000Z | 1.355       |
| below 3 feet      | santa_monica | 2019-08-17T12:48:00.000Z | 1.371       |

Select data based on time interval:

```sql
SELECT "degrees", "location", "time"
FROM "h2o_temperature"
WHERE "location" = 'coyote_creek'
AND time < (NOW() - interval'60 minutes')::timestamp
```
Results:

| degrees | location     | time                     |
| :------ | :----------- | :----------------------- |
| 65      | coyote_creek | 2019-08-20T00:00:00.000Z |
| 67      | coyote_creek | 2019-08-20T00:06:00.000Z |
| 66      | coyote_creek | 2019-08-20T00:12:00.000Z |
| 63      | coyote_creek | 2019-08-20T00:18:00.000Z |
| 65      | coyote_creek | 2019-08-20T00:24:00.000Z |
| 62      | coyote_creek | 2019-08-20T00:30:00.000Z |



Select data within a specified time range using both a Unix epoch timestamp and an RFCC3339 timestamp:

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'coyote_creek'
AND "time" >= 1567296000000000000::timestamp AND "time" <= '2019-09-03 00:12:00'::timestamp 
```



Select data using a mix of UNIX epoch and RFCC timestamps:

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'coyote_creek'
AND "time" >= 1567296000000000000::timestamp AND "time" <= '2019-09-03 00:12:00'
```