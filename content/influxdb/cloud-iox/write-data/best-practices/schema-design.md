---
title: InfluxDB schema design recommendations
seotitle: InfluxDB schema design recommendations and best practices
description: >
  Design your schema for simpler and more performant queries.
menu:
  influxdb_cloud_iox:
    name: Schema design
    weight: 201
    parent: write-best-practices
---

Use the following guidelines to design your [schema](/influxdb/cloud-iox/reference/glossary/#schema)
for simpler and more performant queries.

- [InfluxDB data structure](#influxdb-data-structure)
  - [Tags versus fields](#tags-versus-fields)
- [Schema restrictions](#schema-restrictions)
  - [Do not use duplicate names for tags and fields](#do-not-use-duplicate-names-for-tags-and-fields)
  - [Measurements can contain up to 200 columns](#measurements-can-contain-up-to-200-columns)
- [Design for performance](#design-for-performance)
  - [Avoid wide schemas](#avoid-wide-schemas)
  - [Avoid sparse schemas](#avoid-sparse-schemas)
  - [Measurement schemas should be homogenous](#measurement-schemas-should-be-homogenous)
- [Design for query simplicity](#design-for-query-simplicity)
  - [Keep measurement names, tag keys, and field keys simple](#keep-measurement-names-tag-keys-and-field-keys-simple)
  - [Avoid keywords and special characters](#avoid-keywords-and-special-characters)

---

## InfluxDB data structure

The InfluxDB data model organizes time series data into buckets and measurements.
A bucket can contain multiple measurements. Measurements contain multiple
tags and fields.

- **Bucket**: Named location where time series data is stored.
  A bucket can contain multiple _measurements_.
  - **Measurement**: Logical grouping for time series data.
    All _points_ in a given measurement should have the same _tags_.
    A measurement contains multiple _tags_ and _fields_.
      - **Tags**: Key-value pairs that provide metadata for each point--for example,
        something to identify the source or context of the data like host,
        location, station, etc.
      - **Fields**: Key-value pairs with values that change over time--for example,
        temperature, pressure, stock price, etc.
      - **Timestamp**: Timestamp associated with the data.
        When stored on disk and queried, all data is ordered by time.

### Tags versus fields

When designing your schema for InfluxDB, a common question is, "what should be a
tag and what should be a field?" The following guidelines should help answer that
question as you design your schema.

- Use tags to store identifying information about the source or context of the data.
- Use fields to store values that change over time.
- Tag values can only be strings.
- Field values can be any of the following data types:
  - Integer
  - Unsigned integer
  - Float
  - String
  - Boolean

{{% note %}}
If coming from a version of InfluxDB backed by the TSM storage engine, **tag value**
cardinality no longer affects the overall performance of your database.
The InfluxDB IOx engine supports nearly infinite tag value and series cardinality.
{{% /note %}}

---

## Schema restrictions

### Do not use duplicate names for tags and fields

Tags and fields within the same measurement can not be named the same.
All tags an fields are stored as unique columns in a table representing the
measurement on disk. Tags and fields named the same cause a column conflict.

{{% note %}}
Use [explicit bucket schemas](/influxdb/cloud-iox/...) to enforce unique tag and
field keys within a schema.
{{% /note %}}

### Measurements can contain up to 200 columns

A measurement can contain **up to 200 columns**. Each row requires a time column,
but the rest represent tags and fields stored in the measurement.
Therefore, a measurement can contain one time column and 199 total field and tag columns.
If you attempt to write to a measurement and exceed the 200 column limit, the
write request fails and InfluxDB returns an error.

---

## Design for performance

How you structure your schema within a measurement can affect the overall
performance of queries against that measurement.
The following guidelines help to optimize query performance:

- [Avoid wide schemas](#avoid-wide-schemas)
- [Avoid sparse schemas](#avoid-sparse-schemas)
- [Measurement schemas should be homogenous](#measurement-schemas-should-be-homogenous)

### Avoid wide schemas

A wide schema is one with many tags and fields and corresponding columns for each.
At query time, InfluxDB evaluates each row in the queried measurement to
determine what rows to return. The "wider" the measurement (more columns), the
less performant queries are against that measurement.
To ensure queries stay performant, the InfluxDB IOx storage engine has a
[limit of 200 columns per measurement](#measurements-can-contain-up-to-200-columns).

To avoid a wide schema, limit the number of tags and fields stored in a measurement.
If you need to store more than 199 total tags and fields, consider segmenting
your fields into a separate measurement.

### Avoid sparse schemas

A sparse schema is one where, for many rows, columns contain null values.
These generally stem from [non-homogenous measurement schemas](#measurement-schemas-should-be-homogenous)
or individual fields for a tag set being reported at
separate times. Sparse schemas require the InfluxDB query engine to evaluate many
null columns, adding an unnecessary overhead to storing and querying data.

_For an example of a sparse schema,
[view the non-homogenous schema example below](#view-example-of-a-sparse-non-homogenous-schema)._

### Measurement schemas should be homogenous

Data stored within a measurement should be "homogenous," meaning each row should
have the same tag and field keys.
All rows stored in a measurement share the same columns, but if a point doesn't
include a value for a column, the column value is null.
A measurement full of null values has a ["sparse" schema](#avoid-sparse-schemas).

{{< expand-wrapper >}}
{{% expand "View example of a sparse, non-homogenous schema" %}}

Non-homogenous schemas are often caused by writing points to a measurement with
inconsistent tag or field sets. For example, lets say data is collected from two
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
full of null values (also known as a sparse schema):

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

## Design for query simplicity

Naming conventions for measurements, tag keys, and field keys can simplify or
complicate the process of writing queries for your data.
The following guidelines help to ensure writing queries for your data is as
simple as possible.

- [Keep measurement names, tag keys, and field keys simple](#keep-measurement-names-tag-keys-and-field-keys-simple)
- [Avoid keywords and special characters](#avoid-keywords-and-special-characters)

### Keep measurement names, tag keys, and field keys simple

Measurement names, tag keys, and field keys should be simple and accurately
describe what each contains.

The most common cause of a complex naming convention is when you try to "embed"
data attributes into a measurement name, tag key, or field key.

#### Not recommended {.orange}

As a basic example, consider the following [line protocol](/influxdb/cloud-iox/reference/syntax/line-protocol/)
that embeds sensor metadata (location, model, and ID) into a tag key:

```
home,sensor=loc-kitchen.model-A612.id-1726ZA temp=72.1
home,sensor=loc-bath.model-B723.id-2635YB temp=71.8
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
[Flux](#)
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
{{% code-tab-content %}}

```js
import "experimental/iox"

iox.from(bucket: "example-bucket")
    |> range(start: -1y)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r.sensor =~ /id-1726ZA/)
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL pattern matching and regular expressions both complicate the query and
are less performant than simple equality expressions.

#### Recommended {.green}

The better approach would be to write each sensor attribute as an individual tag:

```
home,location=kitchen,sensor_model=A612,sensor_id=1726ZA temp=72.1
home,location=bath,sensor_model=B723,sensor_id=2635YB temp=71.8
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

To query data from the sensor with ID `1726ZA` using this schema, you have to can
use a simple equality expression:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL & InfluxQL](#)
[Flux](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sql
SELECT * FROM home WHERE sensor_id = '1726ZA'
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```js
import "experimental/iox"

iox.from(bucket: "example-bucket")
    |> range(start: -1y)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r.sensor_id == "1726ZA")
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

This query is easier to write and is more performant than using pattern matching
or regular expressions.

### Avoid keywords and special characters

To simplify query writing, avoid using reserved keywords or special characters
in measurement names, tag keys, and field keys.

- [SQL keywords](#)
- [InfluxQL keywords](/influxdb/cloud-iox/reference/syntax/influxql/spec/#keywords)
- [Flux keywords](/{{< latest "flux" >}}/spec/lexical-elements/#keywords)

When using SQL or InfluxQL to query measurements, tags, and fields with special
characters or keywords, you have to wrap these keys in **double quotes**.
In Flux, if using special characters in tag keys, you have to use
[bracket notation](/{{< latest "flux" >}}/data-types/composite/record/#bracket-notation)
to reference those columns.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL & InfluxQL](#)
[Flux](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sql
SELECT
  "example-field", "tag@1-23"
FROM
  "example-measurement"
WHERE
  "tag@1-23" = 'ABC'
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```js
import "experimental/iox"

iox.from(bucket: "example-bucket")
    |> range(start: -1y)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> filter(fn: (r) => r["tag@1-23"] == "ABC")
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
