---
title: List tables
description: >
  Use the Admin UI, the [`influxctl table list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/list/),
  the [`SHOW TABLES` SQL statement](/influxdb3/cloud-dedicated/query-data/sql/explore-schema/#list-measurements-in-a-database),
  or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb3/cloud-dedicated/query-data/influxql/explore-schema/#list-measurements-in-a-database)
  to list tables in a database.
menu:
  influxdb3_cloud_dedicated:
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
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/table/list/
  - /influxdb3/cloud-dedicated/query-data/sql/explore-schema/
  - /influxdb3/cloud-dedicated/query-data/influxql/explore-schema/
---

Use the Admin UI, the [`influxctl table list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/list/),
the [`SHOW TABLES` SQL statement](/influxdb3/cloud-dedicated/query-data/sql/explore-schema/#list-measurements-in-a-database),
or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb3/cloud-dedicated/query-data/influxql/explore-schema/#list-measurements-in-a-database)
to list tables in a database.

> [!Note]
> With {{< product-name >}}, tables and measurements are synonymous.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#admin-ui)
[influxctl](#influxctl)
[SQL & InfluxQL](#sql--influxql)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------>

The InfluxDB Cloud Dedicated administrative UI includes a portal for managing
tables. You can view the list of tables associated with a database and
their details.

{{< admin-ui-access >}}

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-tables.png" alt="InfluxDB Cloud Dedicated Admin UI tables list" />}}

Use the **Tables** page to manage tables within databases:

- Select a database from the dropdown to view its tables.
- View table IDs and sizes.
- See database size summary.
- Create new tables.
- Access detailed table schema information.

You can **Search** for tables by name or ID to filter the list and use the
sort button and column headers to sort the list.

<!-------------------------------- END ADMIN UI ------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN INFLUXCTL ------------------------------>

Use the [`influxctl table list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/list/)
to list all tables in a database in your {{< product-name omit=" Cluster" >}} cluster.

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

- **Database token**: [Database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with read permissions on the queried database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: Name of the database to query. Uses the `database` setting
  from the [`influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
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

<!------------------------------ END SQL/INFLUXQL ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}
