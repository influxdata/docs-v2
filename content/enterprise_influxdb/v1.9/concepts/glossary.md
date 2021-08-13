---
title: Glossary
description: Terms related to InfluxDB Enterprise.
aliases:
    - /enterprise/v1.8/concepts/glossary/
menu:
  enterprise_influxdb_1_9:
    weight: 20
    parent: Concepts
---

## data node

A node that runs the data service.

For high availability, installations must have at least two data nodes.
The number of data nodes in your cluster must be the same as your highest
replication factor.
Any replication factor greater than two gives you additional fault tolerance and
query capacity within the cluster.

Data node sizes will depend on your needs.
The Amazon EC2 m4.large or m4.xlarge are good starting points.

Related entries: [data service](#data-service), [replication factor](#replication-factor)

## data service

Stores all time series data and handles all writes and queries.

Related entries: [data node](#data-node)

## meta node

A node that runs the meta service.

For high availability, installations must have three meta nodes.
Meta nodes can be very modestly sized instances like an EC2 t2.micro or even a
nano.
For additional fault tolerance installations may use five meta nodes; the
number of meta nodes must be an odd number.

Related entries: [meta service](#meta-service)

## meta service

The consistent data store that keeps state about the cluster, including which
servers, databases, users, continuous queries, retention policies, subscriptions,
and blocks of time exist.

Related entries: [meta node](#meta-node)

## replication factor

The attribute of the retention policy that determines how many copies of the
data are stored in the cluster.
InfluxDB replicates data across `N` data nodes, where `N` is the replication
factor.

To maintain data availability for queries, the replication factor should be less
than or equal to the number of data nodes in the cluster:

* Data is fully available when the replication factor is greater than the
number of unavailable data nodes.
* Data may be unavailable when the replication factor is less than the number of
unavailable data nodes.

Any replication factor greater than two gives you additional fault tolerance and
query capacity within the cluster.

## web console

Legacy user interface for the InfluxDB Enterprise.

This has been deprecated and the suggestion is to use [Chronograf](/{{< latest "chronograf" >}}/introduction/).

If you are transitioning from the Enterprise Web Console to Chronograf, see how to [transition from the InfluxDB Web Admin Interface](/chronograf/v1.7/guides/transition-web-admin-interface/).

<!-- --- -->

## aggregation

An InfluxQL function that returns an aggregated value across a set of points.
For a complete list of the available and upcoming aggregations, see [InfluxQL functions](/enterprise_influxdb/v1.9/query_language/functions/#aggregations).

Related entries: [function](#function), [selector](#selector), [transformation](#transformation)

## batch

A collection of data points in InfluxDB line protocol format, separated by newlines (`0x0A`).
A batch of points may be submitted to the database using a single HTTP request to the write endpoint.
This makes writes using the InfluxDB API much more performant by drastically reducing the HTTP overhead.
InfluxData recommends batch sizes of 5,000-10,000 points, although different use cases may be better served by significantly smaller or larger batches.

Related entries: [InfluxDB line protocol](#influxdb-line-protocol), [point](#point)

## bucket

A bucket is a named location where time series data is stored in **InfluxDB 2.0**. In InfluxDB 1.8+, each combination of a database and a retention policy (database/retention-policy) represents a bucket. Use the [InfluxDB 2.0 API compatibility endpoints](/enterprise_influxdb/v1.9/tools/api#influxdb-2-0-api-compatibility-endpoints) included with InfluxDB 1.8+ to interact with buckets.

## continuous query (CQ)

An InfluxQL query that runs automatically and periodically within a database.
Continuous queries require a function in the `SELECT` clause and must include a `GROUP BY time()` clause.
See [Continuous Queries](/enterprise_influxdb/v1.9/query_language/continuous_queries/).


Related entries: [function](#function)

## database

A logical container for users, retention policies, continuous queries, and time series data.

Related entries: [continuous query](#continuous-query-cq), [retention policy](#retention-policy-rp), [user](#user)

## duration

The attribute of the retention policy that determines how long InfluxDB stores data.
Data older than the duration are automatically dropped from the database.
See [Database Management](/enterprise_influxdb/v1.9/query_language/manage-database/#create-retention-policies-with-create-retention-policy) for how to set duration.

Related entries: [retention policy](#retention-policy-rp)

## field

The key-value pair in an InfluxDB data structure that records metadata and the actual data value.
Fields are required in InfluxDB data structures and they are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant relative to tags.

*Query tip:* Compare fields to tags; tags are indexed.

Related entries: [field key](#field-key), [field set](#field-set), [field value](#field-value), [tag](#tag)

## field key

The key part of the key-value pair that makes up a field.
Field keys are strings and they store metadata.

Related entries: [field](#field), [field set](#field-set), [field value](#field-value), [tag key](#tag-key)

## field set

The collection of field keys and field values on a point.

Related entries: [field](#field), [field key](#field-key), [field value](#field-value), [point](#point)

## field value

The value part of the key-value pair that makes up a field.
Field values are the actual data; they can be strings, floats, integers, or booleans.
A field value is always associated with a timestamp.

Field values are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [field](#field), [field key](#field-key), [field set](#field-set), [tag value](#tag-value), [timestamp](#timestamp)

## function

InfluxQL aggregations, selectors, and transformations.
See [InfluxQL Functions](/enterprise_influxdb/v1.9/query_language/functions/) for a complete list of InfluxQL functions.

Related entries: [aggregation](#aggregation), [selector](#selector), [transformation](#transformation)

<!--
## grant
-->
## identifier

Tokens that refer to continuous query names, database names, field keys,
measurement names, retention policy names, subscription names, tag keys, and
user names.
See [Query Language Specification](/enterprise_influxdb/v1.9/query_language/spec/#identifiers).

Related entries:
[database](#database),
[field key](#field-key),
[measurement](#measurement),
[retention policy](#retention-policy-rp),
[tag key](#tag-key),
[user](#user)

## InfluxDB line protocol

The text based format for writing points to InfluxDB. See [InfluxDB line protocol](/enterprise_influxdb/v1.9/write_protocols/).

## measurement

The part of the InfluxDB data structure that describes the data stored in the associated fields.
Measurements are strings.

Related entries: [field](#field), [series](#series)

## metastore

Contains internal information about the status of the system.
The metastore contains the user information, databases, retention policies, shard metadata, continuous queries, and subscriptions.

Related entries: [database](#database), [retention policy](#retention-policy-rp), [user](#user)

<!--
## permission
-->
## node

An independent `influxd` process.

Related entries: [server](#server)

## now()

The local server's nanosecond timestamp.

## point

In InfluxDB, a point represents a single data record, similar to a row in a SQL database table. Each point:

- has a measurement, a tag set, a field key, a field value, and a timestamp;
- is uniquely identified by its series and timestamp.

You cannot store more than one point with the same timestamp in a series.
If you write a point to a series with a timestamp that matches an existing point, the field set becomes a union of the old and new field set, and any ties go to the new field set.
For more information about duplicate points, see [How does InfluxDB handle duplicate points?](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points)

Related entries: [field set](#field-set), [series](#series), [timestamp](#timestamp)

## points per second

A deprecated measurement of the rate at which data are persisted to InfluxDB.
The schema allows and even encourages the recording of multiple metric values per point, rendering points per second ambiguous.

Write speeds are generally quoted in values per second, a more precise metric.

Related entries: [point](#point), [schema](#schema), [values per second](#values-per-second)

## query

An operation that retrieves data from InfluxDB.
See [Data Exploration](/enterprise_influxdb/v1.9/query_language/explore-data/), [Schema Exploration](/enterprise_influxdb/v1.9/query_language/explore-schema/), [Database Management](/enterprise_influxdb/v1.9/query_language/manage-database/).

## replication factor  

The attribute of the retention policy that determines how many copies of data to concurrently store (or retain) in the cluster. Replicating copies ensures that data is available when a data node (or more) is unavailable.

For three nodes or less, the default replication factor equals the number of data nodes.
For more than three nodes, the default replication factor is 3. To change the default replication factor, specify the replication factor `n` in the retention policy.

Related entries: [duration](#duration), [node](#node),
[retention policy](#retention-policy-rp)

## retention policy (RP)

Describes how long InfluxDB keeps data (duration), how many copies of the data to store in the cluster (replication factor), and the time range covered by shard groups (shard group duration). RPs are unique per database and along with the measurement and tag set define a series.

When you create a database, InfluxDB creates a retention policy called `autogen` with an infinite duration, a replication factor set to one, and a shard group duration set to seven days.
For more information, see [Retention policy management](/enterprise_influxdb/v1.9/query_language/manage-database/#retention-policy-management).

Related entries: [duration](#duration), [measurement](#measurement), [replication factor](#replication-factor), [series](#series), [shard duration](#shard-duration), [tag set](#tag-set)

<!--
## role
  -->
## schema

How the data are organized in InfluxDB.
The fundamentals of the InfluxDB schema are databases, retention policies, series, measurements, tag keys, tag values, and field keys.
See [Schema Design](/enterprise_influxdb/v1.9/concepts/schema_and_data_layout/) for more information.

Related entries: [database](#database), [field key](#field-key), [measurement](#measurement), [retention policy](#retention-policy-rp), [series](#series), [tag key](#tag-key), [tag value](#tag-value)

## selector

An InfluxQL function that returns a single point from the range of specified points.
See [InfluxQL Functions](/enterprise_influxdb/v1.9/query_language/functions/#selectors) for a complete list of the available and upcoming selectors.

Related entries: [aggregation](#aggregation), [function](#function), [transformation](#transformation)

## series

A logical grouping of data defined by shared measurement, tag set, and field key.

Related entries: [field set](#field-set), [measurement](#measurement), [tag set](#tag-set)

## series cardinality

The number of unique database, measurement, tag set, and field key combinations in an InfluxDB instance.

For example, assume that an InfluxDB instance has a single database and one measurement.
The single measurement has two tag keys: `email` and `status`.
If there are three different `email`s, and each email address is associated with two
different `status`es then the series cardinality for the measurement is 6
(3 * 2 = 6):

| email                 | status |
| :-------------------- | :----- |
| lorr@influxdata.com   | start  |
| lorr@influxdata.com   | finish |
| marv@influxdata.com   | start  |
| marv@influxdata.com   | finish |
| cliff@influxdata.com  | start  |
| cliff@influxdata.com  | finish |

Note that, in some cases, simply performing that multiplication may overestimate series cardinality because of the presence of dependent tags.
Dependent tags are tags that are scoped by another tag and do not increase series
cardinality.
If we add the tag `firstname` to the example above, the series cardinality
would not be 18 (3 * 2 * 3 = 18).
It would remain unchanged at 6, as `firstname` is already scoped by the `email` tag:

| email                 | status | firstname |
| :-------------------- | :----- | :-------- |
| lorr@influxdata.com   | start  | lorraine  |
| lorr@influxdata.com   | finish | lorraine  |
| marv@influxdata.com   | start  | marvin    |
| marv@influxdata.com   | finish | marvin    |
| cliff@influxdata.com  | start  | clifford  |
| cliff@influxdata.com  | finish | clifford  |

See [SHOW CARDINALITY](/enterprise_influxdb/v1.9/query_language/spec/#show-cardinality) to learn about the InfluxQL commands for series cardinality.

Related entries: [field key](#field-key),[measurement](#measurement), [tag key](#tag-key), [tag set](#tag-set)

## series key

A series key identifies a particular series by measurement, tag set, and field key.

For example:

```
# measurement, tag set, field key
h2o_level, location=santa_monica, h2o_feet
```

Related entries: [series](#series)

## server

A machine, virtual or physical, that is running InfluxDB.
There should only be one InfluxDB process per server.

Related entries: [node](#node)

## shard

A shard contains the actual encoded and compressed data, and is represented by a TSM file on disk.
Every shard belongs to one and only one shard group.
Multiple shards may exist in a single shard group.
Each shard contains a specific set of series.
All points falling on a given series in a given shard group will be stored in the same shard (TSM file) on disk.

Related entries: [series](#series), [shard duration](#shard-duration), [shard group](#shard-group), [tsm](#tsm-time-structured-merge-tree)

## shard duration

The shard duration determines how much time each shard group spans.
The specific interval is determined by the `SHARD DURATION` of the retention policy.
See [Retention Policy management](/enterprise_influxdb/v1.9/query_language/manage-database/#retention-policy-management) for more information.

For example, given a retention policy with `SHARD DURATION` set to `1w`, each shard group will span a single week and contain all points with timestamps in that week.

Related entries: [database](#database), [retention policy](#retention-policy-rp), [series](#series), [shard](#shard), [shard group](#shard-group)

## shard group

Shard groups are logical containers for shards.
Shard groups are organized by time and retention policy.
Every retention policy that contains data has at least one associated shard group.
A given shard group contains all shards with data for the interval covered by the shard group.
The interval spanned by each shard group is the shard duration.

Related entries: [database](#database), [retention policy](#retention-policy-rp), [series](#series), [shard](#shard), [shard duration](#shard-duration)

## subscription

Subscriptions allow [Kapacitor](/{{< latest "kapacitor" >}}/) to receive data from InfluxDB in a push model rather than the pull model based on querying data.
When Kapacitor is configured to work with InfluxDB, the subscription will automatically push every write for the subscribed database from InfluxDB to Kapacitor.
Subscriptions can use TCP or UDP for transmitting the writes.

## tag

The key-value pair in the InfluxDB data structure that records metadata.
Tags are an optional part of the data structure, but they are useful for storing commonly-queried metadata; tags are indexed so queries on tags are performant.
*Query tip:* Compare tags to fields; fields are not indexed.

Related entries: [field](#field), [tag key](#tag-key), [tag set](#tag-set), [tag value](#tag-value)

## tag key

The key part of the key-value pair that makes up a tag.
Tag keys are strings and they store metadata.
Tag keys are indexed so queries on tag keys are performant.

*Query tip:* Compare tag keys to field keys; field keys are not indexed.

Related entries: [field key](#field-key), [tag](#tag), [tag set](#tag-set), [tag value](#tag-value)

## tag set

The collection of tag keys and tag values on a point.

Related entries: [point](#point), [series](#series), [tag](#tag), [tag key](#tag-key), [tag value](#tag-value)

## tag value

The value part of the key-value pair that makes up a tag.
Tag values are strings and they store metadata.
Tag values are indexed so queries on tag values are performant.


Related entries: [tag](#tag), [tag key](#tag-key), [tag set](#tag-set)

## timestamp

The date and time associated with a point.
All time in InfluxDB is UTC.

For how to specify time when writing data, see [Write Syntax](/enterprise_influxdb/v1.9/write_protocols/write_syntax/).
For how to specify time when querying data, see [Data Exploration](/enterprise_influxdb/v1.9/query_language/explore-data/#time-syntax).

Related entries: [point](#point)

## transformation

An InfluxQL function that returns a value or a set of values calculated from specified points, but does not return an aggregated value across those points.
See [InfluxQL Functions](/enterprise_influxdb/v1.9/query_language/functions/#transformations) for a complete list of the available and upcoming aggregations.

Related entries: [aggregation](#aggregation), [function](#function), [selector](#selector)

## TSM (Time Structured Merge tree)

The purpose-built data storage format for InfluxDB. TSM allows for greater compaction and higher write and read throughput than existing B+ or LSM tree implementations. See [Storage Engine](/enterprise_influxdb/v1.9/concepts/storage_engine/) for more.

## user

There are three kinds of users in InfluxDB Enterprise:

* *Global admin users* have all permissions.
* *Admin users* have `READ` and `WRITE` access to all databases and full access to administrative queries and user management commands.
* *Non-admin users* have `READ`, `WRITE`, or `ALL` (both `READ` and `WRITE`) access per database.

When authentication is enabled, InfluxDB only executes HTTP requests that are sent with a valid username and password.
See [Authentication and Authorization](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/).

## values per second

The preferred measurement of the rate at which data are persisted to InfluxDB. Write speeds are generally quoted in values per second.

To calculate the values per second rate, multiply the number of points written per second by the number of values stored per point. For example, if the points have four fields each, and a batch of 5000 points is written 10 times per second, then the values per second rate is `4 field values per point * 5000 points per batch * 10 batches per second = 200,000 values per second`.

Related entries: [batch](#batch), [field](#field), [point](#point), [points per second](#points-per-second)

## WAL (Write Ahead Log)

The temporary cache for recently written points. To reduce the frequency with which the permanent storage files are accessed, InfluxDB caches new points in the WAL until their total size or age triggers a flush to more permanent storage. This allows for efficient batching of the writes into the TSM.

Points in the WAL can be queried, and they persist through a system reboot. On process start, all points in the WAL must be flushed before the system accepts new writes.

Related entries: [tsm](#tsm-time-structured-merge-tree)

<!--



## shard

## shard group
-->
