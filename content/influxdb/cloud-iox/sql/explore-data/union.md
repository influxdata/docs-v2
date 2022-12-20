---
title: The UNION clause
list_title: The UNION clause
description: > 
    Use the `UNION` clause to combine the results of two or more SELECT statements without returning any duplicate rows.
menu:
  influxdb_cloud_iox:
    name: The UNION clause
    parent: Explore data using SQL
weight: 295
---


- [Syntax](#syntax)
- [Examples](#examples)


### Syntax

SELECT
    a,
    b,
    c
FROM table1
UNION ALL
SELECT
    a,
    b,
    c
FROM table2