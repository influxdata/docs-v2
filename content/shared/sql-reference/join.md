Use the `JOIN` clause to join data from different tables together based on
logical relationships.

- [Syntax](#syntax)
- [Join types](#join-types)
  - [INNER JOIN](#inner-join)
  - [LEFT [OUTER] JOIN](#left-outer-join)
  - [RIGHT [OUTER] JOIN](#right-outer-join)
  - [FULL [OUTER] JOIN](#full-outer-join)
- [Troubleshoot joins](#troubleshoot-joins)

## Syntax

```sql
SELECT_clause
FROM <left_join_items>
[INNER | LEFT [OUTER] | RIGHT [OUTER] | FULL [OUTER]] JOIN <right_join_items>
ON <join_condition>
[WHERE_clause]
[GROUP_BY_clause]
[HAVING_clause]
[ORDER_BY_clause]
```

### Arguments

- **left_join_items**: One or more tables specified in the `FROM` clause that
  represent the left side of the join.
- **right_join_items**: One or more tables specified in the `JOIN` clause that
  represent the right side of the join.
- **join_condition**: A predicate expression in the `ON` clause that uses the
  `=` (equal to) comparison operator to compare column values from the left side
  of the join to column values on the right side of the join. Rows with values
  that match the defined predicate are joined using the specified
  [join type](#join-types).

<!-- Link anchor for fully-qualified references -->
<div id="fully-qualified-reference"></div>

> [!Note]
> If both sides of the join include columns with the same name, you need to
> use the fully-qualified reference to prevent ambiguity.
> A _fully-qualified reference_ uses dot notation to reference both the table name
> and the column name--for example: `table_name.column_name`

## Join types

The following joins types are supported:

{{< flex >}}
{{< flex-content "quarter" >}}
  <a href="#inner-join">
    <p style="text-align:center"><strong>INNER JOIN</strong></p>
    {{< svg svg="static/svgs/join-diagram.svg" class="inner small center" >}}
  </a>
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <a href="#left-outer-join">
    <p style="text-align:center"><strong>LEFT [OUTER] JOIN</strong></p>
    {{< svg svg="static/svgs/join-diagram.svg" class="left small center" >}}
  </a>
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <a href="#right-outer-join">
    <p style="text-align:center"><strong>RIGHT [OUTER] JOIN</strong></p>
    {{< svg svg="static/svgs/join-diagram.svg" class="right small center" >}}
  </a>
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <a href="#full-outer-join">
    <p style="text-align:center"><strong>FULL [OUTER] JOIN</strong></p>
    {{< svg svg="static/svgs/join-diagram.svg" class="full small center" >}}
  </a>  
{{< /flex-content >}}
{{< /flex >}}

#### Join sample tables

The examples below illustrate join methods using the following tables:

{{% influxdb/custom-timestamps %}}

##### prod_line

| time                 | station | produced |
| :------------------- | :-----: | -------: |
| 2022-01-01T08:00:00Z |   B1    |       26 |
| 2022-01-01T09:00:00Z |   B1    |       54 |
| 2022-01-01T10:00:00Z |   B1    |       56 |
| 2022-01-01T11:00:00Z |   B1    |          |
| 2022-01-01T12:00:00Z |   B1    |       82 |

##### errors

| time                 | station | level | message              |
| :------------------- | :-----: | :---: | :------------------- |
| 2022-01-01T10:00:00Z |   B1    | warn  | Maintenance required |
| 2022-01-01T11:00:00Z |   B1    | crit  | Station offline      |

{{% /influxdb/custom-timestamps %}}

### INNER JOIN

Inner joins combine rows from tables on the left and right side of the join
based on common column values defined in the `ON` clause. Rows that don't have
matching column values are not included in the output table.

{{% influxdb/custom-timestamps %}}

#### Inner join example

{{% caption %}}[View sample tables](#join-sample-tables){{% /caption %}}

```sql
SELECT
  *
FROM
  prod_line
RIGHT JOIN errors ON
  prod_line.time = errors.time
  AND prod_line.station = errors.station
ORDER BY
  prod_line.time
```
##### Inner join results

| time                 | station | produced | time                 | station | level | message              |
| :------------------- | :-----: | -------: | :------------------- | :-----: | :---: | :------------------- |
| 2022-01-01T10:00:00Z |   B1    |       56 | 2022-01-01T10:00:00Z |   B1    | warn  | Maintenance required |
| 2022-01-01T11:00:00Z |   B1    |          | 2022-01-01T11:00:00Z |   B1    | crit  | Station offline      |

{{% /influxdb/custom-timestamps %}}

### LEFT [OUTER] JOIN

A left outer join returns all rows from the left side of the join and only
returns data from the right side of the join in rows with matching column values
defined in the `ON` clause.

{{% influxdb/custom-timestamps %}}

#### Left outer join example

{{% caption %}}[View sample tables](#join-sample-tables){{% /caption %}}

```sql
SELECT
  *
FROM
  prod_line
LEFT JOIN errors ON
  prod_line.time = errors.time
  AND prod_line.station = errors.station
ORDER BY
  prod_line.time
```

##### Left outer join results

| time                 | station | produced | time                 | station | level | message              |
| -------------------- | ------- | -------- | -------------------- | ------- | ----- | -------------------- |
| 2022-01-01T08:00:00Z | B1      | 26       |                      |         |       |                      |
| 2022-01-01T09:00:00Z | B1      | 54       |                      |         |       |                      |
| 2022-01-01T10:00:00Z | B1      | 56       | 2022-01-01T10:00:00Z | B1      | warn  | Maintenance required |
| 2022-01-01T11:00:00Z | B1      |          | 2022-01-01T11:00:00Z | B1      | crit  | Station offline      |
| 2022-01-01T12:00:00Z | B1      | 82       |                      |         |       |                      |

{{% /influxdb/custom-timestamps %}}


### RIGHT [OUTER] JOIN

A right outer join returns all rows from the right side of the join and only
returns data from the left side of the join in rows with matching column values
defined in the `ON` clause.

{{% influxdb/custom-timestamps %}}

#### Right outer join example

{{% caption %}}[View sample tables](#join-sample-tables){{% /caption %}}

```sql
SELECT
  *
FROM
  prod_line
RIGHT JOIN errors ON
  prod_line.time = errors.time
  AND prod_line.station = errors.station
ORDER BY
  prod_line.time
```

##### Right outer join results

| time                 | station | produced | time                 | station | level | message              |
| :------------------- | :-----: | -------: | :------------------- | :-----: | :---: | :------------------- |
| 2022-01-01T10:00:00Z |   B1    |       56 | 2022-01-01T10:00:00Z |   B1    | warn  | Maintenance required |
| 2022-01-01T11:00:00Z |   B1    |          | 2022-01-01T11:00:00Z |   B1    | crit  | Station offline      |

{{% /influxdb/custom-timestamps %}}

### FULL [OUTER] JOIN

A full outer join returns all data from the left and right sides of the join and
combines rows with matching column values defined in the `ON` clause.
Data that is not available on each respective side of the join is NULL.

{{% influxdb/custom-timestamps %}}

#### Full outer join example

{{% caption %}}[View sample tables](#join-sample-tables){{% /caption %}}

```sql
SELECT
  *
FROM
  prod_line
FULL JOIN errors ON
  prod_line.time = errors.time
  AND prod_line.station = errors.station
ORDER BY
  time
```

##### Full outer join results

| time                 | station | produced | time                 | station | level | message              |
| -------------------- | ------- | -------- | -------------------- | ------- | ----- | -------------------- |
| 2022-01-01T08:00:00Z | B1      | 26       |                      |         |       |                      |
| 2022-01-01T09:00:00Z | B1      | 54       |                      |         |       |                      |
| 2022-01-01T10:00:00Z | B1      | 56       | 2022-01-01T10:00:00Z | B1      | warn  | Maintenance required |
| 2022-01-01T11:00:00Z | B1      |          | 2022-01-01T11:00:00Z | B1      | crit  | Station offline      |
| 2022-01-01T12:00:00Z | B1      | 82       |                      |         |       |                      |

{{% /influxdb/custom-timestamps %}}

## Troubleshoot joins

### Ambiguous reference to unqualified field

If a column exists on both sides of the join and is used in in the `SELECT`,
`ON`, `WHERE`, `HAVING`, `GROUP BY`, or `ORDER BY` clause, you must use a
[fully-qualified reference](#fully-qualified-reference). For example, if both 
sides of the join have a `time` column and you want to explicitly select a
time column, you must specifiy which side of the join to use the time column from:

{{% code-callout "prod_line.time" "green" %}}
```
SELECT
  prod_line.time,
  produced,
  message,
FROM
  prod_line
INNER JOIN errors ON
  -- ...
```
{{% /code-callout %}}
