---
title: The UNION clause
list_title: The UNION clause
description: > 
    Use the `UNION` clause to combine the results of two or more SELECT statements without returning any duplicate rows.
menu:
  influxdb_cloud_iox:
    name: The UNION clause
    parent: Explore data using SQL
weight: 295
---


- [Syntax](#syntax)
- [Examples](#examples)


### Syntax

SELECT
    a,
    b,
    c
FROM table1
UNION ALL
SELECT
    a,
    b,
    c
FROM table2

Note:
Union queries must have the same number of columns, (left is 1, right is 2)

### Exxamples

```sql
SELECT 'pH'
FROM "h2o_pH"
UNION ALL
SELECT "location"
FROM "h2o_quality"
```
 
Results:



```sql
select 'bottom' as type, time, water_level from 
  (select time, "water_level", row_number() OVER (order by water_level) as rn from h2o_feet) where rn <= 3 
UNION ALL 
select 'top' as type, time, water_level from 
  (select time, "water_level", row_number() OVER (order by water_level desc) as rn from h2o_feet) where rn <= 3;
  ```
Results:
| time                     | type   | water_level |
| :----------------------- | :----- | ----------- |
| 2019-08-28T07:24:00.000Z | top    | 9.964       |
| 2019-08-28T07:18:00.000Z | top    | 9.957       |
| 2019-08-28T07:30:00.000Z | top    | 9.954       |
| 2019-08-28T14:30:00.000Z | bottom | -0.61       |
| 2019-08-29T15:18:00.000Z | bottom | -0.594      |
| 2019-08-28T14:36:00.000Z | bottom | -0.591      |

