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

### Casting timestamps

this query works

the date/time value does not need to be cast, the UNIX epoch does


SELECT *
FROM h2o_feet 
WHERE "location" = 'coyote_creek'
AND "time" >= 1567296000000000000::timestamp AND "time" <= '2019-09-03 00:12:00'


### Timestamps

The following timestamp formats ae used in InfluxDB SQL:

what is nativeley suppported (no casting) and what is not (cast)

walk through what values you can cast with ::timestamp


 - RFCC3339 nanosecond - 2019-09-01T00:00:00Z
 <!-- - unix epoch - 567296000000000000 -->
 - YYYY-MM-DD-time - 2019-09-03 00:12:00 

Must use RFCC3339 timestamp nanosecnd

unix epoch is integer so no quotes


select * from measurement where time 'insert-RFCC3339timestamp'::timestamp

### Syntax

```sql
SELECT time, myfield, l.mytag AS l, r.mytag as r
  FROM mytable_l AS l
  FULL OUTER JOIN mytable_r AS r ON r.mytag = l.mytag AND (time > now() - interval '30 minutes')
  WHERE (time > now() - interval '30 minutes')
```

### Examples

Specify the time column to show the timestamp:

```sql
SELECT degrees, location, time
  FROM h2o_temperature
  WHERE "location" = 'coyote_creek'
```
| time | degrees      | location                 |
| :--- | :----------- | :----------------------- |


SELECT time, myfield, l.mytag AS l, r.mytag as r
  FROM mytable_l AS l
  FULL OUTER JOIN mytable_r AS r ON r.mytag = l.mytag AND (time > now() - interval '30 minutes')
  WHERE (time > now() - interval '30 minutes')

SELECT request, "orgID"
FROM query_log
WHERE time BETWEEN (NOW() - INTERVAL'5 MINUTES') AND (NOW() - INTERVAL'10 MINUTES')

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

SELECT "water_level" 
FROM "h2o_feet" 
WHERE "location" = 'santa_monica' AND time >= '2019-08-18'::timestamp AND time <= '2019-08-18 00:12:00'::timestamp

Select data within a specified time range using Unix epoch timestamps

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'coyote_creek'
AND "time" >= 1567296000000000000::timestamp AND "time" <= '2019-09-03 00:12:00'::timestamp 
```

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
