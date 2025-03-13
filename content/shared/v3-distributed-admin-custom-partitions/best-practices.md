Use the following best practices when defining custom partitioning strategies
for your data stored in {{< product-name >}}.

- [Partition by tags that you commonly query for a specific value](#partition-by-tags-that-you-commonly-query-for-a-specific-value)
- [Only partition by tags that _always_ have a value](#only-partition-by-tags-that-always-have-a-value)
- [Avoid over-partitioning](#avoid-over-partitioning)
- [Limit the number of partition files](#limit-the-number-of-partition-files)
  - [Estimate the total partition count](#estimate-the-total-partition-count)

## Partition by tags that you commonly query for a specific value

Custom partitioning primarily benefits single series queries that look for a specific tag
value in the `WHERE` clause.
For example, if you often query data related to a
specific ID, partitioning by the tag that stores the ID helps the InfluxDB
query engine to more quickly identify what partitions contain the relevant data.

> [!Note]
> 
> #### Use tag buckets for high-cardinality tags
> 
> Partitioning using distinct values of tags with many (10K+) unique values can
> actually hurt query performance as partitions are created for each unique tag value.
> Instead, use [tag buckets](/influxdb/version/admin/custom-partitions/partition-templates/#tag-bucket-part-templates)
> to partition by high-cardinality tags.
> This method of partitioning groups tag values into "buckets" and partitions by bucket.

## Only partition by tags that _always_ have a value

You should only partition by tags that _always_ have a value.
If points don't have a value for the tag, InfluxDB can't store them in the correct partitions and, at query time, must read all the partitions.

## Avoid over-partitioning

As you plan your partitioning strategy, keep in mind that over-partitioning your data can hurt query performance. If partitions are too granular, queries may need to retrieve and read many partitions from the [Object store](/influxdb/version/reference/internals/storage-engine/#object-store).

- Balance the partition time interval with the actual amount of data written during each interval. If a single interval doesn't contain a lot of data, partition by larger time intervals.
- Avoid partitioning by tags that you typically don't use in your query workload.
- Avoid partitioning by distinct values of high-cardinality tags. Instead, [use tag buckets](#use-tag-buckets-for-high-cardinality-tags) to partition by these tags.

## Limit the number of partition files

Avoid exceeding **10,000** total partitions.
Limiting the total partition count can help manage system performance and costs.

While planning your strategy, take the following steps to limit your total
partition count.
We currently recommend planning to keep the total partition count below 10,000.

- [Estimate the total partition count](#estimate-the-total-partition-count) for the lifespan of your data
- **Set a [database retention period](/influxdb/version/admin/databases/#retention-period)**
  to prevent the number of partitions from growing unbounded
- **Partition by month or year** to [avoid over-partitioning](#avoid-over-partitioning)
- **Don't partition on high cardinality tags** unless you also use [tag buckets](#use-tag-buckets-for-high-cardinality-tags)

### Estimate the total partition count

Use the following formula to estimate the total partition count over the
lifetime of the database (or retention period):

```text
total_partition_count = (cardinality_of_partitioned_tag) * (data_lifespan / partition_duration)
```

- `total_partition_count`: The number of partition files in [Object storage](/influxdb/version/reference/internals/storage-engine/#object-storage)
- `cardinality_of_partitioned_tag`: The number of distinct values for a tag
- `data_lifespan`: The [database retention period](/influxdb/version/admin/databases/#retention-period), if set, or the expected lifetime of the database
- `partition_duration`: The partition time interval, defined by the [time part template](/influxdb/version/admin/custom-partitions/partition-templates/#time-part-templates)
