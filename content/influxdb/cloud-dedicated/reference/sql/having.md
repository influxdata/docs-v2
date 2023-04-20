---
title: HAVING clause
description: > 
    Use the `HAVING` clause to filter query results based on values returned from
    an aggregate operation.
menu:
  influxdb_cloud_dedicated:
    name: HAVING clause
    parent: SQL reference
weight: 205
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

## Examples

### Return rows with an aggregate value greater than a specified number

```sql
SELECT
  MEAN("water_level") AS "mean_water_level", "location"
FROM
  "h2o_feet" 
GROUP BY
  "location"
HAVING
  "mean_water_level" > 5
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
The query returns on rows with values in the `mean_water_level` greater than 5 _after_ the aggregate operation.

| location     | mean_water_level  |
| :----------- | :---------------- |
| coyote_creek | 5.359142420303919 |
{{% /expand %}}
{{< /expand-wrapper >}}

### Return the average result greater than a specified number from a specific time range

```sql
SELECT 
  AVG("water_level") AS "avg_water_level", 
  "time" 
FROM 
  "h2o_feet" 
WHERE 
  time >= '2019-09-01T00:00:00Z' AND time <= '2019-09-02T00:00:00Z' 
GROUP BY 
  "time" 
HAVING 
  "avg_water_level" > 6.82 
ORDER BY 
  "time"
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query calculates the average water level per time and only returns rows with an average greater than 6.82 during the specified time range.

| time                 |    avg_water_level |
| :------------------- | -----------------: |
| 2019-09-01T22:06:00Z |             6.8225 |
| 2019-09-01T22:12:00Z | 6.8405000000000005 |
| 2019-09-01T22:30:00Z |             6.8505 |
| 2019-09-01T22:36:00Z |             6.8325 |
{{% /expand %}}
{{< /expand-wrapper >}}