---
title: SQL window functions
list_title: Window functions
description: >
  ....
menu:
  influxdb3_cloud_dedicated:
    name: Window
    parent: sql-functions
weight: 309
related:
  - /influxdb3/cloud-dedicated/query-data/sql/aggregate-select/

# source: /content/shared/sql-reference/functions/aggregate.md
---

A _window function_ performs an operation across a set of rows related to the
current row. This is similar to the type of operations
[aggregate functions](/influxdb3/cloud-dedicated/reference/sql/functions/aggregate/)
perform. However, window functions do not return a single output row per group
like non-window aggregate functions do. Instead, rows retain their separate
identities.

For example, the following query uses the {{< influxdb3/home-sample-link >}}
and returns each temperature reading with the average temperature per room over
the queried time range:

```sql
SELECT
  time,
  room,
  temp,
  avg(temp) OVER (PARTITION BY room) AS avg_room_temp
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
ORDER BY
  room,
  time
```

| time                | room        | temp | avg_room_temp |
| :------------------ | :---------- | ---: | ------------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |         22.32 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |         22.32 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |         22.32 |
| 2022-01-01T11:00:00 | Kitchen     | 22.4 |         22.32 |
| 2022-01-01T12:00:00 | Kitchen     | 22.5 |         22.32 |
| 2022-01-01T08:00:00 | Living Room | 21.1 |         21.74 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |         21.74 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |         21.74 |
| 2022-01-01T11:00:00 | Living Room | 22.2 |         21.74 |
| 2022-01-01T12:00:00 | Living Room | 22.2 |         21.74 |

## Window function syntax

```sql
function([expr])
  OVER(
    [PARTITION BY expr[, …]]
    [ORDER BY expr [ ASC | DESC ][, …]]
    [ frame_clause ]
    )
```

### OVER clause

Window functions use an `OVER` clause directly following the window function's
name and arguments. The `OVER` clause syntactically distinguishes a window
function from a normal function or non-window aggregate function and determines
how rows are split up for the window operation.

### PARTITION BY clause

The `PARTITION BY` clause in the `OVER` clause divides the rows into groups, or
partitions, that share the same values of the `PARTITION BY` expressions.
The window function operates on all the rows in the same partition as the
current row.

### ORDER BY clause

The `ORDER BY` clause inside of the `OVER` clause controls the order that the
window function processes rows in each partition.
When a window clause contains an `ORDER BY` clause, the window frame boundaries
may be explicit or implicit, limiting a window frame size in both directions
relative to the current row.

> [!Note]
> The `ORDER BY` clause in an `OVER` clause is separate from the `ORDER BY`
> clause of the query and only determines the order that rows in each partition
> are processed in.

### Frame clause

The frame clause defines window frame boundaries relative to the current row and
can be one of the following:

```sql
{ RANGE | ROWS | GROUPS } frame_start
{ RANGE | ROWS | GROUPS } BETWEEN frame_start AND frame_end
```

#### Frame units

##### RANGE

Defines frame boundaries using rows with distinct values for columns specified 
in the [`ORDER BY` clause](#order-by-clause) within a value range relative to
the current row value.

> [!Important]
> When using `RANGE` frame units, you must include an `ORDER BY` clause with
> _exactly one column_.

The offset is the difference the between the current row value and surrounding
row values. `RANGE` supports the following offset types:

- Numeric
- String
- Interval

##### ROWS

Defines frame boundaries using row positions relative to the current row.
The offset is the difference in row position from the current row.

##### GROUPS

Defines frame boundaries using row groups.
Rows with the same values for the columns in the [`ORDER BY` clause](#order-by-clause)
comprise a row group. The offset is the difference in row group position
relative to the the current row group.
When using `GROUPS` frame units, you must include an `ORDER BY` clause.

#### Frame boundaries

**frame_start** and **frame_end** can be one of the following:

```sql
UNBOUNDED PRECEDING
offset PRECEDING
CURRENT ROW
offset FOLLOWING
UNBOUNDED FOLLOWING
```

##### UNBOUNDED PRECEDING


##### offset PRECEDING

where **offset** is an non-negative integer.

##### CURRENT ROW



##### offset FOLLOWING

where **offset** is an non-negative integer.

##### UNBOUNDED FOLLOWING




```sql
SELECT depname, empno, salary,
  rank() OVER (PARTITION BY depname ORDER BY salary DESC)
FROM empsalary;

+-----------+-------+--------+--------+
| depname   | empno | salary | rank   |
+-----------+-------+--------+--------+
| personnel | 2     | 3900   | 1      |
| develop   | 8     | 6000   | 1      |
| develop   | 10    | 5200   | 2      |
| develop   | 11    | 5200   | 2      |
| develop   | 9     | 4500   | 4      |
| develop   | 7     | 4200   | 5      |
| sales     | 1     | 5000   | 1      |
| sales     | 4     | 4800   | 2      |
| personnel | 5     | 3500   | 2      |
| sales     | 3     | 4800   | 2      |
+-----------+-------+--------+--------+
```

There is another important concept associated with window functions: for each
row, there is a set of rows within its partition called its window frame. Some
window functions act only on the rows of the window frame, rather than of the
whole partition. Here is an example of using window frames in queries:

```sql
SELECT depname, empno, salary,
    avg(salary) OVER(ORDER BY salary ASC ROWS BETWEEN 1 PRECEDING AND 1
FOLLOWING) AS avg,
    min(salary) OVER(ORDER BY empno ASC ROWS BETWEEN UNBOUNDED PRECEDING AND
CURRENT ROW) AS cum_min
FROM empsalary
ORDER BY empno ASC;

+-----------+-------+--------+--------------------+---------+
| depname   | empno | salary | avg                | cum_min |
+-----------+-------+--------+--------------------+---------+
| sales     | 1     | 5000   | 5000.0             | 5000    |
| personnel | 2     | 3900   | 3866.6666666666665 | 3900    |
| sales     | 3     | 4800   | 4700.0             | 3900    |
| sales     | 4     | 4800   | 4866.666666666667  | 3900    |
| personnel | 5     | 3500   | 3700.0             | 3500    |
| develop   | 7     | 4200   | 4200.0             | 3500    |
| develop   | 8     | 6000   | 5600.0             | 3500    |
| develop   | 9     | 4500   | 4500.0             | 3500    |
| develop   | 10    | 5200   | 5133.333333333333  | 3500    |
| develop   | 11    | 5200   | 5466.666666666667  | 3500    |
+-----------+-------+--------+--------------------+---------+
```

When a query involves multiple window functions, it is possible to write out
each one with a separate OVER clause, but this is duplicative and error-prone if
the same windowing behavior is wanted for several functions. Instead, each
windowing behavior can be named in a WINDOW clause and then referenced in OVER.
For example:

```sql
SELECT sum(salary) OVER w, avg(salary) OVER w
FROM empsalary
WINDOW w AS (PARTITION BY depname ORDER BY salary DESC);
```

## Aggregate functions

All [aggregate functions](/influxdb3/cloud-dedicated/reference/sql/functions/aggregate/)
can be used as window functions.

## Ranking Functions

- [cume_dist](#cume_dist)
- [dense_rank](#dense_rank)
- [ntile](#ntile)
- [percent_rank](#percent_rank)
- [rank](#rank)
- [row_number](#row_number)

### `cume_dist`

Relative rank of the current row: (number of rows preceding or peer with current
row) / (total rows).

```sql
cume_dist()
```

### `dense_rank`

Returns the rank of the current row without gaps. This function ranks rows in a
dense manner, meaning consecutive ranks are assigned even for identical values.

```sql
dense_rank()
```

### `ntile`

Integer ranging from 1 to the argument value, dividing the partition as equally
as possible.

```sql
ntile(expression)
```

#### Arguments

- **expression**: An integer describing the number groups the partition should
  be split into.

### `percent_rank`

Returns the percentage rank of the current row within its partition. The value
ranges from 0 to 1 and is computed as `(rank - 1) / (total_rows - 1)`.

```sql
percent_rank()
```

### `rank`

Returns the rank of the current row within its partition, allowing gaps between
ranks. This function provides a ranking similar to `row_number`, but skips ranks
for identical values.

```sql
rank()
```

### `row_number`

Number of the current row within its partition, counting from 1.

```sql
row_number()
```

## Analytical Functions

- [first_value](#first_value)
- [lag](#lag)
- [last_value](#last_value)
- [lead](#lead)
- [nth_value](#nth_value)

### `first_value`

Returns value evaluated at the row that is the first row of the window frame.

```sql
first_value(expression)
```

#### Arguments

- **expression**: Expression to operate on.

### `lag`

Returns value evaluated at the row that is offset rows before the current row
within the partition; if there is no such row, instead return default (which
must be of the same type as value).

```sql
lag(expression, offset, default)
```

#### Arguments

- **expression**: Expression to operate on.
- **offset**: Integer. Specifies how many rows back the value of expression
  should be retrieved. Defaults to 1.
- **default**: The default value if the offset is not within the partition. Must
  be of the same type as expression.

### `last_value`

Returns value evaluated at the row that is the last row of the window frame.

```sql
last_value(expression)
```

#### Arguments

- **expression**: Expression to operate on.

### `lead`

Returns value evaluated at the row that is offset rows after the current row
within the partition; if there is no such row, instead return default (which
must be of the same type as value).

```sql
lead(expression, offset, default)
```

#### Arguments

- **expression**: Expression to operate on.
- **offset**: Integer. Specifies how many rows forward the value of expression
  should be retrieved. Defaults to 1.
- **default**: The default value if the offset is not within the partition. Must
  be of the same type as expression.

### `nth_value`

Returns value evaluated at the row that is the nth row of the window frame
(counting from 1); null if no such row.

```sql
nth_value(expression, n)
```

#### Arguments

- **expression**: The name the column of which nth value to retrieve.
- **n**: Integer. Specifies the n in nth.
