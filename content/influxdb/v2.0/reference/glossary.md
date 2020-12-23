---
title: Glossary
description: >
  Terms related to InfluxData products and platforms.
weight: 8
menu:
  influxdb_2_0_ref:
    name: Glossary
influxdb/v2.0/tags: [glossary]
---

[A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) | [G](#g) | [H](#h) | [I](#i) | [J](#j) | [K](#k) | [L](#l) | [M](#m) | [N](#n) | [O](#o) | [P](#p) | [Q](#q) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) | [W](#w) | <span style="opacity:.35;font-weight:500">X</span> | <span style="opacity:.35;font-weight:500">Y</span> | <span style="opacity:.35;font-weight:500">Z</span>

## A

### agent

A background process started by (or on behalf of) a user and typically requires user input.

Telegraf is an agent that requires user input (a configuration file) to gather metrics from declared input plugins and sends metrics to declared output plugins, based on the plugins enabled for a configuration.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin), [daemon](#daemon)

### aggregator plugin

Receives metrics from input plugins, creates aggregate metrics, and then passes aggregate metrics to configured output plugins.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin)

### aggregate

A function that returns an aggregated value across a set of points.
For a list of available aggregation functions, see [Flux built-in aggregate functions](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/).

Related entries: [function](#function), [selector](#selector), [transformation](#transformation)

## B

### bar graph

A visual representation in the InfluxDB user interface used to compare variables (bars) and plot categorical data.
A bar graph has spaces between bars, can be sorted in any order, and bars in the graph typically have the same width.

Related entries: [histogram](#histogram)

### batch

A collection of points in line protocol format, separated by newlines (`0x0A`).
Submitting a batch of points using a single HTTP request to the write endpoints drastically increases performance by reducing the HTTP overhead.
InfluxData typically recommends batch sizes of 5,000-10,000 points.
In some use cases, performance may improve with significantly smaller or larger batches.

Related entries: [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/), [point](#point)

### batch size

The number of lines or individual data points in a line protocol batch.
The Telegraf agent sends metrics to output plugins in batches rather than individually.
Batch size controls the size of each write batch that Telegraf sends to the output plugins.

Related entries: [output plugin](#output-plugin)

### bin

In a cumulative histogram, a bin includes all data points less than or equal to a specified upper bound.
In a normal histogram, a bin includes all data points between the upper and lower bounds.

### block

In Flux, a block is a possibly empty sequence of statements within matching braces (`{ }`).
Two types of blocks exist in Flux:

- Explicit blocks in the source code, for example:

  ```
  Block         = "{" StatementList "}
  StatementList = { Statement }
  ```

- Implicit blocks, including:

  - Universe: Encompasses all Flux source text.
  - Package: Each package includes a package block that contains Flux source text for the package.
  - File: Each file has a file block containing Flux source text in the file.
  - Function: Each function literal has a function block with Flux source text (even if not explicitly declared).

Related entries: [implicit block](#implicit-block), [explicit block](#explicit-block)

### boolean

A data type with two possible values: true or false.
By convention, you can express `true` as the integer `1` and false as the integer `0` (zero).
In [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/), columns that contain
boolean values are annotated with the `boolean` datatype.

### bucket

A bucket is a named location where time series data is stored.
All buckets have a retention policy, a duration of time that each data point persists.
A bucket belongs to an organization.

## C

### check

Checks are part of queries used in monitoring to read input data and assign a [status](#check-status) (`_level`) based on specified conditions.
For example:

```
monitor.check(
  crit: (r) => r._value > 90.0,
  warn: (r) => r._value > 80.0,
  info: (r) => r._value > 60.0,
  ok:   (r) => r._value <= 20.0,
  messageFn: (r) => "The current level is ${r._level}",
)
```

This check gives rows with a `_value` greater than 90.0 a crit `_level`; rows greater than 80.0 get a warn `_level`, and so on.

Learn how to [create a check](/influxdb/v2.0/monitor-alert/checks/create/).

Related entries: [check status](#check-status), [notification rule](#notification-rule), [notification endpoint](#notification-endpoint)

### check status

A [check](#check) gets one of the following statuses (`_level`): `crit`, `info`, `warn`, or `ok`.
Check statuses are written to a status measurement in the `_monitoring` bucket.

Related entries: [check](#check), [notification rule](#notification-rule), [notification endpoint](#notification-endpoint)

### CSV

Comma-separated values (CSV) delimits text between commas to separate values.
A CSV file stores tabular data (numbers and text) in plain text.
Each line of the file is a data record.
Each record consists of one or more fields, separated by commas.
CSV file format is not fully standardized.

InfluxData uses annotated CSV (comma-separated values) format to encode HTTP responses and results returned to the Flux csv.from() function.
For more detail, see [Annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/).

<!-- enterprise
### cardinality

Cardinality is the number of unique series in a bucket or database as a whole.

### cluster

An InfluxDB cluster includes meta nodes, data nodes, and the InfluxDB Enterprise web server. In a cluster, meta nodes must communicate with each other and data nodes must communicate with each other and with meta nodes.
-->

### co-monitoring dashboard

The prebuilt co-monitoring dashboard displays details of your instance based on metrics from Telegraf, allowing you to monitor overall performance.

### collect

Collect and write time series data to InfluxDB using line protocol, Telegraf or InfluxDB scrapers, the InfluxDB v2 API, influx command line interface (CLI),the InfluxDB user interface (UI), and client libraries.

### collection interval

The default global interval for collecting data from each Telegraf input plugin.
The collection interval can be overridden by each individual input plugin's configuration.

Related entries: [input plugin](#input-plugin)

<!--Likely configurable for scrapers in the future.-->

### collection jitter

Collection jitter prevents every input plugin from collecting metrics simultaneously, which can have a measurable effect on the system.
For each collection interval, every Telegraf input plugin will sleep for a random time between zero and the collection jitter before collecting the metrics.

Related entries: [collection interval](#collection-interval), [input plugin](#input-plugin)

### column

InfluxDB data is stored in tables within rows and columns.
Columns store tag sets (indexed) and fields sets.
The only required column is _time_, which stores timestamps and is included in all InfluxDB tables.

### comment

Use comments with Flux statements to describe your functions.

### common log format (CLF)

A standardized text file format used by the InfluxDB web server to create log entries when generating server log files.

### compaction

Compressing time series data to optimize disk usage.

### continuous query (CQ)

Continuous queries are the predecessor to tasks in InfluxDB 2.0.
Continuous queries run automatically and periodically on a database.

Related entries: [function](#function)

## D

### daemon

A background process that runs without user input.

### dashboard

InfluxDB dashboards visualize time series data.
Use dashboards to query and graph data.

### dashboard variable

Dashboard template variables define components of a cell query.
Dashboard variables make is easier to interact with and explore your databoard data.
Use the InfluxDB user interface (UI) to add predefined template variables or customize your own template variables.

### Data Explorer

Use the Data Explorer in the InfluxDB user interface (UI) to view, add, or delete variables and functions manually or using the Script Editor.

### data model

A data model organizes elements of data and standardizes how they relate to one another and to properties of the real world entities.

Flux uses a data model built from basic data types: tables, records, columns and streams.

<!-- enterprise ### data node

Data nodes allow a system to replicate data across multiple nodes.

For high availability in InfluxDB, a cluster must have at least two data nodes. The number of data nodes in a cluster must be the same as the highest replication factor. A replication factor greater than two adds fault tolerance and query capacity in a cluster.

Data node sizes will depend on your needs. The Amazon EC2 m4.large or m4.xlarge are good starting points.

Related entries: [data service](#data-service), [replication factor](#replication-factor)
-->

### data service

Stores time series data and handles writes and queries.

### data source

A source of data that InfluxDB collects or queries data from.
Examples include InfluxDB buckets, Prometheus, Postgres, MySQL, and InfluxDB clients.

Related entries: [bucket](#bucket)

### data type

A data type is defined by the values it can take, the programming language used, or the operations that can be performed on it.

InfluxDB supports the following data types: float, integer, string, boolean, and timestamp.

### database

In InfluxDB 2.0, a database represents the InfluxDB instance as a whole.

Related entries: [continuous query](#continuous-query-cq), <!-- [retention policy](#retention-policy-rp),--> [user](#user)

### date-time

InfluxDB stores the date-time format for each data point in a timestamp with nanosecond-precision Unix time.
Specifying a timestamp is options.
If a timestamp isn't specified for a data point, InfluxDB uses the server’s local nanosecond timestamp in UTC.

### downsample

Aggregating high resolution data into lower resolution data to preserve disk space.

### duration

A data type that represents a duration of time (1s, 1m, 1h, 1d).
Retention policies are set using durations.
Data older than the duration is automatically dropped from the database.

<!-- Related entries: [retention policy](#retention-policy-rp) -->

## E

### event

Metrics gathered at irregular time intervals.

### explicit block

In Flux, a an explicit block is a possibly empty sequence of statements within matching braces (`{ }`) that is defined in the source code, for example:

```
Block         = "{" StatementList "}
StatementList = { Statement }
```

Related entries: [implicit block](#implicit-block), [block](#block)

### expression

A combination of one or more constants, variables, operators, and functions.

## F

### field

The key-value pair in InfluxDB's data structure that records metadata and the actual data value.
Fields are required in InfluxDB's data structure and they are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant relative to tags.

*Query tip:* Compare fields to tags; tags are indexed.

Related entries: [field key](#field-key), [field set](#field-set), [field value](#field-value), [tag](#tag)

### field key

The key of the key-value pair.
Field keys are strings and they store metadata.

Related entries: [field](#field), [field set](#field-set), [field value](#field-value), [tag key](#tag-key)

### field set

The collection of field keys and field values on a point.

Related entries: [field](#field), [field key](#field-key), [field value](#field-value), [point](#point)

### field value

The value of a key-value pair.
Field values are the actual data; they can be strings, floats, integers, or booleans.
A field value is always associated with a timestamp.

Field values are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [field](#field), [field key](#field-key), [field set](#field-set), [tag value](#tag-value), [timestamp](#timestamp)

### file block

A file block is a fixed-length chunk of data read into memory when requested by an application.

Related entries: [block](#block)

### float

A real number written with a decimal point dividing the integer and fractional parts (`1.0`, `3.14`, `-20.1`).
InfluxDB supports 64-bit float values.
In [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/), columns that contain
float values are annotated with the `double` datatype.

### flush interval

The global interval for flushing data from each Telegraf output plugin to its destination.
This value should not be set lower than the collection interval.

Related entries: [collection interval](#collection-interval), [flush jitter](#flush-jitter), [output plugin](#output-plugin)

### flush jitter

Flush jitter prevents every Telegraf output plugin from sending writes simultaneously, which can overwhelm some data sinks.
Each flush interval, every Telegraf output plugin will sleep for a random time between zero and the flush jitter before emitting metrics.
Flush jitter smooths out write spikes when running a large number of Telegraf instances.

Related entries: [flush interval](#flush-interval), [output plugin](#output-plugin)

### Flux

A lightweight scripting language for querying databases (like InfluxDB) and working with data.

### function

Flux functions aggregate, select, and transform time series data.
For a complete list of Flux functions, see [Flux functions](/influxdb/v2.0/reference/flux/stdlib/all-functions/).

Related entries: [aggregate](#aggregate), [selector](#selector), [transformation](#transformation)

### function block

In Flux, each file has a file block containing all Flux source text in that file.
Each function literal has its own function block even if not explicitly declared.

## G

### gauge

 A type of visualization that displays the single most recent value for a time series.
A gauge typically displays one or more measures from a single row, and is not designed to display multiple rows of data.
Elements include a range, major and minor tick marks (within the range), and a pointer (needle) indicating the single most recent value.

### graph

A diagram that visually depicts the relation between variable quantities measured along specified axes.

### group key
Group keys determine the schema and contents of tables in Flux output.
A group key is a list of columns for which every row in the table has the same value.
Columns with unique values in each row are not part of the group key.

### gzip

gzip is a type of data compression that compress chunks of data, which is restored by unzipping compressed gzip files.
The gzip file extension is `.gz`.

## H

<!--enterprise
### Hinted Handoff (HH)

Offers full write availability on an InfluxDB cluster. Hinted handoff improves response consistency after temporary outages such as network failures.

-->

### histogram

A visual representation of statistical information that uses rectangles to show the frequency of data items in successive, equal intervals or bins.

## I

### identifier

Identifiers are tokens that refer to task names, bucket names, field keys,
measurement names, tag keys, and user names.
For examples and rules, see [Flux language lexical elements](/influxdb/v2.0/reference/flux/language/lexical-elements/#identifiers).

Related entries:
[bucket](#bucket)
[field key](#field-key),
[measurement](#measurement),
<!-- [retention policy](#retention-policy-rp), -->
[tag key](#tag-key),
[user](#user)

### implicit block

In Flux, an implicit block is a possibly empty sequence of statements within matching braces ({ }) that includes the following types:

  - Universe: Encompasses all Flux source text.
  - Package: Each package includes a package block that contains Flux source text for the package.
  - File: Each file has a file block containing Flux source text in the file.
  - Function: Each function literal has a function block with Flux source text (even if not explicitly declared).

Related entries: [explict block](#explicit-block), [block](#block)

### influx

`influx` is a command line interface (CLI) that interacts with the InfluxDB daemon (influxd).

### influxd

`influxd` is the InfluxDB daemon that runs the InfluxDB server and other required processes.

### InfluxDB

An open-source time series database (TSDB) developed by InfluxData.
Written in Go and optimized for fast, high-availability storage and retrieval of time series data in fields such as operations monitoring, application metrics, Internet of Things sensor data, and real-time analytics.

### InfluxDB UI

The graphical web interface provided by InfluxDB for visualizing data and managing InfluxDB functionality.

### InfluxQL

The SQL-like query language used to query data in InfluxDB 1.x.
The prefered method for querying data in InfluxDB 2.0 is the [Flux](#flux) language.

### input plugin

Telegraf input plugins actively gather metrics and deliver them to the core agent, where aggregator, processor, and output plugins can operate on the metrics.
In order to activate an input plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](#aggregator-plugin), [collection interval](#collection-interval), [output plugin](#output-plugin), [processor plugin](#processor-plugin)

### instance

An entity comprising data on a server (or virtual server in cloud computing).
<!-- An instance in an InfluxDB Enterprise cluster may scale across multiple servers or nodes in a network. -->

### integer

A whole number that is positive, negative, or zero (`0`, `-5`, `143`).
InfluxDB supports 64-bit integers (minimum: `-9223372036854775808`, maximum: `9223372036854775807`).
In [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/), columns that contain
integers are annotated with the `long` datatype.

Related entries: [unsigned integer](#unsigned-integer)

## J

### JWT

Typically, JSON web tokens (JWT) are used to authenticate users between an identity provider and a service provider.
A server can generate a JWT to assert any business processes.
For example, an "admin" token sent to a client can prove the client is logged in as admin.
Tokens are signed by one party's private key (typically, the server).
Private keys are used by both parties to verify that a token is legitimate.

JWT uses an open standard specified in [RFC 7519](https://tools.ietf.org/html/rfc7519).

### Jaeger

Open source tracing used in distributed systems to monitor and troubleshoot transactions.

### JSON

JavaScript Object Notation (JSON) is an open-standard file format that uses human-readable text to transmit data objects consisting of attribute–value pairs and array data types.

## K

### keyword

A keyword is reserved by a program because it has special meaning.
Every programming language has a set of keywords (reserved names) that cannot be used as an identifier.

See a list of [Flux keywords](/influxdb/v2.0/reference/flux/language/lexical-elements/#keywords).

## L

### literal

A literal is value in an expression, a number, character, string, function, record, or array.
Literal values are interpreted as defined.

See examples of [Flux literals](/influxdb/v2.0/reference/flux/language/expressions/#examples-of-function-literals).

<!-- enterprise
### load balancing

Improves workload distribution across multiple computing resources in a network. Load balancing optimizes resource use, maximizes throughput, minimizes response time, and avoids overloading a single resource. Using multiple components with load balancing instead of a single component may increase reliability and availability. If requests to any server in a network increase, requests are forwarded to another server with more capacity. Load balancing can also refer to the communications channels themselves.

-->

### logs

Logs record information.
Event logs describe system events and activity that help to describe and diagnose problems.
Transaction logs describe changes to stored data that help recover data if a database crashes or other errors occur.

The InfluxDB 2.0 user interface (UI) can be used to view log history and data.

### Line protocol (LP)

The text based format for writing points to InfluxDB.
See [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/).

## M

### measurement

The part of InfluxDB's structure that describes the data stored in the associated fields.
Measurements are strings.

Related entries: [field](#field), [series](#series)

### member

A user in an organization.
<!--or a node in a cluster. -->

<!--### meta node - in development

A node that runs the meta service.

For high availability, installations must have three meta nodes.
Meta nodes can be very modestly sized instances like an EC2 t2.micro or even a
nano.
For additional fault tolerance, installations may use five meta nodes. The
number of meta nodes must be an odd number.

Related entries: [meta service](#meta-service)

### meta service

The consistent data store that keeps state about the cluster, including which
servers, buckets, users, tasks, subscriptions, and blocks of time exist.

Related entries: [meta node](#meta-node)

### metastore

Contains internal information about the status of the system.
The metastore contains the user information, buckets, shard metadata, tasks, and subscriptions.

Related entries: [bucket](#bucket), [retention policy](#retention-policy-rp), [user](#user)
-->

### metric

Data tracked over time.

### metric buffer

The metric buffer caches individual metrics when writes are failing for an Telegraf output plugin.
Telegraf will attempt to flush the buffer upon a successful write to the output.
The oldest metrics are dropped first when this buffer fills.

Related entries: [output plugin](#output-plugin)

### missing values

Denoted by a null value.
Identifies missing information, which may be useful to include in an error message.

The Flux data model includes [Missing values (null)](/influxdb/v2.0/reference/flux/language/data-model/#missing-values-null).

## N

### node

An independent `influxd` process.

Related entries: [server](#server)

### notification endpoint

 The notification endpoint specifies the Slack or PagerDuty endpoint to send a notification and contains configuration details for connecting to the endpoint.
Learn how to [create a notification endpoint](/influxdb/v2.0/monitor-alert/notification-endpoints/create).

Related entries: [check](#check), [notification rule](#notification-rule)

### notification rule

A notification rule specifies a status level (and tags) to alert on, the notification message to send for the specified status level (or change in status level), and the interval or schedule you want to check the status level (and tags).
If conditions are met, the notification rule sends a message to the [notification endpoint](#notification-endpoint) and stores a receipt in a notification measurement in the `_monitoring` bucket.
For example, a notification rule may specify a message to send to a Slack endpoint when a status level is critical (`crit`).

Learn how to [create a notification rule](/influxdb/v2.0/monitor-alert/notification-rules/create).

Related entries: [check](#check), [notification endpoint](#notification-endpoint)

### now()

The local server's nanosecond timestamp.

### null

A data type that represents a missing or unknown value.
Denoted by the null value.

## O

### operator

A symbol that usually represents an action or process.
For example: `+`, `-`, `>`.

### operand

The object or value on either side of an operator.

### option

Represents a storage location for any value of a specified type.
Mutable, can hold different values during its lifetime.

See built-in Flux [options](/influxdb/v2.0/reference/flux/language/options/).

### option assignment

An option assignment binds an identifier to an option.

Learn about the [option assignment](/influxdb/v2.0/reference/flux/language/assignment-scope/#option-assignment) in Flux.

### organization

A workspace for a group of users.
All dashboards, tasks, buckets, members, and so on, belong to an organization.

### output plugin

Telegraf output plugins deliver metrics to their configured destination.
To activate an output plugin, enable and configure the plugin in Telegraf's configuration file.

Related entries: [aggregator plugin](#aggregator-plugin), [flush interval](#flush-interval), [input plugin](#input-plugin), [processor plugin](#processor-plugin)

## P

### parameter

A key-value pair used to pass information to functions.

### pipe

Method for passing information from one process to another.
For example, an output parameter from one process is input to another process.
Information passed through a pipe is retained until the receiving process reads the information.

### pipe-forward operator

An operator (`|>`) used in Flux to chain operations together.
Specifies the output from a function is input to next function.

### point

In InfluxDB, a point represents a single data record, similar to a row in a SQL database table.
Each point:

- has a measurement, a tag set, a field key, a field value, and a timestamp;
- is uniquely identified by its series and timestamp.

In a series, each point has a unique timestamp.
If you write a point to a series with a timestamp that matches an existing point, the field set becomes a union of the old and new field set, where any ties go to the new field set.

Related entries: [measurement](#measurement), [tag set](#tag-set), [field set](#field-set), [timestamp](#timestamp)

### precision

The precision configuration setting determines the timestamp precision retained for input data points.
All incoming timestamps are truncated to the specified precision.
Valid precisions are `ns`, `us` or `µs`, `ms`, and `s`.

In Telegraf, truncated timestamps are padded with zeros to create a nanosecond timestamp.
Telegraf output plugins emit timestamps in nanoseconds.
For example, if the precision is set to `ms`, the nanosecond epoch timestamp `1480000000123456789` is truncated to `1480000000123` in millisecond precision and padded with zeroes to make a new, less precise nanosecond timestamp of `1480000000123000000`.
Telegraf output plugins do not alter the timestamp further.
The precision setting is ignored for service input plugins.

Related entries:  [aggregator plugin](#aggregator-plugin), [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin), [service input plugin](#service-input-plugin)

### predicate expression

A predicate expression compares two values and returns `true` or `false` based on
the relationship between the two values.
A predicate expression is comprised of a left operand, a comparison operator, and a right operand.

### predicate function
A Flux predicate function is an anonymous function that returns `true` or `false`
based on one or more [predicate expressions](#predicate-expression).

###### Example predicate function
```js
(r) => r.foo == "bar" and r.baz != "quz"
```

### process

A set of predetermined rules.
A process can refer to instructions being executed by the computer processor or refer to the act of manipulating data.

In Flux, you can process data with [InfluxDB tasks](/influxdb/v2.0/process-data/get-started/).

### processor plugin

Telegraf processor plugins transform, decorate, and filter metrics collected by input plugins, passing the transformed metrics to the output plugins.

Related entries: [aggregator plugin](#aggregator-plugin), [input plugin](#input-plugin), [output plugin](#output-plugin)

### Prometheus format

A simple text-based format for exposing metrics and ingesting them into Prometheus or InfluxDB using InfluxDB scrapers.

Collect data from any accessible endpoint that provides data in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/).

## Q

### query

A Flux script that returns time series data, including [tags](#tag) and [timestamps](#timestamp).

See [Query data in InfluxDB](/influxdb/v2.0/query-data/).

## R

### REPL

A Read-Eval-Print Loop (REPL) is an interactive programming environment where you type a command and immediately see the result.
See [Flux REPL](/influxdb/v2.0/tools/repl/) for information on building and using the REPL.

### record

A tuple of named values represented using a record type.

### regular expressions

Regular expressions (regex or regexp) are patterns used to match character combinations in strings.

<!--### replication factor

The attribute of the retention policy that determines how many copies of the data are stored in the cluster. InfluxDB replicates data across N data nodes, where N is the replication factor.

To maintain data availability for queries, the replication factor should be less than or equal to the number of data nodes in the cluster:

Data is fully available when the replication factor is greater than the number of unavailable data nodes.
Data may be unavailable when the replication factor is less than the number of unavailable data nodes.
Any replication factor greater than two gives you additional fault tolerance and query capacity within the cluster.

### retention policy (RP)

Retention policy is a duration of time that each data point persists. Retention policies are specified in a bucket.

<!--Retention polices describe how many copies of the data is stored in the cluster (replication factor), and the time range covered by shard groups (shard group duration). Retention policies are unique per bucket.

Related entries: [duration](#duration), [measurement](#measurement), [replication factor](#replication-factor), [series](#series), [shard duration](#shard-duration), [tag set](#tag-set)

-->

### RFC3339 timestamp
A timestamp that uses the human readable DateTime format proposed in
[RFC 3339](https://tools.ietf.org/html/rfc3339) (for example: `2020-01-01T00:00:00.00Z`).
Flux and InfluxDB clients return query results with RFC3339 timestamps.

Related entries: [timestamp](#timestamp), [unix timestamp](#unix-timestamp)

## S

### schema

How data is organized in InfluxDB.
The fundamentals of the InfluxDB schema are buckets (which include retention policies), series, measurements, tag keys, tag values, and field keys.

Related entries: [bucket](#bucket), [field key](#field-key), [measurement](#measurement), <!--[retention policy](#retention-policy-rp),--> [series](#series), [tag key](#tag-key), [tag value](#tag-value)

### scrape

InfluxDB scrapes data from specified targets at regular intervals and writes the data to an InfluxDB bucket.
Data can be scraped from any accessible endpoint that provides data in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/).

### secret
Secrets are key-value pairs that contain information you want to control access to, such as API keys, passwords, or certificates.

### selector

A Flux function that returns a single point from the range of specified points.
See [Flux built-in selector functions](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/) for a complete list of available built-in selector functions.

Related entries: [aggregate](#aggregate), [function](#function), [transformation](#transformation)

### series

A collection of data in the InfluxDB data structure that shares a measurement, tag set, and bucket.

Related entries: [field set](#field-set), [measurement](#measurement),<!-- [retention policy](/#retention-policy-rp), --> [tag set](#tag-set)

### series cardinality

The number of unique measurement, tag set, and field key combinations in an InfluxDB bucket.

For example, assume that an InfluxDB bucket has one measurement.
The single measurement has two tag keys: `email` and `status`.
If there are three different `email`s, and each email address is associated with two
different `status`es, the series cardinality for the measurement is 6
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
If we add the tag `firstname` to the example above, the series cardinality
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

##### Query for cardinality:
- **Flux:** [influxdb.cardinality()](/influxdb/v2.0/reference/flux/stdlib/influxdb/cardinality/)
- **InfluxQL:** [SHOW CARDINALITY](/{{< latest "influxdb" "v1" >}}/query_language/spec/#show-cardinality)

Related entries: [field key](#field-key),[measurement](#measurement), [tag key](#tag-key), [tag set](#tag-set)

### series file

A file created and used by the **InfluxDB OSS storage engine**
that contains a set of all series keys across the entire database.

### series key

A series key identifies a particular series by measurement, tag set, and field key.

For example:

```
# measurement, tag set, field key
h2o_level, location=santa_monica, h2o_feet
```

Related entries: [series](#series)

### server

A computer, virtual or physical, running InfluxDB.
<!--is this still valid for 2.0: There should only be one InfluxDB process per server. -->

Related entries: [node](#node)

### service input plugin

Telegraf input plugins that run in a passive collection mode while the Telegraf agent is running.
Service input plugins listen on a socket for known protocol inputs, or apply their own logic to ingested metrics before delivering metrics to the Telegraf agent.

Related entries: [aggregator plugin](#aggregator-plugin), [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin)

<!--### shard

A shard contains encoded and compressed data. Shards are represented by a TSM file on disk.
Every shard belongs to one and only one shard group.
Multiple shards may exist in a single shard group.
Each shard contains a specific set of series.
All points falling on a given series in a given shard group will be stored in the same shard (TSM file) on disk.

Related entries: [series](#series), [shard duration](#shard-duration), [shard group](#shard-group), [tsm](#tsm-time-structured-merge-tree)

### shard duration

The shard duration determines how much time each shard group spans.
The specific interval is determined by the `SHARD DURATION` of the retention policy.
<!-- See [Retention Policy management](/{{< latest "influxdb" "v1" >}}/query_language/database_management/#retention-policy-management) for more information.

For example, given a retention policy with `SHARD DURATION` set to `1w`, each shard group will span a single week and contain all points with timestamps in that week.

Related entries: [database](#database), [retention policy](#retention-policy-rp), [series](/#series), [shard](#shard), [shard group](#shard-group)

### shard group

Shard groups are logical containers for shards.
Shard groups are organized by time and retention policy.
Every retention policy that contains data has at least one associated shard group.
A given shard group contains all shards with data for the interval covered by the shard group.
The interval spanned by each shard group is the shard duration.

Related entries: [database](#database), [retention policy](#retention-policy-rp), [series](/#series), [shard](#shard), [shard duration](#shard-duration)

-->

### Single Stat

A visualization that displays the numeric value of the most recent point in a table (or series) returned by a query.

### Snappy compression

InfluxDB uses snappy compression to compress batches of points.
To improve space and disk IO efficiency, each batch is compressed before being written to disk.

<!-- in development ### stacked graph

A visualization that displays points sharing a common X value as stacked rather than overlaid. Hence, the Y value is equal to the sum of Y values.

Related entries: [bin](#bin)
-->

### step-plot

A data visualization that displays time series data in a staircase graph.
Generate a step-plot using the step [interpolation option for line graphs](/influxdb/v2.0/visualize-data/visualization-types/graph/#options).

### stream

Flux processes streams of data.
A stream includes a series of tables over a sequence of time intervals.

### string

A data type used to represent text.
In [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/), columns that contain
string values are annotated with the `string` datatype.

## T

### TCP

InfluxDB uses Transmission Control Protocol (TCP) port 8086 for client-server communication over the InfluxDB HTTP API.

<!--ports for InfluxDB Enterprise -->

### table

Flux processes a series of tables for a specified time series.
These tables in sequence result in a stream of data.

### tag

The key-value pair in InfluxDB's data structure that records metadata.
Tags are an optional part of InfluxDB's data structure but they are useful for storing commonly-queried metadata; tags are indexed so queries on tags are performant.
*Query tip:* Compare tags to fields; fields are not indexed.

Related entries: [field](#field), [tag key](#tag-key), [tag set](#tag-set), [tag value](#tag-value)

### tag key

The key of a tag key-value pair.
Tag keys are strings and store metadata.
Tag keys are indexed so queries on tag keys are processed quickly.

*Query tip:* Compare tag keys to field keys.
Field keys are not indexed.

Related entries: [field key](#field-key), [tag](#tag), [tag set](#tag-set), [tag value](#tag-value)

### tag set

The collection of tag keys and tag values on a point.

Related entries: [point](#point), [series](#series), [tag](#tag), [tag key](#tag-key), [tag value](#tag-value)

### tag value

The value of a tag key-value pair.
Tag values are strings and they store metadata.
Tag values are indexed so queries on tag values are processed quickly.

Related entries: [tag](#tag), [tag key](#tag-key), [tag set](#tag-set)

### task

A scheduled Flux query that runs periodically and may store results in a specified measurement.
Examples include downsampling and batch jobs.
For more information, see [Process Data with InfluxDB tasks](/influxdb/v2.0/process-data/).

Related entries: [function](#function)

### Telegraf

A plugin-driven agent that collects, processes, aggregates, and writes metrics.

Related entries: [Automatically configure Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/), [Manually configure Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/manual-config/), [Telegraf plugins](/{{< latest "telegraf" >}}/plugins//), [Use Telegraf to collect data](/influxdb/v2.0/write-data/no-code/use-telegraf/), [View a Telegraf configuration](/influxdb/v2.0/telegraf-configs/view/)

### time (data type)

A data type that represents a single point in time with nanosecond precision.

### time series data

Sequence of data points typically consisting of successive measurements made from the same source over a time interval.
Time series data shows how data evolves over time.
On a time series data graph, one of the axes is always time.
Time series data may be regular or irregular.
Regular time series data changes in constant intervals.
Irregular time series data changes at non-constant intervals.

### timestamp

The date and time associated with a point.
Time in InfluxDB is in UTC.

To specify time when writing data, see [Elements of line protocol](/influxdb/v2.0/reference/syntax/line-protocol/#elements-of-line-protocol).
To specify time when querying data, see [Query InfluxDB with Flux](/influxdb/v2.0/query-data/get-started/query-influxdb/#2-specify-a-time-range).

Related entries: [point](#point), [unix timestamp](#unix-timestamp), [RFC3339 timestamp](#rfc3339-timestamp)

### token

Tokens (or authentication tokens) verify user and organization permissions in InfluxDB.
There are different types of athentication tokens:

- **Admin token:** grants full read and write access to all resources in **all organizations in InfluxDB OSS 2.x**.
  _InfluxDB Cloud does not support Admin tokens._
- **All-Access token:** grants full read and write access to all resources in an organization.
- **Read/Write token:** grants read or write access to specific resources in an organization.

Related entries: [Create a token](/influxdb/v2.0/security/tokens/create-token/).

### tracing

By default, tracing is disabled in InfluxDB OSS.
To enable tracing or set other InfluxDB OSS configuration options,
see [InfluxDB OSS configuration options](/influxdb/v2%2E0/reference/config-options/).

### transformation

An InfluxQL function that returns a value or a set of values calculated from specified points, but does not return an aggregated value across those points.
See [InfluxQL functions](/{{< latest "influxdb" "v1" >}}/query_language/functions/#transformations) for a complete list of the available and upcoming aggregations.

Related entries: [aggregate](#aggregate), [function](#function), [selector](#selector)

### TSI (Time Series Index)

TSI uses the operating system's page cache to pull frequently accessed data into memory and keep infrequently accessed data on disk.

### TSL

The Time Series Logs (TSL) extension (`.tsl`) identifies Time Series Index (TSI) log files, generated by the tsi1 engine.

### TSM (Time Structured Merge tree)

A data storage format that allows greater compaction and higher write and read throughput than B+ or LSM tree implementations.
For more information, see [Storage engine](/{{< latest "influxdb" "v1" >}}/concepts/storage_engine/).

Related entries: [TSI](#tsi-time-series-index)

## U

### UDP

User Datagram Protocol is a packet of information.
When a request is made, a UDP packet is sent to the recipient.
The sender doesn't verify the packet is received.
The sender continues to send the next packets.
This means computers can communicate more quickly.
This protocol is used when speed is desirable and error correction is not necessary.

### universe block

An implicit block that encompasses all Flux source text in a universe block.

### unix timestamp

Counts time since **Unix Epoch (1970-01-01T00:00:00Z UTC)** in specified units ([precision](#precision)).
Specify timestamp precision when [writing data to InfluxDB](/influxdb/v2.0/write-data/).
InfluxDB supports the following unix timestamp precisions:

| Precision | Description  | Example               |
|:--------- |:-----------  |:-------               |
| `ns`      | Nanoseconds  | `1577836800000000000` |
| `us`      | Microseconds | `1577836800000000`    |
| `ms`      | Milliseconds | `1577836800000`       |
| `s`       | Seconds      | `1577836800`          |

<p style="font-size:.9rem;margin-top:-2rem"><em>The examples above represent <strong>2020-01-01T00:00:00Z UTC</strong>.</em></p>

Related entries: [timestamp](#timestamp), [RFC3339 timestamp](#rfc3339-timestamp)

### unsigned integer
A whole number that is positive or zero (`0`, `143`). Also known as a "uinteger."
InfluxDB supports 64-bit unsigned integers (minimum: `0`, maximum: `18446744073709551615`).
In [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/), columns that contain
integers are annotated with the `unisgnedLong` datatype.

Related entries: [integer](#integer)

### user

InfluxDB users are granted permission to access to InfluxDB.
Users are added as a member of an organization and are given a unique authentication token.

## V

### values per second

The preferred measurement of the rate at which data are persisted to InfluxDB.
Write speeds are generally quoted in values per second.

To calculate the values per second rate, multiply the number of points written
per second by the number of values stored per point.
For example, if the points have four fields each, and a batch of 5000 points is
written 10 times per second, the values per second rate is:

**4 field values per point** × **5000 points per batch** × **10 batches per second** = **200,000 values per second**  


Related entries: [batch](#batch), [field](#field), [point](#point)

### variable

A storage location (identified by a memory address) paired with an associated symbolic name (an identifier).
A variable contains some known or unknown quantity of information referred to as a value.

### variable assignment

A statement that sets or updates the value stored in a variable.

In Flux, the variable assignment creates a variable bound to an identifier and gives it a type and value.
A variable keeps the same type and value for the remainder of its lifetime.
An identifier assigned to a variable in a block cannot be reassigned in the same block.

## W

<!--
### WAL (Write Ahead Log) - enterprise

The temporary cache for recently written points. To reduce the frequency that permanent storage files are accessed, InfluxDB caches new points in the WAL until their total size or age triggers a flush to more permanent storage. This allows for efficient batching of the writes into the TSM.

Points in the WAL can be queried and persist through a system reboot. On process start, all points in the WAL must be flushed before the system accepts new writes.

Related entries: [tsm](#tsm-time-structured-merge-tree)
-->

### windowing

Grouping data based on specified time intervals.
For information about how to window in Flux, see [Window and aggregate data with Flux](/influxdb/v2.0/query-data/flux/window-aggregate/).
