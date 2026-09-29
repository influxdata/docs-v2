Use the [`influxdb3 update table` command](/influxdb3/version/reference/cli/influxdb3/update/table/)
or the [HTTP API](/influxdb3/version/api/v3/) to add tag and field columns to
an existing table in {{< product-name >}}.

Adding columns is _additive only_.
You can't remove, rename, or change the type of an existing column.
Adding a column that already exists with the same data type is a no-op.
Adding a column that already exists with a different data type returns an error.

This works for tables in databases that use either
[schema mode](/influxdb3/version/admin/databases/create/#schema-mode).
{{% show-in "enterprise" %}}
In a database that uses `explicit` schema mode, declaring a column is what
allows writes that reference it to succeed.
For more information, see
[Enforce a schema](/influxdb3/enterprise/admin/databases/enforce-schema/).
{{% /show-in %}}

- [Add columns using the influxdb3 CLI](#add-columns-using-the-influxdb3-cli)
- [Add columns using the HTTP API](#add-columns-using-the-http-api)

## Add columns using the influxdb3 CLI

Use the `influxdb3 update table` command with `--tags`, `--fields`, or both,
and provide the following:

- _Required_: The name of the database containing the table
- _Required_: The name of the table to update
- _Required_: At least one of `--tags` or `--fields`

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Add tag columns
influxdb3 update table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --tags rack,zone \
  TABLE_NAME

# Add field columns
influxdb3 update table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --fields temp:float64,active:bool \
  TABLE_NAME

# Add tag and field columns in one command
influxdb3 update table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --tags rack \
  --fields temp:float64 \
  TABLE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database containing the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to update
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

See [Field data types](/influxdb3/version/reference/cli/influxdb3/create/table/#field-data-types)
for the list of valid field types.

{{% show-in "enterprise" %}}
> [!Important]
> #### Add columns and update retention in separate commands
>
> `--tags` and `--fields` add columns to the table.
> `--retention-period` updates the table's retention period.
> These are separate operations against separate API endpoints, so
> {{< product-name >}} rejects a command that combines `--retention-period`
> with `--tags` or `--fields`.
> Run them as separate commands.
> For more information about table retention periods, see
> [Data retention](/influxdb3/enterprise/reference/internals/data-retention/).
{{% /show-in %}}

## Add columns using the HTTP API

To add columns using the HTTP API, send a `PATCH` request to the `/api/v3/configure/table` endpoint:

{{% api-endpoint method="PATCH" endpoint="{{< influxdb/host-url >}}/api/v3/configure/table" %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your authentication token
  - `Content-Type: application/json`
- **Request body**: JSON object with the columns to add
  - `db` _(string, required)_: Database name
  - `table` _(string, required)_: Table name
  - `tags` _(array, optional)_: Tag column names to add
  - `fields` _(array, optional)_: Field definitions to add, each with a `name` and a `type`

Provide at least one of `tags` or `fields`.

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Add tag columns
curl --request PATCH "{{< influxdb/host-url >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["rack", "zone"],
    "fields": []
  }'

# Add field columns
curl --request PATCH "{{< influxdb/host-url >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": [],
    "fields": [
      {"name": "temp", "type": "float64"},
      {"name": "active", "type": "bool"}
    ]
  }'
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database containing the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to update
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Response

A successful request returns HTTP status `200` with no content body.

#### Example error responses

An empty request that names no tags and no fields returns HTTP status `400`:

```json
{
  "error": "at least one of tags or fields is required"
}
```

Adding a column that already exists with a different data type returns HTTP status `400`.

Patching a table that doesn't exist returns HTTP status `404`.
Use [`POST /api/v3/configure/table`](/influxdb3/version/admin/tables/create/#create-a-table-using-the-http-api)
to create the table first.

{{% show-in "enterprise" %}}
> [!Note]
> `PATCH /api/v3/configure/table` adds columns only and never touches
> the table's retention period.
> To update a table's retention period, use `PUT /api/v3/configure/table`.
{{% /show-in %}}
