Logical operators combine or manipulate conditions in a SQL query.

| Operator  | Meaning                                                                    |                                 |
| :-------: | :------------------------------------------------------------------------- | :------------------------------ |
|   `AND`   | Returns true if both operands are true. Otherwise, returns false.          | [{{< icon "link" >}}](#and)     |
| `BETWEEN` | Returns true if the left operand is within the range of the right operand. | [{{< icon "link" >}}](#between) |
| `EXISTS`  | Returns true if the results of a subquery are not empty.                   | [{{< icon "link" >}}](#exists)  |
|   `IN`    | Returns true if the left operand is in the right operand list.             | [{{< icon "link" >}}](#in)      |
|  `LIKE`   | Returns true if the left operand matches the right operand pattern string. | [{{< icon "link" >}}](#like)    |
|   `NOT`   | Negates the subsequent expression.                                         | [{{< icon "link" >}}](#not)     |
|   `OR`    | Returns true if any operand is true. Otherwise, returns false.             | [{{< icon "link" >}}](#or)      |

{{% note %}}
#### Sample data

Query examples on this page use the following sample data sets:

- [Get started home sensor sample data](/influxdb/version/reference/sample-data/#get-started-home-sensor-data)
- [Home sensor actions sample data](/influxdb/version/reference/sample-data/#home-sensor-actions-data)
{{% /note %}}

## AND {.monospace}

The `AND` operand returns `true` if both operands are `true`. Otherwise, it returns false.
This operator is typically used in the [`WHERE` clause](/influxdb/version/reference/sql/where/)
to combine multiple conditions.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT true AND false AS "AND condition"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| AND condition |
| :------------ |
| false         |

{{% /flex-content %}}
{{< /flex >}}

##### Examples

{{< expand-wrapper >}}
{{% expand "`AND` operator in the `WHERE` clause" %}}

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
{{% /expand %}}
{{< /expand-wrapper >}}

## BETWEEN {.monospace}

The `BETWEEN` operator returns `true` if the left numeric operand is within the
range specified in the right operand. Otherwise, it returns `false`

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 6 BETWEEN 5 AND 8 AS "BETWEEN condition"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| BETWEEN condition |
| :---------------- |
| true              |

{{% /flex-content %}}
{{< /flex >}}

##### Examples

{{< expand-wrapper >}}
{{% expand "`BETWEEN` operator in the `WHERE` clause" %}}

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
{{% /expand %}}
{{< /expand-wrapper >}}

## EXISTS {.monospace}

The `EXISTS` operator returns `true` if result of a
[correlated subquery](/influxdb/version/reference/sql/subqueries/#correlated-subqueries)
is not empty. Otherwise it returns `false`.

_See [SQL subquery operators](/influxdb/version/reference/sql/subqueries/#subquery-operators)._

##### Examples

{{< expand-wrapper >}}
{{% expand "`EXISTS` operator with a subquery in the `WHERE` clause" %}}

```sql
SELECT *
FROM
  home home_actions
WHERE EXISTS (
  SELECT *
  FROM home
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
{{% /expand %}}
{{< /expand-wrapper >}}

## IN {.monospace}

The `IN` operator returns `true` if the left operand is in the right operand
list or subquery result. Otherwise, it returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'John' IN ('Jane', 'John') AS "IN condition"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| IN condition |
| :----------- |
| true         |

{{% /flex-content %}}
{{< /flex >}}

_See [SQL subquery operators](/influxdb/version/reference/sql/subqueries/#subquery-operators)._

##### Examples

{{< expand-wrapper >}}
{{% expand "`IN` operator with a list in the `WHERE` clause" %}}

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

{{% /expand %}}
{{% expand "`IN` operator with a subquery in the `WHERE` clause" %}}

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
{{% /expand %}}
{{< /expand-wrapper >}}

## LIKE {.monospace}

The `LIKE` operator returns `true` if the left operand matches the string pattern
specified in the right operand.
`LIKE` expressions support [SQL wildcard characters](#sql-wildcard-characters).

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'John' LIKE 'J_%n' AS "LIKE condition"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| LIKE condition |
| :------------- |
| true           |

{{% /flex-content %}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "`LIKE` operator in the `WHERE` clause" %}}

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
{{% /expand %}}
{{< /expand-wrapper >}}

### SQL wildcard characters

The InfluxDB SQL implementation supports the following wildcard characters when
using the `LIKE` operator to match strings to a pattern.

| Character | Description                        |
| :-------: | :--------------------------------- |
|    `%`    | Represents zero or more characters |
|    `_`    | Represents any single character    |

## NOT {.monospace}

The `NOT` operator negates the subsequent expression.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT NOT true AS "NOT condition"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| NOT condition |
| :------------ |
| false         |

{{% /flex-content %}}
{{< /flex >}}

##### Examples

{{< expand-wrapper >}}
{{% expand "`NOT IN`" %}}

```sql
SELECT *
FROM home
WHERE
  room NOT IN ('Kitchen', 'Bathroom')
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
{{% /expand %}}

{{% expand "`NOT EXISTS`" %}}

```sql
SELECT *
FROM
  home home_actions
WHERE NOT EXISTS (
  SELECT *
  FROM home
  WHERE
    home.co = home_actions.co + 4
)
ORDER BY time
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   7 |   36 | Kitchen     | 22.4 | 2022-01-01T16:00:00Z |
|   4 |   36 | Living Room | 22.4 | 2022-01-01T16:00:00Z |
|   9 |   36 | Kitchen     | 22.7 | 2022-01-01T17:00:00Z |
|   9 | 36.2 | Living Room | 22.8 | 2022-01-01T18:00:00Z |
|  17 | 36.4 | Living Room | 22.2 | 2022-01-01T20:00:00Z |
|  26 | 36.5 | Kitchen     | 22.7 | 2022-01-01T20:00:00Z |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "`NOT BETWEEN`" %}}

```sql
SELECT *
FROM home
WHERE
  co NOT BETWEEN 1 AND 22
  AND room = 'Kitchen'
```

{{% influxdb/custom-timestamps %}}

|  co |  hum | room    | temp | time                 |
| --: | ---: | :------ | ---: | :------------------- |
|   0 | 35.9 | Kitchen |   21 | 2022-01-01T08:00:00Z |
|   0 | 36.2 | Kitchen |   23 | 2022-01-01T09:00:00Z |
|   0 | 36.1 | Kitchen | 22.7 | 2022-01-01T10:00:00Z |
|   0 |   36 | Kitchen | 22.4 | 2022-01-01T11:00:00Z |
|   0 |   36 | Kitchen | 22.5 | 2022-01-01T12:00:00Z |
|  26 | 36.5 | Kitchen | 22.7 | 2022-01-01T20:00:00Z |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

## OR {.monospace}

The `OR` operator returns `true` if any operand is `true`.
Otherwise, it returns `false`.
This operator is typically used in the [`WHERE` clause](/influxdb/version/reference/sql/where/)
to combine multiple conditions.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT true OR false AS "OR condition"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| OR condition |
| :----------- |
| true         |

{{% /flex-content %}}
{{< /flex >}}

##### Examples

{{< expand-wrapper >}}
{{% expand "`OR` in the `WHERE` clause" %}}

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
{{% /expand %}}
{{< /expand-wrapper >}}
