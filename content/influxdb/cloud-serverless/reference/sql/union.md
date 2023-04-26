---
title: UNION clause
description: > 
  The `UNION` clause combines the results of two or more `SELECT` statements into
  a single result set.
menu:
  influxdb_cloud_serverless:
    name: UNION clause
    parent: SQL reference
weight: 206
---

The `UNION` clause combines the results of two or more `SELECT` statements into
a single result set.
By default, `UNION` only keeps unique rows.
To keep all rows, including duplicates, use `UNION ALL`.

- [Syntax](#syntax)
- [Examples](#examples)

**When using the `UNION` clause**:

- The number of columns in each result set must be the same.
- Columns must be in the same order and of the same or compatible data types.

## Syntax

```sql
SELECT expression[,...n]
FROM measurement_1
UNION [ALL]
SELECT expression[,...n]
FROM measurement_2
```

## Examples

- [Union results from different measurements](#union-results-from-different-measurements)
- [Return the highest and lowest three results in a single result set](#return-the-highest-and-lowest-three-results-in-a-single-result-set)
- [Union query results with custom data](#union-query-results-with-custom-data)

### Union results from different measurements

```sql
(
  SELECT
    'h2o_pH' AS measurement,
    time,
    "pH" AS "water_pH"
  FROM "h2o_pH"
  LIMIT 4
)
UNION
(
  SELECT
    'h2o_quality' AS measurement,
    time,
    index
  FROM h2o_quality
  LIMIT 4
)
```
{{< expand-wrapper >}}
{{% expand "View example results" %}}

| measurement | time                 | water_pH |
| :---------- | :------------------- | -------: |
| h2o_pH      | 2019-08-27T00:12:00Z |        7 |
| h2o_pH      | 2019-08-27T00:18:00Z |        8 |
| h2o_quality | 2019-09-11T01:06:00Z |       89 |
| h2o_pH      | 2019-08-27T00:06:00Z |        7 |
| h2o_quality | 2019-09-11T00:00:00Z |       26 |
| h2o_quality | 2019-09-11T01:00:00Z |       19 |
| h2o_quality | 2019-09-11T00:48:00Z |       65 |
| h2o_pH      | 2019-08-27T00:00:00Z |        8 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return the highest and lowest three results in a single result set

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
(
  SELECT
    'low' as type,
    time,
    co
  FROM home
  ORDER BY co ASC
  LIMIT 3
)
UNION 
(
  SELECT
    'high' as type,
    time,
    co
  FROM home
  ORDER BY co DESC
  LIMIT 3
)
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

| type | time                 |  co |
| :--- | :------------------- | --: |
| high | 2022-01-01T20:00:00Z |  26 |
| high | 2022-01-01T19:00:00Z |  22 |
| high | 2022-01-01T18:00:00Z |  18 |
| low  | 2022-01-01T14:00:00Z |   0 |
| low  | 2022-01-01T10:00:00Z |   0 |
| low  | 2022-01-01T08:00:00Z |   0 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Union query results with custom data

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol).
It also uses the [table value constructor](/influxdb/cloud-serverless/reference/sql/table-value-constructor/)
to build a table with custom data._

```sql
SELECT *
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
UNION
SELECT * FROM
  (VALUES (0, 34.2, 'Bedroom', 21.1, '2022-01-01T08:00:00Z'::TIMESTAMP),
          (0, 34.5, 'Bedroom', 21.2, '2022-01-01T09:00:00Z'::TIMESTAMP),
          (0, 34.6, 'Bedroom', 21.5, '2022-01-01T10:00:00Z'::TIMESTAMP),
          (0, 34.5, 'Bedroom', 21.8, '2022-01-01T11:00:00Z'::TIMESTAMP),
          (0, 33.9, 'Bedroom', 22.0, '2022-01-01T12:00:00Z'::TIMESTAMP)
  ) newRoom(co, hum, room, temp, time)
ORDER BY room, time
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   0 | 34.2 | Bedroom     | 21.1 | 2022-01-01T08:00:00Z |
|   0 | 34.5 | Bedroom     | 21.2 | 2022-01-01T09:00:00Z |
|   0 | 34.6 | Bedroom     | 21.5 | 2022-01-01T10:00:00Z |
|   0 | 34.5 | Bedroom     | 21.8 | 2022-01-01T11:00:00Z |
|   0 | 33.9 | Bedroom     |   22 | 2022-01-01T12:00:00Z |
|   0 | 35.9 | Kitchen     |   21 | 2022-01-01T08:00:00Z |
|   0 | 36.2 | Kitchen     |   23 | 2022-01-01T09:00:00Z |
|   0 | 36.1 | Kitchen     | 22.7 | 2022-01-01T10:00:00Z |
|   0 |   36 | Kitchen     | 22.4 | 2022-01-01T11:00:00Z |
|   0 |   36 | Kitchen     | 22.5 | 2022-01-01T12:00:00Z |
|   0 | 35.9 | Living Room | 21.1 | 2022-01-01T08:00:00Z |
|   0 | 35.9 | Living Room | 21.4 | 2022-01-01T09:00:00Z |
|   0 |   36 | Living Room | 21.8 | 2022-01-01T10:00:00Z |
|   0 |   36 | Living Room | 22.2 | 2022-01-01T11:00:00Z |
|   0 | 35.9 | Living Room | 22.2 | 2022-01-01T12:00:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}
