---
title: GROUP BY clause
description: > 
    Use the `GROUP BY` clause to group query data by column values.
menu:
  influxdb_cloud_iox:
    name: GROUP BY clause
    parent: SQL reference
weight: 203
---

Use the `GROUP BY` clause to group data by column values.
`GROUP BY` requires an aggregate or selector function in the `SELECT` statement.

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT
  AGGREGATE_FN(field1),
  tag1
FROM measurement
GROUP BY tag1
```

## Examples

### Group data by a tag values

```sql
SELECT
  AVG("water_level") AS "avg_water_level",
  "location"
FROM "h2o_feet" 
GROUP BY "location"
```

{{< expand-wrapper >}}}
{{% expand "View example results" %}}

|   avg_water_level | location     |
| ----------------: | ------------ |
| 5.359142420303919 | coyote_creek |
| 3.530712094245885 | santa_monica |

{{% /expand %}}
{{< /expand-wrapper >}}

Group results in 15 minute time intervals by tag:

```sql
SELECT
  "location",
  DATE_BIN(INTERVAL '15 minutes', time, TIMESTAMP '2022-01-01 00:00:00Z') AS time,
  COUNT("water_level")  AS count
FROM "h2o_feet"
WHERE 
  time >= timestamp '2019-09-17T00:00:00Z'
  AND time <= timestamp '2019-09-17T01:00:00Z'
GROUP BY
  time,
  location
ORDER BY
  location,
  time
```

{{< expand-wrapper >}}}
{{% expand "View example results" %}}

The query uses the `COUNT()` function to count the number of `water_level` points per 15 minute interval.
Results are then ordered by location and time.

| location     | time                 | count |
| :----------- | :------------------- | ----: |
| coyote_creek | 2019-09-16T23:45:00Z |     1 |
| coyote_creek | 2019-09-17T00:00:00Z |     2 |
| coyote_creek | 2019-09-17T00:15:00Z |     3 |
| coyote_creek | 2019-09-17T00:30:00Z |     2 |
| coyote_creek | 2019-09-17T00:45:00Z |     3 |
| santa_monica | 2019-09-16T23:45:00Z |     1 |
| santa_monica | 2019-09-17T00:00:00Z |     2 |
| santa_monica | 2019-09-17T00:15:00Z |     3 |
| santa_monica | 2019-09-17T00:30:00Z |     2 |
| santa_monica | 2019-09-17T00:45:00Z |     3 |

{{% /expand %}}
{{< /expand-wrapper >}}
