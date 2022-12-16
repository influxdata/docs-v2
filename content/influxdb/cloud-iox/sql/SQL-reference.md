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

Comparison operators compare compare numbers or strings and perform evaluations.

| Operator | Meaning                  |
|:--------:|:--------                 |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |


### Quoting

Fields can be double quoted, while tag keys are single quoted. You may double quote measurements, but it's not a requirement. 

The following queries will both return results:

```sql
SELECT location, water_level 
  FROM h2o_feet

SELECT "location","water_level" 
  FROM "h2o_feet"
```




### Duration Units




### Statements and clauses

Use a table structure with links?


| Statement | Description                                         |
| :------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  SELECT  | Use the SQL SELECT statement to query data from a specific measurement or measurments. See [The SELECT statementint](fluxdb/cloud-iox/sql/explore-data/select/ ) |
|  FROM |  |
|  JOIN |  |
| WHERE |  |
| GROUP BY |  |
| HAVING |  |
| UNION |  |
| ORDER BY |  |
| LIMIT |  |
| WITH |  |

### Functions

#### Aggregate
| Function | Description                                         |
| :------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MIN |  |
| MAX |  |
| COUNT |  |
| AVG |  |
| SUM |  |

#### Selectors

Selector functions are unique to time series databases. They behave like aggregate functions but there are some key differences.

| Function | Description                                         |
| :------: |
| FIRST|  |
| LAST |  |
| MIN |  |
| MAX |  |
| PERCENTILE|   |