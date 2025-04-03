
InfluxDB {{< current-version >}} includes the following data elements:

- [Timestamp](#timestamp)
- [Measurement](#measurement)
- [Fields](#fields)
  - [Field key](#field-key)
  - [Field value](#field-value)
  - [Field set](#field-set)
- [Tags](#tags)
  - [Tag key](#tag-key)
  - [Tag value](#tag-value)
  - [Tag set](#tag-set)
- [Series](#series)
- [Point](#point)
- [Bucket](#bucket)
- [Organization](#organization)


The following sample data represents time series records stored in InfluxDB and is used to illustrate data elements concepts.
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

All data stored in InfluxDB has a `_time` column that stores timestamps. On disk, timestamps are stored in epoch nanosecond format. InfluxDB formats timestamps show the date and time in [RFC3339](/influxdb/version/reference/glossary/#rfc3339-timestamp) UTC associated with data. Timestamp precision is important when you write data.

## Measurement

The  `_measurement` column shows the name of the measurement `census`. Measurement names are strings. A measurement acts as a container for tags, fields, and timestamps. Use a measurement name that describes your data. The name `census` tells us that the field values record the number of `bees` and `ants`.

## Fields

A field includes a field key stored in the `_field` column and a field value stored in the `_value` column.

### Field key

A field key is a string that represents the name of the field. In the preceding [sample data](#sample-data), `bees` and `ants` are field keys.

### Field value

A field value represents the value of an associated field. Field values can be strings, floats, integers, or booleans. The field values in the sample data show the number of `bees` at specified times: `23`, and `28` and the number of `ants` at a specified time: `30` and `32`.

### Field set

A field set is a collection of field key-value pairs associated with a timestamp. The [sample data](#sample-data) includes the following field sets:

```text
census bees=23i,ants=30i 1566086400000000000
census bees=28i,ants=32i 1566086760000000000
       -----------------
           Field set
```

{{% note %}}

#### Fields aren't indexed

Fields are required in InfluxDB data and are not indexed.
Queries that filter field values must scan all field values to match query conditions.
As a result, queries on tags are more performant than queries on fields.

See how to [use tags and fields](/influxdb/version/write-data/best-practices/schema-design/#use-tags-and-fields) to make your schema easier to query.

{{% /note %}}

## Tags

The columns in the sample data, `location` and `scientist`, are tags.
Tags include tag keys and tag values that are stored as strings and metadata.

### Tag key

The tag keys in the sample data are `location` and `scientist`.
_For information about tag key requirements, see [Line protocol – Tag set](/influxdb/version/reference/syntax/line-protocol/#tag-set)._

### Tag value

The tag key `location` has two tag values: `klamath` and `portland`.
The tag key `scientist` also has two tag values: `anderson` and `mullen`.
_For information about tag value requirements, see [Line protocol – Tag set](/influxdb/version/reference/syntax/line-protocol/#tag-set)._

### Tag set

The collection of tag key-value pairs make up a tag set. The sample data includes the following four tag sets:

```bash
location = klamath, scientist = anderson
location = portland, scientist = anderson
location = klamath, scientist = mullen
location = portland, scientist = mullen
```

{{% note %}}

#### Tags are indexed

Tags are optional.
You don't need tags in your data structure, but it's typically a good idea to include them.
Because InfluxDB indexes tags, the query engine doesn’t need to scan every record in a bucket to locate a tag value.
See how to [use tags to improve query performance](/influxdb/version/write-data/best-practices/schema-design/#use-tags-to-improve-query-performance).

{{% /note %}}

### Why your schema matters

How you structure measurements, fields, and tags in your data can make queries easier to write and more performant.
Good [schema design](/influxdb/version/write-data/best-practices/schema-design) can prevent [high series cardinality](/influxdb/version/write-data/best-practices/resolve-high-cardinality/), resulting in better performing queries.

## Series

Now that you're familiar with measurements, field sets, and tag sets, it's time to discuss series keys and series.

{{% show-in "v2" %}}

In {{% product-name %}} OSS (TSM), a [series key](/influxdb/version/reference/glossary/#series-key) is a unique combination of measurement and tag set.

For example, the [sample data](#sample-data) includes two unique series keys:

| measurement   | tag set                                                         |
|:------------- |:----------------------------------------------------------------|
| census        | location=klamath,scientist=anderson                             |
| census        | location=portland,scientist=mullen                              |

A _series_ includes timestamps and field values for a given series key--for example,
the sample data contains the following series key and corresponding series:

### Sample data series

{{% filesystem-diagram %}}
- census,location=klamath,scientist=anderson
    - 2019-08-18T00:00:00Z 23
    - 2019-08-18T00:06:00Z 28
{{% /filesystem-diagram %}}

{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}

In {{% product-name %}} Cloud (TSM), a [series key](/influxdb/cloud/reference/glossary/#series-key) is a unique combination of measurement, tag set, and field key.

For example, the [sample data](#sample-data) includes two unique series keys:

| measurement   | tag set                             | field key |
|:------------- |:----------------------------------- |:------ |
| census        | location=klamath,scientist=anderson | bees   |
| census        | location=portland,scientist=mullen  | ants   |

A _series_ includes timestamps and field values for a given series key--for example,
the sample data contains the following series key and corresponding series:

### Sample data series

{{% filesystem-diagram %}}
- census,location=klamath,scientist=anderson bees
    - 2019-08-18T00:00:00Z 23
    - 2019-08-18T00:06:00Z 28
{{% /filesystem-diagram %}}

{{% /show-in %}}

Understanding the concept of a series is essential when [designing your schema](/influxdb/version/write-data/best-practices/schema-design/) and working with your data in InfluxDB.

## Point

A **point** includes the series key, a field value, and a timestamp--for example, a single point from the [sample data](#sample-data):

`2019-08-18T00:00:00Z census ants 30 portland mullen`

## Bucket

All InfluxDB data is stored in a bucket. A **bucket** combines the concept of a database and a retention period (the duration of time that each data point persists). A bucket belongs to an organization. For more information about buckets, see [Manage buckets](/influxdb/version/admin/buckets/).

## Organization

An InfluxDB **organization** is a workspace for a group of [users](/influxdb/version/admin/users/). All [dashboards](/influxdb/version/visualize-data/dashboards/), [tasks](/influxdb/version/process-data/), buckets, and users belong to an organization. For more information about organizations, see [Manage organizations](/influxdb/version/admin/organizations/).

If you're new to using InfluxDB, see how to [get started](/influxdb/version/get-started) writing and querying data.

For an overview of how these elements interconnect within InfluxDB's data model, watch the following video:

{{< youtube 3qTTqsL27lI >}}
