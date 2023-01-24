---
title: The LIMIT clause
list_title: The LIMIT clause
description: > 
    Use the `LIMIT` clause to filter query results based on a spcified condition.
menu:
  influxdb_cloud_iox:
    name: The LIMIT clause
    parent: Explore data using SQL
weight: 270
---


The `LIMIT` clause limits the number of rows in the result to a maximum count which is a non-negative integer.

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

```sql

SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>

-- Example
SELECT a, b
FROM measurement
LIMIT 10
```

### Examples

Limit the results to a specified number:

```sql
SELECT "water_level","location", "time"
FROM "h2o_feet" 
LIMIT 5
```
Results:

| location     | time                     | water_level |
| :----------- | :----------------------- | ----------- |
| coyote_creek | 2019-08-28T00:00:00.000Z | 4.206       |
| coyote_creek | 2019-08-28T00:06:00.000Z | 4.052       |
| coyote_creek | 2019-08-28T00:12:00.000Z | 3.901       |
| coyote_creek | 2019-08-28T00:18:00.000Z | 3.773       |
| coyote_creek | 2019-08-28T00:24:00.000Z | 3.632       |

The query returns a total of 5 results.

Limit the results to the first 6 rows:

```sql
SELECT "water_level","location", "time"
FROM "h2o_feet" 
ORDER BY 1, 2
LIMIT 6
```

Results:

| location     | time                     | water_level |
| :----------- | :----------------------- | ----------- |
| coyote_creek | 2019-08-28T14:30:00.000Z | -0.61       |
| coyote_creek | 2019-08-29T15:18:00.000Z | -0.594      |
| coyote_creek | 2019-08-28T14:36:00.000Z | -0.591      |
| coyote_creek | 2019-08-28T14:24:00.000Z | -0.587      |
| coyote_creek | 2019-08-29T15:24:00.000Z | -0.571      |
| coyote_creek | 2019-08-27T13:42:00.000Z | -0.561      |

The query returns the first 6 rows in the `h2o_feet` measurement by `water_level` and `location`.

