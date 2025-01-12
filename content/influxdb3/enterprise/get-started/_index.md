# **Getting Started with InfluxDB 3 Enterprise**

InfluxDB is a [database](https://www.influxdata.com/time-series-database/) platform purposefully built to collect, process, transform, and store time series data. It is a solution for real-time analytics, observability, and monitoring. Use cases include working with and monitoring sensor data, server monitoring, application performance monitoring, network monitoring, financial market and trading analytics, behavioral analytics, and more. InfluxDB is focused on problem domains where data must be monitored in near real-time and queries must return quickly to drive user experiences like dashboards and interactive UIs. 

In the newest version of the database — InfluxDB 3 — we’ve introduced several major changes that enable improved performance, better usability, and lower overall costs. 

## **What is time series data and why use InfluxDB?**

Time series data is, in its simplest form, a list of time:value pairs ordered by time. There will usually be metadata that describes this list. A time series represents a summarization of some underlying set of events or observations, or it could be the observations themselves.

The important thing to note about InfluxDB is that it's not just for storing time series data, which is usually a summary. InfluxDB can be used for storing raw observational and event data (i.e. the highest precision data you have) and can compute time series summarizations on the fly.

This makes it much more than a simple metrics database.

* Industrial sensor data  
* Server performance metrics  
* Heartbeats per minute  
* Rainfall measurements  
* Stock prices

A **time series database** excels at storing and accessing this type of data, often called OLAP (Online Analytical Processing) data, whereas traditional relational databases focus on OLTP (Online Transactional Processing). 

In a rainfall measurement scenario, you may collect records on the amount of rain, acidity, cloud coverage, and more, over time. For an analytical query, you don’t want all of that data at a specific time, but rather a specific type of data across many different times; for example, rainfall over time.

| \_time | \_measurement | \_sensor | \_rainfall | \_acidity | \_coverage |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 2024-02-02T12:00:00Z | rainfall | outside\_1 | 0.02 | 1.1 | .7 |
| 2024-02-02T12:00:00Z | rainfall | outside\_2 | 0.02 | 1.1 | .8 |
| 2024-02-02T12:01:00Z | rainfall | outside\_1 | 0.03 | 1.0 | .7 |

With InfluxDB, you don’t have to scan \_sensor, \_acidity, or \_coverage like you would in an RDBMS. Instead, you can access just the \_rainfall information alone, with incredibly low latency due to its columnar structure. You can learn more about columnar databases [here](https://www.example.com). 

## **What’s new in InfluxDB 3?**

With the third iteration of InfluxDB, we’ve crafted an entirely new database from the ground up, with new features that maximize speed, usability, and reliability.

| Update | Utilization | Benefit |
| :---- | :---- | :---- |
| Apache Parquet | Storage format | Using Parquet as the new storage solution for InfluxDB provides for simpler storage, easier accessibility across many different tools, and faster performance on analytical queries. |
| Object Storage | Storage location | With Parquet files as the base for persisted data, InfluxDB 3 now allows for object storage as the preferred location for long-term storage. This dramatically reduces storage costs while keeping performance very high. |
| Unlimited Cardinality | Data variety | Leveraging Parquet, we’ve built an entirely new storage architecture that allows for unlimited cardinality. This ensures that your data can be as descriptive and variable as you need. |
| SQL | Query language | InfluxDB now allows for native SQL querying syntax, leveraging Apache Arrow FlightSQL. This ensures incredibly fast performance on columnar databases with familiar querying concepts. |
| Incredible Performance | Multi-Series Queries |  |

## **Data Organization**

The InfluxDB 3 data model organizes time series data into databases and tables. A database can contain multiple tables. Tables contain multiple tags and fields.

| InfluxDB V3 Term | Similar InfluxDB V1 / V2 Term | Similar RDBMS Term | Description |
| :---- | :---- | :---- | :---- |
| Database | Database (V1) Bucket (V2) | Database | A named location where time series data is stored in *tables*.  |
| Table | Measurement | Table | A logical grouping for time series data. All points in a table should have the same tags. Tables contain *tags* and *fields*.  |
| Tags | Tags | Composite Primary Key | Key-value pairs that provide metadata for each point–for example, something to identify the source or context of the data like host, location, station, etc. Tag values may be null. |
| Fields | Fields | Cell Value | Key-value pairs with values that change over time–for example, temperature, stock price, etc. Fields may be null, but at least one is non-null on any given row. |
| Timestamp | Timestamp | *None* | Timestamp associated with the data. When stored on disk and queried, all data is ordered by time. A timestamp is always required and is never null. |

## **Important Definitions**

| Term | Definition | Example |
| :---- | :---- | :---- |
| Point | Single data record identified by its measurement, tag keys, tag values, field key, and timestamp. | A single entry for a specific weather sensor, detailing its location, temperature, and time. |
| Series | A group of points with the same measurement, tag keys, and tag values. | All the entries for a specific weather sensor, detailing its location, temperature, and time for each entry. |
---
## Installation and Setup

### **System Requirements**

InfluxDB 3 Enteprise runs on Linux, MacOS, and Windows. A key feature of InfluxDB 3 is its use of object storage, which is where the Apache Parquet files InfluxDB writes to are ultimately stored. While you can choose to simply store these files on your local file system, we recommend leveraging an object store for best overall performance. Amazon S3, Azure Blob Storage, and Google Cloud Storage have native support; additional, many local object storage implementations, such as Minio, work as well with the S3 API.

### **Installation for Fast Deployments**

We’ve strived to make downloading and installing InfluxDB as simple as possible. If you are looking to get started quickly with an installation on your local machine, we recommend leveraging our install script below. Regardless of your platform OS, it will handle the download and installation of InfluxDB 3 Enterprise.

```
curl -O https://www.influxdata.com/d/install_influxdb3.sh && sh install_influxdb3.sh enterprise
```

To ensure that the download and installation completed successfully, you can run:

```
influxdb3 --version
```

If it your system doesn't locate your installation of InfluxDB, `source` your current shell configuration file (.bashrc, .zshrc, etc). 

```
source ~/.zshrc
```

If you want to leverage additional installation options for your system, we offer multiple approaches, including Docker images. Start by visiting [www.influxdata.com/downloads](http://www.influxdata.com/downloads) to discover the binary for your particular system.


### **Starting InfluxDB**

To start your InfluxDB instance, you’ll need to know your object store of choice for data storage and its connection information. InfluxDB supports the following storage options:

| Type | Description | Requirements |
| :---- | :---- | :---- |
| *Memory* | In-memory storage with no persistence | None |
| *File* | Local filesystem storage | Data directory location |
| *S3* | Amazon S3 object storage | Bucket, AWS Access Key, and AWS Secret Access Key |
| *Google* | Google Cloud Storage | Bucket and Google Service Account |
| *Azure* | Microsoft Azure Blob Storage | Bucket and Azure Storage Account |

You start the database using the `serve` command. This creates a new, running instance of InfluxDB 3 Enterprise. Here are some quick examples:

```
MEMORY
$ influxdb3 serve --host-id=local01 --object-store=memory

FILESYSTEM
$ influxdb3 serve --host-id=local01 --object-store=file --data-dir ~/.influxdb3

S3
$ influxdb3 serve --host-id=local01 --object-store=s3 --bucket=[BUCKET] --aws-access-key=[AWS ACCESS KEY] --aws-secret-access-key=[AWS SECRET ACCESS KEY]

Minio/Open Source Object Store (Uses the AWS S3 API, with additional parameters)
$ influxdb3 serve --host-id=local01 --object-store=s3 --bucket=[BUCKET] --aws-access-key=[AWS ACCESS KEY] --aws-secret-access-key=[AWS SECRET ACCESS KEY] --aws-endpoint=[ENDPOINT] --aws-allow-http

```

### **Licensing**

If you're starting InfluxDB 3 Enterprise for the first time, you'll be asked to enter an email address for verification. Upon verification, the license creation, retrieval, and application is automated. 

## **Creating a Database**

To create a database, use the subcommand `create`. For this guide, we'll use a database called **servers**. InfluxDB also supports creating a database on first write.

```
$ influxdb3 create database servers
```


## **Writing Data**

InfluxDB 3 supports several approaches to writing data to the database. The most basic approach is leveraging the command line interface to write data points directly. In order to use this approach, you’ll need to supply a file with InfluxDB Line Protocol. 

### Line Protocol

All data written to InfluxDB is written using [line protocol](https://docs.influxdata.com/influxdb/clustered/reference/syntax/line-protocol/), a text-based format that lets you provide the necessary information to write a data point to InfluxDB. A point contains a measurement name, one or more fields, a timestamp, and optional tags that provide metadata about the observation.

| Element | Purpose | Required? |
| :---- | :---- | :---- |
| *Measurement* | A string that identifies the table to store the data in. | Yes |
| *Tag Set* | Comma-delimited list of key value pairs, each representing a tag. Tag keys and values are unquoted strings. Spaces, commas, and equal characters must be escaped. | No |
| *Field Set* | Comma-delimited list of key value pairs, each representing a field. Field keys are unquoted strings. Spaces and commas must be escaped. Field values can be strings (quoted), floats, integers, unsigned integers, or booleans. | Yes |
| *Timestamp* | Unix timestamp associated with the data. InfluxDB supports up to nanosecond precision. If the precision of the timestamp is not in nanoseconds, you must specify the precision when writing the data to InfluxDB. | No |

To build this line protocol, you first define the measurement, then the tag set, then the field set, and finally the timestamp. I diagram of structuring this line protocol is below:

Here is an example of this line protocol in a real file format; copy and save it to a file called `server_data`.

```
cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK" 1708541900
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK" 1708542000
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK" 1708542100
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn" 1708542200
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK" 1708542300
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn" 1708542400
```

To write this data to the database, you must supply the database name, and then specify which file contains the line protocol data you wish to write. Below is an example of this command.

```
$ influxdb3 write --database=servers --file=server_data
```


# **Query Data**

InfluxDB 3 now supports native SQL for querying, in addition to InfluxQL – a SQL-like language with tailorings for time series queries. Note: Flux, a language introduced in InfluxDB 2.0, is not supported in 3\.

There are several approaches to querying data. The quickest way to get started is simply leveraging the CLI, though for production use cases you will want to utilize our API endpoints or the supported libraries. For querying from the CLI, you need to supply the database name first.

### 

### Query using the CLI

The `query` subcommand has several parameters to ensure the right database is queried with the correct permissions. Only the `--database` command is required every time, but depending on your specific setup (host port, server token), you may have additional required parameters.

| Option | Description | Required |
|---------|-------------|--------------|
| `--host` | The host URL of the running InfluxDB 3 Enterprise server [default: http://127.0.0.1:8181] | No |
| `--database` | The name of the database to operate on | Yes |
| `--token` | The token for authentication with the InfluxDB 3 Enterprise server | No |
| `--language` | The query language used to format the provided query string [default: sql] [possible values: sql, influxql] | No  |
| `--format` | The format in which to output the query [default: pretty] [possible values: pretty, json, json_lines, csv, parquet] | No |
| `--output` | Put all query output into `output` | No |

Example for “SHOW TABLES” on the database called **servers**. 

```
$ influxdb3 query --database=servers "SHOW TABLES"
+---------------+--------------------+--------------+------------+
| table_catalog | table_schema       | table_name   | table_type |
+---------------+--------------------+--------------+------------+
| public        | iox                | cpu         | BASE TABLE |
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

For production usage, you can leverage our HTTP API for access to your data. To query your database, you can send a request to the `/v3/query_sql` or `/v3/query_influxql` endpoints, supplying the database as a parameter, as well as the entire query in a URL-encoded format.

Example of a SQL query leveraging the API:

```
$ curl -v "http://127.0.0.1:8181/api/v3/query_sql?db=servers&q=select+*+from+cpu+limit+5"
```

### Query using the Python Client

One of the most robust ways to access data in a programmatic way is leveraging our client libraries, specifically our Python client library. We highly recommend installing the required packages in a Python virtual environment for your specific project. You can learn more about the full Python client installation and development process [here](https://docs.influxdata.com/influxdb/clustered/query-data/execute-queries/client-libraries/python/).

To get started, install the `influxdb3-python` package.

```
pip install influxdb3-python
```

From here, you can easily connect to your database with the client library using just the **host** and **database name:**

```py
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host='http://127.0.0.1:8181',
    database='servers'
)
```

To extend this example, we can leverage the query function of the InfluxDB 3 Python client to send requests, aggregate data, print outputs, and more.

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

### 

### 

## **Advanced Features**

### Creating a Last Values Cache

InfluxDB 3 Enterprise supports a **last-n values cache** which accelerates the performance on your most recent data queries. To create this cache, you can leverage the following CLI commands, along with the options presented.

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

You can create a last value cache per time series with as high of a count as you wish (up to your hardware limits), but we recommend you only choose the amount you will likely need for your most important time series.

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

### Querying a Last Values Cache

To leverage the LVC, you need to specifically call on it using the `last_cache()` function. An example of this type of query:

```

Usage: $ influxdb3 query --database=servers "SELECT * FROM last_cache('cpu', 'cpuCache') WHERE host = 'Bravo;"
```

##### Heads Up!
| The Last Value Cache only works with SQL, not InfluxQL; SQL is the default language. |
| :---- |


## **Multi-Node Setups**

InfluxDB 3 Enterprise is built to support multi-node setups for high availability, read replicas, and flexible implementations depending on use case. 

### High Availability

This functionality is built on top of the diskless engine, leveraging the object store as the solution for ensuring that if a node fails, you can still continue reading from and writing to a secondary node. There are several setups that make sense depending on your use case. At a minimum, a two-node setup—both with read/write permissions—will enable high availability with excellent performance.

# **![][image1]**

In this setup, we have two nodes both writing data to the same object store and servicing queries as well. On instantiation, you can enable Node 1 and Node 2 to read from each other’s object store directories. Importantly, you’ll also notice that one of the nodes is designated as the compactor in this instance as well to ensure long-range queries are high performance.

| IMPORTANT  Only one node should be designated as the compactor. Multiple nodes running compaction on your data in the object store will lead to issues with data organization.  |
| :---- |

Leveraging the `--replicas` option, we ensure each node is checking the object storage for the data from the other hosts as well. We additionally will set the compactor to be active for Node 1 using the `--compactor-id` option. We *do not* set a compactor ID for Node 2\. We additionally pass a `--run-compactions` option to ensure Node 1 runs the compaction process.

```
## NODE 1

# Example variables
# host-id: 'host01'
# bucket: 'influxdb-3-enterprise-storage'
# compactor-id: 'c01'


Usage: $ influxdb3 serve --host-id=host01 --replicas=host02 --compactor-id=c01 --run-compactions --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8181 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY> 
```

```
## NODE 2

# Example variables
# host-id: 'host02'
# bucket: 'influxdb-3-enterprise-storage'

Usage: $ influxdb3 serve --host-id=host02 --replicas=host01 --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8282
--aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY> 
```

That’s it\! Querying either node will return data for both nodes. Additionally, compaction will be running on Node 1\. To add additional nodes to this setup, simply add to the replicas list. 

| NOTE | If you want to run this setup on the same node for testing, you can run both commands in separate terminals and pass a different `--http-bind` parameter. E.g., pass `--http-bind=http://127.0.0.1:8181` for terminal 1’s `serve` command and `--http-bind=http://127.0.0.1:8282` for terminal 2’s. |
| :---- | :---- |

### High Availability with Dedicated Compactor

One of the more computationally expensive operations is compaction. To ensure that your node servicing writes and reads doesn’t slow down due to compaction work, we suggest leveraging a compactor-only node for high and level performance across all nodes.

![][image2]

For our first two nodes, we are going to keep them the exact same except for the host id and replicas list (which are flipped). We don’t specify a compactor to run in this scenario for either of the nodes. 

```
## NODE 1 — Writer/Reader Node #1

# Example variables
# host-id: 'host01'
# bucket: 'influxdb-3-enterprise-storage'


Usage: $ influxdb3 serve --host-id=host01 --replicas=host02 --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8181 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>

```

```
## NODE 2 — Writer/Reader Node #2

# Example variables
# host-id: 'host02'
# bucket: 'influxdb-3-enterprise-storage'

Usage: $ influxdb3 serve --host-id=host02 --replicas=host01 --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8282 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
```

For the compactor node, we need to set a few more options. First, we need to specify the mode which needs to be `--mode=compactor`; this ensures not only that it runs compaction, but that it *only* runs compaction. Since this node isn’t replicating data, we don’t pass it the replicas parameter, which means we need another way to tell it the hosts to run compaction. To do this, we set `--compaction-hosts` option with a comma-delimited list, similar to the replicas option. 

```
## NODE 3 — Compactor Node

# Example variables
# host-id: 'host03'
# bucket: 'influxdb-3-enterprise-storage'
# compactor-id: 'c01'

Usage: $ influxdb3 serve --host-id=host03 --mode=compactor --compactor-id=c01 --compaction-hosts=host01,host02 --run-compactions --object-store=s3 --bucket=influxdb-3-enterprise-storage --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
```

### 

### High Availability with Read Replicas and a Dedicated Compactor

To create a very robust and effective setup for managing time-series data, we recommend running ingest nodes alongside read-only nodes, and leveraging a compactor-node for excellent performance. 

![][image3]

First, we want to set up our writer nodes for ingest. Enterprise doesn’t designate a write-only mode, so writers set their mode to **`read_write`**. To properly leverage this architecture though, you should only send requests to reader nodes that have their mode set for reading only; more on that in a moment.

```
## NODE 1 — Writer Node #1

# Example variables
# host-id: 'host01'
# bucket: 'influxdb-3-enterprise-storage'


Usage: $ influxdb3 serve --host-id=host01 --mode=read_write --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8181 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>

```

```
## NODE 2 — Writer Node #2

# Example variables
# host-id: 'host02'
# bucket: 'influxdb-3-enterprise-storage'

Usage: $ influxdb3 serve --host-id=host02 --mode=read_write --object-store=s3 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8282 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
```

For the compactor node, we want to follow the same principles we used earlier, by setting it mode to compaction only, and ensuring it’s running compactions on the proper set of replicas.

```
## NODE 3 — Compactor Node

# Example variables
# host-id: 'host03'
# bucket: 'influxdb-3-enterprise-storage'

Usage: $ influxdb3 serve --host-id=host03 --mode=compactor --compaction-hosts=host01,host02 --run-compactions --object-store=s3 --bucket=influxdb-3-enterprise-storage --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
```

Finally, we have the query nodes, which we need to set the mode to read-only. We use `--mode=read` as our option parameter, along with unique host IDs. 

```
## NODE 4 — Read Node #1

# Example variables
# host-id: 'host04'
# bucket: 'influxdb-3-enterprise-storage'

Usage: $ influxdb3 serve --host-id=host04 --mode=read --object-store=s3 --replicas=host01,host02 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8383 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
```

```
## NODE 5 — Read Node #2

# Example variables
# host-id: 'host05'
# bucket: 'influxdb-3-enterprise-storage'

Usage: $ influxdb3 serve --host-id=host05 --mode=read --object-store=s3 --replicas=host01,host02 --bucket=influxdb-3-enterprise-storage --http-bind=0.0.0.0:8484 --aws-access-key-id=<AWS_ACCESS_KEY_ID> --aws-secret-access-key=<AWS_SECRET_ACCESS_KEY>
```

That’s it\! A full fledged setup of a robust implementation for InfluxDB 3 Enterprise is now complete with 

## **Writing/Querying on InfluxDB 3 Enterprise**

### Writing and Querying for Multi-Node Setups

If you’re running InfluxDB 3 Enterprise in a single-instance setup, writing and querying is the same as for InfluxDB 3 Enterprise. Additionally, if you want to leverage the default port of 8181 for any write or query, then no changes need to be made to your commands.

The key change in leveraging read/writes on this wider architecture is in ensuring that you’re specifying the correct host. If you run locally and serve an instance on 8181 (the default port), you don’t need to specify which host. However, when running multiple local instances for testing, or separate nodes in production, specifying the host ensures writes and queries are routed to the correct instance.

```
# Example variables on a query
# HTTP-bound Port: 8585
Usage: $ influxdb3 query --host=http://127.0.0.1:8585 -d <DATABASE> "<QUERY>" 
```

### File Index Settings

To accelerate performance on specific queries, you can define non-primary keys to index on, which will especially help improve performance on single-series queries. This functionality is reserved for Enterprise and is not available on Enterprise.

```
# Example variables on a query
# HTTP-bound Port: 8585

Create Usage: $ influxdb3 file-index create --host=http://127.0.0.1:8585 -d <DATABASE> -t <TABLE> <COLUMNS>

Delete Usage: $ influxdb3 file-index delete --host=http://127.0.0.1:8585 -d <DATABASE> -t <TABLE>```