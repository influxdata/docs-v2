---
title: Partitioning best practices
description: >
  Learn best practices for applying custom partition strategies to your data
  stored in InfluxDB.
menu:
  influxdb_cloud_dedicated:
    # name: Best practices
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
#### Be careful partitioning on high-cardinality tags

Partitioning using tags with many (500K+) of unique values can actually hurt
query performance as partitions are created for each unique tag value.
{{% /note %}}

## Only partition by tags that _always_ have a value

You should only partition by tags that _always_ have a value.
Otherwise, InfluxDB will not be able to store points without that tag in the
correct partitions and, at query time, will end up reading all partitions.

## Avoid over-partitioning

As you plan your partitioning strategy, keep in mind that data can be
"over-partitioned"--meaning partitions are so granular that queries end up
having to open and read many more partitions than they really need to, which
actually hurts query performance.

- Avoid partition time intervals that are too small. A good rule of thumb is to
  partition data using time intervals similar to your most commonly queried
  time range. For example, if you often query data from the last hour, partitioning by
  hour may help to improve query performance.
  
  However, this should be balanced with the actual amount of data written during
  the specified time interval. If a single interval doesn't contain a lot of data,
  it is better to partition by larger time intervals.

- Don't partition by tags that you typically don't use in your query workload.
- [Be careful partitioning on high-cardinality tags](#be-careful-partitioning-on-high-cardinality-tags).