---
title: InfluxDB SQL reference
description: >
  InfluxDB SQL reference
menu:
  influxdb_cloud_iox:
    name: InfluxDB SQL reference
    parent: Query data with SQL
weight: 190
---

InfluxDB Cloud backed by InfluxDB IOx uses the Apache Arrow DataFusion implementation of SQL.  

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

An identifier is a token which refers to the name of an InfluxDB database object, such as a `bucket`, `measurement`, `tag`, or `field`.

## Quoting and case sensitivity

Rules for quoting:

- Single quote RFCC3339 time durations.
- Do not quote Unix epoch times durations.
- Double quote database identifiers (column names).
- Identifiers using mixed case or [camel case](https://en.wikipedia.org/wiki/Camel_case) must be in double quotes.
- If an identifier contains whitespace it must be in double quotes.

```sql
-- Examples
SELECT * FROM "water temperature"
SELECT * FROM "h2o_temperature"
SELECT "pH"
```

{{% note %}}
**Note:** It is a best practice to always double quote identiifiers, regardless of whether they are case sensitive or not.  The following queries will both return results:

```sql
SELECT location, water_level 
FROM h2o_feet

SELECT "location","water_level" 
FROM "h2o_feet"
```
{{% /note %}}

In some cases, however, using single quotes and misquoting identifiers will return inaccurate results. To avoid this, it is recommended that you double quote identifiers.

Unquoted identifiers **are not** case sensitive.  When a table is created, the case of a column is automatically stored in lowercase **unless** the column name is quoted.  The column name `pH` must be quoted in order to preserve the lowercase p and uppercase H. 

The following query will return an error if the measurement `h2o-pH` and the field `pH` are not double quoted:

```sql
SELECT "pH", location, time
FROM "h2o_pH"
```

## Literals

Literals are the same as constants.  

### String literals

String literals must be surrounded by double quotes. 

```sql
"santa_monica"
"pH"
"average temperature"  
```

### Number literals

Number literals are positive or negative numbers that are either exact numbers or floats.

```sql
10
+10
-10
10.78654
-100.56
```

### Date and time literals

The following date and time literals are supported:

 - 2022-01-31T06:30:30.123Z (RFC3339) 
 - 2022-01-31T06:30:30.123 (RFC3339-like)
 - 2022-01-31 06:30:30.123 (RFC3339-like)
 - 2022-01-31 06:30:30 ((RFC3339-like, no fractional seconds) 
 - 1567296000000000000 (Unix epoch nanosecond) - must cast to `::timestamp` in queries
 - 1566176400 (Unix epoch second) -  must cast to `::timestamp` in queries

All dates and times in RFC3339 and RFC3339-like format must be in single quotes.  Unix epoch timestamps do not need any quotes and must be cast to `::timestamp`.

```sql
--RFC3339 examples
'2019-09-01T00:00:00Z'::timestamp
'2019-08-19T00:00:00.123Z'::TIMESTAMP
'2019-09-03 00:12:00'
'2019-08-18 06:30:30'

--Unix epoch examples
1566176400::timestamp
1567296000000000000:TIMESTAMP
```

 ### Boolean literals

Boolean literals are either TRUE or FALSE. 

## Duration units

Duration units specify a length or unit of time.  You must spell out the entire unit of time or the SQL query will error.

```sql
--Correct:
interval'400 minutes'

--Incorrect:
interval'400m'
```

Supported durations:
| Unit         | Meaning                  |
| :----------- | :----------------------- |
| nanoseconds  | 1 billionth of a second  |
| microseconds | 1 millionth of a second  |
| milliseconds | 1 thousandth of a second |
| second       |                          |
| minute       | 60 seconds               |
| hour         | 60 minutes               |
| day          | 24 hours                 |
| week         | calendar week            |
| month        | calendar month           |
| year         | calendar year            |

## Operators

Operators are reserved words or characters which perform certain operations, inluding comparisons and arithmetic. 

### Arithmetic operators

Arithmetic operators take two numerical values (either literals or variables) and
perform a calculation that returns a single numerical value.

| Operator | Description    | Example  | Result |
|:--------:|:-----------    | -------  | ------ |
| `+`      | Addition       | `2 + 2`  | `4`    |
| `-`      | Subtraction    | `4 - 2`  | `2`    |
| `*`      | Multiplication | `2 * 3`  | `6`    |
| `/`      | Division       | `6 / 3`  | `2`    |

### Comparison operators

Comparison operators compare numbers or strings and perform evaluations. They are used in the `WHERE` clause.

| Operator | Meaning                  | Example    |
| :------: | :----------------------- | :--------- |
|   `=`    | equal to                 | 123 = 123  |
|   `<>`   | not equal to             | 123 <> 456 |
|   `!=`   | not equal to             | 123 != 456 |
|   `>`    | greater than             | 3 > 2      |
|   `>=`   | greater than or equal to | 3 >=2      |
|   `<`    | less than                | 1 < 2      |
|   `<=`   | less than or equal to    | 1<= 2      |

## Keywords

Reserved key words canot be used as identifiers.

| Keyword         | Description                                                                                                                                                                                                                      |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AND             | Operator which includes columns where all conditions are true. Use with the `WHERE` clause.                                                                                                                                      |
| ALL             | Returns boolean TRUE if all subquery values have met the specified condition.                                                                                                                                                    |
| AS              | Renames a column with an alias.  Use in `CAST` operations.                                                                                                                                                                       |
| ASC             | Sorts query results in ascending order.                                                                                                                                                                                          |
| BOTTOM          | Specifies the bottom number of records to return.                                                                                                                                                                                |
| DESC            | Sorts query results in descending order.                                                                                                                                                                                         |
| DISTINCT        | Selects only distinct values.                                                                                                                                                                                                    |
| EXISTS          | Find all rows in a relation where a correlated subquery produces one or more matches for that row. Only correlated subqueries are supported.                                                                                     |
| EXPLAIN         | Shows the logical and physical execution plan for a specified SQL statement.                                                                                                                                                     |
| FROM            | Specifies the measurement from which to select data.                                                                                                                                                                             |
| GROUP BY        | Groups results by aggregate function.                                                                                                                                                                                            |
| HAVING          | Places conditions on results created by the GROUP BY clause.                                                                                                                                                                     |
| IN              | Find all rows in a relation where a given expression’s value can be found in the results of a correlated subquery .                                                                                                              |
| INNER JOIN      | A join that only returns rows where there is a match in both tables .                                                                                                                                                            |
| JOIN            | Combines results from two or more tables into one data set.                                                                                                                                                                      |
| LEFT JOIN       | Gathers data from all rows in the left table regardless of whether there is a match in the right table.                                                                                                                          |
| LIMIT           | Limits the number of rows in the result.                                                                                                                                                                                         |
| NOT EXISTS      | Find all rows in a relation where a correlated subquery produces zero matches for that row. Only correlated subqueries are supported.                                                                                            |
| NOT IN          | Find all rows in a relation where a given expression’s value can not be found in the results of a correlated subquery.                                                                                                           |
| OR              | Operator used to test one or more conditions and return a result where the condition is met. Use with the `WHERE` clause.                                                                                                        |
| ORDER BY        | Orders results by the referenced expression.                                                                                                                                                                                     |
| FULL OUTER JOIN | A join that is effectively a union of a LEFT OUTER JOIN and RIGHT OUTER JOIN. It will show all rows from the left and right side of the join and will produce null values on either side of the join where there is not a match. |
| RIGHT JOIN      | A join that includes all rows from the right table even if there is not a match in the left table. When there is no match, null values are produced for the left side of the join.                                               |
| SELECT          | Retrieves rows from a table (measurement).                                                                                                                                                                                       |
| SELECT DISTINCT | Returns only distinct (different) values from a table (measurement).                                                                                                                                                             |
| TOP             | Specifies the top number of records to return.                                                                                                                                                                                   |
| TYPE            | Groups by common characteristics.                                                                                                                                                                                                |
| UNION           | Used to combine the result set of at least two queries. Keeps only unique records.                                                                                                                                               |
| UNION  ALL      | Like UNION, but keeps all records, including duplicates.                                                                                                                                                                         |
| WHERE           | Used to filter results based on fields, tags, and/or timestamps.                                                                                                                                                                 |
| WITH            | Provides the ability to write auxiliary statements for use in a larger query.                                                                                                                                                    |

## Conditional expressions

Conditional expressions evaluate conditions based on input values.

The following conditional expressions are supported:

| Expression | Description                                                        |
| :--------- | :----------------------------------------------------------------- |
| CASE       | Allows for use of IF-TEHN-ELSE statements.                          |
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

### The SELECT statement and FROM clause

Use the SQL `SELECT` statement to query data from a specific measurement or measurements. The `FROM` clause always accompanies the `SELECT` statement.  

#### Examples

```sql
SELECT *
FROM "h2o_feet" 

SELECT "location","water_level","time"
FROM "h2o_feet"
```
### The WHERE clause

Use the `WHERE` clause to filter results based on `fields`, `tags`, and/or `timestamps`.

#### Examples

```sql
SELECT * 
FROM "h2o_feet" 
WHERE "water_level"  <= 9

SELECT * 
FROM "h2o_feet" 
WHERE "location" = 'santa_monica' and "level description" = 'below 3 feet' 
```

### The JOIN clause 

Use the JOIN clause to join data from multiple measurements (tables).  The following joins are supported:

{{< flex >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Inner join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="inner small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Left outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="left small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Right outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="right small center" >}}
{{< /flex-content >}}
{{< flex-content "quarter" >}}
  <p style="text-align:center"><strong>Full outer join</strong></p>
  {{< svg svg="static/svgs/join-diagram.svg" class="full small center" >}}
{{< /flex-content >}}
{{< /flex >}}

The INNER JOIN clause gathers data where there is a match between the two measurements being joined.

```sql
SELECT *
FROM h2o_feet
INNER JOIN h2o_temperature
ON h2o_feet.location = h2o_temperature.location AND h2o_feet.time = h2o_temperature.time
```
The LEFT JOIN or LEFT OUTER JOIN clause gathers data from all rows in the left table regardless of whether there is a match in the right table. 

```sql
SELECT *
FROM h2o_feet
LEFT OUTER JOIN h2o_temperature
ON h2o_feet.location = h2o_temperature.location AND h2o_feet.time = h2o_temperature.time
```

The RIGHT JOIN or RIGHT OUTER JOIN clause gathers data from all rows in the right table regardless of whether there is a match in the left table

```sql
SELECT *
FROM h2o_feet
RIGHT OUTER JOIN h2o_temperature
ON h2o_feet.location = h2o_temperature.location AND h2o_feet.time = h2o_temperature.time
```

The FULL JOIN or FULL OUTER JOIN will return all rows from the left and the right side fo the JOIN and will produce NULL values where there is no match.

```sql
SELECT *
FROM h2o_feet
FULL JOIN h2o_temperature
ON h2o_feet.location = h2o_temperature.location AND h2o_feet.time = h2o_temperature.time
```

### The GROUP BY clause 

Use the `GROUP BY` clause to group query results based on specified tag keys and/or a specified time interval. `GROUP BY` **requires** an aggregate or selector function in the `SELECT` statement.

#### Examples

```sql
SELECT MEAN("water_level"), "location"
FROM "h2o_feet" 
GROUP BY "location","time"
```

### The HAVING clause

 Use the `HAVING` clause to filter query results based on a specified condition. The `HAVING` clause must follow the `GROUP BY` clause but precedes the `ORDER BY` clause.

#### Examples

```sql
SELECT MEAN("water_level"), "location", "time"
FROM "h2o_feet" 
GROUP BY "location","time"
HAVING MEAN("water_level") > 4

SELECT MEAN("water_level"), "location", "time"
FROM "h2o_feet" 
GROUP BY "location","time"
HAVING MEAN("water_level") > 9.8
ORDER BY "time"
```

### The UNION clause

The `UNION` clause combines the results of two or more SELECT statements without returning any duplicate rows. `UNION ALL` returns all results, including duplicates. 

#### Examples

```sql
SELECT 'pH'
FROM "h2o_pH"
UNION ALL
SELECT "location"
FROM "h2o_quality"
```

### The ORDER BY clause 

The `ORDER BY` clause orders results by the referenced expression.  The result order is `ASC` **by default**.  You can filter data based on fields, tags, and/or timestamps.

#### Examples

```sql
SELECT "water_level" 
FROM "h2o_feet" 
WHERE "location" = 'coyote_creek'  
ORDER BY time DESC
```

### The LIMIT clause

The `LIMIT` clause limits the number of rows to be a maximum of count rows. The count should be a non-negative integer.

#### Examples

```sql
SELECT "water_level","location" 
FROM "h2o_feet" 
LIMIT 10
```

### The WITH clause 

The `WITH` clause provides a way to write auxiliary statements for use in a larger query.  It can help break down large, complicated queries into simpler forms. 

```sql
WITH summary_data as
(SELECT degrees, location, time 
  FROM average_temperature)
SELECT * FROM summary_data
```

### The OVER clause 

The `OVER` clause is used with SQL window functions. A `window function` performs a calculation across a set of table rows that are related in some way to the current row. While similar to aggregate functions, window functions output results into rows retaining their separate identities.   

```sql
SELECT time, water_level 
FROM
(SELECT time, "water_level", row_number() 
 OVER (order by water_level desc) as rn 
FROM h2o_feet) 
WHERE rn <= 3;
```

## Comments

Use comments to describe and add detail and notes to your queries.  

 - Single line comments use the double hyphen `--` symbol. Single line comments end with a line break.
 - Multi-line comments begin with `/*` and end with ` */`. Multi-line comments span multiple lines. 

 ```sql
 Single line comments:

-- Examples

SELECT COUNT("water_level") --no timestamp needed
FROM "h2o_feet"

Multiline comments:

/* author:
 * date:
 */
SELECT COUNT("water_level")
FROM "h2o_feet"
```

## Schema information

InfluxDB Cloud backed by InfluxDB IOx supports the following metedata schema queries:

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

### Selector functions

Selector functions are unique to InfluxDB. They behave like aggregate functions in that they take a row of data and compute it down to a single value.  However, selectors are unique in that they return a **time value** in addition to the computed value. In short, selectors retrun an aggreagetd value along with a timestamp. 

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

### Time series functions

| Function              | Description                                                                                     |
| :-------------------- | :---------------------------------------------------------------------------------------------- |
| TIME_BUCKET_GAPFILL() | Returns a contiguous set of time bucketed data.                                                 |
| DATEBIN()             | Bins the input timestamp into a specified interval.                                             |
| DATE_TRUNC()          | Truncates a timestamp expression based on the date part specified, such as hour, day, or month. |
| DATE_PART()           | Returns the specified part of a date.                                                           |
| NOW()                 | Returns the current time.                                                                       |
|                       
                 
#### Examples

```sql
SELECT time_bucket_gapfill('1 day', time) as day,
"degrees", "location", "time"
FROM "h2o_temperature"

SELECT DATE_BIN(INTERVAL '1 hour', time, '2019-09-18T00:00:00Z'::timestamp),
SUM(water_level)
FROM "h2o_feet"
GROUP BY time

SELECT DATE_TRUNC('month',time) AS "date",
SUM(water_level)
FROM "h2o_feet"
GROUP BY time
```

### Approximate functions

| Function      | Description                                    |
| :------------ | :--------------------------------------------- |
| APPROX_MEDIAN | Returns the approximate median of input values. |


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
                                                                                                           |

### Regular expression functions

| Function       | Description                                                                   |
| :------------- | :---------------------------------------------------------------------------- |
| REGEXP_MATCH   | Matches a regular expression against a string and returns matched substrings. |
| REGEXP_REPLACE | Replaces substrings that match a regular expression by a new substring.       |

