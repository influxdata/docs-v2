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

### Identifiers

An identifier is the name of an object, such as a [`bucket`](/cloud/reference/glossary/#bucket) name (database name), `measurement` name, `tag key`, and `field key`.

### Quoting

Rules for quoting:

- Single quote string literals
- Single quote ime durations  
- Double quote database identifiers (column names)


The following queries will still both return results:

```sql
SELECT location, water_level 
  FROM h2o_feet

SELECT "location","water_level" 
  FROM "h2o_feet"
```
However, a good rule of thumb is to double quote all database identifiers.


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

Comparison operators compare numbers or strings and perform evaluations.

| Operator | Meaning                  |
|:--------:|:--------                 |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |

### Duration Units

Duration units specify a length of time.  You must spell out the unit of time.  

```sql
Correct:

interval'400 minutes'

Incorrect:
interval'400m'
```

Supported durations:

| Unit        | Meaning |
| :---------- | :------ |
| nanoseconds |         |
| minutes     |         |
|             |         |

### SQL keywords

| Keyword         | Description                                                                   |
| :-------------- | :---------------------------------------------------------------------------- |
| AND             | Include columns where all conditions are true                                 |
| AS              | Renames a column with an alias                                                |
| ASC             | Sorts query results in ascending order                                        |
| DESC            | Sorts query results in descending order                                       |
| DISTINCT        | Selects only distinct values                                                  |
| EXISTS          |                                                                               |
| EXPLAIN         | Shows the logical and physical execution plan for a specified SQL statement   |
| FROM            | Specifies the measurement from which to select data                           |
| GROUP BY        | Groups results by aggregate function                                          |
| HAVING          | The HAVING clause places conditions on results created by the GROUP BY clause |
| IN              |                                                                               |
| INNER JOIN      |                                                                               |
| IS NULL         |                                                                               |
| IS NOT NULL     |                                                                               |
| JOIN            | Combines results from two or more tables into one data set                 |
| LEFT JOIN       |                                                                               |
| LIMIT           |                                                                               |
| NOT             |                                                                               |
| NOT EXISTS      |                                                                               |
| NOT IN          |                                                                               |
| NOT NULL        |                                                                               |
| OR              |                                                                               |
| ORDER BY        | Orders results by the referenced expression                                   |
| OUTER JOIN      |                                                                               |
| RIGHT JOIN      |                                                                               |
| SELECT          | Retrieves rows from a table (measurement)                                     |
| SELECT DISTINCT | Returns only distinct (different) values                                      |
| UNION           |                                                                               |
| WHERE           |                                                                               |
| WITH            |                                                                               |


### Statements and clauses

| Statement | Description                                         |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  SELECT  | Use the SQL SELECT statement to query data from a specific measurement or measurments. See [The SELECT statementint](fluxdb/cloud-iox/sql/explore-data/select/ ) |
|  FROM |   The FROM clause always accompanies the SELECT statement.  |
|  JOIN |  | 
| WHERE |  |
| GROUP BY |  |
| HAVING |  |
| UNION | Use the UNION clause to combine the results of two or more SELECT statements without returning any duplicate rows. |
| ORDER BY |  |
| LIMIT |  |
| WITH |  |
| OVER | Used with SQL window functions. |

## Functions

#### Aggregates
| Function | Description |
| :------- | :---------- |
| COUNT    |             |
| AVG      |             |
| SUM      |             |

#### Selectors

Selector functions are unique to time series databases. They behave like aggregate functions but there are some key differences.

| Function   | Description |
| :--------- | :---------- |
| FIRST      |             |
| LAST       |             |
| MIN        |             |
| MAX        |             |
| PERCENTILE |             |

#### Time series functions

| Function            | Description              |
| :------------------ | :----------------------- |
| time_bucket_gapfill |                          |
| date_bin            |                          |
| date_trunc          |                          |
| date_part           |                          |
| now()               | Returns the current time |
| from_unixtime       |                          |
