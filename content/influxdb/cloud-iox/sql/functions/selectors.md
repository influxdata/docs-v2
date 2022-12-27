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


Unique to InfluxDB and IOX - selectors are a time series concept.  they behave similar to aggragte funciton.  Similar in that you have a table full of values and you select a row or multiple rows of values and return a table with fewer values. They should only return one value.  Max and min may return multiple values fi the value is a tie.


it's way of reducing the data. 

Aggregate will modify a value and return the value.  A selector says "here's the row per the logic you have chosen". 

first

last

max 

min

percentile


### Last() function

When using this function you must specify it as `selector_last`.


Examples:


SELECT
    selector_last(request, time)['value']
FROM 
    measurement_name