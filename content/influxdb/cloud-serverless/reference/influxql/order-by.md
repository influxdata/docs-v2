---
title: ORDER BY clause
list_title: ORDER BY clause
description: >
  Use the `ORDER BY` clause to sort data by time in ascending or descending order.
menu:
  influxdb_cloud_serverless:
    name: ORDER BY clause
    identifier: influxql-order-by
    parent: influxql-reference
weight: 204
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] ORDER BY time [DESC|ASC]
  ```
---

Use the `ORDER BY` clause to sort data by time in ascending or descending order.
InfluxQL only supports sorting data by `time`.

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] ORDER BY time [ASC|DESC]
```

- If the the `ORDER BY` clause is not included, the default behavior is to sort data by
  time in **ascending** order: `ORDER BY time ASC`.
- If the query includes [`WHERE`](/influxdb/cloud-serverless/reference/influxql/where/)
  and [`GROUP BY`](/influxdb/cloud-serverless/reference/influxql/group-by/) clauses,
  the `ORDER BY` clause must come **after** these clauses.

#### Sort orders

- **ASC (ascending)**: The first row in the results has the oldest timestamp.
  The last row in the results has the most recent timestamp.
- **DESC (descending)**: The first row in the results has the most recent timestamp.
  The last row in the results has the oldest timestamp.

## Examples

The following examples use the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

{{< expand-wrapper >}}

{{% expand "Sort data with the oldest points first" %}}

{{% note %}}
Ordering data by time in ascending order is the default behavior.
Including `ORDER BY time ASC` in the query isn't necessary, but it is supported.
{{% /note %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
ORDER BY time ASC
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Sort data with the newest points first" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
ORDER BY time DESC
```

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T12:00:00Z |   0 |   36 | Kitchen | 22.5 |
| 2022-01-01T11:00:00Z |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen |   21 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{< /expand-wrapper >}}
