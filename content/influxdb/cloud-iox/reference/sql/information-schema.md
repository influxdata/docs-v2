---
title: Information schema
description: > 
    ...
menu:
  influxdb_cloud_iox:
    parent: SQL reference
weight: 210
---

DataFusion supports showing metadata about the tables and views available.
This information can be accessed using the views of the ISO SQL `information_schema`
schema or the DataFusion specific `SHOW TABLES` and `SHOW COLUMNS` commands.

## SHOW TABLES

To show tables in the DataFusion catalog, use the SHOW TABLES command:

```sql
SHOW TABLES
```

You can also query the `information_schema.tables` view:

```sql
SELECT * FROM information_schema.tables
```

## SHOW COLUMNS

To show the schema of a table in DataFusion, use the `SHOW COLUMNS` command.

```sql
SHOW COLUMNS FROM example_table
```

You can also query the `information_schema.columns` view:

```sql
SELECT
  table_catalog,
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'example_table'
```

## SHOW ALL

To show the current session configuration options, use the SHOW ALL command:

```sql
SHOW ALL
```

You can also query the `information_schema.df_settings` view:

```sql
SELECT * FROM information_schema.df_settings
```