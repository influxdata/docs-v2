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

### Timestamps

The following timestamp formats ae used in InfluxDB SQL:

 - RFCC3339 nanosecond - 2019-09-01T00:00:00Z
 - unix epoch - 567296000000000000
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

Use the time column to show the timestamp:

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

SELECT degrees, location 
  FROM h2o_temperature
  WHERE "location" = 'coyote_creek'
  AND time > (NOW() - interval'60 minutes')::timestamp

Select data based on time interval:

```sql
SELECT degrees, location, time
  FROM h2o_temperature
  WHERE "location" = 'coyote_creek'
  AND time < (NOW() - interval'60 minutes')::timestamp
```
Output:

| degrees | location     | time                     |
| :------ | :----------- | :----------------------- |
| 60      | coyote_creek | 2019-09-01T00:00:00.000Z |
| 70      | coyote_creek | 2019-09-01T00:06:00.000Z |
| 63      | coyote_creek | 2019-09-01T00:12:00.000Z |
| 68      | coyote_creek | 2019-09-01T00:18:00.000Z |
|         |              |                          |



SELECT "water_level" 
FROM "h2o_feet" 
WHERE "location" = 'santa_monica' AND time >= '2019-08-18'::timestamp AND time <= '2019-08-18 00:12:00'::timestamp


SELECT *
FROM h2o_feet 
WHERE "location" = 'coyote_creek'
AND "time" >= 1567296000000000000::timestamp AND "time" <= '2019-09-03 00:12:00'::timestamp 



SELECT *
FROM h2o_feet 
WHERE "location" = 'coyote_creek'
AND "time" >= '2019-09-01T00:00:00Z'::timestamp AND "time" <= '2019-09-03 00:12:00'::timestamp 
