---
title: UNION clause
description: > 
    Use the `UNION` clause to combine the results of two or more queries into a single set of results.
menu:
  influxdb_cloud_iox:
    name: UNION clause
    parent: Explore data using SQL
weight: 295
---

The `UNION` clause combines the results of two or more `SELECT` statements into a single result set.

**Note when using the `UNION` clause**:

- The number of columns in each result set must be the same
- Columns must be in the same order
- Columns must be the same or compatible data types

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT
  a,
  b,
  c
FROM
  measurement_1
UNION [ALL]
SELECT
  a,
  b,
  c
FROM
  measurement_2
``` 

## Examples

### Union results from different measurements

```sql
SELECT "pH" as "water_pH", "time", "location"
FROM "h2o_pH"
UNION 
SELECT "location", "time", "randtag" 
FROM "h2o_quality"
```
Results:

| location     | time                     | water_ph |
| :----------- | :----------------------- | :------- |
| coyote_creek | 2019-08-21T00:00:00.000Z | 8.0      |
| coyote_creek | 2019-08-21T00:18:00.000Z | 7.0      |
| coyote_creek | 2019-08-21T00:42:00.000Z | 8.0      |

The query returns the location, time and pH from the 2 tables.

### Return the top and bottom three results in a single result set

```sql
SELECT 'bottom' as type, time, water_level FROM
  (SELECT time, "water_level", row_number() OVER (order by water_level) as rn FROM h2o_feet) where rn <= 3 
UNION ALL 
SELECT 'top' as type, time, water_level FROM 
  (SELECT time, "water_level", row_number() OVER (order by water_level DESC) as rn FROM h2o_feet) where rn <= 3
  ```
{{< expand-wrapper >}}
{{% expand "View example results" %}}
| time                     | type   | water_level |
| :----------------------- | :----- | ----------- |
| 2019-08-28T07:24:00.000Z | top    | 9.964       |
| 2019-08-28T07:18:00.000Z | top    | 9.957       |
| 2019-08-28T07:30:00.000Z | top    | 9.954       |
| 2019-08-28T14:30:00.000Z | bottom | -0.61       |
| 2019-08-29T15:18:00.000Z | bottom | -0.594      |
| 2019-08-28T14:36:00.000Z | bottom | -0.591      |
{{% /expand %}}
{{< /expand-wrapper >}}
