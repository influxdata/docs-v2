<!-- Comment to prevent error from starting with a shortcode -->

{{% product-name %}} uses the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/) implementation of SQL.  

- [Identifiers](#identifiers)  
- [Quoting and case sensitivity](#quoting-and-case-sensitivity)    
- [Literals](#literals)  
- [Duration units](#duration-units)  
- [Operators](#operators)  
- [Keywords](#keywords)  
- [Conditional expressions](#conditional-expressions)
- [Statements and clauses](#statements-and-clauses)  
- [Comments](#comments)  
- [Functions](#functions)

## Identifiers

An identifier is a token which refers to the name of an InfluxDB database object, such as a **measurement** or a column name (**time**, **tag keys**, or **field keys**).

## Quoting

Use double quotes on [identifiers](#identifiers) to treat them as case-sensitive.
Use single quotes on string literals.

General quoting guidelines:

- Single quote RFC3339 and RFC3339-like time values.
- Do _not_ quote Unix epoch time values (integers cast to a timestamp).
- Double-quote mixed case, [camel case](https://en.wikipedia.org/wiki/Camel_case) or case-sensitive identifiers.
- Double-quote identifiers that contain special characters or whitespace characters.

##### Quoting examples

```sql
-- Double-quote identifiers that contain whitespace
SELECT "water temperature", "buoy location" FROM buoy

-- Double-quote measurement names with special characters
SELECT * FROM "h2o-temperature"

-- Double-quote identifiers that should be treated as case-sensitive
SELECT "pH" FROM "Water"
```

> [!Note]
> **Note:** We recommend always double-quoting identifiers, regardless of case-sensitivity.

Unquoted identifiers **are not** case-sensitive and match any measurement, tag key, or field key with the same characters, despite case.
For example, if you have two fields in a measurement named `ph` and `pH`, the unquoted identifier, `pH` will match both.
To query in a case-sensitive manner, double-quote identifiers.

## Literals

A literal is an explicit value not represented by an identifier.

### String literals

String literals are surrounded by single quotes. 

```sql
'santa_monica'
'pH'
'average temperature'
```

### Numeric literals

Number literals are positive or negative numbers that are either exact numbers or floats.

```sql
-- Integers
10
+10
-10

-- Unsigned integers
10::BIGINT UNSIGNED
+10::BIGINT UNSIGNED

-- Floats
10.78654
-100.56
```

### Date and time literals

The following date and time literals are supported:

```sql
'2022-01-31T06:30:30.123Z'     -- (RFC3339) 
'2022-01-31T06:30:30.123'      -- (RFC3339-like)
'2022-01-31 06:30:30.123'      -- (RFC3339-like)
'2022-01-31 06:30:30'          -- ((RFC3339-like, no fractional seconds) 
1643610630123000000::TIMESTAMP -- (Unix epoch nanosecond cast to a timestamp)
```

### Boolean literals

Boolean literals are either `TRUE` or `FALSE`. 

## Duration units

Interval literals specify a length or unit of time. 

```sql
INTERVAL '4 minutes'
INTERVAL '12 days 6 hours 30 minutes'
```

The following units of time are supported:

- nanoseconds
- microseconds
- milliseconds
- seconds
- minutes
- hours 
- days 
- weeks
- months 
- years
- century

## Operators

Operators are reserved words or characters which perform certain operations, including comparisons and arithmetic. 

### Arithmetic operators

Arithmetic operators take two numeric values (either literals or variables) and
perform a calculation that returns a single numeric value.

| Operator | Description    | Example | Result |
| :------: | :------------- | ------- | -----: |
|   `+`    | Addition       | `2 + 2` |    `4` |
|   `-`    | Subtraction    | `4 - 2` |    `2` |
|   `*`    | Multiplication | `2 * 3` |    `6` |
|   `/`    | Division       | `6 / 3` |    `2` |
|   `%`    | Modulo         | `7 % 2` |    `1` |

### Comparison operators

Comparison operators evaluate the relationship between the left and right operands and `TRUE` or `FALSE`.

| Operator | Meaning                                                  | Example            |
| :------: | :------------------------------------------------------- | :----------------- |
|   `=`    | Equal to                                                 | `123 = 123`        |
|   `<>`   | Not equal to                                             | `123 <> 456`       |
|   `!=`   | Not equal to                                             | `123 != 456`       |
|   `>`    | Greater than                                             | `3 > 2`            |
|   `>=`   | Greater than or equal to                                 | `3 >= 2`           |
|   `<`    | Less than                                                | `1 < 2`            |
|   `<=`   | Less than or equal to                                    | `1 <= 2`           |
|   `~`    | Matches a regular expression                             | `'abc' ~ 'a.*'`    |
|  `~\*`   | Matches a regular expression _(case-insensitive)_        | `'Abc' ~\* 'A.*'`  |
|   `!~`   | Does not match a regular expression                      | `'abc' !~ 'd.*'`   |
|  `!~\*`  | Does not match a regular expression _(case-insensitive)_ | `'Abc' !~\* 'a.*'` |

### Logical operators

| Operator  | Meaning                                                                    |
| :-------: | :------------------------------------------------------------------------- |
|   `AND`   | Returns true if both operands are true. Otherwise, returns false.          |
| `BETWEEN` | Returns true if the left operand is within the range of the right operand. |
| `EXISTS`  | Returns true if the operand is not null.                                   |
|   `IN`    | Returns true if the left operand is in the right operand list.             |
|  `LIKE`   | Returns true if the left operand matches the right operand pattern string. |
|   `NOT`   | Negates the subsequent expression.                                         |
|   `OR`    | Returns true if any operand is true. Otherwise, returns false.             |

### Bitwise operators

Bitwise operators perform bitwise operations on bit patterns or binary numerals.

| Operator | Meaning             | Example  | Result |
| :------: | :------------------ | :------- | -----: |
|   `&`    | Bitwise and         | `5 & 3`  |    `1` |
|   `\|`   | Bitwise or          | `5 \| 3` |    `7` |
|   `^`    | Bitwise xor         | `5 ^ 3`  |    `6` |
|   `>>`   | Bitwise shift right | `5 >> 3` |    `0` |
|   `<<`   | Bitwise shift left  | `5 << 3` |   `40` |

### Other operators

|    Operator    | Meaning                  | Example                                                                                 | Result        |
| :------------: | :----------------------- | :-------------------------------------------------------------------------------------- | :------------ |
|     `\|\|`     | Concatenates strings     | `'Hello' \|\| ' world'`                                                                 | `Hello world` |
| `AT TIME ZONE` | Apply a time zone offset | _[View example](/influxdb/version/reference/sql/operators/other/#at-time-zone)_ |               |

## Keywords

The following reserved keywords cannot be used as identifiers.

```sql
AND
ALL
ANALYZE
AS
ASC
AT TIME ZONE
BETWEEN
BOTTOM
CASE
DESC
DISTINCT
EXISTS
EXPLAIN
FROM
GROUP BY
HAVING
IN
INNER JOIN
JOIN
LEFT JOIN
LIKE
LIMIT
NOT
EXISTS
NOT IN
OR
ORDER BY
FULL OUTER JOIN
RIGHT JOIN
SELECT
TOP
TYPE
UNION
UNION ALL
WHERE
WITH
```

## Conditional expressions

Conditional expressions evaluate conditions based on input values.
The following conditional expressions are supported:

| Expression | Description                                                        |
| :--------- | :----------------------------------------------------------------- |
| CASE       | Allows for use of WHEN-THEN-ELSE statements.                       |
| COALESCE   | Returns the first non-NULL expression in a specified list.         |
| NULLIF     | Returns a NULL value if value1 = value2. Otherwise returns value1. |

## Statements and clauses

InfluxDB SQL supports the following basic syntax for queries:

```sql
[ WITH with_query [, …] ]  
SELECT [ ALL | DISTINCT ] select_expr [, …]  
[ FROM from_item [, …] ]  
[ JOIN join_item [, …] ]  
[ WHERE condition ]  
[ GROUP BY grouping_element [, …] ]  
[ HAVING condition]  
[ UNION [ ALL ] ]
[ ORDER BY expression [ ASC | DESC ][, …] ]  
[ LIMIT count ]  
```

### SELECT statement and FROM clause

Use the SQL `SELECT` statement to query data from a specific measurement or measurements. The `FROM` clause always accompanies the `SELECT` statement.  

#### Examples

```sql
SELECT * FROM "h2o_feet"
```
### WHERE clause

Use the `WHERE` clause to filter results based on `fields`, `tags`, and `timestamps`.
Use predicates to evaluate each row.
Rows that evaluate as `TRUE` are returned in the result set.
Rows that evaluate as `FALSE` are omitted from the result set.

#### Examples

```sql
SELECT * FROM "h2o_feet" WHERE "water_level" <= 9
```
```sql
SELECT 
  * 
FROM 
  "h2o_feet" 
WHERE 
  "location" = 'santa_monica' 
  AND "level description" = 'below 3 feet'
```

### JOIN clause 

Use the `JOIN` clause to join data from multiple measurements (tables).
For more information about joins, see
[JOIN clause](/influxdb/version/reference/sql/join/).
The following join types are supported:

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

{{< expand-wrapper >}}
{{% expand "INNER JOIN" %}}

Inner joins combine rows from tables on the left and right side of the join
based on common column values defined in the `ON` clause. Rows that don't have
matching column values are not included in the output table.

```sql
SELECT
  *
FROM
  home
INNER JOIN home_actions ON
  home.room = home_actions.room
  AND home.time = home_actions.time;
```

{{% /expand %}}
{{% expand "LEFT [OUTER] JOIN" %}}

A left outer join returns all rows from the left side of the join and only
returns data from the right side of the join in rows with matching column values
defined in the `ON` clause.

```sql
SELECT
  *
FROM
  home
LEFT OUTER JOIN home_actions ON
  home.room = home_actions.room
  AND home.time = home_actions.time;
```

{{% /expand %}}
{{% expand "RIGHT [OUTER] JOIN" %}}

A right outer join returns all rows from the right side of the join and only
returns data from the left side of the join in rows with matching column values
defined in the `ON` clause.

```sql
SELECT
  *
FROM
  home
RIGHT OUTER JOIN home_actions ON
  home.room = home_actions.room
  AND home.time = home_actions.time;
```

{{% /expand %}}
{{% expand "FULL [OUTER] JOIN" %}}

A full outer join returns all data from the left and right sides of the join and
combines rows with matching column values defined in the `ON` clause.

```sql
SELECT
  *
FROM
  home
FULL OUTER JOIN home_actions ON
  home.room = home_actions.room
  AND home.time = home_actions.time;
```
{{% /expand %}}
{{< /expand-wrapper >}}

### GROUP BY clause 

Use the `GROUP BY` clause to group query results based on specified column values. `GROUP BY` **requires** an aggregate or selector function in the `SELECT` statement.

#### Examples

```sql
SELECT 
  MEAN("water_level"), 
  "location" 
FROM 
  "h2o_feet" 
GROUP BY 
  "location"
```

### HAVING clause

 Use the `HAVING` clause to filter query results based on a specified condition.
 The `HAVING` clause must _follow_ the `GROUP BY` clause, but _precede_ the `ORDER BY` clause.

#### Examples

```sql
SELECT 
  MEAN("water_level"), 
  "location" 
FROM 
  "h2o_feet" 
GROUP BY 
  "location" 
HAVING 
  MEAN("water_level") > 4
ORDER BY
  "location"
```

### UNION clause

The `UNION` clause combines the results of two or more `SELECT` statements without returning any duplicate rows. `UNION ALL` returns all results, including duplicates. 

#### Examples

```sql
SELECT 
  'pH' 
FROM 
  "h2o_pH" 
UNION ALL 
SELECT 
  "location" 
FROM 
  "h2o_quality"
```

### ORDER BY clause 

The `ORDER BY` clause orders results by specified columns and order.
Sort data based on fields, tags, and timestamps.
The following orders are supported:

- `ASC`: ascending _(default)_
- `DESC`: descending

#### Examples

```sql
SELECT 
  "water_level", 
  "location" 
FROM 
  "h2o_feet" 
ORDER BY 
  "location", 
  "time" DESC
```

### LIMIT clause

The `LIMIT` clause limits the number of rows to return.
The defined limit should be a non-negative integer.

#### Examples

```sql
SELECT 
  "water_level", 
  "location" 
FROM 
  "h2o_feet" 
LIMIT 
  10
```

### WITH clause 

The `WITH` clause provides a way to write auxiliary statements for use in a larger query.
It can help break down large, complicated queries into simpler forms. 

```sql
WITH summary_data as
(SELECT degrees, location, time 
  FROM average_temperature)
SELECT * FROM summary_data
```

### OVER clause 

The `OVER` clause is used with SQL window functions.
A **window function** performs a calculation across a set of table rows that are related in some way to the current row.
 While similar to aggregate functions, window functions output results into rows retaining their separate identities.   

```sql
SELECT 
  time, 
  water_level 
FROM 
  (
    SELECT 
      time, 
      "water_level", 
      row_number() OVER (
        order by 
          water_level desc
      ) as rn 
    FROM 
      h2o_feet
  ) 
WHERE 
  rn <= 3;
```

## Comments

Use comments to describe and add detail or notes to your queries.  

- Single line comments use the double hyphen `--` symbol. Single line comments end with a line break.
- Multi-line comments begin with `/*` and end with ` */`.

```sql
-- Single-line comment

/* 
 * Multi-line comment
 */
```

## Schema information

{{% product-name %}} supports the following metadata schema queries:

```sql
SHOW tables

SHOW columns FROM <measurement>
```

## Functions

Following is a list of supported functions by type. 

### Aggregate functions

An aggregate function performs a calculation or computation on a set of data values in a column and returns a single value.  

| Function | Description                                                |
| :------- | :--------------------------------------------------------- |
| COUNT()  | Returns returns the number of rows from a field or tag key |
| AVG()    | Returns the average value of a column                      |
| SUM()    | Returns the summed value of a column                       |
| MEAN()   | Returns the mean value of a column                         |
| MIN()    | Returns the smallest value of the selected column          |
| MAX()    | Returns the largest value of the selected column          |

#### Examples

```sql

SELECT COUNT("water_level") 
FROM "h2o_feet"

SELECT AVG("water_level"), "location"
FROM "h2o_feet" 
GROUP BY "location"

SELECT SUM("water_level"), "location"
FROM "h2o_feet" 
GROUP BY "location"
```

### Window aggregate functions

Window functions let you calculate running totals, moving averages, or other
aggregate-like results without collapsing rows into groups
(unlike non-window aggregate functions).

Window aggregate functions include **all [aggregate functions](#aggregate-functions/)**
and the [ranking functions](#ranking-functions).
The SQL `OVER` clause syntactically distinguishes a window  
function from a non-window or aggregate function and defines how to group and
order rows for the window operation.

#### Examples:

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

#### Ranking Functions

| Function | Description                                                |
| :------- | :--------------------------------------------------------- |
| CUME_DIST() | Returns the cumulative distribution of a value within a group of values |
| DENSE_RANK() | Returns a rank for each row without gaps in the numbering |
| NTILE() | Distributes the rows in an ordered partition into the specified number of groups |
| PERCENT_RANK() | Returns the percentage rank of the current row within its partition |
| RANK() | Returns the rank of the current row in its partition, allowing gaps between ranks |
| ROW_NUMBER() | Returns the position of the current row in its partition |

### Selector functions

Selector functions are unique to InfluxDB. They behave like aggregate functions in that they take a row of data and compute it down to a single value.  However, selectors are unique in that they return a **time value** in addition to the computed value. In short, selectors return an aggregated value along with a timestamp. 

| Function         | Description                                                     |
| :--------------- | :-------------------------------------------------------------- |
| SELECTOR_FIRST() | Returns the first value of a selected column and timestamp.   |
| SELECTOR_LAST()  | Returns the last value of a selected column and timestamp.     |
| SELECTOR_MIN()   | Returns the smallest value of a selected column and timestamp. |
| SELECTOR_MAX()   | Returns the largest value of a selected column and timestamp.  |

#### Examples

```sql
SELECT 
SELECTOR_MAX("pH", time)['value'],
SELECTOR_MAX("pH", time)['time']
FROM "h2o_pH"

SELECT 
SELECTOR_LAST("water_level", time)['value'],
SELECTOR_LAST("water_level", time)['time']
FROM "h2o_feet"
WHERE time >= timestamp '2019-09-10T00:00:00Z' AND time <= timestamp '2019-09-19T00:00:00Z'

```

### Date and time functions

| Function     | Description                                                                                     |
| :----------- | :---------------------------------------------------------------------------------------------- |
| DATE_BIN()   | Bins the input timestamp into a specified interval.                                             |
| DATE_TRUNC() | Truncates a timestamp expression based on the date part specified, such as hour, day, or month. |
| DATE_PART()  | Returns the specified part of a date.                                                           |
| NOW()        | Returns the current time (UTC).                                                                  |
                 
#### Examples

```sql
SELECT DATE_BIN(INTERVAL '1 hour', time, '2019-09-18T00:00:00Z') AS "_time",
SUM(water_level)
FROM "h2o_feet"
GROUP BY "_time"
```

```sql
SELECT DATE_TRUNC('month',time) AS "date",
SUM(water_level)
FROM "h2o_feet"
GROUP BY time
```

### Approximate functions

| Function                           | Description                                                                                   |
| :--------------------------------- | :-------------------------------------------------------------------------------------------- |
| APPROX_MEDIAN                      | Returns the approximate median of input values.                                               |
| APPROX_DISTINCT                    | Returns the approximate count of the number of distinct values. Implemented only for strings. |
| APPROX_PERCENTILE_CONT             | Returns the approximate percentile of input values.                                           |
| APPROX_PERCENTILE_CONT_WITH_WEIGHT | Returns the approximate percentile of input values with weight.                               |


### Math functions

| Function | Description                                                                      |
| :------- | :------------------------------------------------------------------------------- |
| ABS()    | Absolute value                                                                   |
| ACOS()   | Inverse cosine                                                                   |
| ASIN()   | Inverse sine                                                                     |
| ATAN()   | Inverse tangent                                                                  |
| ATAN2()  | Inverse tangent of y / x                                                         |
| CEIL()   | Returns the smallest integer value greater than or equal to the specified number |
| COS()    | Cosine                                                                           |
| EXP()    | Exponential                                                                      |
| FLOOR()  | Nearest integer less than or equal to the specified number                       |
| LN()     | Natural logarithm                                                                |
| LOG10()  | Base 10 logarithm                                                                |
| LOG2()   | Base 2 logarithm                                                                 |
| POWER()  | Returns the value of a number raised to the power of the number                  |
| ROUND()  | Round to the nearest integer                                                     |
| SIGNUM() | Sign of the argument (-1, 0, +1)                                                 |
| SINE()   | Sine                                                                             |
| SQRT()   | Returns the square root of a number                                              |
| TAN()    | Tangent                                                                          |
| TRUNC()  | Truncates a number to the specified number of decimal places                     |

### Conditional functions

| Function | Description                                                                                                |
| :------- | :--------------------------------------------------------------------------------------------------------- |
| COALESCE | Returns the first argument that is not null. If all arguments are null, then `COALESCE` will return nulls. |
| NULLIF   | Returns a null value if value1 equals value2, otherwise returns value1.                                    |


### Regular expression functions

| Function       | Description                                                                   |
| :------------- | :---------------------------------------------------------------------------- |
| REGEXP_MATCH   | Matches a regular expression against a string and returns matched substrings. |
| REGEXP_REPLACE | Replaces substrings that match a regular expression by a new substring.       |
