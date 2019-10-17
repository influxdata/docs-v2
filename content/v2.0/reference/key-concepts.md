---
title: InfluxDB key concepts
description: >
  Concepts related to InfluxDB 2.0.
weight: 7
menu:
  v2_0_ref:
    name: Key concepts
v2.0/tags: [InfluxDB key concepts]
---

Before working with InfluxDB 2.0, it's helpful to learn a few key concepts, including:

- [InfluxDB table structure](#influxdb-layout)
- [InfluxDB data elements](#influxdb-data-elements)
- [InfluxDB design principles](/v2.0/reference/design-principles)
<!--- [InfluxDB 2.0 platform](/v2.0/reference/) -->

### InfluxDB table structure

InfluxDB 2.0 uses the following table structure to store data:

- **Annotation rows:** include the following rows: #group, #datatype, and #default.
- **Header row:** describes the data labels for each column in a row.
- **Data columns:** include the following columns: annotation, result, and table.
- **Data rows:** all rows that contain time series data. See [sample data](#sample-data) below.

For specifications on the InfluxDB 2.0 table structure, see [Tables](/v2.0/reference/annotated-csv/#tables).

**_Tip:_** To visualize your table structure in the InfluxDB user interface, click the **Data Explorer** icon
in the sidebar, create a query, click **Submit**, and then select **View Raw Data**.

### InfluxDB data elements

InfluxDB 2.0 includes the following data elements:

| Data elements ||||
|:----|:----------|:---------|:-----------|
|[timestamp](#timestamp)|[field key](#field-key)|[field value](#field-value)|[field set](#field-set)|
[tag key](#tag-key)|[tag value](#tag-value)|[tag set](#tag-set)|[measurement](#measurement)|
|[series](#series)|[point](#point)|[bucket](#bucket)|[organization](#organization)|

### Sample data

The sample data below shows a number of bees counted by two scientists (`anderson` and `mullen`) in two locations (`1` and `2`) from 12 AM to 6 AM on August 18, 2019. The sample data is stored in a bucket `my_bucket` and retained for the duration of the retention policy specified in the [bucket](#bucket).

**_Tip:_** Hover over purple terms to get acquainted with InfluxDB terminology and layout.

bucket:  `my_bucket`

| _time | _measurement| <span class="tooltip" data-tooltip-text="Field key">_field</span>|<span class="tooltip" data-tooltip-text="Field value">_value</span>|<span class="tooltip" data-tooltip-text="Tag key">location</span>|<span class="tooltip" data-tooltip-text="Tag key">scientist</span>|
|:-------------------  |:------------|:--|:---|:-------|:------|
| 2019-08-18T00:00:00Z | census|bees |23 | 1  |anderson|
| 2019-08-18T00:00:00Z | census|bees |30 | 1  |mullen  |
| 2019-08-18T00:06:00Z | census|bees |28 |  2 |anderson|
|                      |       |     |   |    |        |       |
| <span class="tooltip" data-tooltip-text="Timestamp">2019-08-18T00:06:00Z</span>| <span class="tooltip" data-tooltip-text="measurement"> census</span>| <span class="tooltip" data-tooltip-text="Field key">ants</span>| <span class="tooltip" data-tooltip-text="Field value">3</span> | <span class="tooltip" data-tooltip-text="Tag value">2</span> |<span class="tooltip" data-tooltip-text="Tag value">mullen</span>|

#### Timestamp

All data stored in InfluxDB has a `_time` column that stores timestamps. Timestamps show the date and time in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) UTC associated with data. Timestamp precision is important. When you search data within a specified time interval, make sure the timestamp precision you're searching matches the timestamp precision in your dataset.

#### Measurement

The  `_measurement` column shows the name of the measurement `census`. Measurement names are strings. A measurement acts as a container for tags, fields, and timestamps. Use a measurement name that describes your data. The name `census` tells us that the field values record the number of `bees` and `ants`. A single measurement can belong to different [buckets](#bucket).

#### Fields

A field includes a field key stored in (`_field`) and associated field value(s) stored in (`_value`).

##### Field key

The field keys `bees` and `ants` is a string that stores the name of the field.

##### Field values

The field values are your data; they can be strings, floats, integers, or Booleans. A field value always has an associated timestamp. The field values in the sample data show the number of `bees` at specified times: `23`, `30`, and `28` and the number of `ants` at a specified time: `3`.

##### Field sets

A field set is a collection of field key-value pairs. The sample data includes the following four field sets:

- `bees = 23`
- `bees = 30`
- `bees = 28`
- `ants = 3`

#### Fields aren't indexed

Fields are required in InfluxDB data and are not indexed. Queries that filter field values must scan all field values to match query conditions. As a result, queries on tags are more performant than queries on fields. Store commonly queried metadata in tags.

#### Tags

The last two columns in the sample data, `location` and `scientist`, are tags.
Tags include tag keys and tag values that are stored as strings and metadata.

##### Tag keys

The tag keys in the sample data are `location` and `scientist`.

##### Tag values

The tag key `location` has two tag values: `1` and `2`.
The tag key `scientist` also has two tag values: `anderson` and `mullen`.

##### Tag sets

The collection of tag key-value pairs make up a tag set. The sample data includes the following four tag sets:

- `location = 1`, `scientist = anderson`
- `location = 2`, `scientist = anderson`
- `location = 1`, `scientist = mullen`
- `location = 2`, `scientist = mullen`

#### Tags are indexed

Tags are optional. You don't need tags in your data structure, but it's typically a good idea to include tags.
Because tags are indexed, queries on tags are faster than queries on fields. This makes tags ideal for storing commonly-queried metadata.

#### Why your schema matters

If most of your queries focus on values in the fields, for example, a query to find when 23 bees were counted:

`SELECT * FROM census WHERE bees = 23`

InfluxDB scans every field value in the dataset for `bees` before the query returns a response. If our sample `census` data grew to millions of rows, to optimize your query, you could rearrange your [schema](/v2.0/reference/glossary/#schema) so the fields (`bees` and `ants`) becomes tags and the tags (`location` and `scientist`) become fields:

| _time                 | _measurement | _field | _value |<span class="tooltip" data-tooltip-text="Tag key">bees</span>|<span class="tooltip" data-tooltip-text="Tag key">ants</span>|
|:----------------------|--------------|--------|--------|-------|-------|
| 2019-08-18T00:00:00Z | census |scientist |anderson   |   23 | |
| <span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:00:00Z</span> | <span class="tooltip" data-tooltip-text="Measurement name">census</span> |<span class="tooltip" data-tooltip-text="Field key">scientist</span> | <span class="tooltip" data-tooltip-text="Field value">mullen</span> | <span class="tooltip" data-tooltip-text="Tag value">30</span>  |
| 2019-08-18T00:06:00Z | census |scientist| anderson| 28 |    |
|                      |        |         |         |    |    |
| 2019-08-18T00:00:00Z | census |location | 1       | 23 |    |
| 2019-08-18T00:00:00Z | census |location | 1       | 30 |    |
| 2019-08-18T00:06:00Z | census |location | 2       | 28 |    |
|                      |        |         |         |    |    |
| 2019-08-18T00:06:00Z | census |location | 2       |    | 3  |

Now that `bees` and `ants` are tags, InfluxDB doesn't have to scan all `_field` and `_value` columns. This makes your queries faster.

#### Series

Now that you're familiar with measurements, field sets, and tag sets, it's time to discuss **series keys** and **series**. A series key is the collection of data that shares a measurement, tag set, and field key. For example, the [sample data](#sample-data) includes four unique series:

| _measurement  | tag set                         | _field |
|:-------------|:---------------------------------|:-------|
| census       |<span class="tooltip" data-tooltip-text="Tag 1">location = 1</span>,scientist = anderson|<span class="tooltip" data-tooltip-text="Field key">bees</span>|
| census       |location = 2,<span class="tooltip" data-tooltip-text="Tag 2">scientist = anderson</span>  |bees |
| census       |location = 1,scientist = mullen   |bees|
| census       |location = 2,scientist = mullen   |ants|

A **series** is a group of field values for a unique series key. In a series, field values (`_values`) are ordered by timestamp (`_time`) in ascending order.

| _time                     | _values     |
|---------------------------|-------------|
| `2019-08-18T00:00:00Z`    | `23`        |
| `2019-08-18T00:00:00Z`    | `30`        |
| `2019-08-18T00:06:00Z`    | `28`        |
| `2019-08-18T00:06:00Z`    | `3`         |

Understanding the concept of a series is essential when designing your [schema](v2.0/reference/glossary/#schema) and when working with your data in InfluxDB.

#### Point

A **point** includes the series key, a field value, and a timestamp. For example, a single point from the [sample data](#sample-data) looks like this:

`2019-08-18T00:00:00Z bees 30  census  1  mullen`



#### Bucket

All InfluxDB data is stored in a bucket. A **bucket** combines the concept of a database and a retention period (the duration of time that each data point persists). A bucket belongs to an organization. For more information about buckets, see [Manage buckets](https://v2.docs.influxdata.com/v2.0/organizations/buckets/).

#### Organization

An InfluxDB **organization** is a workspace for a group of [users](/v2.0/users/). All [dashboards](/v2.0/visualize-data/dashboards/), [tasks](/v2.0/process-data/), buckets, and users belong to an organization. For more information about organizations, see [Manage organizations](https://v2.docs.influxdata.com/v2.0/organizations/).

If you're just starting out, we recommend taking a look at the following guides:

- [Getting Started](/influxdb/v0.10/introduction/getting_started/) 
- [Writing Data](/influxdb/v0.10/guides/writing_data/)
- [Querying Data](/influxdb/v0.10/guides/querying_data/) 
