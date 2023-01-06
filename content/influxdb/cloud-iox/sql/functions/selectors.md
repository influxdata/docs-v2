---
title: SQL selector functions
list_title: Selector functions
description: >
  Select data with SQL selector functions.
menu:
  influxdb_cloud_iox:
    name: Selectors
    parent: SQL functions
weight: 230
---

Selector functions are unique to time series databases. They behave like aggragte functions but there are key differences that should be noted.


These functions are unique to InfluxDB SQL. Similar in that you have a table full of values and you select a row or multiple rows of values and return a table with fewer values. They should only return one value.  Max and min may return multiple values if the value is a tie.


Use selector function to reduce the size of your results set. 

Aggregate will modify a value and return the value.  A selector says "here's the row per the logic you have chosen". 

### The SELECTOR_MIN() function

SELECT SELECTOR_MIN(request, time)['value']
FROM measurement_name


### The SELECTOR_LAST() function

Examples:


