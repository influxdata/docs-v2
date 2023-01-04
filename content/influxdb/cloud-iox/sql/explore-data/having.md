---
title: The HAVING clause
list_title: The HAVING clause
description: > 
    Use the `HAVING` clause to filter query results based on a spcified condition.
menu:
  influxdb_cloud_iox:
    name: The HAVING clause
    parent: Explore data using SQL
weight: 250
---

The `HAVING` clause places conditions on results created by the GROUP BY clause.  The `HAVING` clause must follow the `GROUP BY` clause but precede the `ORDER BY` clause.

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

```sql
SELECT a, b, MEAN(c) 
FROM table 
GROUP BY a, b 
HAVING MAX(c) > 10
```

### Examples

```sql
SELECT MEAN("water_level"), "location", "time"
FROM "h2o_feet" 
GROUP BY "location","time"
HAVING MEAN("water_level") > 5.5
ORDER BY "time"
```

Results:

| AVG(h2o_feet.water_level) | location     | time                     |
| :------------------------ | :----------- | :----------------------- |
| 8.12                      | coyote_creek | 2019-08-17T00:00:00.000Z |
| 8.005                     | coyote_creek | 2019-08-17T00:06:00.000Z |
| 7.887                     | coyote_creek | 2019-08-17T00:12:00.000Z |
| 7.762                     | coyote_creek | 2019-08-17T00:18:00.000Z |



