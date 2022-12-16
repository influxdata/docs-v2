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

InfluxDB SQL supports the following basic syntax for queries:

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
