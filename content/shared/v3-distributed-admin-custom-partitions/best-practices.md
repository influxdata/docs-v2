Use the following best practices when defining custom partitioning strategies
for your data stored in {{< product-name >}}.

- [Partition by tags that you commonly query for a specific value](#partition-by-tags-that-you-commonly-query-for-a-specific-value)
  - [Filter on few values of a partitioned tag](#filter-on-few-values-of-a-partitioned-tag)
- [Only partition by tags that _always_ have a value](#only-partition-by-tags-that-always-have-a-value)
- [Avoid over-partitioning](#avoid-over-partitioning)
  - [Check partition sizes](#check-partition-sizes)
  - [Limit the number of partitions receiving writes](#limit-the-number-of-partitions-receiving-writes)
- [Limit the number of partitions](#limit-the-number-of-partitions)
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

### Filter on few values of a partitioned tag

The query engine can skip a partition when the `WHERE` clause compares the
partitioned tag to literal values--for example, `tag = 'value'` or
`tag IN ('value1', 'value2')`.
A query that matches many values reads every partition that contains any of them.

With [tag buckets](/influxdb/version/admin/custom-partitions/partition-templates/#tag-bucket-part-templates),
tag values are assigned to buckets by a hash, not by any order or grouping,
so the values in one query spread across many buckets.
For example, with 16 buckets, an `IN` list of 10 values reads about 8 buckets
and an `IN` list of 100 values reads nearly all of them.
For such a query, partitioning on the tag provides no benefit.
It can even be slower than not partitioning on the tag, because the query engine
has more partitions to look up in the Catalog and more files to read.

- For long time ranges, split the `IN` list into smaller queries and run only
  a few of them in parallel.
  With tag buckets, separate queries for values in the same bucket read the
  same files again, so compare the total time against a single query before
  you choose a batch size.
- If your queries select a stable set of values--for example, all devices that
  belong to one customer--partition by a tag that identifies the set instead.
- Values that come from a join or subquery instead of the query text don't let
  the query engine skip partitions.

## Only partition by tags that _always_ have a value

You should only partition by tags that _always_ have a value.
If points don't have a value for the tag, InfluxDB can't store them in the correct partitions and, at query time, must read all the partitions.

## Avoid over-partitioning

As you plan your partitioning strategy, keep in mind that over-partitioning your data can hurt query performance. If partitions are too granular, queries may need to retrieve and read many small Parquet files from the [Object store](/influxdb/version/reference/internals/storage-engine/#object-store).

- Balance the partition time interval with the actual amount of data written during each interval. If a single interval doesn't contain a lot of data, partition by larger time intervals.
- Avoid partitioning by tags that you typically don't use in your query workload.
- Avoid partitioning by distinct values of high-cardinality tags. Instead, [use tag buckets](#use-tag-buckets-for-high-cardinality-tags) to partition by these tags.
- For the number of [tag buckets](/influxdb/version/admin/custom-partitions/partition-templates/#tag-bucket-part-templates), consider values between 20 and 400. Higher values can introduce ingest inefficiency.
- Avoid tag buckets on tags that your queries usually filter with long `IN` lists. See [Filter on few values of a partitioned tag](#filter-on-few-values-of-a-partitioned-tag).

### Check partition sizes

The [Compactor](/influxdb/version/reference/internals/storage-engine/#compactor)
combines the data in each partition into Parquet files of up to about 100 MB.
If a partition holds much less than 100 MB of data when its time interval ends,
your partitioning is likely too granular.
The same data is then spread across more partitions and smaller files, which
increases the work for the Ingester, Catalog, and Compactor, and the number of
files queries need to read.

Before you create a database or table with a custom partition template,
check how much data each partition will hold:

1. **Estimate the size of each partition**:

   ```text
   partition_size = data_per_interval / partitions_per_interval
   ```

   - `data_per_interval`: The compressed (Parquet) size of the data written
     to the table during one partition time interval
   - `partitions_per_interval`: The number of partitions created for each time
     interval--for example, the number of tag buckets

2. **Run a trial ingest** (recommended).
   Parquet compression depends on your data, so a trial gives a more reliable
   size than an estimate.
   [Create a test database](/influxdb/version/admin/custom-partitions/define-custom-partitions/)
   with the partition template you plan to use, write representative data
   covering at least one full partition time interval, and then query the
   `system.compactor` table to view partition sizes:

   ```sql { placeholders="TABLE_NAME" }
   SELECT
     partition_key,
     (total_l0_bytes + total_l1_bytes + total_l2_bytes) / 1048576.0 AS size_mb
   FROM
     system.compactor
   WHERE
     table_name = 'TABLE_NAME'
   ORDER BY
     partition_key
   ```

   Replace {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}
   with the name of the table.
   Ignore partitions for time intervals that haven't ended yet, and wait a few
   hours after the last write to a partition before checking its size.
   `system.compactor` only reports data the Ingester has persisted to Parquet,
   and the Compactor compacts a partition again after it stops receiving
   writes, which can change its file count and size.
   For more information, see [View partition information](/influxdb/version/admin/custom-partitions/view-partitions/).

3. **If completed partitions are well below 100 MB**, partition by a larger
   time interval or use fewer tag buckets.

#### Example partition sizes

A table that stores about 300 MB of compressed data per day:

| Partition template                     | Partitions per interval | Size per partition |
| :------------------------------------- | ----------------------: | -----------------: |
| Daily (`%Y-%m-%d`, default)            |                       1 |            ~300 MB |
| Daily (`%Y-%m-%d`) with 60 tag buckets |                      60 |              ~5 MB |
| Monthly (`%Y-%m`) with 60 tag buckets  |                      60 |            ~150 MB |

A table that stores about 10 MB of compressed data per day has ~10 MB
partitions with the default daily template, and ~300 MB partitions when
partitioned by month (`%Y-%m`).

### Limit the number of partitions receiving writes

The [Ingester](/influxdb/version/reference/internals/storage-engine/#ingester)
buffers and persists data for each partition separately.
If writes are spread across many partitions, each partition receives less data
and the Ingester persists many small Parquet files.
Many small files increase the work for the Compactor and Catalog, and cause the
Querier to cache and evict more files.

On smaller clusters, the Catalog can become overloaded when 1,000 or more
partitions receive writes at the same time, especially during upgrades or when
new partitions are being created simultaneously.

To estimate the number of partitions receiving writes, add the
`partitions_per_interval` values (see [Check partition sizes](#check-partition-sizes))
for each table that receives writes.
Writing late-arriving or backfilled data adds partitions from earlier time
intervals.
For example, if 10 tables each use a template with 400 tag buckets and no other
tag parts, writes within a single time interval can go to up to 4,000 partitions.

## Limit the number of partitions

Keep the total partition count for each database below **10,000**.
Spreading partitions across more tables doesn't reduce the load.
Limiting the total partition count can help manage system performance and costs.

A well-sized cluster generally supports more than 10,000 partitions across all
databases, but with more Catalog-related latency.
This latency can affect ingest availability, especially when the cluster's total
partition count exceeds 100,000.

To limit your total partition count:

- [Estimate the total partition count](#estimate-the-total-partition-count) for the lifespan of your data
- **Set a [database retention period](/influxdb/version/admin/databases/#retention-periods)**
  to prevent the number of partitions from growing unbounded
- **Partition by month or year** to [avoid over-partitioning](#avoid-over-partitioning)
- **Don't partition on high cardinality tags** unless you also use [tag buckets](#use-tag-buckets-for-high-cardinality-tags)

### Estimate the total partition count

Use the following formula to estimate the total partition count over the
lifetime of the database (or retention period):

```text
total_partition_count = (cardinality_of_partitioned_tag) * (data_lifespan / partition_duration)
```

- `total_partition_count`: The estimated number of partitions. Each partition stores its data in one or more Parquet files in [Object storage](/influxdb/version/reference/internals/storage-engine/#object-store).
- `cardinality_of_partitioned_tag`: The number of distinct values for a tag
- `data_lifespan`: The [database retention period](/influxdb/version/admin/databases/#retention-periods), if set, or the expected lifetime of the database
- `partition_duration`: The partition time interval, defined by the [time part template](/influxdb/version/admin/custom-partitions/partition-templates/#time-part-templates)

To determine `cardinality_of_partitioned_tag`, use these rules:

- For a [tag bucket part](/influxdb/version/admin/custom-partitions/partition-templates/#tag-bucket-part-templates),
  use the number of buckets, or the number of distinct tag values if that's lower.
- If your partition template includes more than one tag part, multiply the
  values for each part.
  The actual count is lower if not every combination of values occurs in your data.
- To estimate the count for a database, add the counts for each table.

#### Measure the partition count with a trial ingest

Use the [trial ingest](#check-partition-sizes) to measure the partition count
and compare it with your estimate:

1. **Write representative data** with timestamps that span whole partition time
   intervals--for example, full calendar days for `%Y-%m-%d`--and include
   the full range of values for each partitioned tag.
   Data that starts or ends partway through an interval creates partitions for
   that interval too.
2. **Count the partitions in the table**:

   ```sql { placeholders="TABLE_NAME" }
   SELECT
     COUNT(*) AS partition_count
   FROM
     system.partitions
   WHERE
     table_name = 'TABLE_NAME'
   ```

   Replace {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}
   with the name of the table.

3. **Extrapolate over the lifespan of the data**.
   Divide `partition_count` by the number of time intervals the trial data
   spans to get `partitions_per_interval`, and then use it in place of
   `cardinality_of_partitioned_tag`:

   ```text
   total_partition_count = partitions_per_interval * (data_lifespan / partition_duration)
   ```

4. **Repeat for each table** and add the results to get the count for the
   database.
   To count partitions for several tables in one query, see
   [View the number of partitions per table](/influxdb/version/admin/custom-partitions/view-partitions/#view-the-number-of-partitions-per-table).

If your production data has tag values that the trial data doesn't,
production writes can create more partitions than the trial.
