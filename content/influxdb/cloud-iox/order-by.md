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

{{% note %}}
**Note:** If your query includes a `GROUP BY` clause, the `ORDER BY` clause must appear **after** the `GROUP BY` clause.
{{% /note %}}

### Examples

Return the most recent data points first:

```sql
SELECT "water_level", "time"
FROM "h2o_feet" 
WHERE "location" = 'coyote_creek'  
ORDER BY time DESC
```

Results:

| time                     | water_level |
| :----------------------- | :----------- |
| 2019-09-17T16:24:00.000Z | 3.235       |
| 2019-09-17T16:18:00.000Z | 3.314       |
| 2019-09-17T16:12:00.000Z | 3.402       |
| 2019-09-17T16:06:00.000Z | 3.497       |
| 2019-09-17T16:00:00.000Z | 3.599       |
| 2019-09-17T15:54:00.000Z | 3.704       |

The query returns the most recent data first.

Return results by tag or field:

```sql
SELECT "water_level", "time", "location"
FROM "h2o_feet" 
ORDER BY "location" 
```

The query returns the most recent results for the location coyote_creek. 

Return results by column order:

```sql
SELECT "location","water_level", "time"
FROM "h2o_feet"
ORDER BY 1, 2
```
| location     | time                     | water_level |
| :----------- | :----------------------- | :---------- |
| coyote_creek | 2019-08-28T14:30:00.000Z | -0.61       |
| coyote_creek | 2019-08-29T15:18:00.000Z | -0.594      |
| coyote_creek | 2019-08-28T14:36:00.000Z | -0.591      |
| coyote_creek | 2019-08-28T14:24:00.000Z | -0.587      |
| coyote_creek | 2019-08-29T15:24:00.000Z | -0.571      |
| coyote_creek | 2019-08-27T13:42:00.000Z | -0.561      |

The query returns results in order by first column `location`, then by the second column `water_level`. 

Return results by field from within a time range:

```sql
SELECT *
FROM "h2o_feet" 
WHERE "location" = 'santa_monica'
AND "time" >= '2019-08-18T10:00:00Z'::timestamp AND "time" <= '2019-08-18T12:00:00Z'::timestamp 
ORDER BY "water_level"
```
Results:

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-18T11:42:00.000Z | 2.064       |
| below 3 feet      | santa_monica | 2019-08-18T11:48:00.000Z | 2.1         |
| below 3 feet      | santa_monica | 2019-08-18T11:54:00.000Z | 2.106       |
| below 3 feet      | santa_monica | 2019-08-18T12:00:00.000Z | 2.129       |
| below 3 feet      | santa_monica | 2019-08-18T11:36:00.000Z | 2.178       |
| below 3 feet      | santa_monica | 2019-08-18T11:30:00.000Z | 2.277       |

The query return results from August 18, 2019 between 10:00am and 12:00pm by water_level ascending.
