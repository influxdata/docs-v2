
Use the [`influxdb3 show databases` command](/influxdb3/version/reference/cli/influxdb3/show/databases/),
the [`/api/v3/configure/database`](/influxdb3/version/api/v3/) HTTP API endpoint, or [InfluxDB 3 Explorer](/influxdb3/explorer/) to list databases in {{< product-name >}}.

- [List databases using the influxdb3 CLI](#list-databases-using-the-influxdb3-cli)
- [List databases using the HTTP API](#list-databases-using-the-http-api)
- [List databases using InfluxDB 3 Explorer](#list-databases-using-influxdb-3-explorer)

## List databases using the influxdb3 CLI

Provide the following:

  - _(Optional)_ [Output format](#output-formats) with the `--format` option
  - _(Optional)_ [Show deleted databases](#list-deleted-databases) with the
    `--show-deleted` option
  - {{< product-name >}} {{% token-link "admin" "admin" %}} with the `-t`, `--token` option

```sh
influxdb3 show databases
```

### Output formats

The `influxdb3 show databases` command supports output formats:

- `pretty` _(default)_
- `json`
- `jsonl`
- `csv`
<!-- - `parquet` _(must [output to a file](#output-to-a-parquet-file))_ -->

Use the `--format` flag to specify the output format:

```sh
influxdb3 show databases --format json
```

#### Example output

{{< expand-wrapper >}}
{{% expand "View example pretty-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```
+---------------+
| iox::database |
+---------------+
| home          |
| home_actions  |
| noaa          |
+---------------+
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```json
[{"iox::database":"home"},{"iox::database":"home_actions"},{"iox::database":"noaa"}]
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-line-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```json
{"iox::database":"home"}
{"iox::database":"home_actions"}
{"iox::database":"noaa"}
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example CSV-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```csv
iox::database
home
home_actions
noaa
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

### Output to a Parquet file

To output your list of databases to a Parquet file, use the `influxdb3 query` command

- `--format`: `parquet`
- `-o`, `--output`: the filepath to the Parquet file to output to

```sh
influxdb3 query \
  --database _internal \
  --format parquet \
  --output databases.parquet \
  "SELECT * FROM system.databases"
```

### List deleted databases

To list deleted databases, include the `--show-deleted` option with your
`influxdb3 show databases` command:

```sh
influxdb3 show databases --show-deleted
```

## List databases using the HTTP API

To list databases using the HTTP API, send a `GET` request to the `/api/v3/configure/database` endpoint.

{{% api-endpoint method="GET" endpoint="{{< influxdb/host >}}/api/v3/configure/database?format=pretty" %}}

Include the `format` query parameter and specify one of the following formats:

- `pretty`
- `json`
- `jsonl`
- `csv`
- `parquet`

{{< tabs-wrapper >}}
{{% tabs %}}
[Pretty output](#)
[JSON output](#)
[Parquet output](#)
{{% /tabs %}}
{{% tab-content %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your {{% token-link %}}
- **Query Parameters**:
  - `format=pretty`

```bash{placeholders="AUTH_TOKEN"}
curl --request GET "{{< influxdb/host >}}/api/v3/configure/database?format=pretty" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

The response body contains a table of database names:

```text
+---------------------+
| iox::database       |
+---------------------+
| _internal           |
| home                |
| home_actions        |
| noaa                |
+---------------------+
```

{{% /tab-content %}}

{{% tab-content %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your {{% token-link %}}
- **Query Parameters**:
  - `format=json`

```bash{placeholders="AUTH_TOKEN"}
curl --request GET "{{< influxdb/host >}}/api/v3/configure/database?format=json" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

The response body contains a JSON array of database objects whose keys are `iox::database`:

```json
[
  {
    "iox::database": "home"
  },
  {
    "iox::database": "home_actions"
  },
  {
    "iox::database": "noaa"
  }
]
```
{{% /tab-content %}}

{{% tab-content %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your {{% token-link %}}
- **Query Parameters**:
  - `format=parquet`
- An output destination for the Parquet file

```bash{placeholders="AUTH_TOKEN"}
curl "{{< influxdb/host >}}/api/v3/configure/database?format=parquet" \
  -o databases.parquet \
  --header "Authorization: Bearer AUTH_TOKEN"
```

For Parquet responses, you must provide an output destination because the format is binary.

The response contains the databases list.
{{% /tab-content %}}
{{< /tabs-wrapper >}}

A successful request returns HTTP status `200`.

## List databases using InfluxDB 3 Explorer

You can also view all databases using the [InfluxDB 3 Explorer](/influxdb3/explorer/) web interface:

1. If you haven't already, see how to [get started with Explorer and connect to your {{% product-name %}} server](/influxdb3/explorer/get-started/).
2. In Explorer, click **Databases** in the left navigation.
3. The Databases page displays a list of all databases with the following information:
   - Database name
   - Retention period (if configured)
   - Number of tables in the database
   - Creation date

For more information, see [Manage databases with InfluxDB 3 Explorer](/influxdb3/explorer/manage-databases/).
