---
title: The HAVING clause
list_title: The HAVING clause
description: > 
    Use the `HAVING` clause to filter query results based on a spcified condition.
menu:
  influxdb_cloud_iox:
    name: The HAVING clause
    parent: Explore data using SQL
weight: 250
---


The HAVING clause places conditions on results created by the GROUP BY clause.  The HAVING cluase must follow the GROUP BY clause but precede the ORDER BY clause.

```sql
SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY
```

Example:

SELECT a, b, MAX(c) FROM table GROUP BY a, b HAVING MAX(c) > 10
