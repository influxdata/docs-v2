---
title: WHERE clause
list_title: WHERE clause
description: > 
  Use the `WHERE` clause to filter results based on fields, tags, or timestamps.
menu:
  influxdb_cloud_iox:
    name: WHERE clause
    parent: SQL reference
weight: 202
---

Use the `WHERE` clause to filter results based on fields, tags, or timestamps.

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
```

{{% note %}}
**Note:** Unlike InfluxQL, SQL **supports** `OR` in the `WHERE` clause to specify multiple conditions, including time ranges.
{{% /note %}}

## Examples

Note that single quotes are required for string literals in the `WHERE` clause. 

### Filter data based on field values

```sql
SELECT * 
FROM "h2o_feet" 
WHERE "water_level" >= 9.78
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns data from the `h2o_feet` measurement with `water_level` field values
that are greater than or equal to 9.78.

| level description         | location     | time                     | water_level |
| :------------------------ | :----------- | :----------------------- | :---------- |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:06:00.000Z | 9.8         |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:12:00.000Z | 9.829       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:18:00.000Z | 9.862       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:24:00.000Z | 9.892       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:30:00.000Z | 9.902       |
| at or greater than 9 feet | coyote_creek | 2019-09-01T23:36:00.000Z | 9.898       |

{{% /expand %}}
{{< /expand-wrapper >}}


### Filter data based on specific tag and field values

```sql
SELECT * 
FROM "h2o_feet" 
WHERE "location" = 'santa_monica' and "level description" = 'below 3 feet' 
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns all data from the `h2o_feet` measurement with the `location` tag key, `santa_monica`,
and a `level description` field value that equals `below 3 feet`.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-09-01T00:00:00.000Z | 1.529       |
| below 3 feet      | santa_monica | 2019-09-01T00:06:00.000Z | 1.444       |
| below 3 feet      | santa_monica | 2019-09-01T00:12:00.000Z | 1.335       |
| below 3 feet      | santa_monica | 2019-09-01T00:18:00.000Z | 1.345       |
| below 3 feet      | santa_monica | 2019-09-01T00:24:00.000Z | 1.27        |

{{% /expand %}}
{{< /expand-wrapper >}}

###  Filter data within a specific time period

```sql
SELECT *
FROM h2o_feet 
WHERE "location" = 'santa_monica'
AND "time" >= '2019-08-19T12:00:00Z'::timestamp AND "time" <= '2019-08-19T13:00:00Z'::timestamp 
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns results with timestamps greater than or equal to `08-19-2019T12:00:00Z` and
less than or equal to  `08-19-2019T13:00:00Z`.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | santa_monica | 2019-08-19T12:00:00.000Z | 2.533       |
| below 3 feet      | santa_monica | 2019-08-19T12:06:00.000Z | 2.543       |
| below 3 feet      | santa_monica | 2019-08-19T12:12:00.000Z | 2.385       |
| below 3 feet      | santa_monica | 2019-08-19T12:18:00.000Z | 2.362       |
| below 3 feet      | santa_monica | 2019-08-19T12:24:00.000Z | 2.405       |
| below 3 feet      | santa_monica | 2019-08-19T12:30:00.000Z | 2.398       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Filter data using the OR operator

```sql
SELECT *
FROM "h2o_feet"
WHERE "level description" = 'less than 3 feet' OR "water_level" < 2.5
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

The query returns results with a `level description` field value equal to `less than 3 feet` or a `water_level` field value less than 2.5.

| level description | location     | time                     | water_level |
| :---------------- | :----------- | :----------------------- | :---------- |
| below 3 feet      | coyote_creek | 2019-08-25T10:06:00.000Z | 2.398       |
| below 3 feet      | coyote_creek | 2019-08-25T10:12:00.000Z | 2.234       |
| below 3 feet      | coyote_creek | 2019-08-25T10:18:00.000Z | 2.064       |
| below 3 feet      | coyote_creek | 2019-08-25T10:24:00.000Z | 1.893       |

{{% /expand %}}
{{< /expand-wrapper >}}
