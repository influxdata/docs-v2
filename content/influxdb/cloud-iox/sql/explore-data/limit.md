---
title: The LIMIT clause
list_title: The LIMIT clause
description: > 
    Use the `LIMIT` clause to filter query results based on a spcified condition.
menu:
  influxdb_cloud_iox:
    name: The LIMIT clause
    parent: Explore data using SQL
weight: 270
---


The `LIMIT clause` limits the number of rows to be a maximum of count rows. count should be a non-negative integer.

Example:

SELECT age, person FROM table
LIMIT 10