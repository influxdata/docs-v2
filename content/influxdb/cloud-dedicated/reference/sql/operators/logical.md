---
title: SQL logical operators
list_title: Logical operators
description: >
  Logical operators combine or manipulate conditions in a SQL query.
menu:
  influxdb_cloud_dedicated:
    name: Logical operators
    parent: Operators
weight: 303
related:
  - /influxdb/cloud-dedicated/reference/sql/subqueries/#subquery-operators, Subquery operators
list_code_example: |
  | Operator  | Meaning                                                                    |
  | :-------: | :------------------------------------------------------------------------- |
  |   `AND`   | Returns true if both operands are true. Otherwise, returns false.          |
  | `BETWEEN` | Returns true if the left operand is within the range of the right operand. |
  | `EXISTS`  | Returns true if the results of a subquery are not empty.                   |
  |   `IN`    | Returns true if the left operand is in the right operand list.             |
  |  `LIKE`   | Returns true if the left operand matches the right operand pattern string. |
  |   `NOT`   | Negates the subsequent expression.                                         |
  |   `OR`    | Returns true if any operand is true. Otherwise, returns false.             |
---

Logical operators combine or manipulate conditions in a SQL query.

- [AND](#and)
- [BETWEEN](#between)
- [EXISTS](#exists)
- [IN](#in)
- [LIKE](#like)
- [NOT](#not)
- [OR](#or)

## AND {.monospace}

The `AND` operand returns `true` if both operands are `true`. Otherwise, it returns false.
This operator is typically used in the [`WHERE` clause](/influxdb/cloud-dedicated/reference/sql/where/)
to combine multiple conditions.

```sql
SELECT *
FROM home
WHERE
  co > 10
  AND room = 'Kitchen'
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room    | temp | time                 |
| --: | ---: | :------ | ---: | :------------------- |
|  18 | 36.9 | Kitchen | 23.3 | 2022-01-01T18:00:00Z |
|  22 | 36.6 | Kitchen | 23.1 | 2022-01-01T19:00:00Z |
|  26 | 36.5 | Kitchen | 22.7 | 2022-01-01T20:00:00Z |

{{% /influxdb/custom-timestamps %}}

## BETWEEN {.monospace}

The `BETWEEN` operator returns `true` if the left operand is within the range
specified in the right operand. Otherwise, it returns `false`

```sql
SELECT *
FROM home
WHERE
  co BETWEEN 5 AND 10
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   7 |   36 | Kitchen     | 22.4 | 2022-01-01T16:00:00Z |
|   9 |   36 | Kitchen     | 22.7 | 2022-01-01T17:00:00Z |
|   5 | 35.9 | Living Room | 22.6 | 2022-01-01T17:00:00Z |
|   9 | 36.2 | Living Room | 22.8 | 2022-01-01T18:00:00Z |

{{% /influxdb/custom-timestamps %}}

## EXISTS {.monospace}

The `EXISTS` operator returns `true` if result of a
[correlated subquery](/influxdb/cloud-dedicated/reference/sql/subqueries/#correlated-subqueries)
is not empty. Otherwise it returns `false`.

_See [SQL subquery operators](/influxdb/cloud-dedicated/reference/sql/subqueries/#subquery-operators)._

```sql
SELECT *
FROM
  home home_actions
WHERE EXISTS (
  SELECT
    *
  FROM
    home
  WHERE
    home.co = home_actions.co - 1
)
ORDER BY time
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   1 | 36.5 | Kitchen     | 22.8 | 2022-01-01T13:00:00Z |
|   1 | 36.3 | Kitchen     | 22.8 | 2022-01-01T14:00:00Z |
|   1 | 36.1 | Living Room | 22.3 | 2022-01-01T15:00:00Z |
|   4 |   36 | Living Room | 22.4 | 2022-01-01T16:00:00Z |
|   5 | 35.9 | Living Room | 22.6 | 2022-01-01T17:00:00Z |
|  18 | 36.9 | Kitchen     | 23.3 | 2022-01-01T18:00:00Z |

{{% /influxdb/custom-timestamps %}}

## IN {.monospace}

The `IN` operator returns `true` if the left operand is in the right operand
list or subquery result. Otherwise, it returns `false`.

_See [SQL subquery operators](/influxdb/cloud-dedicated/reference/sql/subqueries/#subquery-operators)._

```sql
SELECT *
FROM home
WHERE
  room IN ('Bathroom', 'Bedroom', 'Kitchen')
LIMIT 4
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room    | temp | time                 |
| --: | ---: | :------ | ---: | :------------------- |
|   0 | 35.9 | Kitchen |   21 | 2022-01-01T08:00:00Z |
|   0 | 36.2 | Kitchen |   23 | 2022-01-01T09:00:00Z |
|   0 | 36.1 | Kitchen | 22.7 | 2022-01-01T10:00:00Z |
|   0 |   36 | Kitchen | 22.4 | 2022-01-01T11:00:00Z |

{{% /influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room IN (
    SELECT DISTINCT room
    FROM home_actions
  )
ORDER BY time
LIMIT 4
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   0 | 35.9 | Living Room | 21.1 | 2022-01-01T08:00:00Z |
|   0 | 35.9 | Kitchen     |   21 | 2022-01-01T08:00:00Z |
|   0 | 35.9 | Living Room | 21.4 | 2022-01-01T09:00:00Z |
|   0 | 36.2 | Kitchen     |   23 | 2022-01-01T09:00:00Z |

{{% /influxdb/custom-timestamps %}}

## LIKE {.monospace}

The `LIKE` operator returns `true` if the left operand matches the string pattern
specified in the right operand.
`LIKE` expressions support [SQL wildcard characters](#sql-wildcard-characters).

```sql
SELECT *
FROM home
WHERE
  room LIKE '%Room'
LIMIT 4
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   0 | 35.9 | Living Room | 21.1 | 2022-01-01T08:00:00Z |
|   0 | 35.9 | Living Room | 21.4 | 2022-01-01T09:00:00Z |
|   0 |   36 | Living Room | 21.8 | 2022-01-01T10:00:00Z |
|   0 |   36 | Living Room | 22.2 | 2022-01-01T11:00:00Z |

{{% /influxdb/custom-timestamps %}}



### SQL wildcard characters

The InfluxDB SQL implementation supports the following wildcard characters when
using the `LIKE` operator to match strings to a pattern.

| Character | Description                        |
| :-------: | :--------------------------------- |
|    `%`    | Represents zero or more characters |
|    `_`    | Represents any single character    |

## NOT {.monospace}

The `NOT` operator negates the subsequent expression.

## OR {.monospace}

The `OR` operator returns `true` if any operand is `true`.
Otherwise, it returns `false`.
This operator is typically used in the [`WHERE` clause](/influxdb/cloud-dedicated/reference/sql/where/)
to combine multiple conditions.

```sql
SELECT *
FROM home
WHERE
  co > 20
  OR temp > 23
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room    | temp | time                 |
| --: | ---: | :------ | ---: | :------------------- |
|  18 | 36.9 | Kitchen | 23.3 | 2022-01-01T18:00:00Z |
|  22 | 36.6 | Kitchen | 23.1 | 2022-01-01T19:00:00Z |
|  26 | 36.5 | Kitchen | 22.7 | 2022-01-01T20:00:00Z |

{{% /influxdb/custom-timestamps %}}
