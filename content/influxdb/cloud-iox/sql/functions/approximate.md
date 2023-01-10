---
title: SQL approximate functions
list_title: Approximate functions
description: >
  Approximate data with SQL approximate functions.
menu:
  influxdb_cloud_iox:
    name: Approximate
    parent: SQL functions
weight: 250
---


### The APPROX_MEDIAN function

```sql
SELECT approx_median("pH")
FROM "h2o_pH"
```