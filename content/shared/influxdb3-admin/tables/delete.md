Use the [`influxdb3 delete table` command](/influxdb3/version/reference/cli/influxdb3/delete/table/)
or the [HTTP API](/influxdb3/version/api/v3/) to delete a table from a specified database in {{< product-name >}}.

With {{< product-name >}}, tables and measurements are synonymous.
By default, {{< product-name >}} performs a soft delete, which schedules the table for deletion and makes it unavailable for querying.
You can also schedule a hard deletion to permanently remove the table and its data.

> [!Caution]
> #### Deleting a table cannot be undone
>
> Deleting a table is a destructive action.
> Once a table is deleted, data stored in that table cannot be recovered.

- [Delete a table using the influxdb3 CLI](#delete-a-table-using-the-influxdb3-cli)
- [Delete a table using the HTTP API](#delete-a-table-using-the-http-api)
{{% show-in "enterprise" %}}- [Delete data only (preserve schema and resources)](#delete-data-only-preserve-schema-and-resources){{% /show-in %}}

## Delete a table using the influxdb3 CLI

Use the `influxdb3 delete table` command to delete a table:

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database containing the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to delete
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Hard delete a table immediately

To permanently delete a table and its data immediately, use the `--hard-delete now` flag:

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --hard-delete now \
  TABLE_NAME
```

### Schedule a hard deletion

To schedule a table for hard deletion at a specific time, use the `--hard-delete` flag with a timestamp:

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --hard-delete "2025-12-31T23:59:59Z" \
  TABLE_NAME
```

## Delete a table using the HTTP API

To delete a table using the HTTP API, send a `DELETE` request to the `/api/v3/configure/table` endpoint:

{{% api-endpoint method="DELETE" endpoint="{{< influxdb/host >}}/api/v3/configure/table" %}}

Include the following in your request:

- **Query parameters**:
  - `db`: Database name
  - `table`: Table name to delete
  - `hard_delete_at`: _(Optional)_ Timestamp for hard deletion
- **Headers**: 
  - `Authorization: Bearer` with your authentication token

### Soft delete a table

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
curl -X DELETE "{{< influxdb/host >}}/api/v3/configure/table?db=DATABASE_NAME&table=TABLE_NAME" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database containing the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to delete
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Schedule a hard deletion

To schedule a hard deletion at a specific time, include the `hard_delete_at` parameter with an ISO 8601 timestamp:

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
curl -X DELETE "{{< influxdb/host >}}/api/v3/configure/table?db=DATABASE_NAME&table=TABLE_NAME&hard_delete_at=2025-12-31T23:59:59Z" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

### Response

A successful deletion returns HTTP status `200` with no content body.

#### Example error response

If the table doesn't exist, the API returns HTTP status `404`:

```json
{
  "error": "Table not found"
}
```

{{% show-in "enterprise" %}}
## Delete data only (preserve schema and resources)

{{< product-name >}} supports deleting only the data in a table while preserving the table schema and associated resources.
This is useful when you want to clear old data and re-write new data to the same table structure without recreating resources.

### What is preserved

When using the data-only deletion option, the following are preserved:

- **Table schema**: Column definitions and data types
- **Caches**: Last value caches (LVC) and distinct value caches (DVC) associated with the table

### Delete data only using the CLI

Use the [`--data-only`](/influxdb3/version/reference/cli/influxdb3/delete/table/#options) flag to delete data while preserving the table schema and resources:

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
influxdb3 delete table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --data-only \
  TABLE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database containing the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Delete data only using the HTTP API

To delete only data using the HTTP API, include the `data_only=true` query parameter:

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
curl -X DELETE "{{< influxdb/host >}}/api/v3/configure/table?db=DATABASE_NAME&table=TABLE_NAME&data_only=true" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database containing the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
{{% /show-in %}}