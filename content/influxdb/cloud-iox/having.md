---
title: HAVING clause
description: > 
    Use the `HAVING` clause to filter query results based on a specified condition.
menu:
  influxdb_cloud_iox:
    name: HAVING clause
    parent: Explore data using SQL
weight: 250
---

The `HAVING` clause places conditions on results created by an aggregate operation on groups.
The `HAVING` clause must follow the `GROUP BY` clause and precede the `ORDER BY` clause.

{{% note %}}
The `WHERE` clause filters rows based on specified conditions _before_ the aggregate operation.
The `HAVING` clause filters rows based on specified conditions _after_ the aggregate operation has taken place.
{{% /note %}}

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [HAVING_clause] [ORDER_BY_clause] 
```

### Examples

Group results based on a specified function:

```sql
SELECT MEAN("water_level") AS "mean_water_level", "location", "time"
FROM "h2o_feet" 
GROUP BY "location","time"
HAVING MEAN("water_level") > 9.8
ORDER BY "time"
```
Results:

| location     | mean_water_level | time                     |
| :----------- | :--------------- | :----------------------- |
| coyote_creek | 9.816            | 2019-08-28T06:54:00.000Z |
| coyote_creek | 9.862            | 2019-08-28T07:00:00.000Z |
| coyote_creek | 9.902            | 2019-08-28T07:06:00.000Z |
| coyote_creek | 9.938            | 2019-08-28T07:12:00.000Z |
| coyote_creek | 9.957            | 2019-08-28T07:18:00.000Z |
| coyote_creek | 9.964            | 2019-08-28T07:24:00.000Z |

The query groups results from a `MEAN()` function having a water_level greater than 9.8 feet. This is a partial data set.

Return the average result group from a specified time period:

```sql
SELECT AVG("water_level") AS "average_water_level", "location", "time"
FROM "h2o_feet" 
WHERE time >= timestamp '2019-09-01T00:00:00Z' AND time <= timestamp '2019-09-02T00:00:00Z'
GROUP BY "location","time"
HAVING AVG("water_level") < 1.5
ORDER BY 1,2
```
Results:

 | average_water_level | location     | time                     |
 | :------------------ | :----------- | :----------------------- |
 | 0.65                | coyote_creek | 2019-09-01T05:24:00.000Z |
 | 0.656               | coyote_creek | 2019-09-01T05:30:00.000Z |
 | 0.676               | coyote_creek | 2019-09-01T05:36:00.000Z |
 | 0.679               | coyote_creek | 2019-09-01T05:18:00.000Z |
 | 0.741               | coyote_creek | 2019-09-01T05:42:00.000Z |
 | 0.745               | coyote_creek | 2019-09-01T05:12:00.000Z |
 | 0.84                | coyote_creek | 2019-09-01T05:48:00.000Z |
 | 0.846               | coyote_creek | 2019-09-01T05:06:00.000Z |

The query groups results having an average water level of less than 1.5 feet from a 24 hour time period. This is a partial data set.