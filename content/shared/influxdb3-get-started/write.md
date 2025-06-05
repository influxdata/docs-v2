### Write data

InfluxDB is a schema-on-write database. You can start writing data and InfluxDB creates the logical database, tables, and their schemas on the fly.
After a schema is created, InfluxDB validates future write requests against it before accepting the data.
Subsequent requests can add new fields on-the-fly, but can't add new tags.

{{% show-in "core" %}}
> [!Note]
> #### Core is optimized for recent data
>
> {{% product-name %}} is optimized for recent data but accepts writes from any time period.
> The system persists data to Parquet files for historical analysis with [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/) or third-party tools.
> For extended historical queries and optimized data organization, consider using [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).
{{% /show-in %}}

#### Write data in line protocol syntax

{{% product-name %}} accepts data in [line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax.
The following code block is an example of time series data in [line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax:

- `cpu`: the table name.
- `host`, `region`, `applications`: the tags. A tag set is an ordered, comma-separated list of key/value pairs where the values are strings.
- `val`, `usage_percent`, `status`: the fields. A field set is a comma-separated list of key/value pairs.
- timestamp: If you don't specify a timestamp, InfluxData uses the time when data is written.
  The default precision is a nanosecond epoch.
  To specify a different precision, pass the `precision` parameter in your CLI command or API request.

```
cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK"
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK"
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK"
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn"
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK"
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn"
```

### Write data using the CLI

To quickly get started writing data, you can use the `influxdb3` CLI.

> [!Note]
> For batching and higher-volume write workloads, we recommend using the [HTTP API](#write-data-using-the-http-api).
>
> #### Write data using InfluxDB API client libraries
>
> InfluxDB provides supported client libraries that integrate with your code
> to construct data as time series points and write the data as line protocol to your {{% product-name %}} database.
> For more information, see how to [use InfluxDB client libraries to write data](/influxdb3/version/write-data/api-client-libraries/).

##### Example: write data using the influxdb3 CLI

Use the `influxdb3 write` command to write data to a database.

In the code samples, replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/version/admin/databases/) to write to.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to write to the specified database{{% /show-in %}}

##### Write data via stdin

Pass data as quoted line protocol via standard input (stdin)--for example:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision ns \
  --accept-partial \
'cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK"
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK"
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK"
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn"
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK"
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn"'
```
{{% /code-placeholders %}}

##### Write data from a file

Pass the `--file` option to write line protocol you have saved to a file--for example, save the
[sample line protocol](#write-data-in-line-protocol-syntax) to a file named `server_data`
and then enter the following command:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision ns \ 
  --accept-partial \
  --file path/to/server_data 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/version/admin/databases/) to write to.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to write to the specified database{{% /show-in %}}

### Write data using the HTTP API

{{% product-name %}} provides three write API endpoints that respond to HTTP `POST` requests.
The `/api/v3/write_lp` endpoint is the recommended endpoint for writing data and
provides additional options for controlling write behavior.

If you need to write data using InfluxDB v1.x or v2.x tools, use the compatibility API endpoints.
Compatibility APIs work with [Telegraf](/telegraf/v1/), InfluxDB v2.x and v1.x [API client libraries](/influxdb3/version/reference/client-libraries), and other tools that support the v1.x or v2.x APIs.

{{% tabs-wrapper %}}
{{% tabs %}}
[/api/v3/write_lp](#)
[v2 compatibility](#)
[v1 compatibility](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------ BEGIN /api/v3/write_lp -------------->
{{% product-name %}} adds the `/api/v3/write_lp` endpoint.

{{<api-endpoint endpoint="/api/v3/write_lp?db=mydb&precision=nanosecond&accept_partial=true&no_sync=false" method="post" >}}

This endpoint accepts the same line protocol syntax as previous versions,
and supports the following parameters:

- `?accept_partial=<BOOLEAN>`: Accept or reject partial writes (default is `true`).
- `?no_sync=<BOOLEAN>`: Control when writes are acknowledged:
  - `no_sync=true`: Acknowledges writes before WAL persistence completes.
  - `no_sync=false`: Acknowledges writes after WAL persistence completes (default).
- `?precision=<PRECISION>`: Specify the precision of the timestamp. The default is nanosecond precision.
- request body: The line protocol data to write.

For more information about the parameters, see [Write data](/influxdb3/version/write-data/).

##### Example: write data using the /api/v3 HTTP API

The following examples show how to write data using `curl` and the `/api/3/write_lp` HTTP endpoint.
To show the difference between accepting and rejecting partial writes, line `2` in the example contains a `string` value (`"hi"`) for a `float` field (`temp`).

###### Partial write of line protocol occurred

With `accept_partial=true` (default):

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto" \
  --header 'Authorization: Bearer apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0==' \
  --data-raw 'home,room=Sunroom temp=96
home,room=Sunroom temp="hi"'
```

The response is the following:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "partial write of line protocol occurred",
  "data": [
    {
      "original_line": "home,room=Sunroom temp=hi",
      "line_number": 2,
      "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
    }
  ]
}
```

Line `1` is written and queryable.
The response is an HTTP error (`400`) status, and the response body contains the error message `partial write of line protocol occurred` with details about the problem line. 

###### Parsing failed for write_lp endpoint

With `accept_partial=false`:

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto&accept_partial=false" \
  --header 'Authorization: Bearer apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0==' \
  --data-raw 'home,room=Sunroom temp=96
home,room=Sunroom temp="hi"'
```

The response is the following:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "parsing failed for write_lp endpoint",
  "data": {
    "original_line": "home,room=Sunroom temp=hi",
    "line_number": 2,
    "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
  }
}
```

InfluxDB rejects all points in the batch.
The response is an HTTP error (`400`) status, and the response body contains `parsing failed for write_lp endpoint` and details about the problem line.

For more information about the ingest path and data flow, see [Data durability](/influxdb3/version/reference/internals/durability/).
<!------------ END /api/v3/write_lp -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------ BEGIN /api/v2/write -------------->
The `/api/v2/write` InfluxDB v2 compatibility endpoint provides backwards compatibility with clients (such as [Telegraf's InfluxDB v2 output plugin](/telegraf/v1/plugins/#output-influxdb_v2) and [InfluxDB v2 API client libraries](/influxdb3/version/reference/client-libraries/v2/)) that can write data to InfluxDB OSS v2.x and Cloud 2 (TSM).

{{<api-endpoint endpoint="/api/v2/write?bucket=mydb&precision=ns" method="post" >}}
<!------------ END /api/v2/write -------------->
{{% /tab-content %}}

{{% tab-content %}}
<!------------ BEGIN /write (v1) ---------------->
The `/write` InfluxDB v1 compatibility endpoint provides backwards compatibility for clients that can write data to InfluxDB v1.x.

{{<api-endpoint endpoint="/write?db=mydb&precision=ns" method="post" >}}

<!------------ END /write (v1) ---------------->
{{% /tab-content %}}
{{% /tabs-wrapper %}}

> [!Note]
> #### Compatibility APIs differ from native APIs
> 
> Keep in mind that the compatibility APIs differ from the v1 and v2 APIs in previous versions in the following ways:
>
> - Tags in a table (measurement) are _immutable_
> - A tag and a field can't have the same name within a table.

#### Write responses

By default, InfluxDB acknowledges writes after flushing the WAL file to the object store (occurring every second).
For high write throughput, you can send multiple concurrent write requests.

#### Use no_sync for immediate write responses

To reduce the latency of writes, use the `no_sync` write option, which acknowledges writes _before_ WAL persistence completes.
When `no_sync=true`, InfluxDB validates the data, writes the data to the WAL, and then immediately responds to the client, without waiting for persistence to the object store.

Using `no_sync=true` is best when prioritizing high-throughput writes over absolute durability. 

- Default behavior (`no_sync=false`): Waits for data to be written to the object store before acknowledging the write. Reduces the risk of data loss, but increases the latency of the response.
- With `no_sync=true`: Reduces write latency, but increases the risk of data loss in case of a crash before WAL persistence. 

##### Immediate write using the HTTP API

The `no_sync` parameter controls when writes are acknowledged--for example:

```bash
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto&no_sync=true" \
  --header 'Authorization: Bearer apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0==' \
  --data-raw "home,room=Sunroom temp=96"
```

### Create a database or table

To create a database without writing data, use the `create` subcommand--for example:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 create database DATABASE_NAME \
  --token AUTH_TOKEN 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: the {{% token-link "admin" %}} for your {{% product-name %}} server

To learn more about a subcommand, use the `-h, --help` flag or view the [InfluxDB 3 CLI reference](/influxdb3/version/reference/cli/influxdb3/create):

```bash
influxdb3 create -h
```