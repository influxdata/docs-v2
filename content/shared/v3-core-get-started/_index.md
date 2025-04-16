InfluxDB is a database built to collect, process, transform, and store event and time series data, and is ideal for use cases that require real-time ingest and fast query response times to build user interfaces, monitoring, and automation solutions.

Common use cases include:

- Monitoring sensor data
- Server monitoring
- Application performance monitoring
- Network monitoring
- Financial market and trading analytics
- Behavioral analytics

InfluxDB is optimized for scenarios where near real-time data monitoring is essential and queries need to return quickly to support user experiences such as dashboards and interactive user interfaces.

{{% product-name %}} is the InfluxDB 3 open source release.
Core's feature highlights include:

* Diskless architecture with object storage support (or local disk with no dependencies)
* Fast query response times (under 10ms for last-value queries, or 30ms for distinct metadata)
* Embedded Python VM for plugins and triggers
* Parquet file persistence
* Compatibility with InfluxDB 1.x and 2.x write APIs

The Enterprise version adds the following features to Core:

* Historical query capability and single series indexing
* High availability
* Read replicas
* Enhanced security (coming soon)
* Row-level delete support (coming soon)
* Integrated admin UI (coming soon)

For more information, see how to [get started with Enterprise](/influxdb3/enterprise/get-started/).

### What's in this guide

This guide covers InfluxDB 3 Core (the open source release), including the following topics:

- [Install and startup](#install-and-startup)
- [Authentication and authorization](#authentication-and-authorization)
- [Data Model](#data-model)
- [Tools to use](#tools-to-use)
- [Write data](#write-data)
- [Query data](#query-data)
- [Last values cache](#last-values-cache)
- [Distinct values cache](#distinct-values-cache)
- [Python plugins and the processing engine](#python-plugins-and-the-processing-engine)

### Install and startup

{{% product-name %}} runs on **Linux**, **macOS**, and **Windows**.

{{% tabs-wrapper %}}
{{% tabs %}}
[Linux or macOS](#linux-or-macos)
[Windows](#windows)
[Docker](#docker)
{{% /tabs %}}
{{% tab-content %}}
<!--------------- BEGIN LINUX AND MACOS -------------->
To get started quickly, download and run the install script--for example, using [curl](https://curl.se/download.html):

<!--pytest.mark.skip-->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh
```

Or, download and install [build artifacts](/influxdb3/core/install/#download-influxdb-3-core-binaries):

- [Linux | x86 | gnu](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-gnu.tar.gz.sha256)
- [Linux | ARM | gnu](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-gnu.tar.gz.sha256)
- [macOS | Darwin](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-apple-darwin.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-apple-darwin.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

<!--------------- END LINUX AND MACOS -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------- BEGIN WINDOWS -------------->
Download and install the {{% product-name %}} [Windows (x86) binary](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-pc-windows-gnu.tar.gz)
 •
[sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-pc-windows-gnu.tar.gz.sha256)

<!--------------- END WINDOWS -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------- BEGIN DOCKER -------------->

The [`influxdb3-core` image](https://quay.io/repository/influxdb/influxdb3-core?tab=tags&tag=latest)
is available for x86_64 (AMD64) and ARM64 architectures.

Pull the image:

<!--pytest.mark.skip-->
```bash
docker pull quay.io/influxdb/influxdb3-core:latest
```

##### InfluxDB 3 Explorer -- Query Interface (Beta)

You can download the new InfluxDB 3 Explorer query interface using Docker.
Explorer is currently in beta. Pull the image:

```bash
docker pull quay.io/influxdb/influxdb3-explorer:latest
```

<!--------------- END DOCKER -------------->
{{% /tab-content %}}
{{% /tabs-wrapper %}}

_Build artifacts and images update with every merge into the {{% product-name %}} `main` branch._

#### Verify the install

After you have installed {{% product-name %}}, enter the following command to verify that it completed successfully:

```bash
influxdb3 --version
```

If your system doesn't locate `influxdb3`, then `source` the configuration file (for example, .bashrc, .zshrc) for your shell--for example:

<!--pytest.mark.skip-->
```zsh
source ~/.zshrc
```

#### Start InfluxDB

To start your InfluxDB instance, use the `influxdb3 serve` command
and provide the following:

- `--object-store`: Specifies the type of Object store to use.
  InfluxDB supports the following: local file system (`file`), `memory`,
  S3 (and compatible services like Ceph or Minio) (`s3`),
  Google Cloud Storage (`google`), and Azure Blob Storage (`azure`).
  The default is `file`.
  Depending on the object store type, you may need to provide additional options
  for your object store configuration.
- `--node-id`: A string identifier that distinguishes individual server instances within the cluster.
  This forms the final part of the storage path: `<CONFIGURED_PATH>/<NODE_ID>`.
  In a multi-node setup, this ID is used to reference specific nodes.

> [!Note]
> #### Diskless architecture
>
> InfluxDB 3 supports a diskless architecture that can operate with object
> storage alone, eliminating the need for locally attached disks.
> {{% product-name %}} can also work with only local disk storage when needed. 

The following examples show how to start InfluxDB 3 with different object store configurations:

```bash
# Memory object store
# Stores data in RAM; doesn't persist data
influxdb3 serve \
--node-id host01 \
--object-store memory
```

```bash
# Filesystem object store
# Provide the filesystem directory
influxdb3 serve \
  --node-id host01 \
  --object-store file \
  --data-dir ~/.influxdb3
```

To run the [Docker image](/influxdb3/core/install/#docker-image) and persist data to the filesystem, mount a volume for the Object store-for example, pass the following options:

- `-v /path/on/host:/path/in/container`: Mounts a directory from your filesystem to the container
- `--object-store file --data-dir /path/in/container`: Uses the mount for server storage

> [!Note]
> 
> The {{% product-name %}} Docker image exposes port `8181`, the `influxdb3` server default for HTTP connections.
> To map the exposed port to a different port when running a container, see the Docker guide for [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

<!--pytest.mark.skip-->
```bash
# Filesystem object store with Docker 
# Create a mount
# Provide the mount path
docker run -it \
 -v /path/on/host:/path/in/container \
 quay.io/influxdb/influxdb3-core:latest serve \
 --node-id my_host \
 --object-store file \
 --data-dir /path/in/container
```

```bash
# S3 object store (default is the us-east-1 region)
# Specify the Object store type and associated options
influxdb3 serve \
  --node-id host01 \
  --object-store s3 \
  --bucket BUCKET \
  --aws-access-key AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY
```

```bash
# Minio or other open source object store
# (using the AWS S3 API with additional parameters)
# Specify the object store type and associated options
influxdb3 serve \
  --node-id host01 \
  --object-store s3 \
  --bucket BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --aws-endpoint ENDPOINT \
  --aws-allow-http
```

For more information about server options, use the CLI help:

```bash
influxdb3 serve --help
```

### Authentication and authorization

After you have [started the server](#start-influxdb), you can create and manage tokens using the `influxdb3` CLI or the HTTP API.
{{% product-name %}} uses token-based authentication and authorization which is enabled by default when you start the server.
With authentication enabled, you must provide a token to access server actions.
An {{% product-name %}} instance can have one _admin token_, which grants access to all CLI actions and API endpoints.

When you create a token, InfluxDB 3 returns a token string in plain text
that you use to authenticate CLI commands and API requests.
Securely store your token, as you won't be able to retrieve it later.

To have the `influxdb3` CLI use your admin token automatically, assign it to the
`INFLUXDB3_AUTH_TOKEN` environment variable.

> [!Important]
>
> #### Securely store your tokens
>
> For security, InfluxDB only lets you view tokens when you create them.
> InfluxDB 3 stores a hash of the token in the catalog, so you can't retrieve the token after it is created.

#### Create an admin token

To create an admin token, use the `influxdb3 create token --admin` subcommand--for example:

```bash
influxdb3 create token --admin \
 --host http://{{< influxdb/host >}}
```

The command returns a token string that you can use to authenticate CLI commands and API requests.
Securely store your token, as you won't be able to retrieve it later.

For more information, see how to [Manage admin tokens](/influxdb3/version/admin/tokens/admin/).
### Data model

The database server contains logical databases, which have tables, which have columns. Compared to previous versions of InfluxDB you can think of a database as a `bucket` in v2 or as a `db/retention_policy` in v1. A `table` is equivalent to a `measurement`, which has columns that can be of type `tag` (a string dictionary), `int64`, `float64`, `uint64`, `bool`, or `string` and finally every table has a `time` column that is a nanosecond precision timestamp.

In InfluxDB 3, every table has a primary key--the ordered set of tags and the time--for its data.
This is the sort order used for all Parquet files that get created. When you create a table, either through an explicit call or by writing data into a table for the first time, it sets the primary key to the tags in the order they arrived. This is immutable. Although InfluxDB is still a _schema-on-write_ database, the tag column definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, or `building_id` or `trace_id`. All other data should be kept in fields. You will be able to add fast last N value and distinct value lookups later for any column, whether it is a field or a tag.

### Tools to use

The following table compares tools that you can use to interact with {{% product-name %}}.
This tutorial covers many of the recommended tools.

| Tool                                                                                              |      Administration      |          Write           |          Query           |
| :------------------------------------------------------------------------------------------------ | :----------------------: | :----------------------: | :----------------------: |
| [Chronograf](/chronograf/v1/)                                                                     |            -             |            -             | **{{< icon "check" >}}** |
| <span style="opacity:.5;">`influx` CLI</span>                                                     |            -             |            -             |            -             |
| [`influxdb3` CLI](#influxdb3-cli){{< req text="\* " color="magenta" >}}                           | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| <span style="opacity:.5;">`influxctl` CLI</span>                                                  |            -             |            -             |            -             |
| [InfluxDB HTTP API](#influxdb-http-api){{< req text="\* " color="magenta" >}}                     | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| <span style="opacity:.5;">InfluxDB user interface</span>                                          |            -             |            -             |            -             |
| [InfluxDB 3 client libraries](/influxdb3/version/reference/client-libraries/v3/)                  |            -             | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB v2 client libraries](/influxdb3/version/reference/client-libraries/v2/)                 |            -             | **{{< icon "check" >}}** |            -             |
| [InfluxDB v1 client libraries](/influxdb3/version/reference/client-libraries/v1/)                 |            -             | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB 3 Processing engine](#python-plugins-and-the-processing-engine){{< req text="\* " color="magenta" >}}                              |                          | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [Telegraf](/telegraf/v1/)                                                                         |            -             | **{{< icon "check" >}}** |            -             |
| **Third-party tools**                                                                             |                          |                          |                          |
| Flight SQL clients                                                                                |            -             |            -             | **{{< icon "check" >}}** |
| [Grafana](/influxdb3/version/visualize-data/grafana/)                                             |            -             |            -             | **{{< icon "check" >}}** |

{{< caption >}}
{{< req type="key" text="Covered in this guide" color="magenta" >}}
{{< /caption >}}

### Write data

InfluxDB is a schema-on-write database. You can start writing data and InfluxDB creates the logical database, tables, and their schemas on the fly.
After a schema is created, InfluxDB validates future write requests against it before accepting the data.
Subsequent requests can add new fields on-the-fly, but can't add new tags.

> [!Note]
> #### Core is optimized for recent data
>
> {{% product-name %}} is optimized for recent data but accepts writes from any time period.
> The system persists data to Parquet files for historical analysis with [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/) or third-party tools.
> For extended historical queries and optimized data organization, consider using [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).

#### Write data in line protocol syntax

{{% product-name %}} accepts data in [line protocol](/influxdb3/core/reference/syntax/line-protocol/) syntax.
The following code block is an example of time series data in [line protocol](/influxdb3/core/reference/syntax/line-protocol/) syntax:

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

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: The name of the [database](/influxdb3/version/admin/databases/) to write to.
{{% show-in "core" %}}
- {{% code-placeholder-key %}}`TOKEN`{{% /code-placeholder-key %}}: A [token](/influxdb3/version/admin/tokens/) for your {{% product-name %}} server.
{{% /show-in %}}
{{% show-in "enterprise" %}}
- {{% code-placeholder-key %}}`TOKEN`{{% /code-placeholder-key %}}: A [token](/influxdb3/version/admin/tokens/)
  with permission to write to the specified database.
{{% /show-in %}}

##### Write data via stdin

Pass data as quoted line protocol via standard input (stdin)--for example:

{{% code-placeholders "DATABASE_NAME|TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token TOKEN \
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

{{% code-placeholders "DATABASE_NAME|TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token TOKEN \
  --precision ns \ 
  --accept-partial \
  --file server_data
```
{{% /code-placeholders %}}

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

For more information about the parameters, see [Write data](/influxdb3/core/write-data/).

##### Example: write data using the /api/v3 HTTP API

The following examples show how to write data using `curl` and the `/api/3/write_lp` HTTP endpoint.
To show the difference between accepting and rejecting partial writes, line `2` in the example contains a `string` value (`"hi"`) for a `float` field (`temp`).

###### Partial write of line protocol occurred

With `accept_partial=true` (default):

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto" \
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

By default, InfluxDB acknowledges writes after flushing the WAL file to the Object store (occurring every second).
For high write throughput, you can send multiple concurrent write requests.

#### Use no_sync for immediate write responses

To reduce the latency of writes, use the `no_sync` write option, which acknowledges writes _before_ WAL persistence completes.
When `no_sync=true`, InfluxDB validates the data, writes the data to the WAL, and then immediately responds to the client, without waiting for persistence to the Object store.

Using `no_sync=true` is best when prioritizing high-throughput writes over absolute durability. 

- Default behavior (`no_sync=false`): Waits for data to be written to the Object store before acknowledging the write. Reduces the risk of data loss, but increases the latency of the response.
- With `no_sync=true`: Reduces write latency, but increases the risk of data loss in case of a crash before WAL persistence. 

##### Immediate write using the HTTP API

The `no_sync` parameter controls when writes are acknowledged--for example:

```bash
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto&no_sync=true" \
  --data-raw "home,room=Sunroom temp=96"
```

##### Immediate write using the influxdb3 CLI

The `no_sync` CLI option controls when writes are acknowledged--for example:

```bash
influxdb3 write \
  --bucket mydb \
  --org my_org \
  --token my-token \
  --no-sync
```

### Create a database or table

To create a database without writing data, use the `create` subcommand--for example:

```bash
influxdb3 create database mydb
```

To learn more about a subcommand, use the `-h, --help` flag:

```bash
influxdb3 create -h
```

### Query data

InfluxDB 3 now supports native SQL for querying, in addition to InfluxQL, an
SQL-like language customized for time series queries.

{{< product-name >}} limits
query time ranges to 72 hours (both recent and historical) to ensure query performance.
For more information about the 72-hour limitation, see the
[update on InfluxDB 3 Core’s 72-hour limitation](https://www.influxdata.com/blog/influxdb3-open-source-public-alpha-jan-27/).

> [!Note]
> Flux, the language introduced in InfluxDB 2.0, is **not** supported in InfluxDB 3.

The quickest way to get started querying is to use the `influxdb3` CLI (which uses the Flight SQL API over HTTP2).

The `query` subcommand includes options to help ensure that the right database is queried with the correct permissions. Only the `--database` option is required, but depending on your specific setup, you may need to pass other options, such as host, port, and token.

| Option | Description | Required |
|---------|-------------|--------------|
| `--host` | The host URL of the server [default: `http://127.0.0.1:8181`] to query | No |
| `--database` | The name of the database to operate on | Yes |
| `--token` | The authentication token for the {{% product-name %}} server | No |
| `--language` | The query language of the provided query string [default: `sql`] [possible values: `sql`, `influxql`] | No  |
| `--format` | The format in which to output the query [default: `pretty`] [possible values: `pretty`, `json`, `jsonl`, `csv`, `parquet`] | No |
| `--output` | The path to output data to | No |

#### Example: query `“SHOW TABLES”` on the `servers` database:

```console
$ influxdb3 query --database servers "SHOW TABLES"
+---------------+--------------------+--------------+------------+
| table_catalog | table_schema       | table_name   | table_type |
+---------------+--------------------+--------------+------------+
| public        | iox                | cpu          | BASE TABLE |
| public        | information_schema | tables       | VIEW       |
| public        | information_schema | views        | VIEW       |
| public        | information_schema | columns      | VIEW       |
| public        | information_schema | df_settings  | VIEW       |
| public        | information_schema | schemata     | VIEW       |
+---------------+--------------------+--------------+------------+
```

#### Example: query the `cpu` table, limiting to 10 rows:

```console
$ influxdb3 query --database servers "SELECT DISTINCT usage_percent, time FROM cpu LIMIT 10"
+---------------+---------------------+
| usage_percent | time                |
+---------------+---------------------+
| 63.4          | 2024-02-21T19:25:00 |
| 25.3          | 2024-02-21T19:06:40 |
| 26.5          | 2024-02-21T19:31:40 |
| 70.1          | 2024-02-21T19:03:20 |
| 83.7          | 2024-02-21T19:30:00 |
| 55.2          | 2024-02-21T19:00:00 |
| 80.5          | 2024-02-21T19:05:00 |
| 60.2          | 2024-02-21T19:33:20 |
| 20.5          | 2024-02-21T18:58:20 |
| 85.2          | 2024-02-21T19:28:20 |
+---------------+---------------------+
```

### Query using the CLI for InfluxQL

[InfluxQL](/influxdb3/version/reference/influxql/) is an SQL-like language developed by InfluxData with specific features tailored for leveraging and working with InfluxDB. It’s compatible with all versions of InfluxDB, making it a good choice for interoperability across different InfluxDB installations.

To query using InfluxQL, enter the `influxdb3 query` subcommand and specify `influxql` in the language option--for example:

```bash
influxdb3 query \
  --database servers \
  --language influxql \
  "SELECT DISTINCT usage_percent FROM cpu WHERE time >= now() - 1d"
```

### Query using the API

InfluxDB 3 supports Flight (gRPC) APIs and an HTTP API.
To query your database using the HTTP API, send a request to the `/api/v3/query_sql` or `/api/v3/query_influxql` endpoints.
In the request, specify the database name in the `db` parameter
and a query in the `q` parameter.
You can pass parameters in the query string or inside a JSON object.

Use the `format` parameter to specify the response format: `pretty`, `jsonl`, `parquet`, `csv`, and `json`. Default is `json`.

##### Example: Query passing URL-encoded parameters

The following example sends an HTTP `GET` request with a URL-encoded SQL query:

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/query_sql?db=servers&q=select+*+from+cpu+limit+5"
```

##### Example: Query passing JSON parameters

The following example sends an HTTP `POST` request with parameters in a JSON payload:

```bash
curl http://{{< influxdb/host >}}/api/v3/query_sql \
  --data '{"db": "server", "q": "select * from cpu limit 5"}'
```

### Query using the Python client

Use the InfluxDB 3 Python library to interact with the database and integrate with your application.
We recommend installing the required packages in a Python virtual environment for your specific project.

To get started, install the `influxdb3-python` package.

```bash
pip install influxdb3-python
```

From here, you can connect to your database with the client library using just the **host** and **database name:

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='http://{{< influxdb/host >}}',
    database='servers'
)
```

The following example shows how to query using SQL, and then
use PyArrow to explore the schema and process results:

```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='http://{{< influxdb/host >}}',

    database='servers'
)

# Execute the query and return an Arrow table
table = client.query(
    query="SELECT * FROM cpu LIMIT 10",
    language="sql"
)

print("\n#### View Schema information\n")
print(table.schema)

print("\n#### Use PyArrow to read the specified columns\n")
print(table.column('usage_active'))
print(table.select(['host', 'usage_active']))
print(table.select(['time', 'host', 'usage_active']))

print("\n#### Use PyArrow compute functions to aggregate data\n")
print(table.group_by('host').aggregate([]))
print(table.group_by('cpu').aggregate([('time_system', 'mean')]))
```

For more information about the Python client library, see the [`influxdb3-python` repository](https://github.com/InfluxCommunity/influxdb3-python) in GitHub.


### Query using InfluxDB 3 Explorer (Beta)
You can use the InfluxDB 3 Explorer query interface by downloading the Docker image.

```bash
docker pull quay.io/influxdb/influxdb3-explorer:latest
```

Run the interface using:

```bash
docker run --name influxdb3-explorer -p 8086:8888 quay.io/influxdb/influxdb3-explorer:latest
```

With the default settings above, you can access the UI at http://localhost:8086.
Set your expected database connection details on the Settings page.
From there, you can query data, browser your database schema, and do basic
visualization of your time series data.

### Last values cache

{{% product-name %}} supports a **last-n values cache** which stores the last N values in a series or column hierarchy in memory. This gives the database the ability to answer these kinds of queries in under 10 milliseconds.
You can use the `influxdb3` CLI to [create a last value cache](/influxdb3/version/reference/cli/influxdb3/create/last_cache/).

```bash
influxdb3 create last_cache \
  -d <DATABASE_NAME> \
  -t <TABLE> \
  [CACHE_NAME]
```

Consider the following `cpu` sample table:

| host | application | time | usage\_percent | status |
| ----- | ----- | ----- | ----- | ----- |
| Bravo | database | 2024-12-11T10:00:00 | 55.2 | OK |
| Charlie | cache | 2024-12-11T10:00:00 | 65.4 | OK |
| Bravo | database | 2024-12-11T10:01:00 | 70.1 | Warn |
| Bravo | database | 2024-12-11T10:01:00 | 80.5 | OK |
| Alpha | webserver | 2024-12-11T10:02:00 | 25.3 | Warn |

The following command creates a last value cache named `cpuCache`:

```bash
influxdb3 create last_cache \
  --database servers \
  --table cpu \
  --key-columns host,application \
  --value-columns usage_percent,status \
  --count 5 cpuCache
```

_You can create a last values cache per time series, but be mindful of high cardinality tables that could take excessive memory._

#### Query a last values cache

To use the LVC, call it using the `last_cache()` function in your query--for example:

```bash
influxdb3 query \
  --database servers \
  "SELECT * FROM last_cache('cpu', 'cpuCache') WHERE host = 'Bravo';"
```

> [!Note]
> #### Only works with SQL
> 
> The Last values cache only works with SQL, not InfluxQL; SQL is the default language.

#### Delete a Last values cache

Use the `influxdb3` CLI to [delete a last values cache](/influxdb3/version/reference/cli/influxdb3/delete/last_cache/)

```bash
influxdb3 delete last_cache \
  --database <DATABASE_NAME> \
  --table <TABLE> \
  --cache-name <CACHE_NAME>
```

### Distinct values cache

Similar to the Last values cache, the database can cache in RAM the distinct values for a single column in a table or a hierarchy of columns. This is useful for fast metadata lookups, which can return in under 30 milliseconds. Many of the options are similar to the last value cache. 

You can use the `influxdb3` CLI to [create a distinct values cache](/influxdb3/version/reference/cli/influxdb3/create/distinct_cache/).

```bash
influxdb3 create distinct_cache \
  --database <DATABASE_NAME> \
  --table <TABLE> \
  --columns <COLUMNS> \
  [CACHE_NAME]
```

Consider the following `cpu` sample table:

| host | application | time | usage\_percent | status |
| ----- | ----- | ----- | ----- | ----- |
| Bravo | database | 2024-12-11T10:00:00 | 55.2 | OK |
| Charlie | cache | 2024-12-11T10:00:00 | 65.4 | OK |
| Bravo | database | 2024-12-11T10:01:00 | 70.1 | Warn |
| Bravo | database | 2024-12-11T10:01:00 | 80.5 | OK |
| Alpha | webserver | 2024-12-11T10:02:00 | 25.3 | Warn |

The following command creates a distinct values cache named `cpuDistinctCache`:

```bash
influxdb3 create distinct_cache \
  --database servers \
  --table cpu \
  --columns host,application \
  cpuDistinctCache
```

#### Query a distinct values cache

To use the distinct values cache, call it using the `distinct_cache()` function in your query--for example:

```bash
influxdb3 query \
  --database servers \
  "SELECT * FROM distinct_cache('cpu', 'cpuDistinctCache')"
```

> [!Note]
> #### Only works with SQL
> 
> The distinct cache only works with SQL, not InfluxQL; SQL is the default language.

#### Delete a distinct values cache

Use the `influxdb3` CLI to [delete a distinct values cache](/influxdb3/version/reference/cli/influxdb3/delete/distinct_cache/)

```bash
influxdb3 delete distinct_cache \
  --database <DATABASE_NAME> \
  --table <TABLE> \
  --cache-name <CACHE_NAME>
```

### Python plugins and the Processing engine

The InfluxDB 3 Processing engine is an embedded Python VM for running code inside the database to process and transform data.

To activate the Processing engine, pass the `--plugin-dir <PLUGIN_DIR>` option when starting the {{% product-name %}} server.
`PLUGIN_DIR` is your filesystem location for storing [plugin](#plugin) files for the Processing engine to run.

#### Plugin

A plugin is a Python function that has a signature compatible with a Processing engine [trigger](#trigger).

#### Trigger

When you create a trigger, you specify a [plugin](#plugin), a database, optional arguments,
and a _trigger-spec_, which defines when the plugin is executed and what data it receives.

##### Trigger types

InfluxDB 3 provides the following types of triggers, each with specific trigger-specs:

- **On WAL flush**: Sends a batch of written data (for a specific table or all tables) to a plugin (by default, every second).
- **On Schedule**: Executes a plugin on a user-configured schedule (using a crontab or a duration); useful for data collection and deadman monitoring.
- **On Request**: Binds a plugin to a custom HTTP API endpoint at `/api/v3/engine/<ENDPOINT_PATH>`.
  The plugin receives the HTTP request headers and content, and can then parse, process, and send the data into the database or to third-party services.

### Test, create, and trigger plugin code

##### Example: Python plugin for WAL rows 

```python
# This is the basic structure for Python plugin code that runs in the
# InfluxDB 3 Processing engine.

# When creating a trigger, you can provide runtime arguments to your plugin,
# allowing you to write generic code that uses variables such as monitoring
thresholds, environment variables, and host names.
#
# Use the following exact signature to define a function for the WAL flush
# trigger.
# When you create a trigger for a WAL flush plugin, you specify the database
# and tables that the plugin receives written data from on every WAL flush
# (default is once per second).
def process_writes(influxdb3_local, table_batches, args=None):
    # here you can see logging. for now this won't do anything, but soon 
    # we'll capture this so you can query it from system tables
    if args and "arg1" in args:
        influxdb3_local.info("arg1: " + args["arg1"])

    # here we're using arguments provided at the time the trigger was set up 
    # to feed into paramters that we'll put into a query
    query_params = {"host": "foo"}
    # here's an example of executing a parameterized query. Only SQL is supported. 
    # It will query the database that the trigger is attached to by default. We'll 
    # soon have support for querying other DBs.
    query_result = influxdb3_local.query("SELECT * FROM cpu where host = '$host'", query_params)
    # the result is a list of Dict that have the column name as key and value as 
    # value. If you run the WAL test plugin with your plugin against a DB that 
    # you've written data into, you'll be able to see some results
    influxdb3_local.info("query result: " + str(query_result))

    # this is the data that is sent when the WAL is flushed of writes the server 
    # received for the DB or table of interest. One batch for each table (will 
    # only be one if triggered on a single table)
    for table_batch in table_batches:
        # here you can see that the table_name is available.
        influxdb3_local.info("table: " + table_batch["table_name"])

        # example to skip the table we're later writing data into
        if table_batch["table_name"] == "some_table":
            continue

        # and then the individual rows, which are Dict with keys of the column names and values
        for row in table_batch["rows"]:
            influxdb3_local.info("row: " + str(row))

    # this shows building a line of LP to write back to the database. tags must go first and 
    # their order is important and must always be the same for each individual table. Then 
    # fields and lastly an optional time, which you can see in the next example below
    line = LineBuilder("some_table")\
        .tag("tag1", "tag1_value")\
        .tag("tag2", "tag2_value")\
        .int64_field("field1", 1)\
        .float64_field("field2", 2.0)\
        .string_field("field3", "number three")
    
    # this writes it back (it actually just buffers it until the completion of this function
    # at which point it will write everything back that you put in)
    influxdb3_local.write(line)

    # here's another example, but with us setting a nanosecond timestamp at the end
    other_line = LineBuilder("other_table")
    other_line.int64_field("other_field", 1)
    other_line.float64_field("other_field2", 3.14)
    other_line.time_ns(1302)

    # and you can see that we can write to any DB in the server
    influxdb3_local.write_to_db("mytestdb", other_line)

    # just some log output as an example
    influxdb3_local.info("done")
```

##### Test a plugin on the server

Test your InfluxDB 3 plugin safely without affecting written data. During a plugin test:

- A query executed by the plugin queries against the server you send the request to.
- Writes aren't sent to the server but are returned to you.

To test a plugin, do the following:

1. Create a _plugin directory_--for example, `/path/to/.influxdb/plugins`
2. [Start the InfluxDB server](#start-influxdb) and include the `--plugin-dir <PATH>` option.
3. Save the [example plugin code](#example-python-plugin-for-wal-flush) to a plugin file inside of the plugin directory. If you haven't yet written data to the table in the example, comment out the lines where it queries.
4. To run the test, enter the following command with the following options:

   - `--lp` or  `--file`: The line protocol to test
   - Optional: `--input-arguments`: A comma-delimited list of `<KEY>=<VALUE>` arguments for your plugin code

   ```bash
   influxdb3 test wal_plugin \
     --lp <INPUT_LINE_PROTOCOL> \
     --input-arguments "arg1=foo,arg2=bar" \
     --database <DATABASE_NAME> \
     <PLUGIN_FILENAME> 
   ```

The command runs the plugin code with the test data, yields the data to the plugin code, and then responds with the plugin result.
You can quickly see how the plugin behaves, what data it would have written to the database, and any errors.
You can then edit your Python code in the plugins directory, and rerun the test.
The server reloads the file for every request to the `test` API.

For more information, see [`influxdb3 test wal_plugin`](/influxdb3/version/reference/cli/influxdb3/test/wal_plugin/) or run `influxdb3 test wal_plugin -h`.

With the plugin code inside the server plugin directory, and a successful test,
you're ready to create a plugin and a trigger to run on the server.

##### Example: Test, create, and run a plugin

The following example shows how to test a plugin, and then create the plugin and
trigger:

```bash
# Test and create a plugin
# Requires:
#   - A database named `mydb` with a table named `foo`
#   - A Python plugin file named `test.py`
# Test a plugin
influxdb3 test wal_plugin \
  --lp "my_measure,tag1=asdf f1=1.0 123" \
  --database mydb \
  --input-arguments "arg1=hello,arg2=world" \
  test.py
```

```bash
# Create a trigger that runs the plugin
influxdb3 create trigger \
  -d mydb \
  --plugin test_plugin \
  --trigger-spec "table:foo" \
  --trigger-arguments "arg1=hello,arg2=world" \
  trigger1
```

After you have created a plugin and trigger, enter the following command to
enable the trigger and have it run the plugin as you write data:

```bash
influxdb3 enable trigger --database mydb trigger1 
```

For more information, see [Python plugins and the Processing engine](/influxdb3/version/plugins/).
