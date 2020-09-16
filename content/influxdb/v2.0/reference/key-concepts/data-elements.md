---
title: InfluxDB data elements
description: >
  InfluxDB structures data using elements such as timestamps, field keys, field values, tags, etc.
weight: 102
menu:
  influxdb_2_0_ref:
    parent: Key concepts
    name: Data elements
influxdb/v2.0/tags: [key concepts, schema]
---

InfluxDB 2.0 includes the following data elements:

- [timestamp](#timestamp)
- [field key](#field-key)
- [field value](#field-value)
- [field set](#field-set)
- [tag key](#tag-key)
- [tag value](#tag-value)
- [tag set](#tag-set)
- [measurement](#measurement)
- [series](#series)
- [point](#point)
- [bucket](#bucket)
- [organization](#organization)

The sample data below is used to illustrate data elements concepts.
_Hover over highlighted terms to get acquainted with InfluxDB terminology and layout._
<a id="sample-data"></a>

**bucket:**  `my_bucket`

| _time                                              | _measurement                           | {{< tooltip "Tag key" "location" >}}    | {{< tooltip "Tag key" "scientist" >}} | _field                              | _value                             |
|:-------------------                                |:------------                           |:-------                                |:------                                |:--                                  |:------                             |
| 2019-08-18T00:00:00Z                               | census                                 | klamath                                | anderson                              | bees                                | 23                                 |
| 2019-08-18T00:00:00Z                               | census                                 | portland                               | mullen                                | ants                                | 30                                 |
| 2019-08-18T00:06:00Z                               | census                                 | klamath                                | anderson                              | bees                                | 28                                 |
| {{< tooltip "Timestamp" "2019-08-18T00:06:00Z" >}} | {{< tooltip "measurement" "census" >}} | {{< tooltip "Tag value" "portland" >}} | {{< tooltip "Tag value" "mullen">}}   | {{< tooltip "Field key" "ants" >}} | {{< tooltip "Field value" "32" >}} |

## Timestamp

All data stored in InfluxDB has a `_time` column that stores timestamps. On disk, timestamps are stored in epoch nanosecond format. InfluxDB formats timestamps show the date and time in [RFC3339](/influxdb/v2.0/reference/glossary/#rfc3339-timestamp) UTC associated with data. Timestamp precision is important when you write data.

## Measurement

The  `_measurement` column shows the name of the measurement `census`. Measurement names are strings. A measurement acts as a container for tags, fields, and timestamps. Use a measurement name that describes your data. The name `census` tells us that the field values record the number of `bees` and `ants`.

## Fields

A field includes a field key stored in the `_field` column and a field value stored in the `_value` column.

### Field key

A field key is a string that represents the name of the field. In the sample data above, `bees` and `ants` are field keys.

### Field value

A field value represents the value of an associated field. Field values can be strings, floats, integers, or booleans. The field values in the sample data show the number of `bees` at specified times: `23`, and `28` and the number of `ants` at a specified time: `30` and `32`.

### Field set

A field set is a collection of field key-value pairs associated with a timestamp. The sample data includes the following field sets:

```bash

census bees=23i,ants=30i 1566086400000000000
census bees=28i,ants=32i 1566086760000000000
       -----------------
           Field set

```

{{% note %}}
**Fields aren't indexed:** Fields are required in InfluxDB data and are not indexed. Queries that filter field values must scan all field values to match query conditions. As a result, queries on tags > are more performant than queries on fields. **Store commonly queried metadata in tags.**
{{% /note %}}

## Tags

The columns in the sample data, `location` and `scientist`, are tags.
Tags include tag keys and tag values that are stored as strings and metadata.

### Tag key

The tag keys in the sample data are `location` and `scientist`.
_For information about tag key requirements, see [Line protocol – Tag set](/influxdb/v2.0/reference/syntax/line-protocol/#tag-set)._

### Tag value

The tag key `location` has two tag values: `klamath` and `portland`.
The tag key `scientist` also has two tag values: `anderson` and `mullen`.
_For information about tag value requirements, see [Line protocol – Tag set](/influxdb/v2.0/reference/syntax/line-protocol/#tag-set)._

### Tag set

The collection of tag key-value pairs make up a tag set. The sample data includes the following four tag sets:

```bash
location = klamath, scientist = anderson
location = portland, scientist = anderson
location = klamath, scientist = mullen
location = portland, scientist = mullen
```

{{% note %}}
**Tags are indexed:** Tags are optional. You don't need tags in your data structure, but it's typically a good idea to include tags.
Because tags are indexed, queries on tags are faster than queries on fields. This makes tags ideal for storing commonly-queried metadata.
{{% /note %}}

{{% note %}}
Tags containing highly variable information like UUIDs, hashes, and random strings will lead to a large number of unique series in the database, known as **high series cardinality**. High series cardinality is a primary driver of high memory usage for many database workloads. See [series cardinality](/influxdb/v2.0/reference/glossary/#series-cardinality) for more information.   
{{% /note %}}


#### Why your schema matters

If most of your queries focus on values in the fields, for example, a query to find when 23 bees were counted:

```js
from(bucket: "bucket-name")
  |> range(start: 2019-08-17T00:00:00Z, stop: 2019-08-19T00:00:00Z)
  |> filter(fn: (r) => r._field == "bees" and r._value == 23)
```

InfluxDB scans every field value in the dataset for `bees` before the query returns a response. If our sample `census` data grew to millions of rows, to optimize your query, you could rearrange your [schema](/influxdb/v2.0/reference/glossary/#schema) so the fields (`bees` and `ants`) becomes tags and the tags (`location` and `scientist`) become fields:

| _time                | _measurement | {{< tooltip "Tag key" "bees" >}} | _field                                 | _value                                   |
|:-------------------  |:------------ |:-------                          |:--                                     |:------                                   |
| 2019-08-18T00:00:00Z | census       | 23                               | location                               | klamath                                  |
| 2019-08-18T00:00:00Z | census       | 23                               | scientist                              | anderson                                 |
| 2019-08-18T00:06:00Z | census       | {{< tooltip "Tag value" "28" >}} | {{< tooltip "Field key" "location" >}} | {{< tooltip "Field value" "klamath" >}}  |
| 2019-08-18T00:06:00Z | census       | 28                               | scientist                              | anderson                                 |

| _time                | _measurement | {{< tooltip "Tag key" "ants" >}} | _field                                 | _value                                   |
|:-------------------  |:------------ |:-------                          |:--                                     |:------                                   |
| 2019-08-18T00:00:00Z | census       | 30                               | location                               | portland                                 |
| 2019-08-18T00:00:00Z | census       | 30                               | scientist                              | mullen                                   |
| 2019-08-18T00:06:00Z | census       | {{< tooltip "Tag value" "32" >}} | {{< tooltip "Field key" "location" >}} | {{< tooltip "Field value" "portland" >}} |
| 2019-08-18T00:06:00Z | census       | 32                               | scientist                              | mullen                                   |

Now that `bees` and `ants` are tags, InfluxDB doesn't have to scan all `_field` and `_value` columns. This makes your queries faster.

## Series

Now that you're familiar with measurements, field sets, and tag sets, it's time to discuss series keys and series. A **series key** is a collection of points that share a measurement, tag set, and field key. For example, the [sample data](#sample-data) includes two unique series keys:

| _measurement  | tag set                                                         | _field                             |
|:------------- |:-------------------------------                                 |:------                             |
| census        | {{< tooltip "Tag set" "location=klamath,scientist=anderson" >}} | {{< tooltip "Field key" "bees" >}} |
| census        | location=portland,scientist=mullen                              | ants                               |

A **series** includes timestamps and field values for a given series key. From the sample data, here's a **series key** and the corresponding **series**:

```bash
# series key
census,location=klamath,scientist=anderson bees

# series
2019-08-18T00:00:00Z 23
2019-08-18T00:06:00Z 28        
```

Understanding the concept of a series is essential when designing your [schema](/influxdb/v2.0/reference/glossary/#schema) and working with your data in InfluxDB.

## Point

A **point** includes the series key, a field value, and a timestamp. For example, a single point from the [sample data](#sample-data) looks like this:

`2019-08-18T00:00:00Z census ants 30 portland mullen`

## Bucket

All InfluxDB data is stored in a bucket. A **bucket** combines the concept of a database and a retention period (the duration of time that each data point persists). A bucket belongs to an organization. For more information about buckets, see [Manage buckets](/influxdb/v2.0/organizations/buckets/).

## Organization

An InfluxDB **organization** is a workspace for a group of [users](/influxdb/v2.0/users/). All [dashboards](/influxdb/v2.0/visualize-data/dashboards/), [tasks](/influxdb/v2.0/process-data/), buckets, and users belong to an organization. For more information about organizations, see [Manage organizations](/influxdb/v2.0/organizations/).

If you're just starting out, we recommend taking a look at the following guides:

- [Get started](/influxdb/v2.0/get-started)
- [Write data](/influxdb/v2.0/write-data)
- [Query data](/influxdb/v2.0/query-data)
