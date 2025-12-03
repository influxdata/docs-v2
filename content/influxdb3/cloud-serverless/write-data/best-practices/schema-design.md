---
title: InfluxDB schema design recommendations
seotitle: InfluxDB schema design recommendations and best practices
description: >
  Design your schema for simpler and more performant queries.
menu:
  influxdb3_cloud_serverless:
    name: Schema design
    weight: 201
    parent: write-best-practices
related:
  - /influxdb3/cloud-serverless/admin/buckets/
  - /influxdb3/cloud-serverless/query-data/troubleshoot-and-optimize/
---

Use the following guidelines to design your [schema](/influxdb3/cloud-serverless/reference/glossary/#schema)
for simpler and more performant queries.

- [InfluxDB data structure](#influxdb-data-structure)
  - [Primary keys](#primary-keys)
  - [Tags versus fields](#tags-versus-fields)
- [Schema restrictions](#schema-restrictions)
  - [Do not use duplicate names for tags and fields](#do-not-use-duplicate-names-for-tags-and-fields)
  - [Maximum number of columns per measurement](#maximum-number-of-columns-per-measurement)
- [Design for performance](#design-for-performance)
  - [Avoid wide schemas](#avoid-wide-schemas)
  - [Avoid sparse schemas](#avoid-sparse-schemas)
  - [Measurement schemas should be homogenous](#measurement-schemas-should-be-homogenous)
  - [Use the best data type for your data](#use-the-best-data-type-for-your-data)
- [Design for query simplicity](#design-for-query-simplicity)
  - [Keep measurement names, tags, and fields simple](#keep-measurement-names-tags-and-fields-simple)
  - [Avoid keywords and special characters](#avoid-keywords-and-special-characters)

<!-- TOC -->

## InfluxDB data structure

The InfluxDB data model organizes time series data into buckets and measurements.
A bucket can contain multiple measurements. Measurements contain multiple
tags and fields.

- **Bucket**: Named location where time series data is stored.
  In the InfluxDB SQL implementation, a bucket is synonymous with a _database_.
  A bucket can contain multiple _measurements_.
  - **Measurement**: Logical grouping for time series data.
    In the InfluxDB SQL implementation, a measurement is synonymous with a _table_.
    All _points_ in a given measurement should have the same _tags_.
    A measurement contains multiple _tags_ and _fields_.
      - **Tags**: Key-value pairs that store metadata string values for each point--for example,
        a value that identifies or differentiates the data source or context--for example, host,
        location, station, etc.
        Tag values may be null.
      - **Fields**: Key-value pairs that store data for each point--for example,
        temperature, pressure, stock price, etc.
        Field values may be null, but at least one field value is not null on any given row.
      - **Timestamp**: Timestamp associated with the data.
        When stored on disk and queried, all data is ordered by time.
        In InfluxDB, a timestamp is a nanosecond-scale [Unix timestamp](#unix-timestamp) in UTC.
        A timestamp is never null.

### Primary keys

In time series data, the primary key for a row of data is typically a combination of timestamp and other attributes that uniquely identify each data point.
In InfluxDB, the primary key for a row is the combination of the point's timestamp and _tag set_ - the collection of [tag keys](/influxdb3/cloud-serverless/reference/glossary/#tag-key) and [tag values](/influxdb3/cloud-serverless/reference/glossary/#tag-value) on the point.
A row's primary key tag set does not include tags with null values.

> [!Important]
> Overwriting points with the same primary key (timestamp and tag set) is not reliable for maintaining a last-value view.
> For recommended patterns, see [Duplicate points](/influxdb3/cloud-serverless/reference/line-protocol/#duplicate-points) in the line protocol reference.

### Tags versus fields

When designing your schema for InfluxDB, a common question is, "what should be a
tag and what should be a field?" The following guidelines should help answer that
question as you design your schema.

- Use tags to store metadata, or identifying information, about the source or context of the data.
- Use fields to store measured values.
- Tag values can only be strings.
- Field values can be any of the following data types:
  - Integer
  - Unsigned integer
  - Float
  - String
  - Boolean

{{% product-name %}} indexes tag keys, field keys, and other metadata
 to optimize performance.
It doesn't index tag values or field values.

> [!Note]
> The InfluxDB 3 storage engine supports infinite tag value and series cardinality.
> Unlike InfluxDB backed by the TSM storage engine, **tag value**
> cardinality doesn't affect the overall performance of your bucket.

---

## Schema restrictions

### Do not use duplicate names for tags and fields

Use unique names for tags and fields within the same measurement.
{{% product-name %}} stores tags and fields as unique columns in a measurement that
represents the measurement on disk.
If you attempt to write a measurement that contains tags or fields with the same name,
the write fails due to a column conflict.

### Maximum number of columns per measurement

A measurement has a [maximum number of columns](/influxdb3/cloud-serverless/admin/buckets/#column-limit).
Each row must include a time column.
As a result, a measurement can have the following:

- a time column
- field and tag columns up to the maximum number of columns

If you attempt to write to a measurement and exceed the column limit, then the write
request fails and InfluxDB returns an error.

---

## Design for performance

How you structure your schema within a measurement can affect the overall
performance of queries against that measurement.
The following guidelines help to optimize query performance:

- [Avoid wide schemas](#avoid-wide-schemas)
- [Avoid sparse schemas](#avoid-sparse-schemas)
- [Measurement schemas should be homogenous](#measurement-schemas-should-be-homogenous)


### Avoid wide schemas

A wide schema refers to a schema with a large number of columns (tags and fields).

Wide schemas can lead to the following issues:

- Increased resource usage for persisting and compacting data during ingestion.
- Reduced sorting performance due to complex primary keys with [too many tags](#avoid-too-many-tags).
- Reduced query performance when
  [selecting too many columns](/influxdb3/cloud-serverless/query-data/troubleshoot-and-optimize/optimize-queries/#select-only-columns-you-need).

To prevent wide schema issues, limit the number of tags and fields stored in a measurement.
If you need to store more than the [maximum number of columns](/influxdb3/cloud-serverless/admin/buckets/),
consider segmenting your fields into separate measurements.

#### Avoid too many tags

In InfluxDB, the primary key for a row is the combination of the point's timestamp and _tag set_ - the collection of [tag keys](/influxdb3/cloud-serverless/reference/glossary/#tag-key) and [tag values](/influxdb3/cloud-serverless/reference/glossary/#tag-value) on the point.
A point that contains more tags has a more complex primary key, which could impact sorting performance if you sort using all parts of the key.

### Avoid sparse schemas

A sparse schema is one where, for many rows, columns contain null values.

 These generally stem from the following:
- [non-homogenous measurement schemas](#measurement-schemas-should-be-homogenous)
- [writing individual fields with different timestamps](#writing-individual-fields-with-different-timestamps)

Sparse schemas require the InfluxDB query engine to evaluate many
null columns, adding unnecessary overhead to storing and querying data.

_For an example of a sparse schema,
[view the non-homogenous schema example below](#view-example-of-a-sparse-non-homogenous-schema)._

#### Writing individual fields with different timestamps

Reporting fields at different times with different timestamps creates distinct rows that contain null values--for example:

You report `fieldA` with `tagset`, and then report `field B` with the same `tagset`, but with a different timestamp.
The result is two rows: one row has a _null_ value for **field A** and the other has a _null_ value for **field B**.

In contrast, if you report fields at different times while using the same tagset and timestamp, the existing row is updated.
This requires slightly more resources at ingestion time, but then gets resolved at persistence time or compaction time
and avoids a sparse schema.

### Measurement schemas should be homogenous

Data stored within a measurement should be "homogenous," meaning each row should
have the same tag and field keys.
All rows stored in a measurement share the same columns, but if a point doesn't
include a value for a column, the column value is null.
A measurement full of null values has a ["sparse" schema](#avoid-sparse-schemas).

{{< expand-wrapper >}}
{{% expand "View example of a sparse, non-homogenous schema" %}}

Non-homogenous schemas are often caused by writing points to a measurement with
inconsistent tag or field sets.
In the following example, data is collected from two
different sources and each source returns data with different tag and field sets.

{{< flex >}}
{{% flex-content %}}
##### Source 1 tags and fields:
- tags:
  - source
  - code
  - crypto
- fields:
  - price
{{% /flex-content %}}
{{% flex-content %}}
##### Source 2 tags and fields:
- tags:
  - src
  - currency
  - crypto
- fields:
  - cost
  - volume
{{% /flex-content %}}
{{< /flex >}}

These sets of data written to the same measurement will result in a measurement 
full of null values (also known as a _sparse schema_):

| time                 | source | src | code | currency | crypto  |       price |       cost |      volume |
| :------------------- | :----- | --: | :--- | :------- | :------ | ----------: | ---------: | ----------: |
| 2023-01-01T12:00:00Z | src1   |     | USD  |          | bitcoin | 16588.45865 |            |             |
| 2023-01-01T12:00:00Z |        |   2 |      | EUR      | bitcoin |             | 16159.5806 | 16749450200 |
| 2023-01-01T13:00:00Z | src1   |     | USD  |          | bitcoin | 16559.49871 |            |             |
| 2023-01-01T13:00:00Z |        |   2 |      | EUR      | bitcoin |             | 16131.3694 | 16829683245 |
| 2023-01-01T14:00:00Z | src1   |     | USD  |          | bitcoin | 16577.46667 |            |             |
| 2023-01-01T14:00:00Z |        |   2 |      | EUR      | bitcoin |             | 16148.8727 | 17151722208 |
| 2023-01-01T15:00:00Z | src1   |     | USD  |          | bitcoin | 16591.36998 |            |             |
| 2023-01-01T15:00:00Z |        |   2 |      | EUR      | bitcoin |             | 16162.4167 | 17311854919 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Use the best data type for your data

When writing data to a field, use the most appropriate [data type](/influxdb3/cloud-serverless/reference/glossary/#data-type) for your data--write integers as integers, decimals as floats, and booleans as booleans.
A query against a field that stores integers outperforms a query against string data;
querying over many long string values can negatively affect performance.

## Design for query simplicity

Naming conventions for measurements, tag keys, and field keys can simplify or
complicate the process of writing queries for your data.
The following guidelines help to ensure writing queries for your data is as
simple as possible.

- [Keep measurement names, tags, and fields simple](#keep-measurement-names-tags-and-fields-simple)
- [Avoid keywords and special characters](#avoid-keywords-and-special-characters)

### Keep measurement names, tags, and fields simple

Use one tag or one field for each data attribute.
If your source data contains multiple data attributes in a single parameter,
split each attribute into its own tag or field.

Measurement names, tag keys, and field keys should be simple and accurately
describe what each contains.
Keep names free of data.
The most common cause of a complex naming convention is when you try to "embed"
data attributes into a measurement name, tag key, or field key.

When each key and value represents one attribute (not multiple concatenated attributes) of your data,
you'll reduce the need for regular expressions in your queries.
Without regular expressions, your queries will be easier to write and more performant.

#### Not recommended {.orange}

For example, consider the following [line protocol](/influxdb3/cloud-serverless/reference/syntax/line-protocol/) that embeds multiple attributes (location, model, and ID) into a `sensor` tag value:

```
home,sensor=loc-kitchen.model-A612.id-1726ZA temp=72.1
home,sensor=loc-bath.model-A612.id-2635YB temp=71.8
```

{{< expand-wrapper >}}
{{% expand "View written data" %}}

{{% influxql/table-meta %}}
**name**: home
{{% /influxql/table-meta %}}

| time                 | sensor                           | temp |
| :------------------- | :------------------------------- | ---: |
| 2023-01-01T00:00:00Z | loc-kitchen.model-A612.id-1726ZA | 72.1 |
| 2023-01-01T00:00:00Z | loc-bath.model-A612.id-2635YB    | 71.8 |

{{% /expand %}}
{{< /expand-wrapper >}}

To query data from the sensor with ID `1726ZA`, you have to use either SQL pattern
matching or regular expressions to evaluate the `sensor` tag:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sql
SELECT * FROM home WHERE sensor LIKE '%id-1726ZA%'
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sql
SELECT * FROM home WHERE sensor =~ /id-1726ZA/
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL pattern matching and regular expressions both complicate the query and
are less performant than simple equality expressions.

#### Recommended {.green}

The better approach would be to write each sensor attribute as a separate tag:

```
home,location=kitchen,sensor_model=A612,sensor_id=1726ZA temp=72.1
home,location=bath,sensor_model=A612,sensor_id=2635YB temp=71.8
```

{{< expand-wrapper >}}
{{% expand "View written data" %}}

{{% influxql/table-meta %}}
**name**: home
{{% /influxql/table-meta %}}

| time                 | location | sensor_model | sensor_id | temp |
| :------------------- | :------- | :----------- | :-------- | ---: |
| 2023-01-01T00:00:00Z | kitchen  | A612         | 1726ZA    | 72.1 |
| 2023-01-01T00:00:00Z | bath     | A612         | 2635YB    | 71.8 |

{{% /expand %}}
{{< /expand-wrapper >}}

To query data from the sensor with ID `1726ZA` using this schema, you can use a
simple equality expression:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL & InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sql
SELECT * FROM home WHERE sensor_id = '1726ZA'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

This query is easier to write and is more performant than using pattern matching
or regular expressions.

### Avoid keywords and special characters

To simplify query writing, avoid using reserved keywords or special characters
in measurement names, tag keys, and field keys.

- [SQL keywords](/influxdb3/cloud-serverless/reference/sql/#keywords)
- [InfluxQL keywords](/influxdb3/cloud-serverless/reference/influxql/#keywords)

When using SQL or InfluxQL to query measurements, tags, and fields with special
characters or keywords, you have to wrap these keys in **double quotes**.

```sql
SELECT
  "example-field", "tag@1-23"
FROM
  "example-measurement"
WHERE
  "tag@1-23" = 'ABC'
```
