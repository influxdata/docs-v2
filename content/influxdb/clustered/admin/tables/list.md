---
title: List tables
description: >
  Use the [`SHOW TABLES` SQL statement](/influxdb/clustered/query-data/sql/explore-schema/#list-measurements-in-a-database)
  or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb/clustered/query-data/influxql/explore-schema/#list-measurements-in-a-database)
  to list tables in a database.
menu:
  influxdb_clustered:
    parent: Manage tables
weight: 201
list_code_example: |
  ###### SQL

  ```sql
  SHOW TABLES
  ```

  ###### InfluxQL
  
  ```sql
  SHOW MEASUREMENTS
  ```
related:
  - /influxdb/clustered/query-data/sql/explore-schema/
  - /influxdb/clustered/query-data/influxql/explore-schema/
---

Use the [`SHOW TABLES` SQL statement](/influxdb/clustered/query-data/sql/explore-schema/#list-measurements-in-a-database)
or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb/clustered/query-data/influxql/explore-schema/#list-measurements-in-a-database)
to list tables in a database.

{{% note %}}
With {{< product-name >}}, tables and measurements are synonymous.
{{% /note %}}

###### SQL

```sql
SHOW TABLES
```

###### InfluxQL

```sql
SHOW MEASUREMENTS
```

## List tables with the influxctl CLI

To list tables using the `influxctl` CLI, use the `influxctl query` command to pass
the `SHOW TABLES` SQL statement.

{{% note %}}
The `influxctl query` command only supports SQL queries; not InfluxQL.
{{% /note %}}

Provide the following with your command:

- **Database token**: [database token](/influxdb/clustered/admin/tokens/#database-tokens)
  with read permissions on the queried database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: Name of the database to query. Uses the `database` setting
  from the [`influxctl` connection profile](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--database` command flag.
- **SQL query**: SQL query with the `SHOW TABLES` statement.

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "SHOW TABLES"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with read access to the queried database
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to query

