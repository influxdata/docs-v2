---
title: InfluxDB schema design and data layout
description: >
  General guidelines for InfluxDB schema design and data layout.
menu:
  enterprise_influxdb_v1:
    name: Schema design and data layout
    weight: 50
    parent: Concepts
---

Each InfluxDB use case is unique and your [schema](/enterprise_influxdb/v1/concepts/glossary/#schema) reflects that uniqueness.
In general, a schema designed for querying leads to simpler and more performant queries.
We recommend the following design guidelines for most use cases:

  - [Where to store data (tag or field)](#where-to-store-data-tag-or-field)
  - [Avoid too many series](#avoid-too-many-series)
  - [Use recommended naming conventions](#use-recommended-naming-conventions)
  - [Shard Group Duration Management](#shard-group-duration-management)

## Where to store data (tag or field)

Your queries should guide what data you store in [tags](/enterprise_influxdb/v1/concepts/glossary/#tag) and what you store in [fields](/enterprise_influxdb/v1/concepts/glossary/#field) :

- Store commonly queried and grouping ([`group()`](/flux/v0/stdlib/universe/group) or [`GROUP BY`](/enterprise_influxdb/v1/query_language/explore-data/#group-by-tags)) metadata in tags.
- Store data in fields if each data point contains a different value.
- Store numeric values as fields ([tag values](/enterprise_influxdb/v1/concepts/glossary/#tag-value) only support string values).

## Avoid too many series

IndexDB indexes the following data elements to speed up reads:

- [measurement](/enterprise_influxdb/v1/concepts/glossary/#measurement)
- [tags](/enterprise_influxdb/v1/concepts/glossary/#tag)

[Tag values](/enterprise_influxdb/v1/concepts/glossary/#tag-value) are indexed and [field values](/enterprise_influxdb/v1/concepts/glossary/#field-value) are not.
This means that querying by tags is more performant than querying by fields.
However, when too many indexes are created, both writes and reads may start to slow down.

Each unique set of indexed data elements forms a [series key](/enterprise_influxdb/v1/concepts/glossary/#series-key).
[Tags](/enterprise_influxdb/v1/concepts/glossary/#tag) containing highly variable information like unique IDs, hashes, and random strings lead to a large number of [series](/enterprise_influxdb/v1/concepts/glossary/#series), also known as high [series cardinality](/enterprise_influxdb/v1/concepts/glossary/#series-cardinality).
High series cardinality is a primary driver of high memory usage for many database workloads.
Therefore, to reduce memory consumption, consider storing high-cardinality values in field values rather than in tags or field keys.

{{% note %}}

If reads and writes to InfluxDB start to slow down, you may have high series cardinality (too many series).
See [how to find and reduce high series cardinality](/enterprise_influxdb/v1/troubleshooting/frequently-asked-questions/#why-does-series-cardinality-matter).

{{% /note %}}

## Use recommended naming conventions

Use the following conventions when naming your tag and field keys:

- [Avoid reserved keywords in tag and field keys](#avoid-reserved-keywords-in-tag-and-field-keys)
- [Avoid the same tag and field name](#avoid-the-same-name-for-a-tag-and-a-field)
- [Avoid encoding data in measurements and keys](#avoid-encoding-data-in-measurements-and-keys)
- [Avoid more than one piece of information in one tag](#avoid-putting-more-than-one-piece-of-information-in-one-tag)

### Avoid reserved keywords in tag and field keys

Not required, but avoiding the use of reserved keywords in your tag keys and field keys simplifies writing queries because you won't have to wrap your keys in double quotes.
See [InfluxQL](https://github.com/influxdata/influxql/blob/master/README.md#keywords) and  [Flux keywords](/flux/v0/spec/lexical-elements/#keywords) to avoid.

Also, if a tag key or field key contains characters other than `[A-z,_]`, you must wrap it in double quotes in InfluxQL or use [bracket notation](/flux/v0/data-types/composite/record/#bracket-notation) in Flux.

### Avoid the same name for a tag and a field

Avoid using the same name for a tag and field key.
This often results in unexpected behavior when querying data.

If you inadvertently add the same name for a tag and a field, see
[Frequently asked questions](/enterprise_influxdb/v1/troubleshooting/frequently-asked-questions/#tag-and-field-key-with-the-same-name)
for information about how to query the data predictably and how to fix the issue.

### Avoid encoding data in measurements and keys

Store data in [tag values](/enterprise_influxdb/v1/concepts/glossary/#tag-value) or [field values](/enterprise_influxdb/v1/concepts/glossary/#field-value), not in [tag keys](/enterprise_influxdb/v1/concepts/glossary/#tag-key), [field keys](/enterprise_influxdb/v1/concepts/glossary/#field-key), or [measurements](/enterprise_influxdb/v1/concepts/glossary/#measurement). If you design your schema to store data in tag and field values,
your queries will be easier to write and more efficient.

In addition, you'll keep cardinality low by not creating measurements and keys as you write data.
To learn more about the performance impact of high series cardinality, see [how to find and reduce high series cardinality](/enterprise_influxdb/v1/troubleshooting/frequently-asked-questions/#why-does-series-cardinality-matter).

#### Compare schemas

Compare the following valid schemas represented by line protocol.

**Recommended**: the following schema stores metadata in separate `crop`, `plot`, and `region` tags. The `temp` field contains variable numeric data.

#####  {id="good-measurements-schema"}
```
Good Measurements schema - Data encoded in tags (recommended)
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

**Not recommended**: the following schema stores multiple attributes (`crop`, `plot` and `region`) concatenated  (`blueberries.plot-1.north`) within the measurement, similar to Graphite metrics.

#####  {id="bad-measurements-schema"}
```
Bad Measurements schema - Data encoded in the measurement (not recommended)
-------------
blueberries.plot-1.north temp=50.1 1472515200000000000
blueberries.plot-2.midwest temp=49.8 1472515200000000000
```

**Not recommended**: the following schema stores multiple attributes (`crop`, `plot` and `region`) concatenated  (`blueberries.plot-1.north`) within the field key.

#####  {id="bad-keys-schema"}
```
Bad Keys schema - Data encoded in field keys (not recommended)
-------------
weather_sensor blueberries.plot-1.north.temp=50.1 1472515200000000000
weather_sensor blueberries.plot-2.midwest.temp=49.8 1472515200000000000
```

#### Compare queries

Compare the following queries of the [_Good Measurements_](#good-measurements-schema) and [_Bad Measurements_](#bad-measurements-schema) schemas.
The [Flux](/flux/v0/) queries calculate the average `temp` for blueberries in the `north` region

**Easy to query**: [_Good Measurements_](#good-measurements-schema) data is easily filtered by `region` tag values--for example:

```js
// Query *Good Measurements*, data stored in separate tags (recommended)
from(bucket: "<database>/<retention_policy>")
    |> range(start:2016-08-30T00:00:00Z)
    |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
    |> mean()
```

**Difficult to query**: [_Bad Measurements_](#bad-measurements-schema) requires regular expressions to extract `plot` and `region` from the measurement--for example:

```js
// Query *Bad Measurements*, data encoded in the measurement (not recommended)
from(bucket: "<database>/<retention_policy>")
    |> range(start:2016-08-30T00:00:00Z)
    |> filter(fn: (r) =>  r._measurement =~ /\.north$/ and r._field == "temp")
    |> mean()
```

Complex measurements make some queries impossible. For example, calculating the average temperature of both plots is not possible with the [_Bad Measurements_](#bad-measurements-schema) schema.


##### InfluxQL example to query schemas

```
# Query *Bad Measurements*, data encoded in the measurement (not recommended)
> SELECT mean("temp") FROM /\.north$/

# Query *Good Measurements*, data stored in separate tag values (recommended)
> SELECT mean("temp") FROM "weather_sensor" WHERE "region" = 'north'
```

### Avoid putting more than one piece of information in one tag

Splitting a single tag with multiple pieces into separate tags simplifies your queries and improves performance by
 reducing the need for regular expressions.

Consider the following schema represented by line protocol.

#### Example line protocol schemas

```
Schema 1 - Multiple data encoded in a single tag
-------------
weather_sensor,crop=blueberries,location=plot-1.north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,location=plot-2.midwest temp=49.8 1472515200000000000
```

The Schema 1 data encodes multiple separate parameters, the `plot` and `region` into a long tag value (`plot-1.north`).
Compare this to the following schema represented in line protocol.

```
Schema 2 - Data encoded in multiple tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

Use Flux or InfluxQL to calculate the average `temp` for blueberries in the `north` region.
Schema 2 is preferable because using multiple tags, you don't need a regular expression.

#### Flux example to query schemas

```js
// Schema 1 -  Query for multiple data encoded in a single tag
from(bucket:"<database>/<retention_policy>")
    |> range(start:2016-08-30T00:00:00Z)
    |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.location =~ /\.north$/ and r._field == "temp")
    |> mean()

// Schema 2 - Query for data encoded in multiple tags
from(bucket:"<database>/<retention_policy>")
    |> range(start:2016-08-30T00:00:00Z)
    |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
    |> mean()
```

#### InfluxQL example to query schemas

```
# Schema 1 - Query for multiple data encoded in a single tag
> SELECT mean("temp") FROM "weather_sensor" WHERE location =~ /\.north$/

# Schema 2 - Query for data encoded in multiple tags
> SELECT mean("temp") FROM "weather_sensor" WHERE region = 'north'
```

## Shard group duration management

### Shard group duration overview

InfluxDB stores data in shard groups.
Shard groups are organized by [retention policy](/enterprise_influxdb/v1/concepts/glossary/#retention-policy-rp) (RP) and store data with timestamps that fall within a specific time interval called the [shard duration](/enterprise_influxdb/v1/concepts/glossary/#shard-duration).

If no shard group duration is provided, the shard group duration is determined by the RP [duration](/enterprise_influxdb/v1/concepts/glossary/#duration) at the time the RP is created. The default values are:

| RP Duration  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The shard group duration is also configurable per RP.
To configure the shard group duration, see [Retention Policy Management](/enterprise_influxdb/v1/query_language/manage-database/#retention-policy-management).

### Shard group duration tradeoffs

Determining the optimal shard group duration requires finding the balance between:

- Better overall performance with longer shards
- Flexibility provided by shorter shards

#### Long shard group duration

Longer shard group durations let InfluxDB store more data in the same logical location.
This reduces data duplication, improves compression efficiency, and improves query speed in some cases.

#### Short shard group duration

Shorter shard group durations allow the system to more efficiently drop data and record incremental backups.
When InfluxDB enforces an RP it drops entire shard groups, not individual data points, even if the points are older than the RP duration.
A shard group is only removed once a shard group's duration *end time* is older than the RP duration.

For example, if your RP has a duration of one day, InfluxDB drops an hour's worth of data every hour and always maintains 25 shard groups.
One for each hour in the day, and an extra shard group that is partially expiring, but isn't removed until the whole shard group is older than 24 hours.

>**Note:** A special use case to consider: filtering queries on schema data (such as tags, series, measurements) by time. For example, if you want to filter schema data within a one hour interval, you must set the shard group duration to `1h`. For more information, see [filter schema data by time](/enterprise_influxdb/v1/query_language/explore-schema/#filter-meta-queries-by-time).

### Shard group duration recommendations

The default shard group durations work well for most cases. However, high-throughput or long-running instances will benefit from using longer shard group durations.
Here are some recommendations for longer shard group durations:

| RP Duration  | Shard Group Duration  |
|---|---|
| <= 1 day  | 6 hours  |
| > 1 day and <= 7 days  | 1 day  |
| > 7 days and <= 3 months  | 7 days  |
| > 3 months  | 30 days  |
| infinite  | 52 weeks or longer  |

> **Note:** Note that `INF` (infinite) is not a [valid shard group duration](/enterprise_influxdb/v1/query_language/manage-database/#retention-policy-management).

Longer shard durations may be appropriate for some use cases (for example, [backfilling](#shard-group-duration-for-backfilling)), however updates and deletes to larger shards incur higher costs for recompaction.

Other factors to consider before setting shard group duration:

* Shard groups should be twice as long as the longest time range of the most frequent queries
* Shard groups should each contain more than 100,000 [points](/enterprise_influxdb/v1/concepts/glossary/#point) per shard group
* Shard groups should each contain more than 1,000 points per [series](/enterprise_influxdb/v1/concepts/glossary/#series)

#### Shard group duration for backfilling

Bulk insertion of historical data covering a large time range in the past triggers the creation of a large number of shards at once.
The concurrent access and overhead of writing to hundreds or thousands of shards can quickly lead to slow performance and memory exhaustion.

When writing historical data, set a longer shard group duration so that InfluxDB creates fewer shards.
Typically, a shard group duration of 30 days works well for backfilling, however consider whether the shards are likely to be affected by backfills again in the future.
A longer shard duration makes backfilling a data set more efficient the first time, but makes subsequent backfills of the shard more expensive.
If you expect a shard to require multiple backfills, updates, or deletes, then a slightly shorter duration may be preferable to reduce the resource cost of shard recompaction.
