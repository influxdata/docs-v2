<!-- ALLOW SHORTCODE -->

{{% product-name %}} is designed for high write-throughput and uses an efficient,
human-readable write syntax called _[line protocol](#line-protocol)_. InfluxDB
is a schema-on-write database, meaning you can start writing data and InfluxDB
creates the logical database, tables, and their schemas automatically, without
any required intervention. Once InfluxDB creates the schema, it validates future
write requests against the schema before accepting new data.
Both new tags and fields can be added later as your schema changes.

{{% show-in "core" %}}
> [!Note]
> #### InfluxDB 3 Core is optimized for recent data
>
> {{% product-name %}} is optimized for recent data but accepts writes from any time period.
> The system persists data to Parquet files for historical analysis with [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/) or third-party tools.
> For extended historical queries and optimized data organization, consider using [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).
{{% /show-in %}}

<!-- TOC PLACEHOLDER -->

## Line protocol

{{% product-name %}} accepts data in
[line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax.
Line protocol consists of the following elements:

 <!-- vale InfluxDataDocs.v3Schema = NO -->

{{< req type="key" >}}

- {{< req "\*" >}} **table**: A string that identifies the
  [table](/influxdb3/version/reference/glossary/#table) to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters
  must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each
  representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be one of the following types:

  - [strings](/influxdb3/clustered/reference/syntax/line-protocol/#string) (quoted)
  - [floats](/influxdb3/clustered/reference/syntax/line-protocol/#float)
  - [integers](/influxdb3/clustered/reference/syntax/line-protocol/#integer)
  - [unsigned integers](/influxdb3/clustered/reference/syntax/line-protocol/#uinteger)
  - [booleans](/influxdb3/clustered/reference/syntax/line-protocol/#boolean)

- **timestamp**: [Unix timestamp](/influxdb3/clustered/reference/syntax/line-protocol/#unix-timestamp)
associated with the data. InfluxDB supports up to nanosecond precision.
<!-- vale InfluxDataDocs.v3Schema = YES -->

{{< expand-wrapper >}}
{{% expand "How are InfluxDB line protocol elements parsed?" %}}

 <!-- vale InfluxDataDocs.v3Schema = YES -->

- **table**: Everything before the _first unescaped comma before the first
  whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first
  unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`). Line protocol is
whitespace sensitive.
<!-- vale InfluxDataDocs.v3Schema = YES -->

{{% /expand %}}
{{< /expand-wrapper >}}

_For schema design recommendations, see
[InfluxDB schema design recomendations](/influxdb3/version/write-data/best-practices/schema-design/)._

---

{{< influxdb/line-protocol version="v3" >}}

---

## Construct line protocol

 <!-- vale InfluxDataDocs.v3Schema = NO -->

With a basic understanding of line protocol, you can now construct line protocol
and write data to {{% product-name %}}.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **table**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision
  <!-- vale InfluxDataDocs.v3Schema = YES -->

The following line protocol sample represents data collected hourly beginning at
{{% influxdb/custom-timestamps-span %}}**2022-01-01T08:00:00Z (UTC)** until **2022-01-01T20:00:00Z (UTC)**{{% /influxdb/custom-timestamps-span %}}.
_These timestamps are dynamic and can be updated by clicking the {{% icon "clock" %}}
icon in the bottom right corner._

{{% influxdb/custom-timestamps %}}

##### Home sensor data line protocol

```text
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
```

{{% /influxdb/custom-timestamps %}}

## Write data using the CLI

To quickly get started writing data, use the
[`influxdb3 write` command](/influxdb3/version/reference/clis/influxdb3/write/).
Include the following:

- `--database` option that identifies the target database
- `--token` option that specifies the token to use _(unless the `INFLUXDB3_AUTH_TOKEN`
  environment variable is already set)_
- Quoted line protocol via standard input (stdin)

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200'
```
{{% /code-placeholders %}}

In the code samples, replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the [database](/influxdb3/version/admin/databases/) to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission
  to write to the specified database{{% /show-in %}}

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

> [!Note]
> #### Other write methods
>
> There are many ways to write data to your {{% product-name %}} database, including:
>
> - [InfluxDB HTTP API](#write-data-using-the-http-api): Recommended for
>   batching and higher-volume write workloads.
> - [InfluxDB client libraries](/influxdb3/version/write-data/api-client-libraries/):
>   Client libraries that integrate with your code to construct data as time
>   series points and write the data as line protocol to your {{% product-name %}} database.
> - [Telegraf](/telegraf/v1/): A data collection agent with over 300 plugins for
>   collecting, processing, and writing data.
>
> For more information, see [Write data to {{% product-name %}}](/influxdb3/version/write-data/).

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