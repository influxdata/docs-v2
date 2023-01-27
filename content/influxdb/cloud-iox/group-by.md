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

## Syntax

```sql
--Basic syntax:

SELECT
  tag 1, field 1, AGGREGATE() function, SELECTOR() function
FROM measurement
GROUP BY tag 1
```

## Examples

Group data by a single tag key:

```sql
SELECT MEAN("water_level"), "location", "time"
FROM "h2o_feet" 
GROUP BY "location"
```
| AVG(h2o_feet.water_level) | location     |
| :------------------------ | ------------ |
| 5.359142420303919         | coyote_creek |
| 3.530712094245885         | santa_monica |
      |

Group results in 15 minute time intervals by tag:

```sql
SELECT
  "location",
  DATE_BIN(INTERVAL '15 minutes', time, TIMESTAMP '2022-01-01 00:00:00Z') AS time,
  COUNT("water_level")  AS count
FROM 
  "h2o_feet"
WHERE time >= timestamp '2019-09-17T00:00:00Z' AND time <= timestamp '2019-09-17T01:00:00Z'
GROUP BY 1,2
ORDER BY 1
```

| count | location     | time                     |
| :---- | :----------- | :----------------------- |
| 1     | coyote_creek | 2019-09-16T23:45:00.000Z |
| 2     | coyote_creek | 2019-09-17T00:30:00.000Z |
| 3     | coyote_creek | 2019-09-17T00:45:00.000Z |
| 2     | coyote_creek | 2019-09-17T00:00:00.000Z |
| 3     | coyote_creek | 2019-09-17T00:15:00.000Z |
| 1     | santa_monica | 2019-09-16T23:45:00.000Z |
| 2     | santa_monica | 2019-09-17T00:30:00.000Z |
| 3     | santa_monica | 2019-09-17T00:45:00.000Z |
| 2     | santa_monica | 2019-09-17T00:00:00.000Z |
| 3     | santa_monica | 2019-09-17T00:15:00.000Z |

The query uses a `COUNT()` function to count the number of water_level points, a `DATE_BIN()` function to group results by 15 minute intervals and an `ORDER BY 1` clause to order the results by location.
