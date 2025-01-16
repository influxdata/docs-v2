## Get started with {{% product-name %}}

InfluxDB is a database built to collect, process, transform, and store event and time series data. It is ideal for use cases that require real-time ingest and fast query response times to build user interfaces, monitoring, and automation solutions.

Common use cases include:

- Monitoring sensor data
- Server monitoring
- Application performance monitoring
- Network monitoring
- Financial market and trading analytics
- Behavioral analytics

InfluxDB is optimized for scenarios where near real-time data monitoring is essential and queries need to return quickly to support user experiences such as dashboards and interactive user interfaces.

{{% product-name %}} is built on InfluxDB 3 Core, the InfluxDB 3 open source release.
Core's feature highlights include:

* Diskless architecture with object storage support (or local disk with no dependencies)
* Fast query response times (under 10ms for last-value queries, or 30ms for distinct metadata)
* Embedded Python VM for plugins and triggers
* Parquet file persistence
* Compatibility with InfluxDB 1.x and 2.x write APIs

The Enterprise version adds onto Core's functionality with:

* Historical query capability and single series indexing
* High availability
* Read replicas
* Enhanced security
* Row-level delete support (coming soon)
* Integrated admin UI (coming soon)

### What's in this guide

This guide covers Enterprise as well as InfluxDB 3 Core, including the following topics:

* [Install and startup](#install-and-startup)
* [Data Model](#data-model)
* [Write data to the database](#write-data)
* [Query the database](#query-the-database)
* [Last values cache](#last-values-cache)
* [Distinct Values Cache](#distinct-values-cache)
* [Python plugins and the processing engine](#python-plugins-and-the-processing-engine)
* [Diskless architecture](#diskless-architecture)
* [Multi-server setups](#multi-server-setup)

### Install and startup

{{% product-name %}} runs on **Linux**, **macOS**, and **Windows**.
[Run the install script](#run-the-install-script) to get started quickly,
regardless of your operating system.

Or, if you prefer, you can download and install {{% product-name %}} from [build artifacts and Docker images](#optional-download-build-artifacts-and-docker-images).

#### Run the install script 

Enter the following command to use [curl](https://curl.se/download.html) to download the script and install {{% product-name %}}, for MacOS and Linux operating systems:

```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh && sh install_influxdb3.sh enterprise
```

To verify that the download and installation completed successfully, run the following command:

```bash
influxdb3 --version
```

If your system doesn't locate `influxdb3`, then `source` the configuration file (for example, .bashrc, .zshrc) for your shell--for example:

```zsh
source ~/.zshrc
```

#### Optional: Download build artifacts and Docker images 

Download the latest build artifacts — including Windows — and Docker images from the links below. These are updated with every merge into `main`.

##### {{% product-name %}} (latest):

- Docker: [quay.io/influxdb/influxdb3-enterprise:latest](quay.io/influxdb/influxdb3-enterprise:latest)
- [Linux | x86_64 | GNU](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-unknown-linux-gnu.tar.gz.sha256)
- [Linux | x86_64 | MUSL](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-unknown-linux-musl.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-unknown-linux-musl.tar.gz.sha256)
- [Linux | ARM64 | GNU](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-unknown-linux-gnu.tar.gz.sha256)
- [Linux | ARM64 | MUSL](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-unknown-linux-musl.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-unknown-linux-musl.tar.gz.sha256)
- [macOS | ARM64](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-apple-darwin.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-apple-darwin.tar.gz.sha256)
- [Windows | x86_64](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-pc-windows-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-pc-windows-gnu.tar.gz.sha256)

#### Start InfluxDB

To start your InfluxDB instance, use the `influxdb3 serve` command
and provide an object store configuration and a unique `writer-id`.

- `--object-store`: InfluxDB supports various storage options, including the local file system, memory, S3 (and compatible services like Ceph or Minio), Google Cloud Storage, and Azure Blob Storage.
- `--writer-id`: This string identifier determines the path under which all files written by this instance will be stored in the configured storage location.

The following examples show how to start InfluxDB with different object store configurations:

```bash
# MEMORY
influxdb3 serve --writer-id=local01 --object-store=memory
```

```bash
# FILESYSTEM
influxdb3 serve --writer-id=local01 --object-store=file --data-dir ~/.influxdb3
```

```bash
# S3 (defaults to us-east-1 for region)
influxdb3 serve --writer-id=local01 --object-store=s3 --bucket=[BUCKET] --aws-access-key=[AWS ACCESS KEY] --aws-secret-access-key=[AWS SECRET ACCESS KEY]
```

```bash
# Minio/Open Source Object Store (Uses the AWS S3 API, with additional parameters)
influxdb3 serve --writer-id=local01 --object-store=s3 --bucket=[BUCKET] --aws-access-key=[AWS ACCESS KEY] --aws-secret-access-key=[AWS SECRET ACCESS KEY] --aws-endpoint=[ENDPOINT] --aws-allow-http
```

#### Licensing

When starting {{% product-name %}} for the first time, it prompts you to enter an email address for verification. You will receive an email with a verification link.
Upon verification, the license creation, retrieval, and application are automated.

_During the alpha period, licenses are valid until May 7, 2025._

### Data Model

The database server contains logical databases, which have tables, which have columns. Compared to previous versions of InfluxDB you can think of a database as a `bucket` in v2 or as a `db/retention_policy` in v1. A `table` is equivalent to a `measurement`, which has columns that can be of type `tag` (a string dictionary), `int64`, `float64`, `uint64`, `bool`, or `string` and finally every table has a `time` column that is a nanosecond precision timestamp.

In InfluxDB 3, every table has a primary key--the ordered set of tags and the time--for its data.
This is the sort order used for all Parquet files that get created. When you create a table, either through an explicit call or by writing data into a table for the first time, it sets the primary key to the tags in the order they arrived. This is immutable. Although InfluxDB is still a _schema-on-write_ database, the tag column definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, or `building_id` or `trace_id`. All other data should be kept in fields. You will be able to add fast last N value and distinct value lookups later for any column, whether it is a field or a tag.

### Write Data

InfluxDB is a schema-on-write database. You can start writing data and InfluxDB creates the logical database, tables, and their schemas on the fly.
After a schema is created, InfluxDB validates future write requests against it before accepting the data.
Subsequent requests can add new fields on-the-fly, but can't add new tags.

**Note**: write requests to the database _don't_ return until a WAL file has been flushed to the configured object store, which by default happens once per second.
This means that individual write requests may not complete quickly, but you can make many concurrent requests to get higher total throughput. In the future, we will add an API parameter to make requests that do not wait for the WAL flush to return.

The database has three write API endpoints that respond to HTTP `POST` requests:

* `/write?db=mydb,precision=ns`
* `/api/v2/write?db=mydb,precision=ns`
* `/api/v3/write_lp?db=mydb,precision=ns`

{{% product-name %}} provides the `/write` and `/api/v2/write` endpoints for backward compatibility with clients that can write data to previous versions of InfluxDB.
However, these APIs differ from the APIs in the previous versions in the following ways:

- Tags in a table (measurement) are _immutable_
- A tag and a field can't have the same name within a table.

The `/api/v3/write_lp` endpoint accepts the same line protocol syntax as previous versions, and brings new functionality that lets you accept or reject partial writes using the `accept_partial` parameter (`true` is default).

The following code block is an example of [line protocol](/influxdb3/enterprise/reference/syntax/line-protocol/), which shows the table name followed by tags, which are an ordered, comma-separated list of key/value pairs where the values are strings, followed by a comma-separated list of key/value pairs that are the fields, and ending with an optional timestamp. The timestamp by default is a nanosecond epoch, but you can specify a different precision through the `precision` query parameter.

```
cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK"
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK"
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK"
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn"
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK"
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn"
```

If you save the preceding line protocol to a file (for example, `server_data`), then you can use the `influxdb3` CLI to write the data--for example:

```bash
influxdb3 write --database=mydb --file=server_data
```

The written data goes into WAL files, created once per second, and into an in-memory queryable buffer. Later, InfluxDB snapshots the WAL and persists the data into object storage as Parquet files.
We'll cover the [diskless architecture](#diskless-architecture) later in this document.

#### Create a Database or Table

To create a database without writing data into it, use the `create` subcommand--for example:

```bash
influxdb3 create database mydb
```

To learn more about a subcommand, use the `-h, --help` flag:

```
influxdb3 create -h
```

### Query the database

InfluxDB 3 now supports native SQL for querying, in addition to InfluxQL, an SQL-like language customized for time series queries.

> [!Note]
> Flux, the language introduced in InfluxDB 2.0, is **not** supported in InfluxDB 3.

The quickest way to get started querying is to use the `influxdb3` CLI (which uses the Flight SQL API over HTTP2).

The `query` subcommand includes options to help ensure that the right database is queried with the correct permissions. Only the `--database` option is required, but depending on your specific setup, you may need to pass other options, such as host, port, and token.

| Option | Description | Required |
|---------|-------------|--------------|
| `--host` | The host URL of the running {{% product-name %}} server [default: http://127.0.0.1:8181] | No |
| `--database` | The name of the database to operate on | Yes |
| `--token` | The token for authentication with the {{% product-name %}} server | No |
| `--language` | The query language used to format the provided query string [default: sql] [possible values: sql, influxql] | No  |
| `--format` | The format in which to output the query [default: pretty] [possible values: pretty, json, json_lines, csv, parquet] | No |
| `--output` | Put all query output into `output` | No |

#### Example: query `“SHOW TABLES”` on the `servers` database:

```
$ influxdb3 query --database=servers "SHOW TABLES"
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

```
$ influxdb3 query --database=servers "SELECT DISTINCT usage_percent, time FROM cpu LIMIT 10"
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

### Querying using the CLI for InfluxQL

[InfluxQL](/influxdb3/enterprise/reference/influxql/) is an SQL-like language developed by InfluxData with specific features tailored for leveraging and working with InfluxDB. It’s compatible with all versions of InfluxDB, making it a good choice for interoperability across different InfluxDB installations.

To query using InfluxQL, enter the `influxdb3 query` subcommand and specify `influxql` in the language option--for example:

```bash
influxdb3 query --database=servers --lang=influxql "SELECT DISTINCT usage_percent FROM cpu WHERE time >= now() - 1d"
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
curl -v "http://127.0.0.1:8181/api/v3/query_sql?db=servers&q=select+*+from+cpu+limit+5"
```

##### Example: Query passing JSON parameters

The following example sends an HTTP `POST` request with parameters in a JSON payload:

```bash
curl http://127.0.0.1:8181/api/v3/query_sql --data '{"db": "server", "q": "select * from cpu limit 5"}'
```

### Query using the Python client

Use the InfluxDB 3 Python library to interact with the database and integrate with your application.
We recommend installing the required packages in a Python virtual environment for your specific project.

To get started, install the `influxdb3-python` package.

```
pip install influxdb3-python
```

From here, you can connect to your database with the client library using just the **host** and **database name:

```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='http://127.0.0.1:8181',
    database='servers'
)
```

The following example shows how to query using SQL, and then
use PyArrow to explore the schema and process results:

```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='http://127.0.0.1:8181',

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

## Last values cache

{{% product-name %}} supports a **last-n values cache** which stores the last N values in a series or column hierarchy in memory. This gives the database the ability to answer these kinds of queries in under 10 milliseconds.
You can use the `influxdb3` CLI to create a last value cache.

```
Usage: $ influxdb3 create last-cache [OPTIONS] -d <DATABASE_NAME> -t <TABLE>

Options:
  -h, --host <HOST_URL>                URL of the running InfluxDB 3 server
  -d, --database <DATABASE_NAME>       The database to run the query against 
      --token <AUTH_TOKEN>             The token for authentication 
  -t, --table <TABLE>                  The table for which the cache is created
      --cache-name <CACHE_NAME>        Give a name for the cache
      --help                           Print help information
      --key-columns <KEY_COLUMNS>      Columns used as keys in the cache
      --value-columns <VALUE_COLUMNS>  Columns to store as values in the cache
      --count <COUNT>                  Number of entries per unique key:column 
      --ttl <TTL>                      The time-to-live for entries (seconds)

```

You can create a last values cache per time series, but be mindful of high cardinality tables that could take excessive memory.

An example of creating this cache in use:

| host | application | time | usage\_percent | status |
| ----- | ----- | ----- | ----- | ----- |
| Bravo | database | 2024-12-11T10:00:00 | 55.2 | OK |
| Charlie | cache | 2024-12-11T10:00:00 | 65.4 | OK |
| Bravo | database | 2024-12-11T10:01:00 | 70.1 | Warn |
| Bravo | database | 2024-12-11T10:01:00 | 80.5 | OK |
| Alpha | webserver | 2024-12-11T10:02:00 | 25.3 | Warn |

```bash
influxdb3 create last-cache --database=servers --table=cpu --cache-name=cpuCache --key-columns=host,application --value-columns=usage_percent,status --count=5
```

### Querying a Last values cache

To leverage the LVC, you need to specifically call on it using the `last_cache()` function. An example of this type of query:

```
Usage: $ influxdb3 query --database=servers "SELECT * FROM last_cache('cpu', 'cpuCache') WHERE host = 'Bravo;"
```
{{% note %}}
#### Only works with SQL

The Last Value Cache only works with SQL, not InfluxQL; SQL is the default language.
{{% /note %}}

### Deleting a Last values cache

Removing a Last values cache is also easy and straightforward, with the instructions below.

```

Usage: influxdb3 delete delete [OPTIONS] -d <DATABASE_NAME> -t <TABLE> --cache-name <CACHE_NAME>

Options:
  -h, --host <HOST_URL>          Host URL of the running InfluxDB 3 server
  -d, --database <DATABASE_NAME> The database to run the query against          
      --token <AUTH_TOKEN>       The token for authentication   
  -t, --table <TABLE>            The table for which the cache is being deleted
  -n, --cache-name <CACHE_NAME>  The name of the cache being deleted
      --help                     Print help information
```

## Distinct Values Cache

Similar to the Last values cache, the database can cache in RAM the distinct values for a single column in a table or a heirarchy of columns. This is useful for fast metadata lookups, which can return in under 30 milliseconds. Many of the options are similar to the last value cache. See the CLI output for more information:

```bash
influxdb3 create distinct_cache -h
```

### Python Plugins and the Processing Engine

{{% note %}}
#### Only supported in Docker

As of this writing, the Processing Engine is only supported in Docker environments.
We expect it to launch in non-Docker environments soon. We're still in very active development creating the API and developer experience; things will break and change fast. Join our <a href="https://discord.gg/9zaNCW2PRT">Discord</a> to ask questions and give feedback.
{{% /note %}}

InfluxDB3 has an embedded Python VM for running code inside the database. Currently, we only support plugins that get triggered on WAL file flushes, but more will be coming soon. Specifically, plugins will be able to be triggered by:

* On WAL flush: sends a batch of write data to a plugin once a second (can be configured).
* On Snapshot (persist of Parquet files): sends the metadata to a plugin to do further processing against the Parquet data or send the information elsewhere (for example, adding it to an Iceberg Catalog).
* On Schedule: executes plugin on a schedule configured by the user, and is useful for data collection and deadman monitoring.
* On Request: binds a plugin to an HTTP endpoint at `/api/v3/plugins/<name>` where request headers and content are sent to the plugin, which can then parse, process, and send the data into the database or to third party services

Plugins work in two parts: plugins and triggers. Plugins are the generic Python code that represent a plugin. Once you've loaded a plugin into the server, you can create many triggers of that plugin. A trigger has a plugin, a database and then a trigger-spec, which can be either all_tables or table:my_table_name where my_table_name is the name of your table you want to filter the plugin to.

You can also specify a list of key/value pairs as arguments supplied to a trigger. This makes it so that you could have many triggers of the same plugin, but with different arguments supplied to check for different things. These commands will give you useful information:

```
influxdb3 create plugin -h
influxdb3 create trigger -h
```

> [!Note]
> #### Plugins only work with x86 Docker
> For now, plugins only work with the x86 Docker image.

Before we try to load up a plugin and create a trigger for it, we should write one and test it out. To test out and run plugins, you'll need to create a plugin directory. Start up your server with the --plugin-dir argument and point it at your plugin dir (note that you'll need to make this available in your Docker container).

Have a look at this example Python plugin file:

```python
# This is the basic structure of the Python code that would be a plugin.
# After this Python exmaple there are instructions below for how to interact 
# with the server to test it out, load it in, and set it to trigger on 
# writes to either a specific DB or a specific table within a DB. When you 
# define the trigger you can provide arguments to it. This will allow you to
# set things like monitoring thresholds, environment variables to look up, 
# host names or other things that your generic plugin can use.

# you define a function with this exact signature. every time the wal gets 
# flushed (once per second by default), you will get the writes either from 
# the table you triggered the plugin to or every table in the database that 
# you triggered it to 
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

Then you'll want to drop a file into that plugin directory. You can use the example from above, but comment out the section where it queries (unless you write some data to that table, in which case leave it in!).

To use the server to test what a plugin will do, in advance of actually loading it into the server or creating a trigger that calls it, enter the following command:

`influxdb3 test wal_plugin -h`

The important arguments are `lp` or `file`, which read line protocol from that file and yield it as a test to your new plugin.

`--input-arguments` are key/value pairs separated by commas--for example:

```bash
--input-arguments "arg1=foo,arg2=bar"
```

If you execute a query within the plugin, it will query against the live server you're sending this request to. Any writes you do will not be sent into the server, but instead returned back to you.

This will let you see what a plugin would have written back without actually doing it. It will also let you quickly spot errors, change your python file in the plugins directory, and then run the test again. The server will reload the file on every request to the test API.

Once you've done that, you can create the plugin through the command shown above. Then you'll have to create trigger to have it be active and run with data as you write it into the server.

Here's an example of each of the three commands being run:

```
influxdb3 test wal_plugin --lp="my_measure,tag1=asdf f1=1.0 123" -d mydb --input-arguments="arg1=hello,arg2=world" test.py
# make sure you've created mydb first
influxdb3 create plugin -d mydb --code-filename="/Users/pauldix/.influxdb3/plugins/test.py" test_plugin
influxdb3 create trigger -d mydb --plugin=test_plugin --trigger-spec="table:foo" trigger1
```

After you've tested it, you can create the plugin in the server(the file will need to be there in the plugin-dir) and then create a trigger to trigger it on WAL flushes.

### Diskless architecture

InfluxDB 3 is able to operate using only object storage with no locally attached disk. While it can use only a disk with no dependencies, the ability to operate without one is a new capability with this release. The figure below illustrates the write path for data landing in the database.

{{< img-hd src="/img/influxdb/influxdb-3-write-path.png" alt="Write Path for InfluxDB 3 Core & Enterprise" />}}

As write requests come in to the server, they are parsed and validated and put into an in-memory WAL buffer. This buffer is flushed every second by default (can be changed through configuration), which will create a WAL file. Once the data is flushed to disk, it is put into a queryable in-memory buffer and then a response is sent back to the client that the write was successful. That data will now show up in queries to the server.

InfluxDB periodically snapshots the WAL to persist the oldest data in the queryable buffer, allowing the server to remove old WAL files. By default, the server will keep up to 900 WAL files buffered up (15 minutes of data) and attempt to persist the oldest 10 minutes, keeping the most recent 5 minutes around.

When the data is persisted out of the queryable buffer it is put into the configured object store as Parquet files. Those files are also put into an in-memory cache so that queries against the most recently persisted data do not have to go to object storage.

### Multi-server setup

{{% product-name %}} is built to support multi-node setups for high availability, read replicas, and flexible implementations depending on use case.  

### High availability

Enterprise is architecturally flexible, giving you options on how to configure multiple servers that work together for high availability (HA) and high performance.
Built on top of the diskless engine and leveraging the Object store, an HA setup ensures that if a node fails, you can still continue reading from, and writing to, a secondary node.

A two-node setup is the minimum for basic high availability, with both nodes having read-write permissions.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-high-availability.png" alt="Basic high availability setup" />}}

In a basic HA setup:

- Two nodes both write data to the same Object store and both handle queries
- Node 1 and Node 2 are _read replicas_ that read from each other’s Object store directories
- One of the nodes is designated as the Compactor node

> [!Note]
> Only one node can be designated as the Compactor.
> Compacted data is meant for a single writer, and many readers.

The following examples show how to configure and start two nodes
for a basic HA setup.
The example commands pass the following options:

- `--read-from-writer-ids`: makes the node a _read replica_, which checks the Object store for data arriving from other nodes
- `--compactor-id`: activates the Compactor for a node. Only one node can run compaction
- `--run-compactions`: ensures the Compactor runs the compaction process

```bash
## NODE 1

# Example variables
# writer-id: 'host01'
# bucket: 'influxdb-3-enterprise-storage'
# compactor-id: 'c01'


influxdb3 serve --writer-id=host01 --read-from-writer-ids=host02 --compactor-id=c01 --run-compactions --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8181 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY> 
```

```
## NODE 2

# Example variables
# writer-id: 'host02'
# bucket: 'influxdb-3-enterprise-storage'

influxdb3 serve --writer-id=host02 --read-from-writer-ids=host01 --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8282
--aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY> 
```

After the nodes have started, querying either node returns data for both nodes, and `NODE 1` runs compaction.
To add nodes to this setup, start more read replicas:

```bash
influxdb3 serve --read-from-writer-ids=host01,host02 [...OPTIONS]
```

> [!Note]
> To run this setup for testing, you can start nodes in separate terminals and pass a different `--http-bind` value for each--for example:
> 
> ```bash
> # In terminal 1
> influxdb3 serve --writer-id=host01 --http-bind=http://127.0.0.1:8181 [...OPTIONS]
> ```
>
> ```bash
> # In terminal 2
> influxdb3 serve --writer-id=host01 --http-bind=http://127.0.0.1:8181 [...OPTIONS]

### High availability with a dedicated Compactor

Data compaction in InfluxDB 3 is one of the more computationally expensive operations.
To ensure that your read-write node doesn’t slow down due to compaction work, set up a compactor-only node for consistent and high performance across all nodes.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-dedicated-compactor.png" alt="Dedicated Compactor setup" />}}

The following examples show how to set up HA with a dedicated Compactor node:

1. Start two read-write nodes as read replicas, similar to the previous example,
   and pass the `--compactor-id` option with a dedicated compactor ID (which you'll configure in the next step).

   ```
   ## NODE 1 — Writer/Reader Node #1

   # Example variables
   # writer-id: 'host01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve --writer-id=host01 --compactor-id=c01 --read-from-writer-ids=host02 --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8181 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

   ```bash
   ## NODE 2 — Writer/Reader Node #2

   # Example variables
   # writer-id: 'host02'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve --writer-id=host02 --compactor-id=c01 --read-from-writer-ids=host01 --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8282 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

2. Start the dedicated compactor node, which uses the following options:

   - `--mode=compactor`: Ensures the node **only** runs compaction.
   - `--compaction-hosts`: Specifies a comma-delimited list of hosts to run compaction for.
  
  _**Don't include the replicas (`--read-from-writer-ids`) parameter because this node doesn't replicate data._

   ```bash

   ## NODE 3 — Compactor Node

   # Example variables
   # writer-id: 'host03'
   # bucket: 'influxdb-3-enterprise-storage'
   # compactor-id: 'c01'

   influxdb3 serve --writer-id=host03 --mode=compactor --compactor-id=c01 --compaction-hosts=host01,host02 --run-compactions --object-store=s3 --bucket=influxdb-3-enterprise-storage --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

### High availability with read replicas and a dedicated Compactor

For a very robust and effective setup for managing time-series data, you can run ingest nodes alongside read-only nodes, and a dedicated Compactor node.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-workload-isolation.png" alt="Workload Isolation Setup" />}}

1. Start writer nodes for ingest. Enterprise doesn’t designate a write-only mode, so assign them **`read_write`** mode.
   To achieve the benefits of workload isolation, you'll send _only write requests_ to these read-write nodes. Later, you'll configure the _read-only_ nodes.

   ```
   ## NODE 1 — Writer Node #1

   # Example variables
   # writer-id: 'host01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve --writer-id=host01 --mode=read_write --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8181 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>

   ```

   ```
   ## NODE 2 — Writer Node #2

   # Example variables
   # writer-id: 'host02'
   # bucket: 'influxdb-3-enterprise-storage'

   Usage: $ influxdb3 serve --writer-id=host02 --mode=read_write --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8282 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

2. Start the dedicated Compactor node (`--mode=compactor`) and ensure it runs compactions on the specified `compaction-hosts`.

   ```
   ## NODE 3 — Compactor Node

   # Example variables
   # writer-id: 'host03'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve --writer-id=host03 --mode=compactor --compaction-hosts=host01,host02 --run-compactions --object-store=s3 --bucket=influxdb-3-enterprise-storage --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

3. Finally, start the query nodes as _read-only_.
   Include the following options: 
   
   - `--mode=read`: Sets the node to _read-only_
   - `--read-from-writer-ids=host01,host02`: A comma-demlimited list of host IDs to read data from

   ```bash
   ## NODE 4 — Read Node #1

   # Example variables
   # writer-id: 'host04'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve --writer-id=host04 --mode=read --object-store=s3 --read-from-writer-ids=host01,host02 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8383 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

   ```
   ## NODE 5 — Read Node #2

   # Example variables
   # writer-id: 'host05'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve --writer-id=host05 --mode=read --object-store=s3 --read-from-writer-ids=host01,host02 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8484 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
   ```

Congratulations, you have a robust setup to workload isolation using {{% product-name %}}.

### Writing and Querying for Multi-Node Setups

If you’re running {{% product-name %}} in a single-instance setup, writing and querying is the same as for {{% product-name %}}.
You can use the default port `8181` for any write or query, without changing any of the commands.

> [!Note]
> #### Specify hosts for writes and queries
>
> To benefit from this multi-node, isolated architecture specify hosts:
> 
> - In write requests, specify a host designated for _write-only_
> - In query requests, specify a host designated for _read-only
> 
> When running multiple local instances for testing, or separate nodes in production, specifying the host ensures writes and queries are routed to the correct instance.
> If you run locally and serve an instance on 8181 (the default port), then you don’t need to specify the host.

```
# Example variables on a query
# HTTP-bound Port: 8585
Usage: $ influxdb3 query --host=http://127.0.0.1:8585 -d <DATABASE> "<QUERY>" 
```

### File index settings

To accelerate performance on specific queries, you can define non-primary keys to index on, which helps improve performance for single-series queries.
This feature is only available in Enterprise and is not available in Core.

#### Create a file index

```bash
# Example variables on a query
# HTTP-bound Port: 8585

influxdb3 file-index create --host=http://127.0.0.1:8585 -d <DATABASE> -t <TABLE> <COLUMNS>
```

#### Delete a file index

```bash
influxdb3 file-index delete --host=http://127.0.0.1:8585 -d <DATABASE> -t <TABLE>
```
