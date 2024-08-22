---
title: Partitioning best practices
description: >
  Learn best practices for applying custom partition strategies to your data
  stored in InfluxDB.
menu:
  influxdb_clustered:
    name: Best practices
    parent: Manage data partitioning
weight: 202
---

Use the following best practices when defining custom partitioning strategies
for your data stored in {{< product-name >}}.

- [Partition by tags that you commonly query for a specific value](#partition-by-tags-that-you-commonly-query-for-a-specific-value)
- [Only partition by tags that _always_ have a value](#only-partition-by-tags-that-always-have-a-value)
- [Avoid over-partitioning](#avoid-over-partitioning)

## Partition by tags that you commonly query for a specific value

Custom partitioning primarily benefits queries that look for a specific tag
value in the `WHERE` clause. For example, if you often query data related to a
specific ID, partitioning by the tag that stores the ID helps the InfluxDB
query engine to more quickly identify what partitions contain the relevant data.

{{% note %}}

#### Use tag buckets for high-cardinality tags

Partitioning using distinct values of tags with many (10K+) unique values can
actually hurt query performance as partitions are created for each unique tag value.
Instead, use [tag buckets](/influxdb/clustered/admin/custom-partitions/partition-templates/#tag-bucket-part-templates)
to partition by high-cardinality tags.
This method of partitioning groups tag values into "buckets" and partitions by bucket.
{{% /note %}}

## Only partition by tags that _always_ have a value

You should only partition by tags that _always_ have a value.
If points don't have a value for the tag, InfluxDB can't store them in the correct partitions and, at query time, must read all the partitions.

## Avoid over-partitioning

As you plan your partitioning strategy, keep in mind that data can be
"over-partitioned"--meaning partitions are so granular that queries end up
having to retrieve and read many partitions from the object store, which
hurts query performance.

- Balance the partition time interval with the actual amount of data written
  during each interval. If a single interval doesn't contain a lot of data,
  it is better to partition by larger time intervals.
- Don't partition by tags that you typically don't use in your query workload.
- Don't partition by distinct values of high-cardinality tags.
  Instead, [use tag buckets](#use-tag-buckets-for-high-cardinality-tags) to
  partition by these tags.
