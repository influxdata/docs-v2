---
title: The JOIN clause
list_title: The JOIN clause
description: > 
    Use the `JOIN` clause to combine the results of two or more SELECT statements without returing any duplicate rows.
menu:
  influxdb_cloud_iox:
    name: The JOIN clause
    parent: Explore data using SQL
weight: 290
---






DataFusion supports INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN, and CROSS JOIN.

The following examples are based on this table:

SELECT * from h2o_

INNER JOIN

The keywords JOIN or INNER JOIN define a join that only shows rows where there is a match in both tables.

LEFT OUTER JOIN

The keywords LEFT JOIN or LEFT OUTER JOIN define a join that includes all rows from the left table even if there is not a match in the right table. When there is no match, null values are produced for the right side of the join.

RIGHT OUTER JOIN

The keywords RIGHT JOIN or RIGHT OUTER JOIN define a join that includes all rows from the right table even if there is not a match in the left table. When there is no match, null values are produced for the left side of the join.

FULL OUTER JOIN

The keywords FULL JOIN or FULL OUTER JOIN define a join that is effectively a union of a LEFT OUTER JOIN and RIGHT OUTER JOIN. It will show all rows from the left and right side of the join and will produce null values on either side of the join where there is not a match.

CROSS JOIN

A cross join produces a cartesian product that matches every row in the left side of the join with every row in the right side of the join.

