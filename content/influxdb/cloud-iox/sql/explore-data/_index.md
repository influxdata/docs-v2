---
title: Explore data using SQL
description: >
  Explore time series data using SQL.
menu:
  influxdb_cloud_iox:
    name: Explore data using SQL
    parent: Query data with SQL
weight: 201
---

There are a few points to rmember when creating SQL queries.  The first is that keywords in SQL are not case sensitive.  
Both SELECT and select will reutn results without error. The second is that a query can be written on any number of lines.  You can create a multi-clause query on one line or separate each clause on a new line.  

InfluxDB SQL supports the following basic syntax for queries:

```sql
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
```