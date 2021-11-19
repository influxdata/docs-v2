---
title: InfluxDB schema design
description: >
  Design your schema for simpler and more performant queries.
menu:
  influxdb_2_1:
    name: Schema design
    weight: 201
    parent: write-best-practices
---

Design your [schema](/influxdb/v2.1/reference/glossary/#schema) for simpler and more performant queries.
Follow design guidelines to make your schema easy to query.
Learn how these guidelines lead to more performant queries.

- [Design to query](#design-to-query)
  - [Keep measurements and keys simple](#keep-measurements-and-keys-simple)
- [Use tags and fields](#use-tags-and-fields)
  - [Use fields for unique and numeric data](#use-fields-for-unique-and-numeric-data)
  - [Use tags to improve query performance](#use-tags-to-improve-query-performance)
  - [Keep tags simple](#keep-tags-simple)

{{% note %}}

Good schema design can prevent high series cardinality, resulting in better performing queries. If you notice data reads and writes slowing down or want to learn how cardinality affects performance, see how to [resolve high cardinality](/influxdb/v2.1/write-data/best-practices/resolve-high-cardinality/).

{{% /note %}}

## Design to query

The schemas below demonstrate [measurements](/influxdb/v2.1/reference/glossary/#measurement), [tag keys](/influxdb/v2.1/reference/glossary/#tag-key), and [field keys](/influxdb/v2.1/reference/glossary/#field-key) that are easy to query.

| measurement          | tag key   | tag key | field key |  field key  |
|----------------------|-----------|---------|-----------|-------------|
| airSensor            | sensorId  | station | humidity  | temperature |
| waterQualitySensor   | sensorId  | station | pH        | temperature |

The `airSensor` and `waterQualitySensor` schemas illustrate the following guidelines:
- Each measurement is a simple name that describes a schema.
- Keys [don't repeat within a schema](#avoid-duplicate-names-for-tags-and-fields).
- Keys [don't use reserved keywords or special characters](#avoid-keywords-and-special-characters-in-keys).
- Tags (`sensorId` and `station`) [store metadata common across many data points](#use-tags-to-improve-query-performance).
- Fields (`humidity`, `pH`, and `temperature`) [store numeric data](#use-fields-for-unique-and-numeric-data).
- Fields [store unique or highly variable](#use-fields-for-unique-and-numeric-data) data.
- Measurements and keys [don't contain data](#keep-measurements-and-keys-simple); tag values and field values will store data.

The following points (formatted as line protocol) use the `airSensor` and `waterQualitySensor` schemas:

```
airSensor,sensorId=A0100,station=Harbor humidity=35.0658,temperature=21.667 1636729543000000000
waterQualitySensor,sensorId=W0101,station=Harbor pH=6.1,temperature=16.103 1472515200000000000
```

### Keep measurements and keys simple

Store data in [tag values](/influxdb/v2.1/reference/glossary/#tag-value) or [field values](/influxdb/v2.1/reference/glossary/#field-value), not in [tag keys](/influxdb/v2.1/reference/glossary/#tag-key), [field keys](/influxdb/v2.1/reference/glossary/#field-key), or [measurements](/influxdb/v2.1/reference/glossary/#measurement). If you design your schema to store data in tag and field values,
your queries will be easier to write and more efficient.

{{% oss-only %}}

In addition, you'll keep cardinality low by not creating measurements and keys as you write data.
To learn more about the performance impact of high series cardinality, see how to [resolve high cardinality](/influxdb/v2.1/write-data/best-practices/resolve-high-cardinality/).

{{% /oss-only %}}

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
The [Flux](/{{< latest "flux" >}}/) queries calculate the average `temp` for blueberries in the `north` region

**Easy to query**: [_Good Measurements_](#good-measurements-schema) data is easily filtered by `region` tag values, as in the following example.

```js
// Query *Good Measurements*, data stored in separate tags (recommended)
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
  |> mean()
```

**Difficult to query**: [_Bad Measurements_](#bad-measurements-schema) requires regular expressions to extract `plot` and `region` from the measurement, as in the following example.

```js
// Query *Bad Measurements*, data encoded in the measurement (not recommended)
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement =~ /\.north$/ and r._field == "temp")
  |> mean()
```

Complex measurements make some queries impossible. For example, calculating the average temperature of both plots is not possible with the [_Bad Measurements_](#bad-measurements-schema) schema.

#### Keep keys simple

In addition to keeping your keys free of data, follow these additional guidelines to make them easier to query:
- [Avoid keywords and special characters](#avoid-keywords-and-special-characters-in-keys)
- [Avoid duplicate names for tags and fields](#avoid-duplicate-names-for-tags-and-fields)

##### Avoid keywords and special characters in keys

To simplify query writing, don't include reserved keywords or special characters in tag and field keys.
If you use [Flux keywords](/{{< latest "flux" >}}/spec/lexical-elements/#keywords) in keys,
then you'll have to wrap the keys in double quotes.
If you use non-alphanumeric characters in keys, then you'll have to use [bracket notation](/{{< latest "flux" >}}/data-types/composite/record/#bracket-notation) in [Flux]((/{{< latest "flux" >}}/).

##### Avoid duplicate names for tags and fields

Avoid using the same name for a [tag key](/influxdb/v2.1/reference/glossary/#tag-key) and a [field key](/influxdb/v2.1/reference/glossary/#field-key) within the same schema.
Your query results may be unpredictable if you have a tag and a field with the same name.

{{% cloud-only %}}

{{% note %}}
Use [explicit bucket schemas]() to enforce unique tag and field keys within a schema.
{{% /note %}}

{{% /cloud-only %}}

## Use tags and fields

[Tag values](/influxdb/v2.1/reference/glossary/#tag-value) are indexed and [field values](/influxdb/v2.1/reference/glossary/#field-value) aren't.
This means that querying tags is more performant than querying fields.
Your queries should guide what you store in tags and what you store in fields.

### Use fields for unique and numeric data

- Store unique or frequently changing values as field values.
- Store numeric values as field values. ([Tags](/influxdb/v2.1/reference/glossary/#tag-value) only store strings).

### Use tags to improve query performance

- Store values as tag values if they can be reasonably indexed.
- Store values as [tag values](/influxdb/v2.1/reference/glossary/#tag-value) if the values are used in [filter()]({{< latest "flux" >}}/universe/filter/) or [group()](/{{< latest "flux" >}}/universe/group/) functions.
- Store values as tag values if the values are shared across multiple data points, i.e. metadata about the field.

Because InfluxDB indexes tags, the query engine doesn't need to scan every record in a bucket to locate a tag value.
For example, consider a bucket that stores data about thousands of users. With `userId` stored in a [field](/influxdb/v2.1/reference/glossary/#field), a query for user `abcde` requires InfluxDB to scan `userId` in every row.

```js
from(bucket: "example-bucket")
  |> range(start: -7d)
  |> filter(fn: (r) => r._field == "userId" and r._value == "abcde")
```

To retrieve data more quickly, filter on a tag to reduce the number of rows scanned.
The tag should store data that can be reasonably indexed.
The following query filters by the `company` tag to reduce the number of rows scanned for `userId`.

```js
from(bucket: "example-bucket")
  |> range(start: -7d)
  |> filter(fn: (r) => r.company == "Acme")
  |> filter(fn: (r) => r._field == "userId" and r._value == "abcde")
```

### Keep tags simple

Use one tag for each data attribute.
If your source data contains multiple data attributes in a single parameter,
split each attribute into its own tag.
When each tag represents one attribute (not multiple concatenated attributes) of your data,
you'll reduce the need for regular expressions in your queries.
Without regular expressions, your queries will be easier to write and more performant.

#### Compare schemas

Compare the following valid schemas represented by line protocol.

**Recommended**: the following schema splits location data into `plot` and `region` tags.

#####  {id="good-tags-schema"}
```
Good Tags schema - Data encoded in multiple tags
-------------
weather_sensor,crop=blueberries,plot=1,region=north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,plot=2,region=midwest temp=49.8 1472515200000000000
```

**Not recommended**: the following schema stores multiple attributes (`plot` and `region`) concatenated within the `location` tag value (`plot-1.north`).

##### {id="bad-tags-schema"}
```
Bad Tags schema - Multiple data encoded in a single tag
-------------
weather_sensor,crop=blueberries,location=plot-1.north temp=50.1 1472515200000000000
weather_sensor,crop=blueberries,location=plot-2.midwest temp=49.8 1472515200000000000
```

#### Compare queries

Compare queries of the [_Good Tags_](#good-tags-schema) and [_Bad Tags_](#bad-tags-schema) schemas.
The [Flux](/{{< latest "flux" >}}/) queries calculate the average `temp` for blueberries in the `north` region.

**Easy to query**: [_Good Tags_](#good-tags-schema) data is easily filtered by `region` tag values, as in the following example.

```js
// Query *Good Tags* schema, data encoded in multiple tags
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.region == "north" and r._field == "temp")
  |> mean()
```

**Difficult to query**: [_Bad Tags_](#bad-tags-schema) requires regular expressions to parse the complex `location` values, as in the following example.

```js
// Query *Bad Tags* schema, multiple data encoded in a single tag
from(bucket:"example-bucket")
  |> range(start:2016-08-30T00:00:00Z)
  |> filter(fn: (r) =>  r._measurement == "weather_sensor" and r.location =~ /\.north$/ and r._field == "temp")
  |> mean()
```
