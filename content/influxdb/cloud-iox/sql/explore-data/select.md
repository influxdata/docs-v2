---
title: The SELECT statement
list_title: The SELECT statement
description: >
  Use the SQL SELECT statement to query data from a specific measurement or measurments.
menu:
  influxdb_cloud_iox:
    name: The SELECT statement
    parent: Explore data
weight: 220
---

You can download test data from the 


- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

DataFusion supports the following syntax for queries:

[ WITH with_query [, …] ]  
SELECT [ ALL | DISTINCT ] select_expr [, …]  
[ FROM from_item [, …] ]  
[ JOIN join_item [, …] ]  
[ WHERE condition ]  
[ GROUP BY grouping_element [, …] ]  
[ HAVING condition]  
[ UNION [ ALL | select ]  
[ ORDER BY expression [ ASC | DESC ][, …] ]  
[ LIMIT count ]  

Use the SELECT statement to query data from a specific measurement or measurments.  

```sql
SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
```

{{% note %}}
**Note:** The `SELECT` statement **requires** a `SELECT` clause and a `FROM` clause.
{{% /note %}}

### Examples

Select all fields and tags from a measurement:

```sql
SELECT * from h2o_feet
```

Output:
| level description         | location     | time                     | water_level |
| :------------------------ | :----------- | :----------------------- | :---------- |
| at or greater than 9 feet | coyote_creek | 2019-09-01T00:00:00.000Z | 9.126144144 |
| at or greater than 9 feet | coyote_creek | 2019-09-01T00:06:00.000Z |       9.009 |
| between 6 and 9 feet      | coyote_creek | 2019-09-01T00:12:00.000Z |       8.862 |
| between 6 and 9 feet      | coyote_creek | 2019-09-01T00:18:00.000Z |       8.714 |


Select specific tags and fields from a measurement:

```sql
SELECT "location","pH" FROM "h2o_pH"
```
Output:
| location     | pH  |
| :----------- | :-- |
| coyote_creek | 8   |
| coyote_creek | 6   |
| coyote_creek | 6   |
| coyote_creek | 7   |
| coyote_creek | 7   |     


