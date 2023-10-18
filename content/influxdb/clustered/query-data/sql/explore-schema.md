---
title: Explore your schema with SQL
description: >
  When working with InfluxDB's implementation of SQL, a **measurement** is
  structured as a table, and **time**, **fields**, and **tags** are structured
  as columns.
menu:
  influxdb_clustered:
    name: Explore your schema
    parent: Query with SQL
    identifier: query-sql-schema
weight: 201
influxdb/clustered/tags: [query, sql]
list_code_example: |
  ##### List measurements
  ```sql
  SHOW TABLES
  ```

  ##### List columns in a measurement
  ```sql
  SHOW COLUMNS IN measurement
  ```
---

{{% sql/sql-schema-intro %}}

## List measurements in a database

Use `SHOW TABLES` to list measurements in your InfluxDB database.

```sql
SHOW TABLES
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

Tables listed with the `table_schema` of `iox` are measurements.
Tables with `system` or `information_schema` table schemas are system tables that
store internal metadata.

| table_catalog | table_schema       | table_name  | table_type |
| :------------ | :----------------- | :---------- | ---------: |
| public        | iox                | home        | BASE TABLE |
| public        | iox                | noaa        | BASE TABLE |
| public        | system             | queries     | BASE TABLE |
| public        | information_schema | tables      |       VIEW |
| public        | information_schema | views       |       VIEW |
| public        | information_schema | columns     |       VIEW |
| public        | information_schema | df_settings |       VIEW |

{{% /expand %}}
{{< /expand-wrapper >}}

## List columns in a measurement

Use the `SHOW COLUMNS` statement to view what columns are in a measurement.
Use the `IN` clause to specify the measurement.

```sql
SHOW COLUMNS IN home
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

| table_catalog | table_schema | table_name | column_name | data_type                   | is_nullable |
| :------------ | :----------- | :--------- | :---------- | :-------------------------- | ----------: |
| public        | iox          | home       | co          | Int64                       |         YES |
| public        | iox          | home       | hum         | Float64                     |         YES |
| public        | iox          | home       | room        | Dictionary(Int32, Utf8)     |         YES |
| public        | iox          | home       | temp        | Float64                     |         YES |
| public        | iox          | home       | time        | Timestamp(Nanosecond, None) |          NO |

{{% /expand %}}
{{< /expand-wrapper >}}
