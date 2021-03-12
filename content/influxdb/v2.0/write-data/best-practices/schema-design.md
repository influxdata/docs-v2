---
title: InfluxDB schema design
description: >
  Improve InfluxDB schema design and data layout to reduce high cardinality and make your data more performant.
menu:
  influxdb_2_0:
    name: Schema design
    weight: 201
    parent: write-best-practices
---

Each InfluxDB use case is unique and your [schema](/influxdb/v2.0/reference/glossary/#schema) design reflects the uniqueness. We recommend the following design guidelines for most use cases:

- [Where to store data (tag or field)](#where-to-store-data-tags-or-fields)
- [Avoid too many series](#avoid-too-many-series)
- [Use recommended naming conventions](#use-recommended-naming-conventions)
<!-- - [Recommendations for managing shard group duration](#shard-group-duration-management)
-->

{{% note %}}
Follow these guidelines to minimize high series cardinality and make your data more performant.
{{% /note %}}

## Where to store data (tag or field)

[Tags](/influxdb/v2.0/reference/glossary/#tag) are indexed and [fields](/influxdb/v2.0/reference/glossary/#field) are not.
This means that querying by tags is more performant than querying by fields.

In general, your queries should guide what gets stored as a tag and what gets stored as a field:

- Store commonly-queried meta data in tags.
- Store data in fields if each data point contains a different value.
- Store numeric values as fields ([tag values](/influxdb/v2.0/reference/glossary/#tag-value) only support string values).

## Avoid too many series

[Tags](/influxdb/v2.0/reference/glossary/#tag) containing highly variable information like unique IDs, hashes, and random strings lead to a large number of [series](/influxdb/v2.0/reference/glossary/#series), also known as high [series cardinality](/influxdb/v2.0/reference/glossary/#series-cardinality).

High series cardinality is a primary driver of high memory usage for many database workloads.
InfluxDB uses measurements and tags to create indexes and speed up reads. However, when too many indexes created, both writes and reads may start to slow down. Therefore, if a system has memory constraints, consider storing high-cardinality data as a field rather than a tag.

{{% note %}}
If reads and writes to InfluxDB start to slow down, you may have high series cardinality (too many series). See how to [resolve high cardinality](/influxdb/v2.0/write-data/best-practices/resolve-high-cardinality/).
{{% /note %}}

## Use recommended naming conventions

Use the following conventions when naming your tag and field keys:

- [Avoid keywords in tag and field names](#avoid-keywords-as-tag-or-field-names)
- [Avoid the same tag and field name](#avoid-the-same-name-for-a-tag-and-a-field)
- [Avoid encoding data in measurement names](#avoid-encoding-data-in-measurement-names)
- [Avoid more than one piece of information in one tag](#avoid-putting-more-than-one-piece-of-information-in-one-tag)

### Avoid keywords as tag or field names

Not required, but simplifies writing queries because you won't have to wrap tag or field names in double quotes.
See [Flux keywords](/influxdb/v2.0/reference/flux/language/lexical-elements/#keywords) to avoid.

Also, if a tag or field name contains non-alphanumeric characters, you must use [bracket notation](/influxdb/v2.0/query-data/get-started/syntax-basics/#records) in Flux.

### Avoid the same name for a tag and a field

Avoid using the same name for a tag and field key, which may result in unexpected behavior when querying data.

### Avoid encoding data in measurement names

InfluxDB queries merge data that falls within the same [measurement](/influxdb/v2.0/reference/glossary/#measurement), so it's better to differentiate data with [tags](/influxdb/v2.0/reference/glossary/#tag) than with detailed measurement names. If you encode data in a measurement name, you must use a regular expression to query the data, making some queries more complicated.

#### Example line protocol schemas

Consider the following schema represented by line protocol.

```
Schema 1 - Data encoded in the measurement name
-------------
blueberries.plot-1.north temp=50.1 1472515200000000000
blueberries.plot-2.midwest temp=49.8 1472515200000000000
```

The long measurement names (`blueberries.plot-1.north`) with no tags are similar to Graphite metrics.
Encoding the `plot` and `region` in the measurement name makes the data more difficult to query.

For example, calculating the average temperature of both plots 1 and 2 is not possible with schema 1.
Compare this to schema 2:

```
Schema 2 - Data encoded in tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

#### Flux example to query schemas

Use Flux to calculate the average `temp` for blueberries in the `north` region:

```js
// Schema 1 - Query for data encoded in the measurement name
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement =~ /\.north$/ and r._field == "temp")
  |> mean()

// Schema 2 - Query for data encoded in tags
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
  |> mean()
```

In schema 1, we see that querying the `plot` and `region` in the measurement name makes the data more difficult to query.

### Avoid putting more than one piece of information in one tag

Splitting a single tag with multiple pieces into separate tags simplifies your queries and reduces the need for regular expressions.

#### Example line protocol schemas

Consider the following schema represented by line protocol.

```
Schema 1 - Multiple data encoded in a single tag
-------------
weather_sensor,crop=blueberries,location=plot-1.north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,location=plot-2.midwest temp=49.8 1472515200000000000
```

The schema 1 data encodes multiple parameters, the `plot` and `region`, into a long tag value (`plot-1.north`).
Compare this to schema 2:

```
Schema 2 - Data encoded in multiple tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

Schema 2 is preferable because, with multiple tags, you don't need a regular expression.

#### Flux example to query schemas

The following Flux examples show how to calculate the average `temp` for blueberries in the `north` region; both for schema 1 and schema 2.

```js
// Schema 1 -  Query for multiple data encoded in a single tag
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.location =~ /\.north$/ and r._field == "temp")
  |> mean()

// Schema 2 - Query for data encoded in multiple tags
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
  |> mean()
```
In schema 1, we see that querying the `plot` and `region` in a single tag makes the data more difficult to query.

<!--
## Shard group duration management

InfluxDB stores data in shard groups.
Shard groups are organized by [buckets](/influxdb/v2.0/reference/glossary/#bucket) and store data with timestamps that fall within a specific time interval called the [shard duration](/influxdb/v1.8/concepts/glossary/#shard-duration).

If no shard group duration is provided, the shard group duration is determined by the RP [duration](/influxdb/v1.8/concepts/glossary/#duration) at the time the RP is created. The default values are:

| RP Duration  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The shard group duration is also configurable per RP.
To configure the shard group duration, see [Retention Policy Management](/influxdb/v1.8/query_language/manage-database/#retention-policy-management).

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
A shard group will only be removed once a shard group's duration *end time* is older than the RP duration.

For example, if your RP has a duration of one day, InfluxDB will drop an hour's worth of data every hour and will always have 25 shard groups. One for each hour in the day and an extra shard group that is partially expiring, but isn't removed until the whole shard group is older than 24 hours.

>**Note:** A special use case to consider: filtering queries on schema data (such as tags, series, measurements) by time. For example, if you want to filter schema data within a one hour interval, you must set the shard group duration to 1h. For more information, see [filter schema data by time](/influxdb/v1.8/query_language/explore-schema/#filter-meta-queries-by-time).

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

> **Note:** Note that `INF` (infinite) is not a [valid shard group duration](/influxdb/v1.8/query_language/manage-database/#retention-policy-management).
In extreme cases where data covers decades and will never be deleted, a long shard group duration like `1040w` (20 years) is perfectly valid.

Other factors to consider before setting shard group duration:

* Shard groups should be twice as long as the longest time range of the most frequent queries
* Shard groups should each contain more than 100,000 [points](/influxdb/v1.8/concepts/glossary/#point) per shard group
* Shard groups should each contain more than 1,000 points per [series](/influxdb/v1.8/concepts/glossary/#series)

#### Shard group duration for backfilling

Bulk insertion of historical data covering a large time range in the past creates a large number of shards at once.
The concurrent access and overhead of writing to hundreds or thousands of shards can quickly lead to slow performance and memory exhaustion.

When writing historical data, consider your ingest rate limits, volume, and existing data schema affects performance and memory.

-->
