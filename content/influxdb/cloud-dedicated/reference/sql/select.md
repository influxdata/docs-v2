---
title: SELECT statement
description: >
  Use the SQL `SELECT` statement to query data from a measurement.
menu:
  influxdb_cloud_dedicated:
    name: SELECT statement
    parent: SQL reference
weight: 201
related:
  - /influxdb/cloud-dedicated/reference/sql/subqueries/
---

Use the `SELECT` statement to query data from an InfluxDB measurement.
The `SELECT` clause is required when querying data in SQL.

- [Syntax](#syntax)
- [Examples](#examples)

### Syntax

```sql
SELECT a, b, "time" FROM <measurement>
```

{{% note %}}
**Note:** When querying InfluxDB, the `SELECT` statement **always requires** a `FROM` clause.
{{% /note %}}

The SELECT clause supports the following:

 - `SELECT *` - return all tags, fields and timestamps.
 - `SELECT DISTINCT` to return all distinct (different) values. 
 - `SELECT <"field" or "tag">` - returns a specified field or tag.
 - `SELECT <"field" or "tag">, <"field" or "tag">` - returns more than one tag or field.
 - `SELECT <"field"> AS a `- return the field as the alias.

## Examples

The following examples use data from the NOAA database. 
To download the NOAA test data see [NOAA water sample data](/influxdb/v2/reference/sample-data/#noaa-water-sample-data).

### Select all fields and tags from a measurement

```sql
SELECT * FROM h2o_feet LIMIT 10
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
| level description         | location     | time                     | water_level |
| :------------------------ | :----------- | :----------------------- | :---------- |
| at or greater than 9 feet | coyote_creek | 2019-09-01T00:00:00.000Z | 9.126144144 |
| at or greater than 9 feet | coyote_creek | 2019-09-01T00:06:00.000Z |       9.009 |
| between 6 and 9 feet      | coyote_creek | 2019-09-01T00:12:00.000Z |       8.862 |
| between 6 and 9 feet      | coyote_creek | 2019-09-01T00:18:00.000Z |       8.714 |
{{% /expand %}}
{{< /expand-wrapper >}}

### Select specific tags and fields from a measurement

```sql
SELECT "location", "water_level" FROM "h2o_feet"
```

{{< expand-wrapper >}}
{{% expand "View example results" "1" %}}
| location     | water_level |
| :----------- | :---------- |
| coyote_creek | 9.126144144 |
| coyote_creek | 9.009       |
| coyote_creek | 8.862       |
| coyote_creek | 8.714       |
| coyote_creek | 8.547       |
{{% /expand %}}
{{< /expand-wrapper >}}

### Select a field, tag and timestamp from a measurement

```sql
SELECT "water_level", "location", "time" FROM "h2o_feet"
```

{{< expand-wrapper >}}
{{% expand "View example results" "2" %}}
| location     | time                     | water_level |
| :----------- | :----------------------- | :---------- |
| coyote_creek | 2019-08-20T00:00:00.000Z | 8.638       |
| coyote_creek | 2019-08-20T00:06:00.000Z | 8.658       |
| coyote_creek | 2019-08-20T00:12:00.000Z | 8.678       |
{{% /expand %}}
{{< /expand-wrapper >}}

### Select a field and perform basic arithmetic

The following query takes the value of water_level, multiplies it by 3 and adds 5 to the result.

```sql
SELECT ("water_level" * 3) + 5 FROM "h2o_feet"
```

{{< expand-wrapper >}}
{{% expand "View example results" "3" %}}
| water_level        |
| :----------------- |
| 30.128             |
| 30.641000000000002 |
| 31.142000000000003 |
| 31.586             |
| 32.027             |
| 32.378432432       |
{{% /expand %}}
{{< /expand-wrapper >}}

