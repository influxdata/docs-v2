---
title: Manage data partitioning
seotitle: Manage data partitioning on disk
description: >
  Customize your partitioning strategy to optimize query performance for your
  specific schema and workload.
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 103
influxdb/cloud-dedicated/tags: [storage]
related:
  - /influxdb/cloud-dedicated/reference/internals/storage-engine/
---

When writing data to {{< product-name >}}, the InfluxDB v3 storage engine stores
data in the [Object store](/influxdb/cloud-dedicated/reference/internals/storage-engine/#object-store)
in [Apache Parquet](https://parquet.apache.org/) format.
Each Parquet file represents a _partition_--a logical grouping of data.
By default, InfluxDB partitions each measurement (table) by day.
{{< product-name >}} lets you customize the partitioning strategy and partition
by tag values and different time intervals.
Customize your partitioning strategy to optimize query performance for your
specific schema and workload.

- [Advantages](#advantages)
- [Disadvantages](#disadvantages)
- [Limitations](#limitations)
- [How partitioning works](#how-partitioning-works)
  - [Partition templates](#partition-templates)
  - [Partition keys](#partition-keys)
- [Partitions in the query life cycle](#partitions-in-the-query-life-cycle)
- [Partition guides](#partition-guides)
{{< children type="anchored-list" >}}

## Advantages

The primary advantage of custom partitioning is that it lets you customize your
storage structure to improve query performance specific to your schema and workload.

- **Optimized storage for improved performance on specific types of queries**.
  For example, if queries often select data with a specific tag value, you can
  partition by that tag to improve the performance of those queries.
- **Optimized storage for specific types of data**. For example, if the data you
  store is sparse and the time ranges you query are often much larger than a day,
  you could partition your data by week instead of by day.

## Disadvantages

Using custom partitioning may increase the load on other parts of the
[InfluxDB v3 storage engine](/influxdb/cloud-dedicated/reference/internals/storage-engine/),
but each can be scaled individually to address the added load.

{{% note %}}
_The following disadvantages assume that your custom partitioning strategy includes
additional tags to partition by or partition intervals smaller than a day._
{{% /note %}}

- **Increased load on the [Ingester](/influxdb/cloud-dedicated/reference/internals/storage-engine/#ingester)**
  as it groups data into smaller partitions and files.
- **Increased load on the [Catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog)**
  as more references to partition Parquet file locations are stored and queried.
- **Increased load on the [Compactor](/influxdb/cloud-dedicated/reference/internals/storage-engine/#compactor)**
  as more partition Parquet files need to be compacted.
- **Increased costs associated with [Object storage](/influxdb/cloud-dedicated/reference/internals/storage-engine/#object-storage)**
  as more partition Parquet files are created and stored.
- **Risk of decreased performance for queries that don't use tags in the WHERE clause**.
  These queries may end up reading many partitions and smaller files, degrading performance.

## Limitations

Custom partitioning has the following limitations:

- Database and measurement partitions can only be defined on create.
  You cannot update the partition strategy of a database or measurement after it
  has been created.
- You can partition by up to eight dimensions (seven tags and a time interval).

## How partitioning works

### Partition templates

A partition template defines the pattern used for _[partition keys](#partition-keys)_
and determines the time interval that data is partitioned by.
Partition templates use tag values and
[Rust strftime date and time formatting syntax](https://docs.rs/chrono/latest/chrono/format/strftime/index.html).

_For more detailed information, see [Partition templates](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/)._

### Partition keys

A partition key uniquely identifies a partition. The structure of partition keys
is defined by a _[partition template](#partition-templates)_. Partition keys are
composed of up to eight parts or dimensions (tags and time).
Each part is delimited by the partition key separator (`|`).

{{< expand-wrapper >}}
{{% expand "View example partition templates and keys" %}}

Given the following line protocol with the following timestamps:

- 2023-12-31T23:00:00Z
- 2024-01-01T00:00:00Z
- 2024-01-01T01:00:00Z

```text
production,line=A,station=1 temp=81.2,qty=35i 1704063600000000000
production,line=A,station=2 temp=92.8,qty=35i 1704063600000000000
production,line=B,station=1 temp=101.1,qty=43i 1704063600000000000
production,line=B,station=2 temp=102.4,qty=43i 1704063600000000000
production,line=A,station=1 temp=81.9,qty=36i 1704067200000000000
production,line=A,station=2 temp=110.0,qty=22i 1704067200000000000
production,line=B,station=1 temp=101.8,qty=44i 1704067200000000000
production,line=B,station=2 temp=105.7,qty=44i 1704067200000000000
production,line=A,station=1 temp=82.2,qty=35i 1704070800000000000
production,line=A,station=2 temp=92.1,qty=30i 1704070800000000000
production,line=B,station=1 temp=102.4,qty=43i 1704070800000000000
production,line=B,station=2 temp=106.5,qty=43i 1704070800000000000
```

---

{{% flex %}}
<!---------------------- BEGIN PARTITION EXAMPLES GROUP 1 --------------------->
{{% flex-content "half" %}}

##### Partition template parts

- `%Y-%m-%d` <em class="op50">(by day, default format)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `2023-12-31`
- `2024-01-01`

{{% /flex-content %}}
<!----------------------- END PARTITION EXAMPLES GROUP 1 ---------------------->
{{% /flex %}}

---

{{% flex %}}
<!---------------------- BEGIN PARTITION EXAMPLES GROUP 2 --------------------->
{{% flex-content "half" %}}

##### Partition template parts

- `line`
- `%d %b %Y` <em class="op50">(by day, non-default format)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | 31 Dec 2023`
- `B | 31 Dec 2023`
- `A | 01 Jan 2024`
- `B | 01 Jan 2024`

{{% /flex-content %}}
<!----------------------- END PARTITION EXAMPLES GROUP 2 ---------------------->
{{% /flex %}}

---

{{% flex %}}
<!---------------------- BEGIN PARTITION EXAMPLES GROUP 3 --------------------->
{{% flex-content "half" %}}

##### Partition template parts

- `line`
- `station`
- `%Y-%m-%d` <em class="op50">(by day, default format)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | 1 | 2023-12-31`
- `A | 2 | 2023-12-31`
- `B | 1 | 2023-12-31`
- `B | 2 | 2023-12-31`
- `A | 1 | 2024-01-01`
- `A | 2 | 2024-01-01`
- `B | 1 | 2024-01-01`
- `B | 2 | 2024-01-01`

{{% /flex-content %}}
<!----------------------- END PARTITION EXAMPLES GROUP 3 ---------------------->
{{% /flex %}}

---

{{% flex %}}
<!---------------------- BEGIN PARTITION EXAMPLES GROUP 4 --------------------->
{{% flex-content "half" %}}

##### Partition template parts

- `line`
- `station`
- `%Y-%m-%d %H:00` <em class="op50">(by hour)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | 1 | 2023-12-31 23:00`
- `A | 2 | 2023-12-31 23:00`
- `B | 1 | 2023-12-31 23:00`
- `B | 2 | 2023-12-31 23:00`
- `A | 1 | 2024-01-01 00:00`
- `A | 2 | 2024-01-01 00:00`
- `B | 1 | 2024-01-01 00:00`
- `B | 2 | 2024-01-01 00:00`
- `A | 1 | 2024-01-01 01:00`
- `A | 2 | 2024-01-01 01:00`
- `B | 1 | 2024-01-01 01:00`
- `B | 2 | 2024-01-01 01:00`

{{% /flex-content %}}
<!----------------------- END PARTITION EXAMPLES GROUP 4 ---------------------->
{{% /flex %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Partitions in the query life cycle

When querying data:

1.  The [Catalog](/influxdb/cloud-dedicated/reference/internals/storage-engine/#catalog)
    provides the v3 query engine ([Querier](/influxdb/cloud-dedicated/reference/internals/storage-engine/#querier))
    with the locations of partitions that contain the queried time series data.
2.  The query engine reads all rows in the returned partitions to identify what
    rows match the logic in the query and should be included in the query result.
  
The faster the query engine can identify what partitions to read and then read
the data in those partitions, the more performant queries are.

_For more information about the query lifecycle, see
[InfluxDB v3 query life cycle](/influxdb/cloud-dedicated/reference/internals/storage-engine/#query-life-cycle)._

##### Query example

Consider the following query that selects everything in the `production` measurement
where the `line` tag is `A` and the `station` tag is `1`:

```sql
SELECT *
FROM production
WHERE
  time >= now() - INTERVAL '1 week'
  AND line = 'A'
  AND station = '1'
```

Using the default partitioning strategy (by day), the query engine
reads eight separate partitions (one partition for today and one for each of the
last seven days):

- {{< datetime/current-date trimTime=true >}}
- {{< datetime/current-date offset=-1 trimTime=true >}}
- {{< datetime/current-date offset=-2 trimTime=true >}}
- {{< datetime/current-date offset=-3 trimTime=true >}}
- {{< datetime/current-date offset=-4 trimTime=true >}}
- {{< datetime/current-date offset=-5 trimTime=true >}}
- {{< datetime/current-date offset=-6 trimTime=true >}}
- {{< datetime/current-date offset=-7 trimTime=true >}}

The query engine must scan _all_ rows in the partitions to identify rows
where `line` is `A` and `station` is `1`. This process takes valuable time
and results in less performant queries.

However, if you partition by other tags, InfluxDB can identify partitions that
contain only the tag values your query needs and spend less time
scanning rows to see if they contain the tag values.

For example, if data is partitioned by `line`, `station`, and day, although
there are more partition files, the query engine can quickly identify and read
only those with data relevant to the query:

{{% columns 4 %}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date trimTime=true >}}
- B | 1 | {{< datetime/current-date trimTime=true >}}
- B | 2 | {{< datetime/current-date trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-1 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-1 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-1 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-1 trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-2 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-2 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-2 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-2 trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-3 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-3 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-3 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-3 trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-4 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-4 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-4 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-4 trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-5 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-5 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-5 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-5 trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-6 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-6 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-6 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-6 trimTime=true >}}
- <strong class="req normal green">A | 1 | {{< datetime/current-date offset=-7 trimTime=true >}}</strong>
- A | 2 | {{< datetime/current-date offset=-7 trimTime=true >}}
- B | 1 | {{< datetime/current-date offset=-7 trimTime=true >}}
- B | 2 | {{< datetime/current-date offset=-7 trimTime=true >}}
{{% /columns %}}

---

## Partition guides

{{< children >}}
