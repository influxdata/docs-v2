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

Core part of Telegraf that gathers metrics from the declared input plugins and sends metrics to the declared output plugins, based on the plugins enabled by the given configuration.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin)

### aggregator plugin

Receives metrics from input plugins, creates aggregate metrics, and then passes aggregate metrics to configured output plugins.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin)

### aggregation

A function that returns an aggregated value across a set of points.
For a list of available aggregation functions, see [Flux built-in aggregate functions](https://v2.docs.influxdata.com/v2.0/reference/flux/functions/built-in/transformations/aggregates/).

Related entries: [function](#function), [selector](#selector), [transformation](#transformation)

## B

<!-- bar graph -->

### batch

A collection of points in line protocol format, separated by newlines (`0x0A`).
Submitting a batch of points to the database using a single HTTP request to the write endpoints drastically increases performance by reducing the HTTP overhead.
InfluxData typically recommends batch sizes of 5,000-10,000 points. In some use cases, performance may improve with significantly smaller or larger batches.

Related entries: [line protocol](/v2.0/reference/line-protocol/), [point](#point)

### batch size 

The Telegraf agent sends metrics to output plugins in batches, not individually.
The batch size controls the size of each write batch that Telegraf sends to the output plugins.

Related entries: [output plugin](#output-plugin)

<!-- ### block

### bool

### bucket

### bytes

## C

### CSV

### cardinality

### cluster

### co-monitoring dashboard

### collect

-->

### collection interval

The default global interval for collecting data from each input plugin.
The collection interval can be overridden by each individual input plugin's configuration.

Related entries: [input plugin](#input-plugin)

### collection jitter

Collection jitter is used to prevent every input plugin from collecting metrics simultaneously, which can have a measurable effect on the system.
Each collection interval, every input plugin will sleep for a random time between zero and the collection jitter before collecting the metrics.

Related entries: [collection interval](#collection-interval), [input plugin](#input-plugin)

### column

### comment

### common log format (CLF)

### continuous query (CQ)

An InfluxQL query that runs automatically and periodically within a database.
Continuous queries require a function in the `SELECT` clause and must include a `GROUP BY time()` clause.
See [Continuous Queries](/influxdb/v1.7/query_language/continuous_queries/).

Related entries: [function](#function)

## D

### daemon

### dashboard

### Data Explorer

### data model

### data node

A node that runs the data service.

For high availability, installations must have at least two data nodes.
The number of data nodes in your cluster must be the same as your highest
replication factor.
Any replication factor greater than two gives you additional fault tolerance and
query capacity in the cluster.

Data node sizes will depend on your needs. The Amazon EC2 m4.large or m4.xlarge are good starting points.

Related entries: [data service](#data-service), [replication factor](#replication-factor)

### data service

Stores time series data and handles writes and queries.

Related entries: [data node](#data-node)

### data type

### database

A logical container for users, retention policies, continuous queries, and time series data.

Related entries: [continuous query](#continuous-query-cq), [retention policy](#retention-policy-rp), [user](#user)

### date-time

### downsample

### duration

The attribute of the retention policy that determines how long InfluxDB stores data.
Data older than the duration are automatically dropped from the database.
<!-- See [Database Management](/influxdb/v1.7/query_language/database_management/#create-retention-policies-with-create-retention-policy) for how to set duration.
-->

Related entries: [retention policy](#retention-policy-rp)

<!-- ### duration (data type)
-->

## E

### event

Measurements gathered at irregular time intervals.

<!-- ### explicit block

### expression

-->

## F

### field

The key-value pair in InfluxDB's data structure that records metadata and the actual data value.
Fields are required in InfluxDB's data structure and they are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant relative to tags.

*Query tip:* Compare fields to tags; tags are indexed.

Related entries: [field key](#field-key), [field set](#field-set), [field value](#field-value), [tag](#tag)

### field key

The key part of the key-value pair that makes up a field.
Field keys are strings and they store metadata.

Related entries: [field](#field), [field set](#field-set), [field value](#field-value), [tag key](#tag-key)

### field set

The collection of field keys and field values on a point.

Related entries: [field](#field), [field key](#field-key), [field value](#field-value), [point](#point)

### field value

The value part of the key-value pair that makes up a field.
Field values are the actual data; they can be strings, floats, integers, or booleans.
A field value is always associated with a timestamp.

Field values are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [field](#field), [field key](#field-key), [field set](#field-set), [tag value](#tag-value), [timestamp](#timestamp)

### file block

### float

### flush interval 

The global interval for flushing data from each output plugin to its destination.
This value should not be set lower than the collection interval.

Related entries: [collection interval](#collection-interval), [flush jitter](#flush-jitter), [output plugin](#output-plugin)

### flush jitter 

Flush jitter is used to prevent every output plugin from sending writes simultaneously, which can overwhelm some data sinks.
Each flush interval, every output plugin will sleep for a random time between zero and the flush jitter before emitting metrics.
This helps smooth out write spikes when running a large number of Telegraf instances.

Related entries: [flush interval](#flush-interval), [output plugin](#output-plugin)

### Flux

### function

InfluxQL aggregations, selectors, and transformations.
See [InfluxQL Functions](/influxdb/v1.7/query_language/functions/) for a complete list of InfluxQL functions.

Related entries: [aggregation](/influxdb/v1.7/concepts/glossary/#aggregation), [selector](/influxdb/v1.7/concepts/glossary/#selector), [transformation](/influxdb/v1.7/concepts/glossary/#transformation)

### function block

## G

### gauge

### graph

### gzip

- compression
- file (`.gz`)

## H

### Hinted Handoff (HH)

### historgram

## I

### identifier

Tokens that refer to continuous query names, database names, field keys,
measurement names, retention policy names, subscription names, tag keys, and
user names.
See [Query Language Specification](/influxdb/v1.7/query_language/spec/#identifiers).

Related entries:
[database](/influxdb/v1.7/concepts/glossary/#database),
[field key](/influxdb/v1.7/concepts/glossary/#field-key),
[measurement](/influxdb/v1.7/concepts/glossary/#measurement),
[retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp),
[tag key](/influxdb/v1.7/concepts/glossary/#tag-key),
[user](/influxdb/v1.7/concepts/glossary/#user)

### implicit block

### influx

### influxd

### InfluxDB

### InfluxDB UI

### InfluxQL

### input plugin

Input plugins actively gather metrics and deliver them to the core agent, where aggregator, processor, and output plugins can operate on the metrics.
In order to activate an input plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [collection interval](/telegraf/v1.10/concepts/glossary/#collection-interval), [output plugin](/telegraf/v1.10/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.10/concepts/glossary/#processor-plugin)

### instance

### int (data type)

## J

### JWT

### Jaeger

### Java Web Tokens

### join

## K

### Kapacitor

### keyword

## L

### literal

### load balancing

### Log Viewer

### logging

### Line Protocol (LP)

The text based format for writing points to InfluxDB. See [Line Protocol](/influxdb/v1.7/write_protocols/).

## M

### measurement

The part of InfluxDB's structure that describes the data stored in the associated fields.
Measurements are strings.

Related entries: [field](/influxdb/v1.7/concepts/glossary/#field), [series](/influxdb/v1.7/concepts/glossary/#series)

### member

### meta node - e

A node that runs the meta service.

For high availability, installations must have three meta nodes.
Meta nodes can be very modestly sized instances like an EC2 t2.micro or even a
nano.
For additional fault tolerance installations may use five meta nodes; the
number of meta nodes must be an odd number.

Related entries: [meta service](#meta-service)

### meta service - e

The consistent data store that keeps state about the cluster, including which
servers, databases, users, continuous queries, retention policies, subscriptions,
and blocks of time exist.

Related entries: [meta node](#meta-node)

### metastore

Contains internal information about the status of the system.
The metastore contains the user information, databases, retention policies, shard metadata, continuous queries, and subscriptions.

Related entries: [database](/influxdb/v1.7/concepts/glossary/#database), [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp), [user](/influxdb/v1.7/concepts/glossary/#user)

### metric

Measurements gathered at regular time intervals.

### metric buffer - obsolete?

The metric buffer caches individual metrics when writes are failing for an output plugin.
Telegraf will attempt to flush the buffer upon a successful write to the output.
The oldest metrics are dropped first when this buffer fills.

Related entries: [output plugin](/telegraf/v1.10/concepts/glossary/#output-plugin)

### missing value

## N

### node

An independent `influxd` process.

Related entries: [server](/influxdb/v1.7/concepts/glossary/#server)

### now()

The local server's nanosecond timestamp.

### null

## O

### operator

### option

### option assignment

### organization

### output plugin 

Output plugins deliver metrics to their configured destination. In order to activate an output plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [flush interval](/telegraf/v1.10/concepts/glossary/#flush-interval), [input plugin](/telegraf/v1.10/concepts/glossary/#input-plugin), [processor plugin](/telegraf/v1.10/concepts/glossary/#processor-plugin)

## P

### parameter

### pipe

### pipe-forward operator

### point

The part of InfluxDB's data structure that consists of a single collection of fields in a series.
Each point is uniquely identified by its series and timestamp.

You cannot store more than one point with the same timestamp in the same series.
Instead, when you write a new point to the same series with the same timestamp as an existing point in that series, the field set becomes the union of the old field set and the new field set, where any ties go to the new field set.
For an example, see [Frequently Asked Questions](/influxdb/v1.7/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points).

Related entries: [field set](/influxdb/v1.7/concepts/glossary/#field-set), [series](/influxdb/v1.7/concepts/glossary/#series), [timestamp](/influxdb/v1.7/concepts/glossary/#timestamp)

## points per second - in 1.x - obsolete?

A deprecated measurement of the rate at which data are persisted to InfluxDB.
The schema allows and even encourages the recording of multiple metric values per point, rendering points per second ambiguous.

Write speeds are generally quoted in values per second, a more precise metric.

Related entries: [point](/influxdb/v1.7/concepts/glossary/#point), [schema](/influxdb/v1.7/concepts/glossary/#schema), [values per second](/influxdb/v1.7/concepts/glossary/#values-per-second)

### precision 

The precision configuration setting determines how much timestamp precision is retained in the points received from input plugins. All incoming timestamps are truncated to the given precision.
Telegraf then pads the truncated timestamps with zeros to create a nanosecond timestamp; output plugins will emit timestamps in nanoseconds.
Valid precisions are `ns`, `us` or `µs`, `ms`, and `s`.

For example, if the precision is set to `ms`, the nanosecond epoch timestamp `1480000000123456789` would be truncated to `1480000000123` in millisecond precision and then padded with zeroes to make a new, less precise nanosecond timestamp of `1480000000123000000`.
Output plugins do not alter the timestamp further. The precision setting is ignored for service input plugins.

Related entries:  [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.10/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.10/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.10/concepts/glossary/#processor-plugin), [service input plugin](/telegraf/v1.10/concepts/glossary/#service-input-plugin)

### process

### processor plugin

Processor plugins transform, decorate, and filter metrics collected by input plugins, passing the transformed metrics to the output plugins.

Related entries: [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.10/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.10/concepts/glossary/#output-plugin)

### Prometheus format

## Q

### query

An operation that retrieves data from InfluxDB.
See [Data Exploration](/influxdb/v1.7/query_language/data_exploration/), [Schema Exploration](/influxdb/v1.7/query_language/schema_exploration/), [Database Management](/influxdb/v1.7/query_language/database_management/).

## R

### REPL

### record

### regular expressions

### replication factor (RF) - e

The attribute of the retention policy that determines how many copies of the
data are stored in the cluster.
InfluxDB replicates data across `N` data nodes, where `N` is the replication
factor.

<dt> Replication factors are not relevant for single node instances.
</dt> - obsolete?

To maintain data availability for queries, the replication factor should be less
than or equal to the number of data nodes in the cluster:

* Data is fully available when the replication factor is greater than the
number of unavailable data nodes.
* Data may be unavailable when the replication factor is less than the number of
unavailable data nodes.

Any replication factor greater than two gives you additional fault tolerance and
query capacity within the cluster.

Related entries: [duration](/influxdb/v1.7/concepts/glossary/#duration), [node](/influxdb/v1.7/concepts/glossary/#node), [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp) - obsolete?

### retention policy (RP)

The part of InfluxDB's data structure that describes for how long InfluxDB keeps data (duration), how many copies of this data is stored in the cluster (replication factor), and the time range covered by shard groups (shard group duration).
RPs are unique per database and along with the measurement and tag set define a series.

When you create a database, InfluxDB automatically creates a retention policy called `autogen` with an infinite duration, a replication factor set to one, and a shard group duration set to seven days.
See [Database Management](/influxdb/v1.7/query_language/database_management/#retention-policy-management) for retention policy management.

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

Related entries: [duration](/influxdb/v1.7/concepts/glossary/#duration), [measurement](/influxdb/v1.7/concepts/glossary/#measurement), [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor), [series](/influxdb/v1.7/concepts/glossary/#series), [shard duration](/influxdb/v1.7/concepts/glossary/#shard-duration), [tag set](/influxdb/v1.7/concepts/glossary/#tag-set)

## S

### schema

How the data are organized in InfluxDB.
The fundamentals of the InfluxDB schema are databases, retention policies, series, measurements, tag keys, tag values, and field keys.
See [Schema Design](/influxdb/v1.7/concepts/schema_and_data_layout/) for more information.

Related entries: [database](/influxdb/v1.7/concepts/glossary/#database), [field key](/influxdb/v1.7/concepts/glossary/#field-key), [measurement](/influxdb/v1.7/concepts/glossary/#measurement), [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp), [series](/influxdb/v1.7/concepts/glossary/#series), [tag key](/influxdb/v1.7/concepts/glossary/#tag-key), [tag value](/influxdb/v1.7/concepts/glossary/#tag-value)

### scrape

### selector

An InfluxQL function that returns a single point from the range of specified points.
See [InfluxQL Functions](/influxdb/v1.7/query_language/functions/#selectors) for a complete list of the available and upcoming selectors.

Related entries: [aggregation](/influxdb/v1.7/concepts/glossary/#aggregation), [function](/influxdb/v1.7/concepts/glossary/#function), [transformation](/influxdb/v1.7/concepts/glossary/#transformation)

### series

The collection of data in InfluxDB's data structure that share a measurement, tag set, and retention policy.

> **Note:** The field set is not part of the series identification! - obsolete? remove ! 

Related entries: [field set](/influxdb/v1.7/concepts/glossary/#field-set), [measurement](/influxdb/v1.7/concepts/glossary/#measurement), [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp), [tag set](/influxdb/v1.7/concepts/glossary/#tag-set)- obsolete? 

### series cardinality

The number of unique database, measurement, tag set, and field key combinations in an InfluxDB instance.

For example, assume that an InfluxDB instance has a single database and one measurement.
The single measurement has two tag keys: `email` and `status`.
If there are three different `email`s, and each email address is associated with two
different `status`es then the series cardinality for the measurement is 6
(3 * 2 = 6):

| email                 | status |
| :-------------------- | :----- |
| lorr@influxdata.com | start  |
| lorr@influxdata.com | finish |
| marv@influxdata.com     | start  |
| marv@influxdata.com     | finish |
| cliff@influxdata.com | start  |
| cliff@influxdata.com | finish |

Note that, in some cases, simply performing that multiplication may overestimate series cardinality because of the presence of dependent tags.
Dependent tags are tags that are scoped by another tag and do not increase series
cardinality.
If we add the tag `firstname` to the example above, the series cardinality
would not be 18 (3 * 2 * 3 = 18).
It would remain unchanged at 6, as `firstname` is already scoped by the `email` tag:

| email                 | status | firstname |
| :-------------------- | :----- | :-------- |
| lorr@influxdata.com | start  | lorraine  |
| lorr@influxdata.com | finish | lorraine  |
| marv@influxdata.com     | start  | marvin      |
| marv@influxdata.com     | finish | marvin      |
| cliff@influxdata.com | start  | clifford  |
| cliff@influxdata.com | finish | clifford  |

See [SHOW CARDINALITY](/influxdb/v1.7/query_language/spec/#show-cardinality) to learn about the InfluxQL commands for series cardinality.

Related entries: [field key](#field-key),[measurement](#measurement), [tag key](#tag-key), [tag set](#tag-set)

### server

A machine, virtual or physical, that is running InfluxDB.
There should only be one InfluxDB process per server.

Related entries: [node](/influxdb/v1.7/concepts/glossary/#node)

### service

### service input plugin

Service input plugins are input plugins that run in a passive collection mode while the Telegraf agent is running.
They listen on a socket for known protocol inputs, or apply their own logic to ingested metrics before delivering them to the Telegraf agent.

Related entries: [aggregator plugin](/telegraf/v1.10/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.10/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.10/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.10/concepts/glossary/#processor-plugin)

### shard

A shard contains the actual encoded and compressed data, and is represented by a TSM file on disk.
Every shard belongs to one and only one shard group.
Multiple shards may exist in a single shard group.
Each shard contains a specific set of series.
All points falling on a given series in a given shard group will be stored in the same shard (TSM file) on disk.

Related entries: [series](/influxdb/v1.7/concepts/glossary/#series), [shard duration](/influxdb/v1.7/concepts/glossary/#shard-duration), [shard group](/influxdb/v1.7/concepts/glossary/#shard-group), [tsm](/influxdb/v1.7/concepts/glossary/#tsm-time-structured-merge-tree)

### shard duration

The shard duration determines how much time each shard group spans.
The specific interval is determined by the `SHARD DURATION` of the retention policy.
See [Retention Policy management](/influxdb/v1.7/query_language/database_management/#retention-policy-management) for more information.

For example, given a retention policy with `SHARD DURATION` set to `1w`, each shard group will span a single week and contain all points with timestamps in that week.

Related entries: [database](/influxdb/v1.7/concepts/glossary/#database), [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp), [series](/influxdb/v1.7/concepts/glossary/#series), [shard](/influxdb/v1.7/concepts/glossary/#shard), [shard group](/influxdb/v1.7/concepts/glossary/#shard-group)

### shard group

Shard groups are logical containers for shards.
Shard groups are organized by time and retention policy.
Every retention policy that contains data has at least one associated shard group.
A given shard group contains all shards with data for the interval covered by the shard group.
The interval spanned by each shard group is the shard duration.

Related entries: [database](/influxdb/v1.7/concepts/glossary/#database), [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp), [series](/influxdb/v1.7/concepts/glossary/#series), [shard](/influxdb/v1.7/concepts/glossary/#shard), [shard duration](/influxdb/v1.7/concepts/glossary/#shard-duration)

### Single Stat

### Snappy compression

### source

### stacked graph

### statement

### step-plot

### stream

"stream of tables"

### string

### subscription

Subscriptions allow [Kapacitor](/kapacitor/latest/) to receive data from InfluxDB in a push model rather than the pull model based on querying data.
When Kapacitor is configured to work with InfluxDB, the subscription will automatically push every write for the subscribed database from InfluxDB to Kapacitor.
Subscriptions can use TCP or UDP for transmitting the writes.

## T

### TCP

### TSL

### TSM (Time-structured merge tree)

### TSM file

### table

### tag

The key-value pair in InfluxDB's data structure that records metadata.
Tags are an optional part of InfluxDB's data structure but they are useful for storing commonly-queried metadata; tags are indexed so queries on tags are performant.
*Query tip:* Compare tags to fields; fields are not indexed.

Related entries: [field](/influxdb/v1.7/concepts/glossary/#field), [tag key](/influxdb/v1.7/concepts/glossary/#tag-key), [tag set](/influxdb/v1.7/concepts/glossary/#tag-set), [tag value](/influxdb/v1.7/concepts/glossary/#tag-value)

### tag key

The key part of the key-value pair that makes up a tag.
Tag keys are strings and they store metadata.
Tag keys are indexed so queries on tag keys are performant.

*Query tip:* Compare tag keys to field keys; field keys are not indexed.

Related entries: [field key](/influxdb/v1.7/concepts/glossary/#field-key), [tag](/influxdb/v1.7/concepts/glossary/#tag), [tag set](/influxdb/v1.7/concepts/glossary/#tag-set), [tag value](/influxdb/v1.7/concepts/glossary/#tag-value)

### tag set

The collection of tag keys and tag values on a point.

Related entries: [point](/influxdb/v1.7/concepts/glossary/#point), [series](/influxdb/v1.7/concepts/glossary/#series), [tag](/influxdb/v1.7/concepts/glossary/#tag), [tag key](/influxdb/v1.7/concepts/glossary/#tag-key), [tag value](/influxdb/v1.7/concepts/glossary/#tag-value)

### tag value

The value part of the key-value pair that makes up a tag.
Tag values are strings and they store metadata.
Tag values are indexed so queries on tag values are performant.

Related entries: [tag](/influxdb/v1.7/concepts/glossary/#tag), [tag key](/influxdb/v1.7/concepts/glossary/#tag-key), [tag set](/influxdb/v1.7/concepts/glossary/#tag-set)

### task

### Telegraf

### template

### template variable

### time (data type)

### time series data

Sequence of data points typically consisting of successive measurements made from the same source over a time interval.

Regular

graph somewhere one of the the one of the axes on your graph would always be time so one of the
dimensions of your data is always time. time matters and it changes over time so

data does not evolve over time or if you

don't care how your data evolves over
time it's probably not a time series use
case

### timestamp

The date and time associated with a point. Time in InfluxDB is UTC.

To specify time when writing data, see [Elements of line protocol](https://v2.docs.influxdata.com/v2.0/reference/line-protocol/#elements-of-line-protocol).
To specify time when querying data, see [Query InfluxDB with Flux](https://v2.docs.influxdata.com/v2.0/query-data/get-started/query-influxdb/#2-specify-a-time-range).

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

### variable

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

### windowing 

## X 


## Y


## Z

-->
