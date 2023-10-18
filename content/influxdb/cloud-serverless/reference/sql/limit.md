---
title: LIMIT clause
description: > 
    Use the `LIMIT` clause to limit the number of results returned by a query.
menu:
  influxdb_cloud_serverless:
    name: LIMIT clause
    parent: SQL reference
weight: 206
---

The `LIMIT` clause limits the number of rows returned by a query to a specified non-negative integer.

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
```

## Examples

### Limit results to a maximum of five rows

```sql
SELECT
  "water_level","location", "time"
FROM
  "h2o_feet" 
LIMIT
  5
```
{{< expand-wrapper >}}
{{% expand "View example results" %}}
The query returns a maximum of 5 results.

| location     | time                     | water_level |
| :----------- | :----------------------- | ----------- |
| coyote_creek | 2019-08-28T00:00:00.000Z | 4.206       |
| coyote_creek | 2019-08-28T00:06:00.000Z | 4.052       |
| coyote_creek | 2019-08-28T00:12:00.000Z | 3.901       |
| coyote_creek | 2019-08-28T00:18:00.000Z | 3.773       |
| coyote_creek | 2019-08-28T00:24:00.000Z | 3.632       |
{{% /expand %}}
{{< /expand-wrapper >}}

### Sort and limit results

Use the `ORDER BY` and `LIMIT` clauses to first sort results by specified columns,
then limit the sorted results by a specified number.

```sql
SELECT
  "water_level", "location", "time"
FROM
  "h2o_feet" 
ORDER BY
  "water_level" DESC
LIMIT
  3
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
The query returns the highest 3 `water_level` readings in the `h2o_feet` measurement.

| location     | time                     | water_level |
| :----------- | :----------------------- | ----------- |
| coyote_creek | 2019-08-27T13:42:00.000Z | -0.561      |
| coyote_creek | 2019-08-29T15:24:00.000Z | -0.571      |
| coyote_creek | 2019-08-28T14:24:00.000Z | -0.587      |
{{% /expand %}}
{{< /expand-wrapper >}}

