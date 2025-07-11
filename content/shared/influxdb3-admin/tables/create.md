Use the [`influxdb3 create table` command](/influxdb3/version/reference/cli/influxdb3/create/table/)
or the [HTTP API](/influxdb3/version/api/v3/) to create a table in a specified database in {{< product-name >}}.

With {{< product-name >}}, tables and measurements are synonymous.
Typically, tables are created automatically on write using the table name
specified in line protocol written to InfluxDB.
However, you can manually create tables to define a custom schema or apply custom settings before writing data.

- [Create a table using the influxdb3 CLI](#create-a-table-using-the-influxdb3-cli)
- [Create a table using the HTTP API](#create-a-table-using-the-http-api)
- [Table naming restrictions](#table-naming-restrictions)

## Create a table using the influxdb3 CLI

1. If you haven't already, [download and install the `influxdb3` CLI](/influxdb3/version/reference/cli/influxdb3/#download-and-install-the-influxdb3-cli).

2. Run the `influxdb3 create table` command and provide the following:

   - _Required_: The name of the database to create the table in
   - _Required_: The name of the table to create (see [Table naming restrictions](#table-naming-restrictions))
   - _Required_: Tag columns to include in the table (must have at least one tag column)
   - _Optional_: Field columns and their data types to include in the table
   {{% show-in "enterprise" %}}
   - _Optional_: A retention period for the table
   {{% /show-in %}}

   > [!Note]
   > Tables must include at least one tag column.
   > Field columns are optional and can be added later when you write data.
   
   > [!Important]
   > #### Tag order affects query performance
   > When considering your schema and creating your table, order your tags by query priority. 
   > Place the most commonly queried tags first.
   > Columns that appear earlier are typically faster to filter and access during query execution.
   > 
   > For more information, see [Optimize writes](/influxdb3/version/write-data/best-practices/optimize-writes/#sort-tags-by-query-priority).

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 create table \
  --tags tag1,tag2,tag3 \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Create a table with field columns

To define specific field columns and their data types when creating the table, use the `--fields` flag:

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}
```sh
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64,co:int64 \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```
{{% /code-placeholders %}}

{{% show-in "enterprise" %}}
### Create a table with a retention period

To set a specific retention period for the table, use the `--retention-period` flag:

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}
```sh
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64 \
  --retention-period 7d \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```
{{% /code-placeholders %}}
{{% /show-in %}}

## Create a table using the HTTP API

To create a table using the HTTP API, send a `POST` request to the `/api/v3/configure/table` endpoint:

{{% api-endpoint method="POST" endpoint="{{< influxdb/host >}}/api/v3/configure/table" %}}

Include the following in your request:

- **Headers**: 
  - `Authorization: Bearer` with your authentication token
  - `Content-Type: application/json`
- **Request body**: JSON object with table configuration

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}
```bash
curl -X POST "http://{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["tag1", "tag2", "tag3"]
  }'
```
{{% /code-placeholders %}}

### Create a table with field columns using the API

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}
```bash
curl -X POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["room", "sensor_id"],
    "fields": [
      {"name": "temp", "type": "float64"},
      {"name": "hum", "type": "float64"},
      {"name": "co", "type": "int64"}
    ]
  }'
```
{{% /code-placeholders %}}

{{% show-in "enterprise" %}}
### Create a table with a retention period using the API

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}
```bash
curl -X POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["room", "sensor_id"],
    "fields": [
      {"name": "temp", "type": "float64"},
      {"name": "hum", "type": "float64"}
    ],
    "retention_period": "7d"
  }'
```
{{% /code-placeholders %}}
{{% /show-in %}}

## Table naming restrictions

Table names in {{< product-name >}} must adhere to the following naming restrictions:

- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`)
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Table names are case-sensitive
- **Quoting**: Use double quotes when names contain special characters or whitespace

> [!Caution]
> #### Underscore prefix reserved for system use
>
> Names starting with an underscore (`_`) may be reserved for InfluxDB system use.
> While {{< product-name >}} might not explicitly reject these names, using them risks
> conflicts with current or future system features and may result in
> unexpected behavior or data loss.
