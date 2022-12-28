---
title: The ORDER BY clause
list_title: The ORDER BY clause
description: > 
    Use the ORDER BY clause to filter data based on fields, tags, and/or timestamps.
menu:
  influxdb_cloud_iox:
    name: The ORDER BY clause
    parent: Explore data using SQL
weight: 230
---

The ORDER BY clause orders results by the referenced expression.  The result order is ASC **by default**.

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

```sql
[SELECT CLAUSE] [FROM CLAUSE] [ ORDER BY expression [ ASC | DESC ][, …] ]
```

### Examples

Return points grouping by tag key in descending order

```sql
SELECT "water_level" 
FROM "h2o_feet" 
WHERE "location" = 'coyote_creek'  
ORDER BY time DESC
```

Results:

| water_level |
| :---------- |
| 3.235       |
| 3.314       |
| 3.402       |
| 3.497       |
| 3.599       |
| 3.704       |


The query returns 


```sql
SELECT "water_level" 
    FROM "h2o_feet" 
    WHERE "location" = 'coyote_creek'  
    ORDER BY time DESC
```
