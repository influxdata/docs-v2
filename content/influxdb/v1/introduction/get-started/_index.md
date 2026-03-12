---
title: Get started with InfluxDB OSS v1
description: Get started with InfluxDB OSS v{{< current-version >}}. Learn how to create databases, write data, and query your time series data.
aliases:
  - /influxdb/v1/introduction/getting_started/
  - /influxdb/v1/introduction/getting-started/
menu:
  influxdb_v1:
    name: Get started with InfluxDB
    weight: 30
    parent: Introduction
alt_links:
  v2: /influxdb/v2/get-started/
---

With InfluxDB [installed](/influxdb/v1/introduction/installation), you're ready to start working with time series data.
This guide uses the `influx` [command line interface](/influxdb/v1/tools/shell/) (CLI), which is included with InfluxDB
and provides direct access to the database.
The CLI communicates with InfluxDB through the HTTP API on port `8086`.

> [!Tip]
> **Docker users**: Access the CLI from your container using:
> ```bash
> docker exec -it <container-name> influx
> ```

> [!Note]
> #### Directly access the API 
> You can also interact with InfluxDB using the HTTP API directly.
> See [Writing Data](/influxdb/v1/guides/writing_data/) and [Querying Data](/influxdb/v1/guides/querying_data/) for examples using `curl`.

## Creating a database

After installing InfluxDB locally, the `influx` command is available from your terminal.
Running `influx` starts the CLI and connects to your local InfluxDB instance
(ensure InfluxDB is running with `service influxdb start` or `influxd`).
To start the CLI and connect to the local InfluxDB instance, run the following command.
The [`-precision` argument](/influxdb/v1/tools/shell/#influx-arguments) specifies the format and precision of any returned timestamps.

```bash
$ influx -precision rfc3339
Connected to http://localhost:8086 version {{< latest-patch >}}
InfluxDB shell {{< latest-patch >}}
>
```

The `influx` CLI connects to port `localhost:8086` (the default).
The timestamp precision `rfc3339` tells InfluxDB to return timestamps in [RFC3339 format](https://www.ietf.org/rfc/rfc3339.txt) (`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`).

To view available options for customizing CLI connection parameters or other settings, run `influx --help` in your terminal.

The command line is ready to take input in the form of the Influx Query Language (InfluxQL) statements.
To exit the InfluxQL shell, type `exit` and hit return.

A fresh install of InfluxDB has no databases (apart from the system `_internal`),
so creating one is our first task.
You can create a database with the `CREATE DATABASE <db-name>` InfluxQL statement,
where `<db-name>` is the name of the database you wish to create.
Names of databases can contain any unicode character as long as the string is double-quoted.
Names can also be left unquoted if they contain _only_ ASCII letters,
digits, or underscores and do not begin with a digit.

Throughout this guide, we'll use the database name `mydb`:

```sql
> CREATE DATABASE mydb
>
```

> **Note:** After hitting enter, a new prompt appears and nothing else is displayed.
In the CLI, this means the statement was executed and there were no errors to display.
There will always be an error displayed if something went wrong.

Now that the `mydb` database is created, we'll use the `SHOW DATABASES` statement
to display all existing databases:

```sql
> SHOW DATABASES
name: databases
name
----
_internal
mydb

>
```

> **Note:** The `_internal` database is created and used by InfluxDB to store internal runtime metrics.
Check it out later to get an interesting look at how InfluxDB is performing under the hood.

Unlike `SHOW DATABASES`, most InfluxQL statements must operate against a specific database.
You may explicitly name the database with each query,
but the CLI provides a convenience statement, `USE <db-name>`,
which will automatically set the database for all future requests. For example:

```sql
> USE mydb
Using database mydb
>
```

Now future commands will only be run against the `mydb` database.

## Writing and exploring data

Now that we have a database, InfluxDB is ready to accept queries and writes.

First, a short primer on the datastore.
Data in InfluxDB is organized by "time series",
which contain a measured value, like "cpu_load" or "temperature".
Time series have zero to many `points`, one for each discrete sample of the metric.
Points consist of `time` (a timestamp), a `measurement` ("cpu_load", for example),
at least one key-value `field` (the measured value itself, e.g.
"value=0.64", or "temperature=21.2"), and zero to many key-value `tags` containing any metadata about the value (e.g.
"host=server01", "region=EMEA", "dc=Frankfurt").

Conceptually you can think of a `measurement` as an SQL table,
where the primary index is always time.
`tags` and `fields` are effectively columns in the table.
`tags` are indexed, and `fields` are not.
The difference is that, with InfluxDB, you can have millions of measurements,
you don't have to define schemas up-front, and null values aren't stored.

Points are written to InfluxDB using the InfluxDB line protocol, which follows the following format:

```
<measurement>[,<tag-key>=<tag-value>...] <field-key>=<field-value>[,<field2-key>=<field2-value>...] [unix-nano-timestamp]
```

The following lines are all examples of points that can be written to InfluxDB:

```
cpu,host=serverA,region=us_west value=0.64
payment,device=mobile,product=Notepad,method=credit billed=33,licenses=3i 1434067467100293230
stock,symbol=AAPL bid=127.46,ask=127.48
temperature,machine=unit42,type=assembly external=25,internal=37 1434067467000000000
```

> **Note:** For details on the InfluxDB line protocol, see [InfluxDB line protocol syntax](/influxdb/v1/write_protocols/line_protocol_reference/#line-protocol-syntax) page.

To insert a single time series data point into InfluxDB using the CLI, enter `INSERT` followed by a point:

```sql
> INSERT cpu,host=serverA,region=us_west value=0.64
>
```

A point with the measurement name of `cpu` and tags `host` and `region` has now been written to the database, with the measured `value` of `0.64`.

Now we will query for the data we just wrote:

```sql
> SELECT "host", "region", "value" FROM "cpu"
name: cpu
---------
time		    	                     host     	region   value
2015-10-21T19:28:07.580664347Z  serverA	  us_west	 0.64

>
```

> **Note:** We did not supply a timestamp when writing our point.
When no timestamp is supplied for a point, InfluxDB assigns the local current timestamp when the point is ingested.
That means your timestamp will be different.

Let's try storing another type of data, with two fields in the same measurement:

```sql
> INSERT temperature,machine=unit42,type=assembly external=25,internal=37
>
```

To return all fields and tags with a query, you can use the `*` operator:

```sql
> SELECT * FROM "temperature"
name: temperature
-----------------
time		                        	 external	  internal	 machine	type
2015-10-21T19:28:08.385013942Z  25	        	37     		unit42  assembly

>
```

{{% warn %}}
**Warning:** Using `*` without a `LIMIT` clause on a large database can cause performance issues.
You can use `Ctrl+C` to cancel a query that is taking too long to respond.
{{%/warn %}}

InfluxQL has many [features and keywords](/influxdb/v1/query_language/spec/) that are not covered here,
including support for Go-style regex. For example:

```sql
> SELECT * FROM /.*/ LIMIT 1
--
> SELECT * FROM "cpu_load_short"
--
> SELECT * FROM "cpu_load_short" WHERE "value" > 0.9
```

## Using the HTTP API

You can also interact with InfluxDB using HTTP requests with tools like `curl`:

### Create a database
```bash
curl -G http://localhost:8086/query --data-urlencode "q=CREATE DATABASE mydb"
```

### Write data
```bash
curl -i -XPOST 'http://localhost:8086/write?db=mydb' \
  --data-binary 'cpu,host=serverA,region=us_west value=0.64'
```

### Query data
```bash
curl -G 'http://localhost:8086/query?pretty=true' \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu"
```

## Next steps

This is all you need to know to write data into InfluxDB and query it back.
To learn more about the InfluxDB write protocol,
check out the guide on [Writing Data](/influxdb/v1/guides/writing_data/).
To further explore the query language,
check out the guide on [Querying Data](/influxdb/v1/guides/querying_data/).
For more information on InfluxDB concepts, check out the [Key Concepts](/influxdb/v1/concepts/key_concepts/) page.
