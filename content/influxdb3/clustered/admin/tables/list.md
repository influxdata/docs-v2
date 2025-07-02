---
title: List tables
description: >
  Use the [`influxctl table list` command](/influxdb3/clustered/reference/cli/influxctl/table/list/),
  the [`SHOW TABLES` SQL statement](/influxdb3/clustered/query-data/sql/explore-schema/#list-measurements-in-a-database),
  or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb3/clustered/query-data/influxql/explore-schema/#list-measurements-in-a-database)
  to list tables in a database.
menu:
  influxdb3_clustered:
    parent: Manage tables
weight: 201
list_code_example: |
  ##### CLI
  ```sh
  influxctl table list <DATABASE_NAME>
  ```

  ##### SQL

  ```sql
  SHOW TABLES
  ```

  ##### InfluxQL
  
  ```sql
  SHOW MEASUREMENTS
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/table/list/
  - /influxdb3/clustered/query-data/sql/explore-schema/
  - /influxdb3/clustered/query-data/influxql/explore-schema/
---

Use the [`influxctl table list` command](/influxdb3/clustered/reference/cli/influxctl/table/list/),
the [`SHOW TABLES` SQL statement](/influxdb3/clustered/query-data/sql/explore-schema/#list-measurements-in-a-database),
or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb3/clustered/query-data/influxql/explore-schema/#list-measurements-in-a-database)
to list tables in a database.

> [!Note]
> With {{< product-name >}}, tables and measurements are synonymous.

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#influxctl)
[SQL & InfluxQL](#sql--influxql)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->

Use the [`influxctl table list` command](/influxdb3/clustered/reference/cli/influxctl/table/list/)
to list all tables in a database in your {{< product-name omit=" Cluster" >}}.

{{% code-placeholders "DATABASE_NAME" %}}
<!-- pytest.mark.skip -->
```bash
influxctl table list DATABASE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: 
  Name of the database containing the tables to list

### Output formats

The `influxctl table list` command supports the following output formats:

- `table` (default): Human-readable table format
- `json`: JSON format for programmatic use

Use the `--format` flag to specify the output format:

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl table list --format json DATABASE_NAME
```
{{% /code-placeholders %}}

<!------------------------------- END INFLUXCTL ------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN SQL/INFLUXQL ---------------------------->

## List tables with the influxctl query command

To list tables using SQL or InfluxQL, use the `influxctl query` command to pass
the appropriate statement.

### SQL

```sql
SHOW TABLES
```

### InfluxQL

```sql
SHOW MEASUREMENTS
```

Provide the following with your command:

- **Database token**: a [database token](/influxdb3/clustered/admin/tokens/#database-tokens)
  with read permissions on the queried database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: Name of the database to query. Uses the `database` setting
  from the [`influxctl` connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--database` command flag.
- **SQL query**: SQL query with the `SHOW TABLES` statement or InfluxQL query with the `SHOW MEASUREMENTS` statement.

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

##### SQL
<!-- pytest.mark.skip -->
```bash
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "SHOW TABLES"
```

##### InfluxQL
<!-- pytest.mark.skip -->
```bash
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
   --language influxql \
  "SHOW MEASUREMENTS"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with read access to the queried database
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to query

> [!Note]
> The `influxctl query` command only supports SQL queries; not InfluxQL.
> To use InfluxQL, query InfluxDB through the API using InfluxQL request parameters.

<!------------------------------ END SQL/INFLUXQL ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

