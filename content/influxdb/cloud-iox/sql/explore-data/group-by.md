---
title: The GROUP BY clause
list_title: The GROUP BY clause
description: > 
    Use the `GROUP BY` clause to group query results based on specified tag keys and/or a specified time interval.
menu:
  influxdb_cloud_iox:
    name: The GROUP BY clause
    parent: Explore data using SQL
weight: 240
---

Use the `GROUP BY` clause to group query results based on specified tag keys and/or a specified time interval. `GROUP BY` requires an aggregate or selector function in the `SELECT` statement.

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

```sql
SELECT
tag 1, field 1, AGGREGATE() function
FROM measurement
GROUP BY tag 1
```

### Examples

Group data by a single tag key:

```sql
SELECT MEAN("water_level"), "location"
FROM "h2o_feet" 
GROUP BY "location"
```
| AVG(h2o_feet.water_level) | location     |
| :------------------------ | ------------ |
| 5.359142420303919         | coyote_creek |
| 3.530712094245885         | santa_monica |
      |

Group by time

```sql
SELECT MEAN("temperature"),"time"
FROM "airSensors" 
GROUP BY "sensor_id","time"
```


```sql
SELECT
  DATE_BIN(INTERVAL '1' day, time, TIMESTAMP '2022-01-01 00:00:00Z') AS time,
  COUNT("water_level")  as count
FROM "h2o_feet"
WHERE time >= timestamp '2019-08-17T00:00:00Z' AND time <= timestamp '2019-09-10T00:00:00Z'
GROUP BY 1
ORDER BY 1 DESC
```