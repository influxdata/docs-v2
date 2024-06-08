---
title: Information schema
description: >
  The `SHOW TABLES`, `SHOW COLUMNS`, and `SHOW ALL` commands return metadata related to
  your data schema.
menu:
  influxdb_clustered:
    parent: SQL reference
weight: 210
---

The underlying query engine for the InfluxDB SQL implementation,
[DataFusion](https://arrow.apache.org/datafusion/index.html), provides commands
that return metadata related to your data schema.
To access this information, use the `SHOW TABLES`, `SHOW COLUMNS`, and
`SHOW ALL` commands or query views in the [ISO](https://www.iso.org/) SQL
`information_schema` schema.

<!-- vale Clustered.Schema= NO -->

In the context of {{% product-name %}}, a [measurement](/influxdb/clustered/reference/glossary/#measurement)
is represented as a [table](/influxdb/clustered/reference/glossary/#table). Time, [tags](/influxdb/clustered/reference/glossary/#tag),
and [fields](/influxdb/clustered/reference/glossary/#field) are each represented
by columns in a table.

<!-- vale Clustered.Schema= YES -->

- [SHOW TABLES](#show-tables)
  - [Example SHOW TABLES output](#example-show-tables-output)
- [SHOW COLUMNS](#show-columns)
  - [Example SHOW COLUMNS output](#example-show-columns-output)
- [SHOW ALL](#show-all)
  - [Example SHOW ALL output](#view-show-all-example-output)

## SHOW TABLES

Returns information about tables (measurements) in an InfluxDB database.

```sql
SHOW TABLES
```

You can also query the `information_schema.tables` view:

```sql
SELECT * FROM information_schema.tables
```

#### Example SHOW TABLES output

_Measurements are those that use the **`iox` table schema**._

| table_catalog | table_schema       | table_name  | table_type |
| :------------ | :----------------- | :---------- | :--------- |
| public        | iox                | home        | BASE TABLE |
| public        | system             | queries     | BASE TABLE |
| public        | information_schema | tables      | VIEW       |
| public        | information_schema | views       | VIEW       |
| public        | information_schema | columns     | VIEW       |
| public        | information_schema | df_settings | VIEW       |

## SHOW COLUMNS

Returns information about the schema of a table (measurement) in an InfluxDB database.

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

#### Example SHOW COLUMNS output

| table_catalog | table_schema | table_name | column_name | data_type                   | is_nullable |
| :------------ | :----------- | :--------- | :---------- | :-------------------------- | :---------- |
| public        | iox          | home       | co          | Int64                       | YES         |
| public        | iox          | home       | hum         | Float64                     | YES         |
| public        | iox          | home       | room        | Dictionary(Int32, Utf8)     | YES         |
| public        | iox          | home       | temp        | Float64                     | YES         |
| public        | iox          | home       | time        | Timestamp(Nanosecond, None) | NO          |

## SHOW ALL

Returns the configuration options of the current session.

```sql
SHOW ALL
```

You can also query the `information_schema.df_settings` view:

```sql
SELECT * FROM information_schema.df_settings
```

{{< expand-wrapper >}}
{{% expand "View `SHOW ALL` example output" %}}

| name                                                      | setting  |
| :-------------------------------------------------------- | :------- |
| datafusion.catalog.create_default_catalog_and_schema      | true     |
| datafusion.catalog.default_catalog                        | public   |
| datafusion.catalog.default_schema                         | iox      |
| datafusion.catalog.format                                 |          |
| datafusion.catalog.has_header                             | false    |
| datafusion.catalog.information_schema                     | true     |
| datafusion.catalog.location                               |          |
| datafusion.execution.batch_size                           | 8192     |
| datafusion.execution.coalesce_batches                     | true     |
| datafusion.execution.collect_statistics                   | false    |
| datafusion.execution.parquet.enable_page_index            | false    |
| datafusion.execution.parquet.metadata_size_hint           |          |
| datafusion.execution.parquet.pruning                      | true     |
| datafusion.execution.parquet.pushdown_filters             | true     |
| datafusion.execution.parquet.reorder_filters              | true     |
| datafusion.execution.parquet.skip_metadata                | true     |
| datafusion.execution.target_partitions                    | 4        |
| datafusion.execution.time_zone                            | +00:00   |
| datafusion.explain.logical_plan_only                      | false    |
| datafusion.explain.physical_plan_only                     | false    |
| datafusion.optimizer.enable_round_robin_repartition       | true     |
| datafusion.optimizer.filter_null_join_keys                | false    |
| datafusion.optimizer.hash_join_single_partition_threshold | 1048576  |
| datafusion.optimizer.max_passes                           | 3        |
| datafusion.optimizer.prefer_hash_join                     | true     |
| datafusion.optimizer.repartition_aggregations             | true     |
| datafusion.optimizer.repartition_file_min_size            | 10485760 |
| datafusion.optimizer.repartition_file_scans               | true     |
| datafusion.optimizer.repartition_joins                    | true     |
| datafusion.optimizer.repartition_sorts                    | false    |
| datafusion.optimizer.repartition_windows                  | true     |
| datafusion.optimizer.skip_failed_rules                    | true     |
| datafusion.optimizer.top_down_join_key_reordering         | true     |
| datafusion.sql_parser.enable_ident_normalization          | true     |
| datafusion.sql_parser.parse_float_as_decimal              | false    |

{{% /expand %}}
{{< /expand-wrapper >}}
