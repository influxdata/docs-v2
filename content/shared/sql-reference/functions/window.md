
Window functions let you calculate running totals, moving averages, or other aggregate-like results without collapsing rows into groups.
They perform their calculations over a “window” of rows, which you can partition and order in various ways, and return a calculated value for each row in the set.

Unlike non-window [aggregate functions](/influxdb3/version/reference/sql/functions/aggregate/) that combine each group into a single row, window functions preserve each row’s identity and calculate an additional value for every row in the partition.

For example, the following query uses the {{< influxdb3/home-sample-link >}}
and returns each temperature reading with the average temperature per room over
the queried time range:

{{% influxdb/custom-timestamps %}}

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
  AND time <= '2022-01-01T09:00:00Z'
ORDER BY
  room,
  time
```

| time                | room        | temp | avg_room_temp |
| :------------------ | :---------- | ---: | ------------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |          22.0 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |          22.0 |
| 2022-01-01T08:00:00 | Living Room | 21.1 |         21.25 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |         21.25 |

{{% /influxdb/custom-timestamps %}}

- [Window frames](#window-frames)
  - [OVER clause](#over-clause)
  - [PARTITION BY clause](#partition-by-clause)
  - [ORDER BY clause](#order-by-clause)
  - [Frame clause](#frame-clause)
    - [Frame units](#frame-units)
    - [Frame boundaries](#frame-boundaries)
  - [WINDOW clause](#window-clause)
- [Aggregate functions](#aggregate-functions)
- [Ranking Functions](#ranking-functions)
  - [cume_dist](#cume_dist)
  - [dense_rank](#dense_rank)
  - [ntile](#ntile)
  - [percent_rank](#percent_rank)
  - [rank](#rank)
  - [row_number](#row_number)
- [Analytical Functions](#analytical-functions)
  - [first_value](#first_value)
  - [lag](#lag)
  - [last_value](#last_value)
  - [lead](#lead)
  - [nth_value](#nth_value)

## Window frames

As window functions operate on a row, there is a set of rows in the row's
partition that the window function uses to perform the operation. This set of
rows is called the _window frame_.
Window frame boundaries can be defined using
`RANGE`, `ROW`, or `GROUPS` frame units, each relative to the current row--for
example:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[RANGE](#)
[ROWS](#)
[GROUPS](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  temp,
  avg(temp) OVER (
    ORDER BY time
    RANGE INTERVAL '3 hours' PRECEDING
  ) AS 3h_moving_avg
FROM home
WHERE room = 'Kitchen'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  temp,
  avg(temp) OVER (
    ROWS 3 PRECEDING
  ) AS moving_avg
FROM home
WHERE room = 'Kitchen'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  room,
  temp,
  avg(temp) OVER (
    ORDER BY room
    GROUPS 1 PRECEDING
  ) AS moving_avg
FROM home
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_For more information about how window frames work, see the [frame clause](#frame-clause)._

If you don't specify window frames, window functions use all rows in the current
partition to perform their operation.

```sql
function([expr])
  OVER(
    [PARTITION BY expr[, …]]
    [ORDER BY expr [ ASC | DESC ][, …]]
    [ frame_clause ]
    )
```

### OVER clause

Window functions use an `OVER` clause that directly follows the window function's  
name and arguments.  
The `OVER` clause syntactically distinguishes a window  
function from a non-window or aggregate function and defines how to group and order rows for the window operation.

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
> The `ORDER BY` clause in an `OVER` clause determines the processing order for
> rows in each partition and is separate from the `ORDER BY`
> clause of the query.

### Frame clause

The _frame clause_ defines window frame boundaries and can be one of the following:

```sql
{ RANGE | ROWS | GROUPS } frame_start
{ RANGE | ROWS | GROUPS } BETWEEN frame_start AND frame_end
```

- [Frame units](#frame-units)
  - [RANGE](#range)
  - [ROWS](#rows)
  - [GROUPS](#groups)
- [Frame boundaries](#frame-boundaries)
  - [UNBOUNDED PRECEDING](#unbounded-preceding)
  - [offset PRECEDING](#offset-preceding)
  - [CURRENT ROW](#current-row)
  - [offset FOLLOWING](#offset-following)
  - [UNBOUNDED FOLLOWING](#unbounded-following)

#### Frame units

When defining window frames, you can use one of the following frame units:

- [RANGE](#range)
- [ROWS](#rows)
- [GROUPS](#groups)

##### RANGE

Defines frame boundaries using rows with values for columns specified 
in the [`ORDER BY` clause](#order-by-clause) within a value range relative to
the current row value.

> [!Important]
> When using `RANGE` frame units, you must include an `ORDER BY` clause with
> _exactly one column_.

The offset is the difference between the current row value and surrounding
row values. `RANGE` supports the following offset types:

- Numeric _(non-negative)_
- Numeric string _(non-negative)_
- Interval

{{< expand-wrapper >}}
{{% expand "See how `RANGE` frame units work with numeric offsets" %}}

To use a numeric offset with the `RANGE` frame unit, you must sort partitions
by a numeric-type column.

```sql
... OVER (
  ORDER BY wind_direction
  RANGE BETWEEN 45 PRECEDING AND 45 FOLLOWING
)
```

The window frame includes rows with sort column values between 45 below and 
45 above the current row's value:

{{< sql/window-frame-units "range numeric" >}}

{{% /expand %}}

{{% expand "See how `RANGE` frame units work with interval offsets" %}}

To use an interval offset with the `RANGE` frame unit, you must sort partitions
by `time` or a timestamp-type column.

```sql
... OVER (
  ORDER BY time
  RANGE BETWEEN
    INTERVAL '3 hours' PRECEDING
    AND INTERVAL '1 hour' FOLLOWING
)
```

The window frame includes rows with timestamps between three hours before and
one hour after the current row's timestamp:

{{% influxdb/custom-timestamps %}}

{{< sql/window-frame-units "range interval" >}}

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

##### ROWS

Defines window frame boundaries using row positions relative to the current row.
The offset is the difference in row position from the current row.
`ROWS` supports the following offset types:

- Numeric _(non-negative)_
- Numeric string _(non-negative)_

{{< expand-wrapper >}}
{{% expand "See how `ROWS` frame units work" %}}

When using the `ROWS` frame unit, row positions relative to the current row
determine frame boundaries--for example:

```sql
... OVER (
  ROWS BETWEEN 2 PRECEDING AND 1 FOLLOWING
)
```

The window frame includes the two rows before and the one row after the current row:

{{< sql/window-frame-units "rows" >}}

{{% /expand %}}
{{< /expand-wrapper >}}

##### GROUPS

Defines window frame boundaries using row groups.
Rows with the same values for the columns in the [`ORDER BY` clause](#order-by-clause)
comprise a row group.

> [!Important]
> When using `GROUPS` frame units, include an `ORDER BY` clause.

The offset is the difference in row group position relative to the current row group.
`GROUPS` supports the following offset types:

- Numeric _(non-negative)_
- Numeric string _(non-negative)_

{{< expand-wrapper >}}
{{% expand "See how `GROUPS` frame units work" %}}

When using the `GROUPS` frame unit, unique combinations column values specified
in the `ORDER BY` clause determine each row group. For example, if you sort
partitions by `country` and `city`:

```sql
... OVER (
  ORDER BY country, city
  GROUPS ...
)
```

The query defines row groups in the following way:

{{< sql/window-frame-units "groups" >}}

You can then use group offsets to determine frame boundaries:

```sql
... OVER (
  ORDER BY country, city
  GROUPS 2 PRECEDING
)
```

The window function uses all rows in the current row group and the two preceding row groups to perform the operation:

{{< sql/window-frame-units "groups with frame" >}}

{{% /expand %}}
{{< /expand-wrapper >}}

#### Frame boundaries

Frame boundaries (**frame_start** and **frame_end**) define the boundaries of
each frame that the window function operates on.  

- [UNBOUNDED PRECEDING](#unbounded-preceding)
- [offset PRECEDING](#offset-preceding)
- [CURRENT_ROW](#current-row)
- [offset FOLLOWING](#offset-following)
- [UNBOUNDED FOLLOWING](#unbounded-following)

##### UNBOUNDED PRECEDING

Starts at the first row of the partition and ends at the current row.

```sql
UNBOUNDED PRECEDING
```

##### offset PRECEDING

Starts at `offset` [frame units](#frame-units) before the current row and ends at the current row.
For example, `3 PRECEDING` includes 3 rows before the current row.

```sql
<offset> PRECEDING
```

##### CURRENT ROW

Both starts and ends at the current row when used as a boundary.

```sql
CURRENT ROW
```

##### offset FOLLOWING

Starts at the current row and ends at `offset` [frame units](#frame-units) after the current row.
For example, `3 FOLLOWING` includes 3 rows after the current row.

```sql
<offset> FOLLOWING
```

##### UNBOUNDED FOLLOWING

Use the current row to the end of the current partition the frame boundary.

```sql
UNBOUNDED FOLLOWING
```

### WINDOW clause

Use the `WINDOW` clause to define a reusable alias for a window specification.
This is useful when multiple window functions in your query share the same window definition.  

Instead of repeating the same OVER clause for each function,
define the window once and reference it by alias--for example:  

```sql
SELECT
  sum(net_gain) OVER w,
  avg(net_net) OVER w
FROM
  finance
WINDOW w AS ( PARTITION BY ticker ORDER BY time DESC);
```

---

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

### cume_dist

Returns the cumulative distribution of a value within a group of values.
The returned value is greater than 0 and less than or equal to 1 and represents
the relative rank of the value in the set of values.
The [`ORDER BY` clause](#order-by-clause) in the `OVER` clause is used
to correctly calculate the cumulative distribution of the current row value.  

```sql
cume_dist()
```

> [!Important]
> When using `cume_dist`, include an [`ORDER BY` clause](#order-by-clause) in the `OVER` clause.  

{{< expand-wrapper >}}
{{% expand "View `cume_dist` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  cume_dist() OVER (
    PARTITION BY room
    ORDER BY temp 
  ) AS cume_dist
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T12:00:00Z'
```

| time                | room        | temp | cume_dist |
| :------------------ | :---------- | ---: | --------: |
| 2022-01-01T08:00:00 | Living Room | 21.1 |      0.25 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |       0.5 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |      0.75 |
| 2022-01-01T11:00:00 | Living Room | 22.2 |       1.0 |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |      0.25 |
| 2022-01-01T11:00:00 | Kitchen     | 22.4 |       0.5 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |      0.75 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |       1.0 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### dense_rank

Returns the rank of the current row in its partition.
Ranking is consecutive; assigns duplicate values the same rank number and the rank sequence continues
with the next distinct value (unlike [`rank()`](#rank)).

The [`ORDER BY` clause](#order-by-clause) in the `OVER` clause determines
ranking order.

```sql
dense_rank()
```

{{< expand-wrapper >}}
{{% expand "View `dense_rank` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  dense_rank() OVER (
    PARTITION BY room
    ORDER BY temp 
  ) AS dense_rank
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T12:00:00Z'
```

| time                | room        | temp | dense_rank |
| :------------------ | :---------- | ---: | ---------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |          1 |
| 2022-01-01T11:00:00 | Kitchen     | 22.4 |          2 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |          3 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |          4 |
| 2022-01-01T08:00:00 | Living Room | 21.1 |          1 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |          2 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |          3 |
| 2022-01-01T11:00:00 | Living Room | 22.2 |          4 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "Compare `dense_rank`, `rank`, and `row_number` functions"%}}

Consider a table with duplicate ID values.
The following query shows how each ranking function handles duplicate values:

```sql
SELECT
  id,
  rank() OVER(ORDER BY id),
  dense_rank() OVER(ORDER BY id),
  row_number() OVER(ORDER BY id)
FROM my_table;
```

| ID  | rank | dense_rank | row_number |
|:----|-----:|-----------:|-----------:|
| 1   | 1    | 1         | 1          |
| 1   | 1    | 1         | 2          |
| 1   | 1    | 1         | 3          |
| 2   | 4    | 2         | 4          |

Key differences:

- [`rank()`](#rank) assigns the same rank to equal values but skips ranks for subsequent values
- [`dense_rank()`](#dense_rank) assigns the same rank to equal values and uses consecutive ranks
- [`row_number()`](#row_number) assigns unique sequential numbers regardless of value (non-deterministic)
{{% /expand %}}
{{< /expand-wrapper >}}

### ntile

Distributes the rows in an ordered partition into the specified number of groups.
Each group is numbered, starting at one.
For each row, `ntile` returns the group number to which the row belongs.
Group numbers range from 1 to the `expression` value, dividing the partition as
equally as possible.
The [`ORDER BY` clause](#order-by-clause) in the `OVER` clause determines
ranking order.

```sql
ntile(expression)
```

#### Arguments

- **expression**: An integer. The number of groups to split the partition into.

{{< expand-wrapper >}}
{{% expand "View `ntile` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  temp,
  ntile(4) OVER (
    ORDER BY time 
  ) AS ntile
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T15:00:00Z'
```

| time                | temp | ntile |
| :------------------ | ---: | ----: |
| 2022-01-01T08:00:00 | 21.0 |     1 |
| 2022-01-01T09:00:00 | 23.0 |     1 |
| 2022-01-01T10:00:00 | 22.7 |     2 |
| 2022-01-01T11:00:00 | 22.4 |     2 |
| 2022-01-01T12:00:00 | 22.5 |     3 |
| 2022-01-01T13:00:00 | 22.8 |     3 |
| 2022-01-01T14:00:00 | 22.8 |     4 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### percent_rank

Returns the percentage rank of the current row within its partition.
The returned value is between `0` and `1`, computed as:

```
(rank - 1) / (total_rows - 1)
```

The [`ORDER BY` clause](#order-by-clause) in the `OVER` clause determines
the ranking order.

```sql
percent_rank()
```

{{< expand-wrapper >}}
{{% expand "View `percent_rank` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  percent_rank() OVER (
    PARTITION BY room
    ORDER BY temp 
  ) AS percent_rank
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
```

| time                | room        | temp | percent_rank |
| :------------------ | :---------- | ---: | -----------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |          0.0 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |          0.5 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |          1.0 |
| 2022-01-01T08:00:00 | Living Room | 21.1 |          0.0 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |          0.5 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |          1.0 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### rank

Returns the rank of the current row in its partition.
For duplicate values, `rank` assigns them the same rank number, skips subsequent ranks (unlike [`dense_rank()`](#dense_rank)),
and then continues ranking with the next distinct value.

The [`ORDER BY` clause](#order-by-clause) in the `OVER` clause determines
ranking order.

```sql
rank()
```

{{< expand-wrapper >}}
{{% expand "View `rank` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  rank() OVER (
    PARTITION BY room
    ORDER BY temp 
  ) AS rank
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
```

| time                | room        | temp | rank |
| :------------------ | :---------- | ---: | ---: |
| 2022-01-01T08:00:00 | Living Room | 21.1 |    1 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |    2 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |    3 |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |    1 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |    2 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |    3 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "Compare `dense_rank`, `rank`, and `row_number` functions"%}}

Consider a table with duplicate ID values.
The following query shows how each ranking function handles duplicate values:

```sql
SELECT
  id,
  rank() OVER(ORDER BY id),
  dense_rank() OVER(ORDER BY id),
  row_number() OVER(ORDER BY id)
FROM my_table;
```

| ID  | rank | dense_rank | row_number |
|:----|-----:|-----------:|-----------:|
| 1   | 1    | 1         | 1          |
| 1   | 1    | 1         | 2          |
| 1   | 1    | 1         | 3          |
| 2   | 4    | 2         | 4          |

Key differences:

- [`rank()`](#rank) assigns the same rank to equal values but skips ranks for subsequent values
- [`dense_rank()`](#dense_rank) assigns the same rank to equal values and uses consecutive ranks
- [`row_number()`](#row_number) assigns unique sequential numbers regardless of value (non-deterministic)
{{% /expand %}}
{{< /expand-wrapper >}}

### row_number

Returns the position of the current row in its partition, counting from 1.
The [`ORDER BY` clause](#order-by-clause) in the `OVER` clause determines
row order.

```sql
row_number()
```

{{< expand-wrapper >}}
{{% expand "View `row_number` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  row_number() OVER (
    PARTITION BY room
    ORDER BY temp 
  ) AS row_number
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
```

| time                | room        | temp | row_number |
| :------------------ | :---------- | ---: | ---------: |
| 2022-01-01T08:00:00 | Living Room | 21.1 |          1 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |          2 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |          3 |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |          1 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |          2 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |          3 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "Compare `dense_rank`, `rank`, and `row_number` functions"%}}

Consider a table with duplicate ID values.
The following query shows how each ranking function handles duplicate values:

```sql
SELECT
  id,
  rank() OVER(ORDER BY id),
  dense_rank() OVER(ORDER BY id),
  row_number() OVER(ORDER BY id)
FROM my_table;
```

| ID  | rank | dense_rank | row_number |
|:----|-----:|-----------:|-----------:|
| 1   | 1    | 1         | 1          |
| 1   | 1    | 1         | 2          |
| 1   | 1    | 1         | 3          |
| 2   | 4    | 2         | 4          |

Key differences:

- [`rank()`](#rank) assigns the same rank to equal values but skips ranks for subsequent values
- [`dense_rank()`](#dense_rank) assigns the same rank to equal values and uses consecutive ranks
- [`row_number()`](#row_number) assigns unique sequential numbers regardless of value (non-deterministic)
{{% /expand %}}
{{< /expand-wrapper >}}

## Analytical Functions

- [first_value](#first_value)
- [lag](#lag)
- [last_value](#last_value)
- [lead](#lead)
- [nth_value](#nth_value)

### first_value

Returns the value from the first row of the window frame.

```sql
first_value(expression)
```

#### Arguments

- **expression**: Expression to operate on. Can be a constant, column, or
  function, and any combination of arithmetic operators.

##### Related functions

[last_value](#last_value)

{{< expand-wrapper >}}
{{% expand "View `first_value` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  first_value(temp) OVER (
    PARTITION BY room
    ORDER BY time 
  ) AS first_value
FROM home
WHERE  
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | first_value |
| :------------------ | :---------- | ---: | ----------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |        21.0 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |        21.0 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |        21.0 |
| 2022-01-01T08:00:00 | Living Room | 21.1 |        21.1 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |        21.1 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |        21.1 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### lag

Returns the value from the row that is at the specified offset before the
current row in the partition. If the offset row is outside the partition,
the function returns the specified default.

```sql
lag(expression, offset, default)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic or 
  string operators.
- **offset**: How many rows _before_ the current row to retrieve the value of
  _expression_ from. Default is `1`.
- **default**: The default value to return if the offset is in the partition.
  Must be of the same type as _expression_.

##### Related functions

[lead](#lead)

{{< expand-wrapper >}}
{{% expand "View `lag` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  lag(temp, 1, 0) OVER (
    PARTITION BY room
    ORDER BY time
  ) AS previous_value
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | previous_value |
|:--------------------|:------------|-----:|---------------:|
| 2022-01-01T08:00:00 | Kitchen     | 21.0 | 0.0            |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 | 21.0           |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 | 23.0           |
| 2022-01-01T08:00:00 | Living Room | 21.1 | 0.0            |
| 2022-01-01T09:00:00 | Living Room | 21.4 | 21.1           |
| 2022-01-01T10:00:00 | Living Room | 21.8 | 21.4           |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### last_value

Returns the value from the last row of the window frame.

```sql
last_value(expression)
```

#### Arguments

- **expression**: Expression to operate on. Can be a constant, column, or
  function, and any combination of arithmetic operators.

##### Related functions

[first_value](#first_value)

{{< expand-wrapper >}}
{{% expand "View `last_value` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  last_value(temp) OVER (
    PARTITION BY room
    ORDER BY time
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_value
FROM home
WHERE  
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | last_value |
| :------------------ | :---------- | ---: | ---------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 | 22.7       |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 | 22.7       |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 | 22.7       |
| 2022-01-01T08:00:00 | Living Room | 21.1 | 21.8       |
| 2022-01-01T09:00:00 | Living Room | 21.4 | 21.8       |
| 2022-01-01T10:00:00 | Living Room | 21.8 | 21.8       |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### lead

Returns the value from the row that is at the specified offset after the
current row in the partition. If the offset row is outside the partition,
the function returns the specified default.

```sql
lead(expression, offset, default)
```

#### Arguments

- **expression**: Expression to operate on.
  Can be a constant, column, or function, and any combination of arithmetic or 
  string operators.
- **offset**: How many rows _before_ the current row to retrieve the value of
  _expression_ from. Default is `1`.
- **default**: The default value to return if the offset is in the partition.
  Must be of the same type as _expression_.

##### Related functions

[lag](#lag)

{{< expand-wrapper >}}
{{% expand "View `lead` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  lead(temp, 1, 0) OVER (
    PARTITION BY room
    ORDER BY time
  ) AS next_value
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T11:00:00Z'
ORDER BY room, time
```

| time                | room        | temp | next_value |
| :------------------ | :---------- | ---: | ---------: |
| 2022-01-01T08:00:00 | Kitchen     | 21.0 |       23.0 |
| 2022-01-01T09:00:00 | Kitchen     | 23.0 |       22.7 |
| 2022-01-01T10:00:00 | Kitchen     | 22.7 |        0.0 |
| 2022-01-01T08:00:00 | Living Room | 21.1 |       21.4 |
| 2022-01-01T09:00:00 | Living Room | 21.4 |       21.8 |
| 2022-01-01T10:00:00 | Living Room | 21.8 |        0.0 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### nth_value

Returns the value from the row that is the nth row of the window frame
(counting from 1). If the nth row doesn't exist, the function returns _null_.

```sql
nth_value(expression, n)
```

#### Arguments

- **expression**: The expression to operator on.
  Can be a constant, column, or function, and any combination of arithmetic or 
  string operators.
- **n**: Specifies the row number in the current frame and partition to reference.

{{< expand-wrapper >}}
{{% expand "View `lead` query example" %}}

The following example uses the {{< influxdb3/home-sample-link >}}.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  time,
  room,
  temp,
  nth_value(temp, 2) OVER (
    PARTITION BY room
  ) AS "2nd_temp"
FROM home
WHERE  
  time >= '2025-02-10T08:00:00Z'
  AND time < '2025-02-10T11:00:00Z'
```

| time                | room        | temp | 2nd_temp |
| :------------------ | :---------- | ---: | -------: |
| 2025-02-10T08:00:00 | Kitchen     | 21.0 |     22.7 |
| 2025-02-10T10:00:00 | Kitchen     | 22.7 |     22.7 |
| 2025-02-10T09:00:00 | Kitchen     | 23.0 |     22.7 |
| 2025-02-10T08:00:00 | Living Room | 21.1 |     21.8 |
| 2025-02-10T10:00:00 | Living Room | 21.8 |     21.8 |
| 2025-02-10T09:00:00 | Living Room | 21.4 |     21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}
