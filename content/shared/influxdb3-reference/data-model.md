The {{% product-name %}} data model organizes time series data into
databases and tables.
This page defines the elements of the data model and how {{% product-name %}}
identifies a point.

- [Data structure](#data-structure)
- [Primary keys](#primary-keys)
- [Point identity](#point-identity)

## Data structure

<!-- vale InfluxDataDocs.v3Schema = NO -->

A database can contain multiple tables.
Tables contain multiple tags and fields.

- **Database**: A named location where time series data is stored.
  In {{% product-name %}}, _database_ is synonymous with _bucket_ in InfluxDB
  Cloud Serverless and InfluxDB TSM implementations.

  A database can contain multiple _tables_.
  - **Table**: A logical grouping for time series data.
    In {{% product-name %}}, _table_ is synonymous with _measurement_ in
    InfluxDB Cloud Serverless and InfluxDB TSM implementations.
    All _points_ in a given table should have the same _tags_.
    A table contains multiple _tags_ and _fields_.
    - **Tags**: Key-value pairs that store metadata string values for each
      point--for example, a value that identifies or differentiates the data
      source or context, such as host, location, or station.
      Tag values may be null.
      The collection of tag keys and tag values on a point is the point's
      _tag set_.
    - **Fields**: Key-value pairs that store data for each point--for example,
      temperature, pressure, or stock price.
      Field values may be null, but at least one field value is not null on
      any given row.
      The collection of field keys and field values on a point is the point's
      _field set_.
    - **Timestamp**: Timestamp associated with the data.
      When stored on disk and queried, all data is ordered by time.
      In InfluxDB, a timestamp is a nanosecond-scale
      [Unix timestamp](/influxdb3/version/reference/glossary/#unix-timestamp)
      in UTC.
      A timestamp is never null.

> [!Note]
>
> #### What happened to buckets and measurements?
>
> If coming from earlier versions of InfluxDB, InfluxDB Cloud (TSM), or
> InfluxDB Cloud Serverless, you're likely familiar with the concepts _bucket_
> and _measurement_:
>
> - _**Bucket**_ in InfluxDB v2 or InfluxDB Cloud Serverless is synonymous with
>   _**database**_ in InfluxDB 3.
> - _**Measurement**_ in InfluxDB v1, v2, or InfluxDB Cloud Serverless is
>   synonymous with _**table**_ in InfluxDB 3.

<!-- vale InfluxDataDocs.v3Schema = YES -->

{{% hide-in "cloud" %}}
For guidance on choosing tags and fields, see
[Schema design recommendations](/influxdb3/version/write-data/best-practices/schema-design/).
{{% /hide-in %}}

## Primary keys

In time series data, the primary key for a row of data is typically a
combination of timestamp and other attributes that uniquely identify each data
point.
In {{% product-name %}}, the primary key for a row is the combination of the
point's timestamp and _tag set_--the collection of
[tag keys](/influxdb3/version/reference/glossary/#tag-key) and
[tag values](/influxdb3/version/reference/glossary/#tag-value) on the point.
A row's primary key tag set does not include tags with null values.

## Point identity

A point is identified by its table, tag set, and timestamp.
Points that share all three are _duplicate points_.
{{% product-name %}} stores a single row for that identity and merges the
field sets of the duplicate writes.
Field keys and field values don't make a point unique.

{{% hide-in "cloud" %}}
For duplicate-write behavior and recommended write patterns, see
[Handle duplicate points](/influxdb3/version/write-data/best-practices/duplicate-points/).
{{% /hide-in %}}
