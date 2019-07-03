---
title: Glossary
description: >
  Terms related to InfluxData products and platforms.
weight: 6
menu:
  v2_0_ref:
    name: Glossary
v2.0/tags: [glossary]
---

[A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) |[G](#g) | [H](#h) | [I](#i) | [J](#j) | [K](#k) | [L](#l) | [M](#m) | [N](#n) | [O](#o) | [P](#p) | [Q](#q) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) | [W](#w) | [X](#x) | [Y](#y) | [Z](#z)

## A

### agent

A background process started by (or on behalf of) a user and typically requires user input. 

Telegraf is an example of an agent that requires user input (a configuration file) to gather metrics from declared input plugins and sends metrics to declared output plugins, based on the plugins enabled for a configuration.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin), [daemon](#daemon)

### aggregator plugin

Receives metrics from input plugins, creates aggregate metrics, and then passes aggregate metrics to configured output plugins.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin)

### aggregate

A function that returns an aggregated value across a set of points.
For a list of available aggregation functions, see [Flux built-in aggregate functions](/v2.0/reference/flux/functions/built-in/transformations/aggregates/).

Related entries: [function](#function), [selector](#selector), [transformation](#transformation)

## B

### bar graph

A visual representation used to compare variables (bars) and plot categorical data. A bar graph has spaces between bars, can be sorted in any order, and bars in the graph typically have the same width.

Related entries: [histogram](#histogram)

### batch

A collection of points in line protocol format, separated by newlines (`0x0A`).
Submitting a batch of points using a single HTTP request to the write endpoints drastically increases performance by reducing the HTTP overhead.
InfluxData typically recommends batch sizes of 5,000-10,000 points. In some use cases, performance may improve with significantly smaller or larger batches.

Related entries: [line protocol](/v2.0/reference/line-protocol/), [point](#point)

### batch size

The number of lines or individual data points in a line protocol batch. The Telegraf agent sends metrics to output plugins in batches rather than individually.
Batch size controls the size of each write batch that Telegraf sends to the output plugins.

Related entries: [output plugin](#output-plugin)

### block

In Flux, a block is a possibly empty sequence of statements within matching braces ({ }). Two types of blocks exist in Flux:

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

### boolean

A data type with two possible values: true or false.
By convention, you can express `true` as the integer `1` and false as the integer `0` (zero).

### bucket

A bucket is a named location where time series data is stored. All buckets have a retention policy, a duration of time that each data point persists. A bucket belongs to an organization.

### bytesRX

A measurement statistic for the Anti-Entropy (AE) engine in InfluxDB Enterprise clusters that measures the number of bytes received by a data node.

## C

### CSV

Annotated CSV (comma-separated values) format is used to encode HTTP responses and results returned to the Flux csv.from() function.

### cardinality

Cardinality is the number of unique series in a bucket or database as a whole.

### cluster

An InfluxDB cluster includes meta nodes, data nodes, and the InfluxDB Enterprise web server. In a cluster, meta nodes must communicate with each other and data nodes must communicate with each other and with meta nodes.

### co-monitoring dashboard

### collect


### collection interval

The default global interval for collecting data from each Telegraf input plugin.
The collection interval can be overridden by each individual input plugin's configuration.

Related entries: [input plugin](#input-plugin)

<!--Likely configurable for scrapers in the future.-->

### collection jitter

Collection jitter prevents every input plugin from collecting metrics simultaneously, which can have a measurable effect on the system. For each collection interval, every Telegraf input plugin will sleep for a random time between zero and the collection jitter before collecting the metrics.

Related entries: [collection interval](#collection-interval), [input plugin](#input-plugin)

<!-- ### column

### comment

### common log format (CLF)

-->

### continuous query (CQ)

Continuous queries are the predecessor to tasks in InfluxDB 2.0. Continuous queries run automatically and periodically on a database.

Related entries: [function](#function)

## D

### daemon
A background process that runs without user input.

<!--
### dashboard

### dashboard variable

### Data Explorer

### data model
-->

<!-- ### data node

A node that runs the InfluxDB? data service.

For high availability, installations must have at least two data nodes.
The number of data nodes in your cluster must be the same as your highest replication factor.
Any replication factor greater than two gives you additional fault tolerance and
query capacity in the cluster.

Data node sizes will depend on your needs. The Amazon EC2 m4.large or m4.xlarge are good starting points.

Related entries: [data service](#data-service), [replication factor](#replication-factor)
-->

### data service

Stores time series data and handles writes and queries.

Related entries: [data node](#data-node)

<!--### data type -->

### database

In InfluxDB 2.0, a database represents the InfluxDB instance as a whole.

Related entries: [continuous query](#continuous-query-cq), [retention policy](#retention-policy-rp), [user](#user)

<!-- ### date-time-->

### downsample
Aggregating high resolution data into lower resolution data to preserve disk space.

### duration

A data type that represents a duration of time (1s, 1m, 1h, 1d). Retention policies are set using durations. Data older than the duration is automatically dropped from the database.
<!-- See [Database Management](/influxdb/v1.7/query_language/database_management/#create-retention-policies-with-create-retention-policy) for how to set duration.
-->

Related entries: [retention policy](#retention-policy-rp)

<!-- ### duration (data type)
-->

## E

### event

Metrics gathered at irregular time intervals.

<!-- ### explicit block
-->
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

<!-- ### file block
-->
### float
A float represents real numbers and is written with a decimal point dividing the integer and fractional parts. For example, 1.0, 3.14.

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

Flux functions aggregate, select, and transform time series data. For a complete list of Flux functions, see [Flux functions](/v2.0/reference/flux/functions/all-functions/). 
<!--Or opt to use Flux functions' predecessor, InfluxQL functions. See [InfluxQL functions](/influxdb/v1.7/query_language/functions/) for a complete list. -->

Related entries: [aggregation](#aggregation), [selector](#selector), [transformation](#transformation)

<!--### function block

## G

### gauge

### graph

### gzip

- compression
- file (`.gz`)

## H

### Hinted Handoff (HH)
-->
### histogram
A visual representation of statistical information that uses rectangles to show the frequency of data items in successive, equal intervals or bins.

## I

### identifier

Identifiers are tokens that refer to task names, bucket names, field keys,
measurement names, subscription names, tag keys, and
user names.
For examples and rules, see [Flux language lexical elements](/v2.0/reference/flux/language/lexical-elements/#identifiers).

Related entries:
[bucket](#bucket)
[field key](#field-key),
[measurement]/#measurement),
[retention policy](#retention-policy-rp),
[tag key](#tag-key),
[user](#user)

<!--### implicit block -->

### influx
A command line interface (CLI) that interacts with the InfluxDB daemon (influxd).

### influxd
The InfluxDB daemon that runs the InfluxDB server and other required processes.

<!--### InfluxDB -->

### InfluxDB UI
The graphical web interface provided by InfluxDB for visualizing data and managing InfluxDB functionality.

### InfluxQL
The SQL-like query language used to query data in InfluxDB 1.x.

### input plugin

Telegraf input plugins actively gather metrics and deliver them to the core agent, where aggregator, processor, and output plugins can operate on the metrics.
In order to activate an input plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [collection interval](/telegraf/v1.10/concepts/glossary/#collection-interval), [output plugin](/telegraf/v1.10/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.10/concepts/glossary/#processor-plugin)

<!-- ### instance

### int (data type)

## J

### JWT

### Jaeger

### Java Web Tokens

### join

## K

### keyword

-->

## L

<!-- ### literal

### load balancing

### Log Viewer

### logging

-->

### Line Protocol (LP)

The text based format for writing points to InfluxDB. See [Line Protocol](/v2.0/reference/line-protocol/).

## M

### measurement

The part of InfluxDB's structure that describes the data stored in the associated fields.
Measurements are strings.

Related entries: [field](#field), [series](#series)

### member
A user in an organization. <!--or a node in a cluster. -->

<!--### meta node

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

-->

### metastore

Contains internal information about the status of the system.
The metastore contains the user information, buckets, shard metadata, tasks, and subscriptions.

Related entries: [bucket](#bucket), [retention policy](#retention-policy-rp), [user](#user)

### metric

Data tracked over time.

### metric buffer

The metric buffer caches individual metrics when writes are failing for an Telegraf output plugin.
Telegraf will attempt to flush the buffer upon a successful write to the output.
The oldest metrics are dropped first when this buffer fills.

Related entries: [output plugin](/#output-plugin)

<!-- ### missing value
-->

## N

### node

An independent `influxd` process.

Related entries: [server](#server)

### now()

The local server's nanosecond timestamp.

### null
A data type that represents a missing or unknown value. Denoted by the null value.

## O

### operator
A symbol that usually represents an action or process. For example: `+`, `-`, `>`.

### operand
The object or value on either side of an operator.

<!-- ### option

### option assignment
-->
### organization
A workspace for a group of users. All dashboards, tasks, buckets, members, and so on, belong to an organization.

### output plugin

Telegraf output plugins deliver metrics to their configured destination. In order to activate an output plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [flush interval](/telegraf/v1.10/concepts/glossary/#flush-interval), [input plugin](/telegraf/v1.10/concepts/glossary/#input-plugin), [processor plugin](/telegraf/v1.10/concepts/glossary/#processor-plugin)

## P

### parameter
A key-value pair used to pass information to functions.
<!-- 
### pipe
-->
### pipe-forward operator
An operator (`|>`) used in Flux to chain operations together. Specifies the output from a function is input to next function.

### point

A point in the InfluxDB data structure that consists of a single collection of fields in a series. Each point is uniquely identified by its series and timestamp. In a series, you cannot store more than one point with the same timestamp.
When you write a new point to a series with a timestamp that matches an existing point, the field set becomes a union of the old and new field set, where any ties go to the new field set.
<!-- For an example, see [Frequently Asked Questions](/influxdb/v1.7/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points).

Related entries: [field set](/influxdb/v1.7/concepts/glossary/#field-set), [series](/influxdb/v1.7/concepts/glossary/#series), [timestamp](/influxdb/v1.7/concepts/glossary/#timestamp)

## points per second - in 1.x - obsolete?

A deprecated measurement of the rate at which data are persisted to InfluxDB.
The schema allows and even encourages the recording of multiple metric values per point, rendering points per second ambiguous.

Write speeds are generally quoted in values per second, a more precise metric.

Related entries: [point](/influxdb/v1.7/concepts/glossary/#point), [schema](/influxdb/v1.7/concepts/glossary/#schema), [values per second](/influxdb/v1.7/concepts/glossary/#values-per-second)

-->

### precision

The precision configuration setting determines the timestamp precision retained for input data points. All incoming timestamps are truncated to the specified precision. Valid precisions are `ns`, `us` or `µs`, `ms`, and `s`.

In Telegraf, truncated timestamps are padded with zeros to create a nanosecond timestamp. Telegraf output plugins emit timestamps in nanoseconds. For example, if the precision is set to `ms`, the nanosecond epoch timestamp `1480000000123456789` is truncated to `1480000000123` in millisecond precision and padded with zeroes to make a new, less precise nanosecond timestamp of `1480000000123000000`. Telegraf output plugins do not alter the timestamp further. The precision setting is ignored for service input plugins.

Related entries:  [aggregator plugin](#aggregator-plugin), [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](/#processor-plugin), [service input plugin](#service-input-plugin)

<!-- ### process -->

### processor plugin

Telegraf processor plugins transform, decorate, and filter metrics collected by input plugins, passing the transformed metrics to the output plugins.

Related entries: [aggregator plugin](#aggregator-plugin), [input plugin](#input-plugin), [output plugin](#output-plugin)

<!-- ### Prometheus format -->

## Q

### query

An operation that retrieves data from InfluxDB.
See [Query data in InfluxDB](/v2.0/query-data/).

## R

### REPL

A read-eval-print-loop is an interactive programming environment where you type a command and immediately see the result.
See [Use the influx CLI's REPL](/v2.0/query-data/get-started/syntax-basics/#use-the-influx-cli-s-repl)

### record

A tuple of named values represented using an object type.

### regular expressions

Regular expressions (regex or regexp) are patterns used to match character combinations in strings.

### retention policy (RP)

Retention policy is a duration of time that each data point persists. Retention policies are specified in a bucket.

<!--Retention polices describe how many copies of the data is stored in the cluster (replication factor), and the time range covered by shard groups (shard group duration). Retention policies are unique per bucket.
-->
Related entries: [duration](#duration), [measurement](#measurement), [replication factor](#replication-factor), [series](#series), [shard duration](#shard-duration), [tag set](#tag-set)

## S

### schema

How data is organized in InfluxDB. The fundamentals of the InfluxDB schema are buckets (which include retention policies), series, measurements, tag keys, tag values, and field keys.

<!-- See [Schema Design](/influxdb/v1.7/concepts/schema_and_data_layout/) for more information.
should we replace this with influxd generate help-schema link? -->

Related entries: [bucket](#bucket), [field key](#field-key), [measurement](#measurement), [retention policy](#retention-policy-rp), [series](#series), [tag key](#tag-key), [tag value](#tag-value)

<!-- ### scrape -->

### selector

A Flux function that returns a single point from the range of specified points.
See [Flux built-in selector functions](/v2.0/reference/flux/functions/built-in/transformations/selectors/) for a complete list of available built-in selector functions.

Related entries: [aggregation](#aggregation), [function](#function), [transformation](#transformation)

### series

A collection of data in the InfluxDB data structure that shares a measurement, tag set, and bucket.

Related entries: [field set](#field-set), [measurement](#measurement), [retention policy](/#retention-policy-rp), [tag set](#tag-set)

### series cardinality

The number of unique bucket, measurement, tag set, and field key combinations in an InfluxDB instance.

For example, assume that an InfluxDB instance has a single bucket and one measurement.
The single measurement has two tag keys: `email` and `status`.
If there are three different `email`s, and each email address is associated with two
different `status`es, the series cardinality for the measurement is 6
(3 * 2 = 6):

| email                 | status |
| :-------------------- | :----- |
| lorr@influxdata.com | start  |
| lorr@influxdata.com | finish |
| marv@influxdata.com     | start  |
| marv@influxdata.com     | finish |
| cliff@influxdata.com | start  |
| cliff@influxdata.com | finish |

In some cases, performing this multiplication may overestimate series cardinality because of the presence of dependent tags. Dependent tags are scoped by another tag and do not increase series
cardinality.
If we add the tag `firstname` to the example above, the series cardinality
would not be 18 (3 * 2 * 3 = 18).
The series cardinality would remain unchanged at 6, as `firstname` is already scoped by the `email` tag:

| email                 | status | firstname |
| :-------------------- | :----- | :-------- |
| lorr@influxdata.com | start  | lorraine  |
| lorr@influxdata.com | finish | lorraine  |
| marv@influxdata.com     | start  | marvin      |
| marv@influxdata.com     | finish | marvin      |
| cliff@influxdata.com | start  | clifford  |
| cliff@influxdata.com | finish | clifford  |

<!--See [SHOW CARDINALITY](/influxdb/v1.7/query_language/spec/#show-cardinality) to learn about the InfluxQL commands for series cardinality. -->

Related entries: [field key](#field-key),[measurement](#measurement), [tag key](#tag-key), [tag set](#tag-set)

### server

A computer, virtual or physical, running InfluxDB. <!--still valid There should only be one InfluxDB process per server. -->

Related entries: [node](#node)

<!-- ### service -->

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
<!-- See [Retention Policy management](/influxdb/v1.7/query_language/database_management/#retention-policy-management) for more information.

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

<!--### Single Stat

### Snappy compression

### source

### stacked graph

### statement

### step-plot

### stream

"stream of tables"

-->

### string
A data type used to represent text.

<!-- how does this work in 2.0? ### subscription

Subscriptions allow [Kapacitor](/kapacitor/latest/) to receive data from InfluxDB in a push model rather than the pull model based on querying data.
When Kapacitor is configured to work with InfluxDB, the subscription will automatically push every write for the subscribed database from InfluxDB to Kapacitor.
Subscriptions can use TCP or UDP for transmitting the writes.

-->

## T

<!--### TCP

### TSL

### TSM (Time-structured merge tree)

### TSM file

### table
-->
### tag

The key-value pair in InfluxDB's data structure that records metadata.
Tags are an optional part of InfluxDB's data structure but they are useful for storing commonly-queried metadata; tags are indexed so queries on tags are performant.
*Query tip:* Compare tags to fields; fields are not indexed.

Related entries: [field](/influxdb/v1.7/concepts/glossary/#field), [tag key](/influxdb/v1.7/concepts/glossary/#tag-key), [tag set](/influxdb/v1.7/concepts/glossary/#tag-set), [tag value](/influxdb/v1.7/concepts/glossary/#tag-value)

### tag key

The key of a tag key-value pair. Tag keys are strings and store metadata.
Tag keys are indexed so queries on tag keys are processed quickly.

*Query tip:* Compare tag keys to field keys. Field keys are not indexed.

Related entries: [field key](/#field-key), [tag](#tag), [tag set](#tag-set), [tag value](#tag-value)

### tag set

The collection of tag keys and tag values on a point.

Related entries: [point](#point), [series](#series), [tag](#tag), [tag key](#tag-key), [tag value](#tag-value)

### tag value

The value of a tag key-value pair.
Tag values are strings and they store metadata.
Tag values are indexed so queries on tag values are processed quickly.

Related entries: [tag]#tag), [tag key](#tag-key), [tag set](#tag-set)

<!--### task

### Telegraf
-->

### time (data type)

A data type that represents a single point in time with nanosecond precision.

### time series data

Sequence of data points typically consisting of successive measurements made from the same source over a time interval. Time series data shows how data evolves over
time. On a time series data graph, one of the axes is always time. Time series data may be regular or irregular. Regular time series data changes in constant intervals. Irregular time series data changes at non-constant intervals.

### timestamp

The date and time associated with a point. Time in InfluxDB is in UTC.

To specify time when writing data, see [Elements of line protocol](/v2.0/reference/line-protocol/#elements-of-line-protocol).
To specify time when querying data, see [Query InfluxDB with Flux](/v2.0/query-data/get-started/query-influxdb/#2-specify-a-time-range).

Related entries: [point](#point)

<!--### token

### tracing

### transformation

An InfluxQL function that returns a value or a set of values calculated from specified points, but does not return an aggregated value across those points.
See [InfluxQL Functions](/influxdb/v1.7/query_language/functions/#transformations) for a complete list of the available and upcoming aggregations.

Related entries: [aggregation](/influxdb/v1.7/concepts/glossary/#aggregation), [function](/influxdb/v1.7/concepts/glossary/#function), [selector](/influxdb/v1.7/concepts/glossary/#selector)

## tsm (Time Structured Merge tree) - in 1.x - obsolete?

The purpose-built data storage format for InfluxDB. TSM allows for greater compaction and higher write and read throughput than existing B+ or LSM tree implementations. See [Storage Engine](http://docs.influxdata.com/influxdb/v1.7/concepts/storage_engine/) for more.

## U

### UDP

### universe block

### user

There are two kinds of users in InfluxDB:

* *Admin users* have `READ` and `WRITE` access to all databases and full access to administrative queries and user management commands.
* *Non-admin users* have `READ`, `WRITE`, or `ALL` (both `READ` and `WRITE`) access per database.

When authentication is enabled, InfluxDB only executes HTTP requests that are sent with a valid username and password.
See [Authentication and Authorization](/influxdb/v1.7/administration/authentication_and_authorization/).
-->

## V

## values per second

The preferred measurement of the rate at which data are persisted to InfluxDB. Write speeds are generally quoted in values per second.

To calculate the values per second rate, multiply the number of points written per second by the number of values stored per point. For example, if the points have four fields each, and a batch of 5000 points is written 10 times per second, the values per second rate is `4 field values per point * 5000 points per batch * 10 batches per second = 200,000 values per second`.

Related entries: [batch](#batch), [field](#field), [point](#point), [points per second](#points-per-second)

<!-- ### variable

### variable assignment

## W

### WAL (Write Ahead Log)

The temporary cache for recently written points. To reduce the frequency that permanent storage files are accessed, InfluxDB caches new points in the WAL until their total size or age triggers a flush to more permanent storage. This allows for efficient batching of the writes into the TSM.

Points in the WAL can be queried and persist through a system reboot. On process start, all points in the WAL must be flushed before the system accepts new writes.

Related entries: [tsm](#tsm-time-structured-merge-tree)

<!-- ## web console - e - obsolete?

Legacy user interface for the InfluxDB Enterprise.

This has been deprecated and the suggestion is to use [Chronograf](/chronograf/latest/introduction/).

If you are transitioning from the Enterprise Web Console to Chronograf and helpful [transition guide](/chronograf/latest/guides/transition-web-admin-interface/) is available.

-->

### windowing
The process of partitioning data based on equal windows of time.
