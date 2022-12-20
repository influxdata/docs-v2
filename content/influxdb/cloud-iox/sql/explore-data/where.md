---
title: The WHERE clause
list_title: The WHERE clause
description: > 
    Use the `WHERE` clause to filter data based on fields, tags, and/or timestamps.
menu:
  influxdb_cloud_iox:
    name: The WHERE clause
    parent: Explore data using SQL
weight: 220
---

Use the `WHERE` clause to filter data based on selected columns containing
- fields
- tags
- timestamps

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]

### Examples

```sql
SELECT * 
  FROM "h2o_feet" 
  WHERE "water_level"  >= 9.78
```
Outut:

| level description  | location | time | water_level |
| :----------------- | :-------------------| :------------------| :------- |
|at or greater than 9 feet	|coyote_creek |	2019-09-01T23:06:00.000Z |	9.8|
|at or greater than 9 feet	|coyote_creek |	2019-09-01T23:12:00.000Z |	9.829|
|at or greater than 9 feet	|coyote_creek |	2019-09-01T23:18:00.000Z |	9.862|
|at or greater than 9 feet	|coyote_creek |	2019-09-01T23:24:00.000Z |	9.892|
|at or greater than 9 feet	|coyote_creek |	2019-09-01T23:30:00.000Z |	9.902|
|at or greater than 9 feet	|coyote_creek |	2019-09-01T23:36:00.000Z |	9.898|

The query returns data from the measurement h2o_feet with field values of water_level that are greater than or equal to 9.78. This is a partial data set.

```sql
SELECT * 
  FROM "h2o_feet" 
  WHERE "location" = 'santa_monica' and "level description" = 'below 3 feet' 
```
Output:

| level description  | location | time | water_level |
| :----------------- | :-------------------| :---------------------| :--------------- |
|below 3 feet |	santa_monica | 2019-09-01T00:00:00.000Z	| 1.529 |
|below 3 feet |	santa_monica | 2019-09-01T00:06:00.000Z | 1.444 |
|below 3 feet |	santa_monica | 2019-09-01T00:12:00.000Z | 1.335 |
|below 3 feet |	santa_monica | 2019-09-01T00:18:00.000Z | 1.345 |
|below 3 feet |	santa_monica | 2019-09-01T00:24:00.000Z | 1.27 |

The query returns all data from the `h2o_feet` measurement with the location tag key `santa_monica` and field value of `level description` that equals the `below 3 feet` string. This is a partial data set.

Select data with specific tag key and field key values



