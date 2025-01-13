---
title: InfluxDB 3 Core Guide
description: >
  InfluxDB 3 Core is an open source time series database designed and optimized
  for time series and observational data in real time. It is focused on recent 
  data and optimized for the last 72 hours. Learn how to use and leverage 
  InfluxDB v3 in use cases such as edge data collection, IoT data, and events.
menu:
  influxdb3_core:
    name: InfluxDB 3 Core
weight: 1
---

# **Getting Started with InfluxDB 3 Core**

InfluxDB is a database built to collect, process, transform, and store event and time series data. It is ideal for use cases that require real-time ingest and fast query response times to build user interfaces, monitoring, and automation solutions. Use cases include applications in sensor data, server monitoring, application performance monitoring, network monitoring, financial market and trading analytics, behavioral analytics, and more. InfluxDB is focused on problem domains where data must be monitored in near real-time and queries must return quickly to drive user experiences like dashboards and interactive UIs. 

This guide covers InfluxDB 3 Core (the open source release). Core's feature highlights include:
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

You can find the [Enterprise Guide here](https://docs.influxdata.com/influxdb3/enterprise/get-started/).

## **What's in this guide**

Here's what we'll cover in this guide:

* [Installation and startup](#installation-and-startup)
* [The Data Model](#data-model)
* [Writing data to the database](#write-data)
* [Querying the database](#querying-the-database)
* [Last Values Cache](#last-values-cache)
* [Distinct Values Cache](#distinct-values-cache)
* [Python plugins and the processing engine](#python-plugins-and-the-processing-engine)
* [Diskless architechture](#diskless-architechture)

## **Installation and Startup**

If you are looking to get started quickly with an installation on your local machine, we recommend using our install script below. Regardless of your platform OS, it will handle the download and installation of InfluxDB 3 Core. If you just want to find the built artifacts or Docker images and install them yourself, details are after the install script instructions.

```
curl -O https://www.influxdata.com/d/install_influxdb3.sh && sh install_influxdb3.sh
```

To ensure that the download and installation completed successfully, you can run:

```
influxdb3 --version
```

If your system doesn't locate your installation of InfluxDB, `source` your current shell configuration file (.bashrc, .zshrc, etc). 

```
source ~/.zshrc
```

If you just want to download the build artifacts and Docker images you can find them here. These are build on every merge into `main` so they represent the latest builds.

### **InfluxDB 3 Core (latest):**
* Docker: [quay.io/influxdb/influxdb3-core:latest](https://quay.io/influxdb/influxdb3-core:latest)
* [Linux | x86 | musl](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-musl.tar.gz)
* [Linux | x86 | gnu](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-gnu.tar.gz)
* [Linux | ARM | musl](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-musl.tar.gz)
* [Linux | ARM | gnu](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-gnu.tar.gz)
* [macOS | Darwin](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-apple-darwin.tar.gz)
* [Windows | x86](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-pc-windows-gnu.tar.gz)

### **Starting InfluxDB**

To start your InfluxDB instance, you’ll need to set your object store configuration and choose a unique `writer-id`. InfluxDB can use either the local file system, RAM, S3 (or compatible services like Ceph or Minio), Google, and Azure. In the configured storage location, all files that this instance writes will be kept under the path of the `writer-id` you choose, which is just a string identifier.

You start the database using the `serve` command. This creates a new, running instance of InfluxDB 3 Core. Here are some quick examples:

```bash
# MEMORY
influxdb3 serve --writer-id=local01 --object-store=memory

# FILESYSTEM
influxdb3 serve --writer-id=local01 --object-store=file --data-dir ~/.influxdb3

# S3
influxdb3 serve --writer-id=local01 --object-store=s3 --bucket=[BUCKET] --aws-access-key=[AWS ACCESS KEY] --aws-secret-access-key=[AWS SECRET ACCESS KEY]

# Minio/Open Source Object Store (Uses the AWS S3 API, with additional parameters)
influxdb3 serve --writer-id=local01 --object-store=s3 --bucket=[BUCKET] --aws-access-key=[AWS ACCESS KEY] --aws-secret-access-key=[AWS SECRET ACCESS KEY] --aws-endpoint=[ENDPOINT] --aws-allow-http
```

## **Data Model**

The database server contains logical databases, which have tables, which have columns. Compared to previous versions of InfluxDB you can think of a database as a `bucket` in v2 or as a `db/retention_policy` in v1. A `table` is equivalent to a `measurement` which has columns that can be of type `tag` (a string dictionary), `int64`, `float64`, `uint64`, `bool`, or `string` and finally every table has a `time` column that is a nanosecond precision timestamp.

In InfluxDB 3, every table has a primary key for the data in it, which is the ordered set of tags and the time. This is the sort order that will be used for all Parquet files that get created. When you create a table, either through an explicit call or by writing data into a a table for the first time, it will set the primary key to the tags in the order they came in. This is immutable. So while InfluxDB is still a "schema on write" database, the tag column definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, or `building_id` or `trace_id`. All other data should be kept in fields. You will be able to add fast last N value and distinct value lookups later for any column, whether it is a field or a tag.

## **Write Data**

InfluxDB is a schema on write database. You can start writing data and it will create the logical database, tables, and their schemas on the fly. Once schema has been created, future requests with get validated against that schema before being accepted. New on-the-fly field additions are possible in subsequent requests (but tags are not).

InfluxDB 3 Core is optimized for recent data only. It accepts writes for data with timestamps from the last 72 hours. It will persist that data in Parquet files for access by third-party systems for longer term historical analysis and queries. If you require longer historical queries with a compactor that optimizes data organization, that functionality is available in [InfluxDB 3 Enterprise](https://docs.influxdata.com/influxdb3/enterprise/get-started/).

It is important to note that write requests to the database do not return until a WAL file has been flushed to the configured object store, which by default happens once per second. This means that individual write requests may not complete quickly, but you can make many concurrent requests to get higher total throughput. In the near future we will add an API parameter to make requests that do not wait for WAL flush to return.

The database has three write API endpoints that repopnd to HTTP POST requests:

* /api/v1/write?db=mydb,precision=ns
* /api/v2/write?db=mydb,precision=ns
* /api/v3/write?db=mydb,precision=ns

The v1 and v2 APIs are there for backward compatability with clients that can write data to previous versions of InfluxDB. The most important thing to note about those endpoints that is different from previous versions is that the tags in a table (measurement) are immutable and you are no longer able to have a tag and field with the same name within a table.

The v3 write API accepts the same Line Protocol as previous versions. It adds new functionality to accept or reject partial writes with the `accept_partial` parameter, which defaults to true.

Here's an example of line protocol, which shows the table name followed by tags, which are an ordered, comma separated list of key/value pairs where the values are strings, followed by a comma separated list of key/val.ue pairs that are the fields and ending with an optional timestamp. The timestamp by default is a nanosecond epoch, but the precision can be specified through the `precision` query parameter.

```
cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK"
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK"
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK"
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn"
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK"
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn"
```

More details on [line protocol here](https://docs.influxdata.com/influxdb/clustered/reference/syntax/line-protocol/).

If you save this line protocol example to a file you can load it using the CLI like this:

```
influxdb3 write --database=mydb --file=server_data
```

The written data will go into WAL files, which are created once per second, and into an in-memory queryable buffer. Later when the WAL is snapshotted, the data will be persisted into object storage as Parquet files. We'll cover more about the [diskless architecture](#diskless-architechture) later in this document.

### **Creating a Database or Table**

You can create a database without writing data into it, use the subcommand `create`.

```
influxdb3 create database mydb
```

Explore the create API with the help flag:

```
influxdb3 create -h
```

## **Querying the database**

InfluxDB 3 now supports native SQL for querying, in addition to InfluxQL – a SQL-like language customized for time series queries. Note: Flux, the language introduced in InfluxDB 2.0, is not supported in 3.

The quickest way to get started is simply leveraging the CLI. It uses the FlightSQL API to make queries to the database over HTTP2.


The `query` subcommand has several parameters to ensure the right database is queried with the correct permissions. Only the `--database` command is required every time, but depending on your specific setup (host port, server token), you may have additional required parameters.

| Option | Description | Required |
|---------|-------------|--------------|
| `--host` | The host URL of the running InfluxDB 3 Core server [default: http://127.0.0.1:8181] | No |
| `--database` | The name of the database to operate on | Yes |
| `--token` | The token for authentication with the InfluxDB 3 Core server | No |
| `--language` | The query language used to format the provided query string [default: sql] [possible values: sql, influxql] | No  |
| `--format` | The format in which to output the query [default: pretty] [possible values: pretty, json, json_lines, csv, parquet] | No |
| `--output` | Put all query output into `output` | No |

Example for “SHOW TABLES” on the database called **servers**. 

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

Another example of querying directly on that **cpu** table (limiting to last ten for brevity):

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

InfluxQL is a SQL-like language developed by InfluxData with specific features tailored for leveraging and working with InfluxDB. It’s compatible with all versions of InfluxDB, making it a tremendous choice for interoperability across different InfluxDB installations.

To learn more about all that InfluxQL has to offer, you can [learn more here](https://docs.influxdata.com/influxdb/cloud-serverless/query-data/influxql/basic-query/).

Once you’re familiar with InfluxQL, you can run queries directly from the CLI similarly to how you can run SQL queries. The only adjustment is supplying the language option: `--lang=influxql`

```
$ influxdb3 query --database=servers --lang=influxql "SELECT DISTINCT usage_percent FROM cpu WHERE time >= now() - 1d"
```

### Query using the API

InfluxDB3 supports FlightSQL and an HTTP API. To query your database, you can send a request to the `/v3/query_sql` or `/v3/query_influxql` endpoints, supplying the the `db` as a parameter, as well as the entire query in a URL-encoded format. You can also issue a POST for longer queries. Use the `format` parameter to specify what resonse format. Valid options are `pretty`, `jsonl`, `parquet`, `csv`, and `json`.

Example of a SQL query leveraging the API:

```
$ curl -v "http://127.0.0.1:8181/api/v3/query_sql?db=servers&q=select+*+from+cpu+limit+5"
```

### Query using the Python Client

We have a Python library available to interact with the database. We recommend installing the required packages in a Python virtual environment for your specific project. You can learn more about the full Python client installation and development process [here](https://docs.influxdata.com/influxdb/clustered/query-data/execute-queries/client-libraries/python/).

To get started, install the `influxdb3-python` package.

```
pip install influxdb3-python
```

From here, you can connect to your database with the client library using just the **host** and **database name:**

```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='http://127.0.0.1:8181',
    database='servers'
)
```

Here are more examples of using the Python client to query the database.

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
print(table.column('temp'))
print(table.select(['room', 'temp']))
print(table.select(['time', 'room', 'temp']))

print("\n#### Use PyArrow compute functions to aggregate data\n")
print(table.group_by('hum').aggregate([]))
print(table.group_by('room').aggregate([('temp', 'mean')]))
```

## Last Values Cache

InfluxDB 3 supports a **last-n values cache** which stores the last N values in a series or or column heirarchy in memory. This gives the database the ability to answer these kinds of queries in under 10 milliseconds. The CLI can be used to create a last value cache, which uses a REST API on the database.

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

You can create a last value cache per time series, but you should be mindful of high cardinality tables that could take excessive memory.

An example of creating this cache in use:

| host | application | time | usage\_percent | status |
| ----- | ----- | ----- | ----- | ----- |
| Bravo | database | 2024-12-11T10:00:00 | 55.2 | OK |
| Charlie | cache | 2024-12-11T10:00:00 | 65.4 | OK |
| Bravo | database | 2024-12-11T10:01:00 | 70.1 | Warn |
| Bravo | database | 2024-12-11T10:01:00 | 80.5 | OK |
| Alpha | webserver | 2024-12-11T10:02:00 | 25.3 | Warn |

```
influxdb3 create last-cache --database=servers --table=cpu --cache-name=cpuCache --key-columns=host,application --value-columns=usage_percent,status --count=5
```

### Querying a Last Values Cache

To leverage the LVC, you need to specifically call on it using the `last_cache()` function. An example of this type of query:

```
Usage: $ influxdb3 query --database=servers "SELECT * FROM last_cache('cpu', 'cpuCache') WHERE host = 'Bravo;"
```
{{% note %}}
Note: The Last Value Cache only works with SQL, not InfluxQL; SQL is the default language.
{{% /note %}}

### Deleting a Last Values Cache

Removing a Last Values Cache is also easy and straightforward, with the instructions below.

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

Similar to the Last Values Cache, the database can cache in RAM the distinct values for a single column in a table or a heirarchy of columns. This is useful for fast metadata lookups, which can return in under 30 milliseoncds. Many of the options are similar to the last value cache. See the CLI output for more information:

```
influxdb3 create distinct_cache -h
```

## **Python Plugins and the Processing Engine**
{{% note %}}
As of this writing, the Processing Engine is only supported in Docker environments.<br/>
We expect it to launch in non-Docker environments soon. We're still in very active development creating the API and developer experience so things will break and change fast. Join our <a href=https://discord.com/invite/eMnhxPyj>Discord</a> to ask questions and give feedback.
{{% /note %}}

InfluxDB3 has an embedded Python VM for running code inside the database. Currently, we only support plugins that get triggered on WAL file flushes, but more will be coming soon. Specifically, plugins will be able to be triggered by:

* On WAL flush sends a batch of write data to a plugin once a second (can be configured).
* On Snapshot (persist of Parquet files) sends the metadata to a plugin to do further processing against the Parquet data or send the information elsewhere (e.g., adding it to an Iceberg Catalog).
* On Schedule executes plugin on a schedule configured by the user, and is useful for data collection and deadman monitoring.
* On Request binds a plugin to an HTTP endpoint at /api/v3/plugins/<name> where request headers and content are sent to the plugin, which can then parse, process, and send the data into the database or to third party services

Plugins work in two parts: plugins and triggers. Plugins are the generic Python code that represent a plugin. Once you've loaded a plugin into the server, you can create many triggers of that plugin. A trigger has a plugin, a database and then a trigger-spec, which can be either all_tables or table:my_table_name where my_table_name is the name of your table you want to filter the plugin to.

You can also specify a list of key/value pairs as arugments supplied to a trigger. This makes it so that you could have many triggers of the same plugin, but with different arguments supplied to check for different things. These commands will give you useful information:

```
influxdb3 create plugin -h
influxdb3 create trigger -h
```

For now, plugins will only work with the x86 Docker image. So you'll need to run from there.

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
    query_result = influxdb3_local.query("SELECT * FROM cpu where host = $host", query_params)
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

The server has a way to test out what a plugin will do in advance of actually loading it into the server or creating a trigger that calls it. To see that do:

influxdb3 test wal_plugin -h
The important arguements are lp or file which will read line protocol from that file. This is what will get yielded as a test to your new plugin. --input-arguments take the form of key/value pairs separated by commas (e.g. --input-arguments "arg1=foo,arg2=bar".

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

After you've tested it, you can create the plugin in the serve (the file will need to be there in the plugin-dir) and then create a trigger to trigger it on WAL flushes.

## **Diskless Architechture**

InfluxDB 3 is able to operate using only object storage with no locally attached disk. While it can use only a disk with no dependencies, the ability to operate without one is a new capability with this release. The figure below illustrates the write path for data landing in the database.

{{< img-hd src="/img/influxdb/influxdb-3-write-path.png" alt="Write Path for InfluxDB 3 Core & Enterprise" />}}

As write requests come in to the server, they are parsed and validated and put into an in-memory WAL buffer. This buffer is flushed every second by default (can be changed through configuration), which will create a WAL file. Once the data is flushed to disk it is put into a queryable in-memory buffer and then a response is sent back to the client that the write was successful. That data will now show up in queries to the server.

The WAL is periodically snapshotted, which will persist the oldest data in the queryable buffer, allowing the server to remove old WAL files. By default, the server will keep up to 900 WAL files buffered up (15 minutes of data) and attempt to persist the oldest 10 minutes, keeping the most recent 5 minutes around.

When the data is persisted out of the queryable buffer it is put into the configured object store as Paruqet files. Those files are also put into an in-memory cache so that queries against the most recently persisted data do not have to go to object storage.
