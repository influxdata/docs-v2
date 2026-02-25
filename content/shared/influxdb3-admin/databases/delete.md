
Use the [`influxdb3 delete database` command](/influxdb3/version/reference/cli/influxdb3/delete/database/),
the [HTTP API](/influxdb3/version/api/v3/), or [InfluxDB 3 Explorer](/influxdb3/explorer/) to delete a database from {{< product-name >}}.

> [!Caution]
> #### Deleting a database cannot be undone
>
> Deleting a database is a destructive action.
> Once a database is deleted, data stored in that database cannot be recovered.

- [Delete a database using the influxdb3 CLI](#delete-a-database-using-the-influxdb3-cli)
- [Delete a database using the HTTP API](#delete-a-database-using-the-http-api)
- [Delete a database using InfluxDB 3 Explorer](#delete-a-database-using-influxdb-3-explorer)
{{% show-in "enterprise" %}}- [Delete data only (preserve schema and resources)](#delete-data-only-preserve-schema-and-resources){{% /show-in %}}

## Delete a database using the influxdb3 CLI

Provide the following:

- Name of the database to delete
- - {{< product-name >}} {{% token-link "admin" "admin" %}}

```sh{placeholders="DATABASE_NAME"}
influxdb3 delete database DATABASE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to delete

Enter `yes` to confirm that you want to delete the database.

## Delete a database using the HTTP API

To delete a database using the HTTP API, send a `DELETE` request to the `/api/v3/configure/database` endpoint:

{{% api-endpoint method="DELETE" endpoint="{{< influxdb/host >}}/api/v3/configure/database" %}}

Include the following in your request:

- **Query parameters**:
  - `db`: Database name to delete
- **Headers**:
  - `Authorization: Bearer` with your {{% token-link "admin" %}}

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
curl --request DELETE "{{< influxdb/host >}}/api/v3/configure/database?db=DATABASE_NAME" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to delete
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Response

A successful deletion returns HTTP status `200` with no content body.

## Delete a database using InfluxDB 3 Explorer

You can also delete databases using the [InfluxDB 3 Explorer](/influxdb3/explorer/) web interface:

1. If you haven't already, see how to [get started with Explorer and connect to your {{% product-name %}} server](/influxdb3/explorer/get-started/).
2. In Explorer, click **Databases** in the left navigation.
3. Find the database you want to delete in the list.
4. Click the **Delete** icon (trash can) next to the database name.
5. In the confirmation dialog, type the database name to confirm.
6. Click **Delete Database**.

> [!Caution]
> This action cannot be undone. All data in the database will be permanently deleted.

For more information, see [Manage databases with InfluxDB 3 Explorer](/influxdb3/explorer/manage-databases/).

{{% show-in "enterprise" %}}
## Delete data only (preserve schema and resources)

{{< product-name >}} supports deleting only the data in a database while preserving the database schema and associated resources.
This is useful when you want to clear old data and re-write new data to the same structure without recreating resources.

### What is preserved

When using the data-only deletion option, the following are preserved:

- **Database schema**: Tables and column definitions
- **Authentication tokens**: Database-scoped access tokens
- **Processing engine configurations**: Triggers and plugin configurations
- **Caches**: Last value caches (LVC) and distinct value caches (DVC)

### Delete data only using the CLI

Use the [`--data-only`](/influxdb3/version/reference/cli/influxdb3/delete/database/#options) flag to delete data while preserving the database schema and resources--for example:

```sh{placeholders="DATABASE_NAME"}
influxdb3 delete database --data-only DATABASE_NAME
```

Replace {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}} with the name of your database.

#### Delete data and remove tables

To delete data and remove table schemas while preserving database-level resources (tokens, triggers, configurations), combine `--data-only` with [`--remove-tables`](/influxdb3/version/reference/cli/influxdb3/delete/database/#options):

```sh{placeholders="DATABASE_NAME"}
influxdb3 delete database --data-only --remove-tables DATABASE_NAME
```

This preserves:
- Authentication tokens
- Processing engine triggers and configurations

But removes:
- All data
- Table schemas
- Table-level caches (LVC and DVC)

### Delete data only using the HTTP API

To delete only data using the HTTP API, include the `data_only=true` query parameter:

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
curl --request DELETE "{{< influxdb/host >}}/api/v3/configure/database?db=DATABASE_NAME&data_only=true" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

#### Delete data and remove tables

To also remove table schemas, add the `remove_tables=true` parameter:

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
curl --request DELETE "{{< influxdb/host >}}/api/v3/configure/database?db=DATABASE_NAME&data_only=true&remove_tables=true" \
  --header "Authorization: Bearer AUTH_TOKEN"
```
{{% /show-in %}}
