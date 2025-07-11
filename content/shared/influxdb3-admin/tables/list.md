Use the [`influxdb3 query` command](/influxdb3/version/reference/cli/influxdb3/query/)
or the [HTTP API](/influxdb3/version/api/v3/) to list tables in a specified database in {{< product-name >}}.

With {{< product-name >}}, tables and measurements are synonymous.
This guide shows how to retrieve a list of all tables (measurements) in a database.

- [List tables using the influxdb3 CLI](#list-tables-using-the-influxdb3-cli)
- [List tables using the HTTP API](#list-tables-using-the-http-api)

## List tables using the influxdb3 CLI

1. If you haven't already, [download and install the `influxdb3` CLI](/influxdb3/version/reference/cli/influxdb3/#download-and-install-the-influxdb3-cli).

2. Use the `influxdb3 query` command with the `SHOW TABLES` SQL statement:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```sh
influxdb3 query \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  "SHOW TABLES"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to list tables from
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Example output

```
+---------------+---------------+------------+------------+
| table_catalog | table_schema  | table_name | table_type |
+---------------+---------------+------------+------------+
| public        | iox           | home       | BASE TABLE |
| public        | iox           | sensors    | BASE TABLE |
+---------------+---------------+------------+------------+
```

### Alternative: List tables using InfluxQL

You can also use InfluxQL syntax to list measurements (tables):

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```sh
influxdb3 query \
  --language influxql \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  "SHOW MEASUREMENTS"
```
{{% /code-placeholders %}}

## List tables using the HTTP API

To list tables using the HTTP API, send a `GET` request to the `/api/v3/query_sql` endpoint with a `SHOW TABLES` query:

{{% api-endpoint method="GET" endpoint="{{< influxdb/host >}}/api/v3/query_sql" %}}

Include the following in your request:

- **Query parameters**:
  - `db`: Database name
  - `q`: The SQL query (`SHOW TABLES`)
  - `format`: Response format (optional, defaults to `json`)
- **Headers**: 
  - `Authorization: Bearer` with your authentication token

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
curl --get "{{< influxdb/host >}}/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SHOW TABLES" \
  --data-urlencode "format=json"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to list tables from
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Example response

```json
{
  "results": [
    {
      "series": [
        {
          "name": "tables",
          "columns": ["table_catalog", "table_schema", "table_name", "table_type"],
          "values": [
            ["public", "iox", "home", "BASE TABLE"],
            ["public", "iox", "sensors", "BASE TABLE"]
          ]
        }
      ]
    }
  ]
}
```

### Get response in CSV format

To get the response in CSV format, set the `format` parameter to `csv`:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
curl --get "{{< influxdb/host >}}/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SHOW TABLES" \
  --data-urlencode "format=csv"
```
{{% /code-placeholders %}}