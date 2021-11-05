---
title: Resolve high series cardinality
description: >
  Reduce high series cardinality in InfluxDB. If reads and writes to InfluxDB have started to slow down, you may have high cardinality. Find the source of high cardinality and adjust your schema to resolve high cardinality issues.
menu:
  influxdb_2_0:
    name: Resolve high cardinality
    weight: 202
    parent: write-best-practices
---

If reads and writes to InfluxDB have started to slow down, high [series cardinality](/influxdb/v2.0/reference/glossary/#series-cardinality) (too many series) may be causing memory issues.
Take steps to understand and resolve high series cardinality.

1. [Learn the causes of high cardinality](#learn-the-causes-of-high-series-cardinality)
2. [Measure series cardinality](#measure-series-cardinality)
3. [Resolve high cardinality](#resolve-high-cardinality)

## Learn the causes of high series cardinality

{{% oss-only %}}

  IndexDB indexes the following data elements to speed up reads:
  - [measurement](/influxdb/v2.0/reference/glossary/#measurement)
  - [tags](/influxdb/v2.0/reference/glossary/#tag)

{{% /oss-only %}}
{{% cloud-only %}}

  IndexDB indexes the following data elements to speed up reads:
  - [measurement](/influxdb/v2.0/reference/glossary/#measurement)
  - [tags](/influxdb/v2.0/reference/glossary/#tag)
  - [field keys](/influxdb/cloud/reference/glossary/#field-key)

{{% /cloud-only %}}

Each unique set of indexed data elements forms a [series key](/influxdb/v2.0/reference/glossary/#series-key).
[Tags](/influxdb/v2.0/reference/glossary/#tag) containing highly variable information like unique IDs, hashes, and random strings lead to a large number of [series](/influxdb/v2.0/reference/glossary/#series), also known as high [series cardinality](/influxdb/v2.0/reference/glossary/#series-cardinality).
High series cardinality is a primary driver of high memory usage for many database workloads.
Therefore, to reduce memory overhead, consider storing high-cardinality values in fields rather than in tags.

## Measure series cardinality
{{% oss-only %}}

  The [`SHOW SERIES CARDINALITY`](/influxdb/v2.0/query_language/spec/#show-series-cardinality) InfluxQL command returns the number of unique [series keys](/influxdb/v2.0/reference/glossary/#series) from your data.

{{% /oss-only %}}

{{% cloud-only %}}

  The [`influxdb.cardinality()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/cardinality) Flux function returns the number of unique [series keys](/influxdb/v2.0/reference/glossary/#series) from your data.

{{% /cloud-only %}}

## Resolve high cardinality

To resolve high series cardinality, complete the following steps (for multiple buckets if applicable):

1. [Review tags](#review-tags).
2. [Adjust your schema](#adjust-your-schema).

## Review tags

Review your tags to ensure each tag **does not contain** unique values for most entries:

- Scan your tags for [common tag issues](#common-tag-issues).
- Use the example Flux query below to [count unique tag values](#count-unique-tag-values).

### Common tag issues

Look for the following common issues, which often cause many unique tag values:

- **Writing log messages to tags**. If a log message includes a unique timestamp, pointer value, or unique string, many unique tag values are created.
- **Writing timestamps to tags**. Typically done by accident in client code.
- **Unique tag values that grow over time** For example, a user ID tag may work at a small startup, but may begin to cause issues when the company grows to hundreds of thousands of users.

### Count unique tag values

The following example Flux query shows you which tags are contributing the most to cardinality. Look for tags with values orders of magnitude higher than others.

```js
// Count unique values for each tag in a bucket
import "influxdata/influxdb/schema"

cardinalityByTag = (bucket) =>
  schema.tagKeys(bucket: bucket)
    |> map(fn: (r) => ({
      tag: r._value,
      _value:
        if contains(set: ["_stop","_start"], value:r._value) then 0
        else (schema.tagValues(bucket: bucket, tag: r._value)
          |> count()
          |> findRecord(fn: (key) => true, idx: 0))._value
    }))
    |> group(columns:["tag"])
    |> sum()

cardinalityByTag(bucket: "example-bucket")
```

{{% note %}}
 If you're experiencing runaway cardinality, the query above may timeout. If you experience a timeout, run the queries below—one at a time.
{{% /note %}}

1. Generate a list of tags:

    ```js
    // Generate a list of tags
    import "influxdata/influxdb/schema"

    schema.tagKeys(bucket: "example-bucket")
    ```

2. Count unique tag values for each tag:

    ```js
    // Run the following for each tag to count the number of unique tag values
    import "influxdata/influxdb/schema"

    tag = "example-tag-key"

    schema.tagValues(bucket: "my-bucket", tag: tag)
      |> count()
    ```

These queries should help identify the sources of high cardinality in each of your buckets. To determine which specific tags are growing, check the cardinality again after 24 hours to see if one or more tags have grown significantly.

## Adjust your schema

Review the following potential solutions for resolving high cardinality:
- If a tag has many unique values, change it to a field.
- [Delete data to reduce high cardinality](#delete-data-to-reduce-high-cardinality).
- Review [best practices for schema design](/influxdb/v2.0/write-data/best-practices/schema-design/).

### Delete data to reduce high cardinality

Consider whether you need the data that is causing high cardinality.
If you no longer need this data, you can [delete the whole bucket](/influxdb/v2.0/organizations/buckets/delete-bucket/) or [delete a range of data](/influxdb/v2.0/write-data/delete-data/).
