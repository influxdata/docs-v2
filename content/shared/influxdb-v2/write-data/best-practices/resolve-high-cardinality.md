
If reads and writes to InfluxDB have started to slow down, high [series cardinality](/influxdb/version/reference/glossary/#series-cardinality) (too many series) may be causing memory issues. {{% show-in "cloud,cloud-serverless" %}}Cardinality can also cause writes to fail if it exceeds your [plan’s adjustable service quota](/influxdb/cloud/account-management/limits/).{{% /show-in %}}

Take steps to understand and resolve high series cardinality.

1. [Learn the causes of high cardinality](#learn-the-causes-of-high-series-cardinality)
2. [Measure series cardinality](#measure-series-cardinality)
3. [Resolve high cardinality](#resolve-high-cardinality)

## Learn the causes of high series cardinality

{{% show-in "v2" %}}

  InfluxDB indexes the following data elements to speed up reads:
  - [measurement](/influxdb/version/reference/glossary/#measurement)
  - [tags](/influxdb/version/reference/glossary/#tag)

{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}

  InfluxDB indexes the following data elements to speed up reads:
  - [measurement](/influxdb/version/reference/glossary/#measurement)
  - [tags](/influxdb/version/reference/glossary/#tag)
  - [field keys](/influxdb/cloud/reference/glossary/#field-key)

{{% /show-in %}}

Each unique set of indexed data elements forms a [series key](/influxdb/version/reference/glossary/#series-key).
[Tags](/influxdb/version/reference/glossary/#tag) containing highly variable information like unique IDs, hashes, and random strings lead to a large number of [series](/influxdb/version/reference/glossary/#series), also known as high [series cardinality](/influxdb/version/reference/glossary/#series-cardinality).
High series cardinality is a primary driver of high memory usage for many database workloads.

## Measure series cardinality

Use the following to measure series cardinality of your buckets:
- [`influxdb.cardinality()`](/flux/v0/stdlib/influxdata/influxdb/cardinality): Flux function that returns the number of unique [series keys](/influxdb/version/reference/glossary/#series) in your data.

- [`SHOW SERIES CARDINALITY`](/influxdb/v1/query_language/spec/#show-series-cardinality): InfluxQL command that returns the number of unique [series keys](/influxdb/version/reference/glossary/#series) in your data.

## Resolve high cardinality

To resolve high series cardinality, complete the following steps (for multiple buckets if applicable):

1. [Review tags](#review-tags).
2. [Improve your schema](#improve-your-schema).
3. [Delete high cardinality data](#delete-data-to-reduce-high-cardinality).

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

cardinalityByTag = (bucket) => schema.tagKeys(bucket: bucket)
    |> map(
        fn: (r) => ({
            tag: r._value,
            _value: if contains(set: ["_stop", "_start"], value: r._value) then
                0
            else
                (schema.tagValues(bucket: bucket, tag: r._value)
                    |> count()
                    |> findRecord(fn: (key) => true, idx: 0))._value,
        }),
    )
    |> group(columns: ["tag"])
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

## Improve your schema

To minimize cardinality in the future, design your schema for easy and performant querying.
Review [best practices for schema design](/influxdb/version/write-data/best-practices/schema-design/).

## Delete data to reduce high cardinality

Consider whether you need the data that is causing high cardinality.
If you no longer need this data, you can [delete the whole bucket](/influxdb/version/admin/buckets/delete-bucket/) or [delete a range of data](/influxdb/version/write-data/delete-data/).
