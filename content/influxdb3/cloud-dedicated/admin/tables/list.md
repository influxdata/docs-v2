---
title: List tables
description: >
  Use the Admin UI, the [`SHOW TABLES` SQL statement](/influxdb3/cloud-dedicated/query-data/sql/explore-schema/#list-measurements-in-a-database),
  or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb3/cloud-dedicated/query-data/influxql/explore-schema/#list-measurements-in-a-database)
  to list tables in a database.
menu:
  influxdb3_cloud_dedicated:
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
  - /influxdb3/cloud-dedicated/query-data/sql/explore-schema/
  - /influxdb3/cloud-dedicated/query-data/influxql/explore-schema/
---

Use the Admin UI, the [`SHOW TABLES` SQL statement](/influxdb3/cloud-dedicated/query-data/sql/explore-schema/#list-measurements-in-a-database),
or the [`SHOW MEASUREMENTS` InfluxQL statement](/influxdb3/cloud-dedicated/query-data/influxql/explore-schema/#list-measurements-in-a-database)
to list tables in a database.

> [!Note]
> With {{< product-name >}}, tables and measurements are synonymous.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#admin-ui)
[influxctl](#influxctl)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------>
The InfluxDB Cloud Dedicated administrative UI includes a portal for managing
tables. You can view the list of tables associated with a database and
their details, including:

- Name
- Table ID
- Table size (in bytes) 

1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>
2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

   After you log in, the Account Management portal displays [account information](/influxdb3/cloud-dedicated/admin/account/)
   and lists all clusters associated with your account.
3. In the cluster list, find the cluster that contains the database and table. You can **Search** for clusters by name or ID to filter the list and use the sort button and column headers to sort the list.
4. Click the cluster row to view the list of databases associated with the cluster.
5. In the database list, find the database that contains the table. You can **Search** for databases by name or ID to filter the list and use the sort button and column headers to sort the list.
6. Click the database row to view the list of tables associated with the database.
7. The table list displays the following table details:
   - Name
   - Table ID
   - Table size (in bytes)
8. You can **Search** for tables by name or ID to filter the list and use the sort button and column headers to sort the list.

You can **Search** for databases by name or ID to filter the list and use the sort button and column headers to sort the list. 

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ------------------------------>
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

Provide the following with your command:

- **Database token**: [Database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with read permissions on the queried database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: Name of the database to query. Uses the `database` setting
  from the [`influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
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

{{% /tab-content %}}
{{< /tabs-wrapper >}}