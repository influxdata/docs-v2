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


The `LIMIT clause` limits the number of rows to be a maximum of count rows. The count should be a non-negative integer.

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax



### Examples

Limit by a specified number

```sql
SELECT "water_level","location" 
FROM "h2o_feet" 
LIMIT 5
```

Results:

| location     | water_level |
| :----------- | :---------- |
| coyote_creek | 4.206       |
| coyote_creek | 4.052       |
| coyote_creek | 3.901       |
| coyote_creek | 3.773       |
| coyote_creek | 3.632       |
