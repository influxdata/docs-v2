---
title: The SELECT statement
list_title: The SELECT statement
description: >
  Use the SQL SELECT statement to query data from a specific measurement or measurments.
menu:
  influxdb_cloud_iox:
    name: The SELECT statement
    parent: Explore data
weight: 210
---

The following examples use data from the NOAA database.  To download NOAA test data see <insert doc name>.

Use the SELECT statement to query data from a specific measurement or measurments.  

The select clause is required.

- [Syntax](#syntax)

- [Examples](#examples)

### Syntax

```sql
SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
```

{{% note %}}
**Note:** The `SELECT` statement **requires** a `SELECT` clause and a `FROM` clause.
{{% /note %}}

### Examples

Select all fields and tags from a measurement, or select all columns from the specified measurement:

```sql
SELECT * 
  FROM h2o_feet
```

Output:
| level description         | location     | time                     | water_level |
| :------------------------ | :----------- | :----------------------- | :---------- |
| at or greater than 9 feet | coyote_creek | 2019-09-01T00:00:00.000Z | 9.126144144 |
| at or greater than 9 feet | coyote_creek | 2019-09-01T00:06:00.000Z |       9.009 |
| between 6 and 9 feet      | coyote_creek | 2019-09-01T00:12:00.000Z |       8.862 |
| between 6 and 9 feet      | coyote_creek | 2019-09-01T00:18:00.000Z |       8.714 |


This is a partial data set.

Select all columns from multiple measurements: - this errored out so I don't know if this will work

SELECT * FROM "h2o_feet","h2o_pH"

Select specific tags and fields from a measurement:

```sql
SELECT "location","water_level" 
  FROM "h2o_feet"
```
Output:
| location     | water_level |
| :----------- | :---------- |
| coyote_creek | 9.126144144 |
| coyote_creek | 9.009       |
| coyote_creek | 8.862       |
| coyote_creek | 8.714       |
| coyote_creek | 8.547       |

Select a filed and perform basic arithmetic:

```sql
SELECT ("water_level" * 3) + 5 
  FROM "h2o_feet"
```
| water_level        |
| :----------------- |
| 32.378432432       |
| 32.027             |
| 31.586             |
| 31.142000000000003 |
| 30.641000000000002 |
| 30.128             |



