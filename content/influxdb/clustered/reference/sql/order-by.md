---
title: ORDER BY clause
list_title: ORDER BY clause
description: > 
    Use the `ORDER BY` clause to sort results by specified columns and order.
menu:
  influxdb_clustered:
    name: ORDER BY clause
    parent: SQL reference
weight: 204
---

The `ORDER BY` clause sort results by specified columns and order.
Sort data based on fields, tags, and timestamps.
The following orders are supported:

- `ASC`: ascending _(default)_
- `DESC`: descending

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
[SELECT CLAUSE] [FROM CLAUSE] [ ORDER BY expression [ ASC | DESC ][, …] ]
```

{{% note %}}
**Note:** If your query includes a `GROUP BY` clause, the `ORDER BY` clause must appear **after** the `GROUP BY` clause.
{{% /note %}}

## Examples

### Sort data by time with the most recent first

```sql
SELECT
  "water_level", "time"
FROM
  "h2o_feet" 
WHERE
  "location" = 'coyote_creek'  
ORDER BY
  time DESC
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
| time                     | water_level |
| :----------------------- | :----------- |
| 2019-09-17T16:24:00.000Z | 3.235       |
| 2019-09-17T16:18:00.000Z | 3.314       |
| 2019-09-17T16:12:00.000Z | 3.402       |
| 2019-09-17T16:06:00.000Z | 3.497       |
| 2019-09-17T16:00:00.000Z | 3.599       |
| 2019-09-17T15:54:00.000Z | 3.704       |
{{% /expand %}}
{{< /expand-wrapper >}}

### Sort data by tag or field values

```sql
SELECT
  "water_level", "time", "location"
FROM
  "h2o_feet" 
ORDER BY
  "location", "water_level" DESC
```

### Sort data by selection order

```sql
SELECT
  "location","water_level", "time"
FROM
  "h2o_feet"
ORDER BY
  1, 2
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
The query sorts results the location of a column in the `SELECT` statement:
first by `location` (1), and second by `water_level` (2). 

| location     | time                     | water_level |
| :----------- | :----------------------- | :---------- |
| coyote_creek | 2019-08-28T14:30:00.000Z | -0.61       |
| coyote_creek | 2019-08-29T15:18:00.000Z | -0.594      |
| coyote_creek | 2019-08-28T14:36:00.000Z | -0.591      |
| coyote_creek | 2019-08-28T14:24:00.000Z | -0.587      |
| coyote_creek | 2019-08-29T15:24:00.000Z | -0.571      |
| coyote_creek | 2019-08-27T13:42:00.000Z | -0.561      |

{{% /expand %}}
{{< /expand-wrapper >}}
