
[A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) | [G](#g) | [H](#h) | [I](#i) | [J](#j) | [K](#k) | [L](#l) | [M](#m) | [N](#n) | [O](#o) | [P](#p) | [Q](#q) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) | [W](#w) | <span style="opacity:.35;font-weight:500">X</span> | <span style="opacity:.35;font-weight:500">Y</span> | <span style="opacity:.35;font-weight:500">Z</span>

## A

### abstract syntax tree (AST)

Tree representation of source code that shows the structure, content, and rules
of programming statements and discards additional syntax elements.
The tree is hierarchical, with elements of program statements broken down into their parts.

For more information about AST design, see [Abstract Syntax Tree on Wikipedia](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

### agent

A background process started by (or on behalf of) a user that typically requires user input.

[Telegraf](/telegraf/v1/) is an agent that requires user input
(a configuration file) to gather metrics from declared input plugins and sends
metrics to declared output plugins, based on the plugins enabled for a configuration.

Related entries:
[input plugin](#input-plugin),
[output plugin](#output-plugin),
[daemon](#daemon)

### aggregator plugin

Receives metrics from input plugins, creates aggregate metrics, and then passes aggregate metrics to configured output plugins.

Related entries:
[input plugin](#input-plugin),
[output plugin](#output-plugin),
[processor plugin](#processor-plugin)

### aggregate

A function that returns an aggregated value across a set of points.
For a list of available aggregation functions,
see [SQL aggregate functions](/influxdb3/version/reference/sql/functions/aggregate/).

<!-- TODO: Add a link to InfluxQL aggregate functions -->

Related entries:
[function](#function),
[selector](#selector)

### API

Application programming interface that facilitates and standardizes communication
between two or more computer programs.

### argument

A value passed to a function or command that determines how the process operates.

Related entries:
[parameter](#parameter)

## B

### batch

A collection of points in line protocol format, separated by newlines (`0x0A`).
Submitting a batch of points using a single HTTP request to the write endpoints
drastically increases performance by reducing the HTTP overhead.
InfluxData typically recommends batch sizes of 5,000-10,000 points.
In some use cases, performance may improve with significantly smaller or larger batches.

Related entries:
[line protocol](#line-protocol-lp),
[point](#point)

### batch size

The number of lines or individual data points in a line protocol batch.
The Telegraf agent sends metrics to output plugins in batches rather than individually.
Batch size controls the size of each write batch that Telegraf sends to the output plugins.

Related entries:
[output plugin](#output-plugin)

### bin

In a cumulative histogram, a bin includes all data points less than or equal to a specified upper bound.
In a normal histogram, a bin includes all data points between the upper and lower bounds.
Histogram bins are also sometimes referred to as "buckets."

### boolean

A data type with two possible values: true or false.
By convention, you can express `true` as the integer `1` and false as the integer `0` (zero).

### bucket

"Bucket" is the term used in InfluxDB 2.x and _InfluxDB Cloud Serverless_ to refer
to a named location where time series data is stored.

{{% hide-in "serverless" %}}
Bucket is synonymous with "database" when using {{< product-name >}}.
{{% /hide-in %}}

Related entries:
[database](#database)

## C

### CSV

Comma-separated values (CSV) delimits text between commas to separate values.
A CSV file stores tabular data (numbers and text) in plain text.
Each line of the file is a data row.
Each row consists of one or more columns, separated by commas.
CSV file format is not fully standardized.

### cardinality

Cardinality is the number of unique values in a set.
Series cardinality is the number of unique [series](#series) in a database as a whole.
With the InfluxDB 3 storage engine, high series cardinality _does not_ affect performance.

### cluster

A collection of servers or processes that work together as a single unit.
An InfluxDB cluster is a collection of InfluxDB servers dedicated
to the workload of a single customer.

### collect

Collect and write time series data to InfluxDB using line protocol and any of the following tools:

- Telegraf
- the InfluxDB v1, v2, or v3 HTTP APIs
- `influxdb3` command line interface (CLI) for InfluxDB 3 Core and Enterprise
- InfluxDB 3 Processing engine with the `LineBuilder` and `influxdb3_local` shared API.
- v1 or v2 `influx` command line interface (CLI)
- InfluxDB v1, v2, or v3 client libraries

### collection interval

The default global interval for collecting data from each Telegraf input plugin.
The collection interval can be overridden by each individual input plugin's configuration.

Related entries:
[input plugin](#input-plugin)

### collection jitter

Collection jitter prevents every input plugin from collecting metrics simultaneously,
which can have a measurable effect on the system.
For each collection interval, every Telegraf input plugin sleeps for a random
time between zero and the collection jitter before collecting the metrics.

Related entries:
[collection interval](#collection-interval),
[input plugin](#input-plugin)

### column

InfluxDB data is stored in tables within rows and columns.
Columns store tag sets and fields sets, and time values.
The only required column is _time_, which stores timestamps and is included
in all InfluxDB tables.

### common log format (CLF)

A standardized text file format used by the InfluxDB server to create log
entries when generating server log files.

### compaction

Compressing time series data to optimize disk usage.

### continuous query (CQ)

Continuous queries are a feature of InfluxDB 1.x used to regularly downsample
or process time series data.

## D

### daemon

A background process that runs without user input.

### dashboard

A collection of data visualizations, charts, and panels organized in a single view to monitor and analyze time series data. Dashboards provide at-a-glance visualization of metrics and allow users to track trends, spot anomalies, and understand relationships between different data points over time.
Some versions of InfluxDB include built-in dashboarding features.
InfluxDB can integrate with third-party visualization and dashboard tools, such as 
[Grafana](https://grafana.com), [Apache Superset](https://superset.apache.org/),
[Tableau](https://www.tableau.com/).

<!-- ### Data Explorer

Use the Data Explorer in the InfluxDB user interface (UI) to view, add, or
delete variables and functions manually or using the Script Editor. -->

### data model

A data model organizes elements of data and standardizes how they relate to one
another and to properties of the real world entities.

{{% show-in "cloud-dedicated,clustered,cloud-serverless" %}}
For information about the InfluxDB data model, see
[InfluxDB data organization](/influxdb3/version/get-started/#data-organization)
{{% /show-in %}}

{{% show-in "core,enterprise" %}}
For more information, see the [{{< product-name >}} data model](/influxdb3/version/get-started/#data-model)
{{% /show-in %}}

### data service

Stores time series data and handles writes and queries.

### data source

A source of data that InfluxDB collects or queries data from.

Related entries:
[database](#database)

### data type

A data type is defined by the values it can take, the programming language used,
or the operations that can be performed on it.

InfluxDB supports the following data types:

- string
- boolean
- float (64-bit)
- integer (64-bit)
- unsigned integer (64-bit)
- time

For more information about different data types, see:

- [line protocol](/influxdb3/version/reference/syntax/line-protocol/#data-types-and-format)
- [InfluxQL](/influxdb3/version/reference/influxql/#literals)
- [SQL](/influxdb3/version/reference/sql/data-types/#sql-and-arrow-data-types)

#### database

A named location where time series data is stored.

In InfluxDB 1.x, a database represented a logical container for users, retention
policies, continuous queries, and time series data.
In InfluxDB 2.x and InfluxDB Cloud Serverless, the equivalent of this concept is an InfluxDB [bucket](#bucket).

Related entries:
[bucket](#bucket),
[retention policy](#retention-policy-rp)

### date-time

InfluxDB stores the date-time format for each data point in a timestamp with
nanosecond-precision Unix time.
Specifying a timestamp is optional.
If a timestamp isn't specified for a data point, InfluxDB uses the server’s
local nanosecond timestamp in UTC.

### downsample

Aggregating high resolution data into lower resolution data to preserve disk space.

### duration

A data type that represents a duration of time--for example, `1s`, `1m`, `1h`, `1d`.
Retention periods are set using durations.

Related entries:
[retention period](#retention-period)

## E

### event

Metrics gathered at irregular time intervals.

### expression

A combination of one or more constants, variables, operators, and functions.

In the following SQL example, `now() - INTERVAL '7 days'` is an expression that calculates the difference between the `now()` function expression and the duration represented by `INTERVAL '7 days`:

```sql
SELECT *
FROM home
WHERE
  time >= now() - INTERVAL '7 days'
```

## F

### field

A key-value pair in InfluxDB's data structure that records a data value.
Generally, field values change over time.
Fields are required in InfluxDB's data structure.

Related entries:
[field key](#field-key),
[field set](#field-set),
[field value](#field-value),
[tag](#tag)

### field key

The key of the key-value pair.
Field keys are strings.

Related entries:
[field](#field),
[field set](#field-set),
[field value](#field-value),
[tag key](#tag-key)

### field set

The collection of field key-value pairs.

Related entries:
[field](#field),
[field key](#field-key),
[field value](#field-value),
[point](#point)

### field value

The value of a key-value pair.
Field values are the actual data; they can be strings, floats, integers, unsigned integers or booleans.
A field value is always associated with a timestamp.

Related entries:
[field](#field),
[field key](#field-key),
[field set](#field-set),
[tag set](#tag-set),
[tag value](#tag-value),
[timestamp](#timestamp)

### file block

A file block is a fixed-length chunk of data read into memory when requested by an application.

### float

A real number written with a decimal point dividing the integer and fractional parts (`1.0`, `3.14`, `-20.1`).
InfluxDB supports 64-bit float values.

### flush interval

The global interval for flushing data from each Telegraf output plugin to its destination.
This value should not be set lower than the collection interval.

Related entries:
[collection interval](#collection-interval),
[flush jitter](#flush-jitter),
[output plugin](#output-plugin)

### flush jitter

Flush jitter prevents every Telegraf output plugin from sending writes
simultaneously, which can overwhelm some data sinks.
Each flush interval, every Telegraf output plugin sleeps for a random time
between zero and the flush jitter before emitting metrics.
Flush jitter smooths out write spikes when running a large number of Telegraf instances.

Related entries:
[flush interval](#flush-interval),
[output plugin](#output-plugin)

### function

A function is an operation that performs a specific task.
Functions take input, operate on that input, and then return output.

For complete lists of available query language functions, see:

- [InfluxQL functions](/influxdb3/version/reference/influxql/functions/)
- [SQL functions](/influxdb3/version/reference/sql/functions/).

Related entries:
[aggregate](#aggregate),
[selector](#selector)

## G

### gzip

gzip is a type of data compression that compress chunks of data, which is
restored by unzipping compressed gzip files.
The gzip file extension is `.gz`.

## H

### histogram

A visual representation of statistical information that uses rectangles to show
the frequency of data items in successive, equal intervals or bins.

## I

### identifier

Identifiers are tokens that refer to specific database objects such as database
names, field keys, measurement names, tag keys, etc.

Related entries:
[database](#database),
[field key](#field-key),
[measurement](#measurement),
[tag key](#tag-key)

### influx

`influx` is a command line interface (CLI) that interacts with the InfluxDB v1.x and v2.x server.

### influxctl

[`influxctl`](/influxdb3/cloud-dedicated/reference/cli/influxctl/) is a CLI that
performs [administrative tasks](/influxdb3/cloud-dedicated/admin/) for an
InfluxDB Cloud Dedicated cluster.

### influxd

`influxd` is the InfluxDB OSS v1.x and v2.x daemon that runs the InfluxDB server
and other required processes.

### InfluxDB

An open source time series database (TSDB) developed by InfluxData, optimized for fast, high-availability storage and retrieval of
time series data in fields such as operations monitoring, application metrics,
Internet of Things sensor data, and real-time analytics.

### influxdb3

`influxdb3` is:

- the InfluxDB 3 Core and Enterprise daemon that runs the InfluxDB 3 server
- the InfluxDB 3 CLI that interacts with the server for InfluxDB 3 Core and Enterprise

### InfluxQL

The SQL-like query language used to query data in InfluxDB.

### input plugin

Telegraf input plugins actively gather metrics and deliver them to the core agent,
where aggregator, processor, and output plugins can operate on the metrics.
To activate an input plugin, enable and configure it in the
Telegraf configuration file.

Related entries:
[aggregator plugin](#aggregator-plugin),
[collection interval](#collection-interval),
[output plugin](#output-plugin),
[processor plugin](#processor-plugin)

### instance

An entity comprising data on a server (or virtual server in cloud computing).

### integer

A whole number that is positive, negative, or zero (`0`, `-5`, `143`).
InfluxDB supports 64-bit integers (minimum: `-9223372036854775808`, maximum: `9223372036854775807`).

Related entries:
[unsigned integer](#unsigned-integer)

### IOx

The IOx storage engine (InfluxDB 3 storage engine) is a real-time, columnar
database optimized for time series data built in Rust on top of
[Apache Arrow](https://arrow.apache.org/) and
[DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).
IOx replaces the [TSM (Time Structured Merge tree)](#tsm-time-structured-merge-tree) storage engine.

## J

### JWT

Typically, JSON web tokens (JWT) are used to authenticate users between an
identity provider and a service provider.
A server can generate a JWT to assert any business processes.
For example, an "admin" token sent to a client can prove the client is logged in as admin.
Tokens are signed by one party's private key (typically, the server).
Private keys are used by both parties to verify that a token is legitimate.

JWT uses an open standard specified in [RFC 7519](https://tools.ietf.org/html/rfc7519).

### Jaeger

Open source tracing used in distributed systems to monitor and troubleshoot transactions.

### JSON

JavaScript Object Notation (JSON) is an open-standard file format that uses
human-readable text to transmit data objects consisting of attribute–value pairs
and array data types.

## K

### keyword

A keyword is reserved by a program because it has special meaning.
Every programming language has a set of keywords (reserved names) that cannot be used as identifiers--for example,
you can't use `SELECT` (an SQL keyword) as a variable name in an SQL query.

See keyword lists:

- [SQL keywords](/influxdb3/version/reference/sql/#keywords)
- [InfluxQL keywords](/influxdb3/version/reference/influxql/#keywords)

## L

### literal

A literal is a value in an expression, a number, character, string, function, record, or array.
Literal values are interpreted as defined.

### load balancing

Improves workload distribution across multiple computing resources in a network.
Load balancing optimizes resource use, maximizes throughput, minimizes response
time, and avoids overloading a single resource.
Using multiple components with load balancing instead of a single component may
increase reliability and availability.
If requests to any server in a network increase, requests are forwarded to
another server with more capacity.
Load balancing can also refer to the communications channels themselves.

### logs

Logs record information.
Event logs describe system events and activity that help to describe and diagnose problems.
Transaction logs describe changes to stored data that help recover data if a
database crashes or other errors occur.

### line protocol (LP)

The text based format for writing points to InfluxDB.
See [line protocol](/influxdb3/version/reference/syntax/line-protocol/).

## M

### measurement

The part of InfluxDB's data structure that describes the data stored in associated fields.
Measurements are strings.

Related entries:
[field](#field), [series](#series)

### metric

Data tracked over time.

### metric buffer

The metric buffer caches individual metrics when writes are failing for an Telegraf output plugin.
Telegraf will attempt to flush the buffer upon a successful write to the output.
The oldest metrics are dropped first when this buffer fills.

Related entries:
[output plugin](#output-plugin)

### missing values

Denoted by a null value.
Identifies missing information, which may be useful to include in an error message.

## N

### node

An independent process or server in a cluster.

Related entries:
[cluster](#cluster),
[server](#server)

### now

The local server's nanosecond timestamp.

### null

A data type that represents a missing or unknown value.
Denoted by the `null` value.
Values of [tags](#tag) and [fields](#field) may be `null`, but timestamp values are never `null`.

## O

### operator

A symbol that usually represents an action or process.
For example: `+`, `-`, `>`.

Related entries:
[operand](#operand)

### operand

The object or value on either side of an [operator](#operator).

Related entries:
[operator](#operator)

### organization

An InfluxDB v2 concept that describes workspace for a group of users.
All InfluxDB v2 dashboards, tasks, buckets, members, and so on, belong to an organization.

{{% hide-in "cloud-serverless" %}}
Organizations are not part of {{< product-name >}}.
{{% /hide-in %}}

### owner

A type of role for a user.
Owners have read/write permissions.
Users can have owner roles for databases and other resources.

Role permissions are separate from API token permissions. For additional
information on API tokens, see [token](#token).

### output plugin

Telegraf output plugins deliver metrics to their configured destination.
To activate an output plugin, enable and configure the plugin in Telegraf's configuration file.

Related entries:
[aggregator plugin](#aggregator-plugin),
[flush interval](#flush-interval),
[input plugin](#input-plugin),
[processor plugin](#processor-plugin)

## P

### parameter

A key-value pair used to pass information to a function that determines how the
function operates.

Related entries:
[argument](#argument)

### pipe

Method for passing information from one process to another.
For example, an output parameter from one process is input to another process.
Information passed through a pipe is retained until the receiving process reads the information.

### plugin

A Python file with a specific function signature that corresponds to a
[trigger](#trigger) type.
Plugins run in the InfluxDB 3 [Processing engine](#processing-engine) to process data,
respond to database events, and connect to external systems.

Related entries:
[Processing engine](#processing-engine),
[trigger](#trigger)

### point

Single data record identified by its _measurement_, _tag keys_, _tag values_,
_field key_, and _timestamp_.

In a [series](#series), each point has a unique timestamp.
If you write a point to a series with a timestamp that matches an existing point,
the field set becomes a union of the old and new field set, where any ties go to
the new field set.

Related entries:
[measurement](#measurement),
[tag set](#tag-set),
[field set](#field-set),
[timestamp](#timestamp)

### primary key

With the InfluxDB 3 storage engine, the primary key is the list of columns
used to uniquely identify each row in a table.
Rows are uniquely identified by their timestamp and tag set.
A row's primary key tag set does not include tags with null values.

### precision

The precision configuration setting determines the timestamp precision retained
for input data points.
All incoming timestamps are truncated to the specified precision.
Valid precisions are `ns`, `us` or `µs`, `ms`, and `s`.

In Telegraf, truncated timestamps are padded with zeros to create a nanosecond timestamp.
Telegraf output plugins emit timestamps in nanoseconds.
For example, if the precision is set to `ms`, the nanosecond epoch timestamp `1480000000123456789` is truncated to `1480000000123` in millisecond precision and padded with zeroes to make a new, less precise nanosecond timestamp of `1480000000123000000`.
Telegraf output plugins do not alter the timestamp further.
The precision setting is ignored for service input plugins.

Related entries:
[aggregator plugin](#aggregator-plugin),
[input plugin](#input-plugin),
[output plugin](#output-plugin),
[processor plugin](#processor-plugin),
[service input plugin](#service-input-plugin)

### predicate expression

A predicate expression compares two values and returns `true` or `false` based on
the relationship between the two values.
A predicate expression is comprised of a left operand, a comparison operator, and a right operand.

### process

A set of predetermined rules.
A process can refer to instructions being executed by the computer processor or
refer to the act of manipulating data.

### Processing engine

The Processing engine is a Python virtual machine (VM) embedded within
InfluxDB 3 Core and Enterprise for automatically processing data and responding
to database events. It executes Python plugins in response to events defined by
triggers. The Processing engine runs Python code directly in your
database, allowing plugins to react to specific triggers without requiring external services.

Related entries:
[plugin](#plugin),
[trigger](#trigger)

### processor plugin

Telegraf processor plugins transform, decorate, and filter metrics collected by
input plugins, passing the transformed metrics to the output plugins.

Related entries:
[aggregator plugin](#aggregator-plugin),
[input plugin](#input-plugin),
[output plugin](#output-plugin)

### Prometheus format

A simple text-based format for exposing metrics and ingesting them into Prometheus.

## Q

### query

A request for information.
An InfluxDB query returns time series data.

See [Query data in InfluxDB](/influxdb3/version/query-data/).

### query plan

A sequence of steps (_nodes_) that the InfluxDB Querier devises and executes to calculate the result of the query in the least amount of time.
A _logical plan_ is a high level representation of a query and doesn't consider cluster configuration or data organization.
A _physical plan_ represents the query execution plan and data flow through plan nodes that read (_scan_), deduplicate, merge, filter, and sort data.
A physical plan is optimized for the cluster configuration and data organization.

{{% show-in "cloud-dedicated,clustered" %}}
For more information, see [Query plans](/influxdb3/version/reference/internals/query-plans/).
{{% /show-in %}}

## R

### REPL

A Read-Eval-Print Loop (REPL) is an interactive programming environment where
you type a command and immediately see the result.

### regular expressions

Regular expressions (regex or regexp) are patterns used to match character
combinations in strings.

### rejected points

In a batch of data, points that InfluxDB couldn't write to a database.
Field type conflicts are a common cause of rejected points.

### retention period

The [duration](#duration) of time that a database retains data.

InfluxDB drops points with timestamps older than their database's retention period
relative to [now](#now).
The minimum retention period is **one hour**.

In InfluxDB Cloud Serverless, _bucket_ is synonymous with database.

Related entries:
[bucket](#bucket)
[database](#database)

### retention policy (RP)

A retention policy is part of the InfluxDB 1.x data model that describes how long
InfluxDB keeps data (duration), how many copies of the data to store when in a
in the cluster (replication factor), and the time range covered by shard groups
(shard group duration). RPs are unique per database and along with the measurement
and tag set define a series.

In {{< product-name >}}, the equivalent is [retention period](#retention-period),
however retention periods are not part of the data model.
The retention period describes the data persistence behavior of a database.

In InfluxDB Cloud Serverless, _bucket_ is synonymous with database.

Related entries:
[retention period](#retention-period),

### RFC3339 timestamp

A timestamp that uses the human-readable DateTime format proposed in
[RFC 3339](https://tools.ietf.org/html/rfc3339) (for example: `2020-01-01T00:00:00.00Z`).

Related entries:
[RFC3339Nano timestamp](#rfc3339nano-timestamp),
[timestamp](#timestamp),
[unix timestamp](#unix-timestamp)

### RFC3339Nano timestamp

A [Golang representation of the RFC 3339 DateTime format](https://go.dev/src/time/format.go)
that uses nanosecond resolution--for example:
`2006-01-02T15:04:05.999999999Z07:00`.

InfluxDB clients can return RFC3339Nano timestamps in log events and CSV-formatted
query results.

Related entries:
[RFC3339 timestamp](#rfc3339-timestamp),
[timestamp](#timestamp),
[unix timestamp](#unix-timestamp)

### row

A row in a [table](#table) represents a specific record or instance of data.
[Column](#column) values in a row represent specific attributes or properties of the instance.
Each row has a [primary key](/#primary-key) that makes the row unique from other rows in the table.

Related entries:
[column](#column),
[primary key](#primary-key),
[series](#series),
[table](#table)

## S

### schema

How data is organized in InfluxDB.
{{% hide-in "cloud-serverless" %}}
The fundamentals of the InfluxDB schema are databases, measurements,
tag keys, tag values, and field keys.
{{% /hide-in %}}
{{% show-in "cloud-serverless" %}}
The fundamentals of the {{% product-name %}} schema are buckets, measurements (or _tables_),
tag keys, tag values, and field keys.
{{% /show-in %}}

Related entries:
[bucket](#bucket),
[database](#database),
[field key](#field-key),
[measurement](#measurement),
[series](#series),
[tag key](#tag-key),
[tag value](#tag-value)

### secret

Secrets are key-value pairs that contain information you want to control access
to, such as API keys, passwords, or certificates.

### selector

A function that returns a single point from the range of specified points.
See [SQL selector functions](/influxdb3/version/reference/sql/functions/selector/)
for a complete list of available SQL selector functions.

Related entries:
[aggregate](#aggregate),
[function](#function),
[transformation](#transformation)

### series

In the InfluxDB 3 data structure, a collection of data that share a common
_measurement_ and _tag set_.

Related entries:
[field set](#field-set),
[measurement](#measurement),
[tag set](#tag-set)

### series cardinality

The number of unique measurement, tag set, and field key combinations in an
{{% product-name %}} database.

For example, assume that an InfluxDB database has one measurement.
The single measurement has two tag keys: `email` and `status`.
If there are three different `email` tag values,
and each email address is associated with two
different `status` tag values, then the series cardinality for the measurement is 6
(3 × 2 = 6):

| email                 | status |
| :-------------------- | :----- |
| lorr@influxdata.com   | start  |
| lorr@influxdata.com   | finish |
| marv@influxdata.com   | start  |
| marv@influxdata.com   | finish |
| cliff@influxdata.com  | start  |
| cliff@influxdata.com  | finish |

In some cases, performing this multiplication may overestimate series cardinality
because of the presence of dependent tags.
Dependent tags are scoped by another tag and do not increase series cardinality.
If we add the tag `firstname` to the preceding example, the series cardinality
would not be 18 (3 × 2 × 3 = 18).
The series cardinality would remain unchanged at 6, as `firstname` is already scoped by the `email` tag:

| email                | status | firstname |
| :------------------- | :----- | :-------- |
| lorr@influxdata.com  | start  | lorraine  |
| lorr@influxdata.com  | finish | lorraine  |
| marv@influxdata.com  | start  | marvin    |
| marv@influxdata.com  | finish | marvin    |
| cliff@influxdata.com | start  | clifford  |
| cliff@influxdata.com | finish | clifford  |

{{% show-in "cloud-serverless" %}}
In InfluxDB Cloud Serverless, _bucket_ is synonymous with database.
{{% /show-in %}}

Related entries:
[field key](#field-key),
[measurement](#measurement),
[tag key](#tag-key),
[tag set](#tag-set)

### series key

A series key identifies a particular series by measurement, tag set, and field key.

For example:

```text
# measurement, tag set, field key
h2o_level, location=santa_monica, h2o_feet
```

Related entries:
[series](#series)

### server

A computer, virtual or physical, running InfluxDB.
<!--is this still valid for {{< current-version >}}: There should only be one InfluxDB process per server. -->

### service input plugin

Telegraf input plugins that run in a passive collection mode while the Telegraf agent is running.
Service input plugins listen on a socket for known protocol inputs, or apply
their own logic to ingested metrics before delivering metrics to the Telegraf agent.

Related entries:
[aggregator plugin](#aggregator-plugin),
[input plugin](#input-plugin),
[output plugin](#output-plugin),
[processor plugin](#processor-plugin)

### string

A data type used to represent text.

## T

### TCP

Transmission Control Protocol.

### table

A collection of related data organized in a structured way with a predefined set
of columns and data types.
Each row in the table represents a specific record or instance of the data, and
each column represents a specific attribute or property of the data.

{{% show-in "cloud-dedicated,clustered,core,enterprise" %}}
In {{< product-name >}}, a table represents a measurement.
{{% /show-in %}}

Related entries:
[column](#column),
[measurement](#measurement),
[primary key](#primary-key),
[row](#row)

### tag

The key-value pair in InfluxDB's data structure that records metadata.
Tags are an optional part of InfluxDB's data structure but they are useful for
storing commonly queried metadata.

Related entries:
[field](#field),
[tag key](#tag-key),
[tag set](#tag-set),
[tag value](#tag-value)

### tag key

The key of a tag key-value pair.
Tag keys are strings and store metadata.

Related entries:
[field key](#field-key),
[tag](#tag),
[tag set](#tag-set),
[tag value](#tag-value)

### tag set

The collection of tag keys and tag values on a point.

Related entries:
[point](#point),
[primary key](#primary-key),
[series](#series),
[tag](#tag),
[tag key](#tag-key),
[tag value](#tag-value)

### tag value

The value of a tag key-value pair.
Tag values are strings and they store metadata.

Related entries:
[tag](#tag),
[tag key](#tag-key),
[tag set](#tag-set)

### Telegraf

A plugin-driven agent that collects, processes, aggregates, and writes metrics.

Related entries:
[Telegraf plugins](/telegraf/v1/plugins/),
[Use Telegraf to collect data](/influxdb3/version/write-data/use-telegraf/),

### time (data type)

A data type that represents a single point in time with nanosecond precision.

### time series data

Sequence of data points typically consisting of successive measurements made
from the same source over a time interval.
Time series data shows how data evolves over time.
On a time series data graph, one of the axes is always time.
Time series data may be regular or irregular.
Regular time series data changes in constant intervals.
Irregular time series data changes at non-constant intervals.

### timestamp

The date and time associated with a point.
Time in InfluxDB is in UTC.

To specify time when writing data, see
[Elements of line protocol](/influxdb3/version/reference/syntax/line-protocol/#elements-of-line-protocol).

Related entries:
[point](#point),
[unix timestamp](#unix-timestamp),
[RFC3339 timestamp](#rfc3339-timestamp)

### token

Tokens provide authorization to perform specific actions in InfluxDB.

{{% show-in "cloud-serverless" %}}
{{< product-name >}} uses _API tokens_ to authorize read and write access to resources and data.
{{% /show-in %}}

{{% show-in "cloud-dedicated,clustered" %}}
{{< product-name >}} supports different types of authorization tokens:
- **Database token:** Grants read and write access to a database.
- **Management token:** A short-lived token that grants clients administrative
  access to your {{< product-name >}} cluster.
{{% /show-in %}}

{{% show-in "core,enterprise" %}}
{{< product-name >}} supports different types of authorization tokens:

- **Admin token:** A token that grants full access to InfluxDB 3 server actions.
- **Resource token:** Tokens that grant read and write access to server resources,
  such as databases and system information.
  Database tokens allow for reading and writing data in your {{< product-name omit="Clustered" >}} instance.
  System tokens allow for reading system information and metrics for your server.
{{% /show-in %}}

For more information, see [Manage tokens](/influxdb3/version/admin/tokens/).

### transformation

Data transformation refers to the process of converting or modifying input data
from one format, value, or structure to another.

InfluxQL [transformation functions](/influxdb3/version/reference/influxql/functions/transformations/)
modify and return values in each row of queried data, but do not return an
aggregated value across those rows.

Related entries: [aggregate](#aggregate), [function](#function), [selector](#selector)

### trigger

With InfluxDB 3 Core and Enterprise, a Processing engine trigger connects a
Processing engine plugin to a specific type of event.
A trigger has:

- a  _trigger specification_ that defines the event (data ingestion, a time interval or schedule, or an HTTP request) that runs the plugin.
- a plugin file that contains the code to run when the trigger fires.
- optional configuration parameters that are passed to the plugin.

Related entries:
[plugin](#plugin),
[Processing engine](#processing-engine)

### TSM (Time Structured Merge tree)

The InfluxDB v1 and v2 data storage format that allows greater compaction and
higher write and read throughput than B+ or LSM tree implementations.
The TSM storage engine has been replaced by the [InfluxDB 3 storage engine (IOx)](#iox).

Related entries:
[IOx](#iox)

## U

### UDP

User Datagram Protocol is a packet of information.
When a request is made, a UDP packet is sent to the recipient.
The sender doesn't verify the packet is received.
The sender continues to send the next packets.
This means computers can communicate more quickly.
This protocol is used when speed is desirable and error correction is not necessary.

### unix epoch

The date and time from which Unix system times are measured.
The Unix epoch is `1970-01-01T00:00:00Z`.

### unix timestamp

Counts time since **Unix Epoch (1970-01-01T00:00:00Z UTC)** in specified units ([precision](#precision)).
Specify timestamp precision when [writing data to InfluxDB](/influxdb3/version/write-data/).
InfluxDB supports the following unix timestamp precisions:

| Precision | Description  | Example               |
|:--------- |:-----------  |:-------               |
| `ns`      | Nanoseconds  | `1577836800000000000` |
| `us`      | Microseconds | `1577836800000000`    |
| `ms`      | Milliseconds | `1577836800000`       |
| `s`       | Seconds      | `1577836800`          |

<p style="font-size:.9rem;margin-top:-2rem"><em>The examples above represent <strong>2020-01-01T00:00:00Z UTC</strong>.</em></p>

Related entries:
[timestamp](#timestamp),
[RFC3339 timestamp](#rfc3339-timestamp)

### unsigned integer

A whole number that is positive or zero (`0`, `143`). Also known as a "uinteger."
InfluxDB supports 64-bit unsigned integers (minimum: `0`, maximum: `18446744073709551615`).

Related entries:
[integer](#integer)

### user

InfluxDB users are granted permission to access InfluxDB.

## V

### values per second

The preferred measurement of the rate at which data is persisted to InfluxDB.
Write speeds are generally quoted in values per second.

To calculate the values per second rate, multiply the number of points written
per second by the number of values stored per point.
For example, if the points have four fields each, and a batch of 5000 points is
written 10 times per second, the values per second rate is:

**4 field values per point** × **5000 points per batch** × **10 batches per second** = **200,000 values per second**  

Related entries:
[batch](#batch),
[field](#field),
[point](#point)

### variable

A storage location (identified by a memory address) paired with an associated
symbolic name (an identifier).
A variable contains some known or unknown quantity of information referred to as a value.

### variable assignment

A statement that sets or updates the value stored in a variable.

## W

### WAL (Write-Ahead Log)

The temporary cache for recently written points.
To reduce the frequency that permanent storage files are accessed, InfluxDB
caches new points in the WAL until their total size or age triggers a flush to
more permanent storage. This allows for efficient batching of the writes into
the storage engine.

Points in the WAL are queryable and persist through a system reboot.
On process start, all points in the WAL must be flushed before the system
accepts new writes.

### windowing

Grouping data based on specified time intervals.
This is also referred to as "time binning" or "date binning."
