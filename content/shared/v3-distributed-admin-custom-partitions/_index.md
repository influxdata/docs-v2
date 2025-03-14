When writing data to {{< product-name >}}, the InfluxDB 3 storage engine stores data in [Apache Parquet](https://parquet.apache.org/) format in the [Object store](/influxdb/version/reference/internals/storage-engine/#object-store). Each Parquet file represents a _partition_--a logical grouping of data.
By default, InfluxDB partitions each table _by day_.
If this default strategy yields unsatisfactory performance for single-series queries,
you can define a custom partitioning strategy by specifying tag values and different time intervals to optimize query performance for your specific schema and workload.

- [Advantages](#advantages)
- [Disadvantages](#disadvantages)
- [Limitations](#limitations)
- [Plan for custom partitioning](#plan-for-custom-partitioning)
- [How partitioning works](#how-partitioning-works)
  - [Partition templates](#partition-templates)
  - [Partition keys](#partition-keys)
- [Partitions in the query life cycle](#partitions-in-the-query-life-cycle)
- [Partition guides](#partition-guides)
  {{< children type="anchored-list" >}}

> [!Note]
>
> #### When to consider custom partitioning
>
> Consider custom partitioning if:
> 
> 1. You have taken steps to [optimize your queries](/influxdb/version/query-data/troubleshoot-and-optimize/optimize-queries/), and
> 2. Performance for _single-series queries_ (querying for a specific [tag value](/influxdb/version/reference/glossary/#tag-value) or [tag set](/influxdb/version/reference/glossary/#tag-set)) is still unsatisfactory. 
> 
> Before choosing a partitioning strategy, weigh the [advantages](#advantages), [disadvantages](#disadvantages), and [limitations](#limitations) of custom partitioning.

## Advantages

The primary advantage of custom partitioning is that it lets you customize your
storage structure to improve query performance specific to your schema and workload.

- **Optimized storage for improved performance on specific types of queries**.
  For example, if queries often select data with a specific tag value, you can
  partition by that tag to improve the performance of those queries.
- **Optimized storage for specific types of data**. For example, if the data you
  store is sparse and the time ranges you query are often much larger than a day,
  you could partition your data by month instead of by day.

## Disadvantages

Using custom partitioning may increase the load on other parts of the
[InfluxDB 3 storage engine](/influxdb/version/reference/internals/storage-engine/),
but you can scale each part individually to address the added load.

> [!Note]
> _The weight of these disadvantages depends upon the cardinality of
>  tags and the specificity of time intervals used for partitioning._

- **Increased load on the [Ingester](/influxdb/version/reference/internals/storage-engine/#ingester)**
  as it groups data into smaller partitions and files.
- **Increased load on the [Catalog](/influxdb/version/reference/internals/storage-engine/#catalog)**
  as more references to partition Parquet file locations are stored and queried.
- **Increased load on the [Compactor](/influxdb/version/reference/internals/storage-engine/#compactor)**
  as it needs to compact more partition Parquet files.
- **Increased costs associated with [Object storage](/influxdb/version/reference/internals/storage-engine/#object-storage)**
  as more partition Parquet files are created and stored.
- **Increased latency**. The amount of time for InfluxDB to process a query and return results increases linearly, although slightly, with the total partition count for a table.
- **Risk of decreased performance for queries that don't use tags in the WHERE clause**.
  These queries might read many partitions and smaller files, which can degrade performance.

## Limitations

Custom partitioning has the following limitations:

- Define database and table partitions only during creation; you can't update the partition strategy afterward.
- Include a time part in a partition template.
- You can partition by up to eight dimensions (seven tags and a time interval).

## Plan for custom partitioning

After you have considered the [advantages](#advantages), [disadvantages](#disadvantages), and [limitations](#limitations) of
custom partitioning, use the guides in this section to:

1. Learn [how partitioning works](#how-partitioning-works)
2. Follow [best practices](/influxdb/version/admin/custom-partitions/best-practices/) for defining partitions and managing partition
   growth
3. [Define custom partitions](/influxdb/version/admin/custom-partitions/define-custom-partitions/) for your data
4. Take steps to [limit the number of partition files](/influxdb/version/admin/custom-partitions/best-practices/#limit-the-number-of-partition-files)

## How partitioning works

### Partition templates

A partition template defines the pattern used for _[partition keys](#partition-keys)_
and determines the time interval that InfluxDB partitions data by.
Partition templates use tag values and
[Rust strftime date and time formatting syntax](https://docs.rs/chrono/latest/chrono/format/strftime/index.html).

_For more detailed information, see [Partition templates](/influxdb/version/admin/custom-partitions/partition-templates/)._

### Partition keys

A partition key uniquely identifies a partition.
A _[partition template](#partition-templates)_ defines the partition key format.
Partition keys are
composed of up to 8 dimensions (1 time part and up to 7 tag or tag bucket parts).
A partition key uses the partition key separator (`|`) to delimit parts.

The default format for partition keys is `%Y-%m-%d` (for example, `2024-01-01`),
which creates 1 partition for each day.

{{< expand-wrapper >}}
{{% expand "View example partition templates and keys" %}}

Given the following line protocol with the following timestamps:

- 2023-12-31T23:00:00Z
- 2024-01-01T00:00:00Z
- 2024-01-01T01:00:00Z

```text
production,line=A,station=cnc temp=81.2,qty=35i 1704063600000000000
production,line=A,station=wld temp=92.8,qty=35i 1704063600000000000
production,line=B,station=cnc temp=101.1,qty=43i 1704063600000000000
production,line=B,station=wld temp=102.4,qty=43i 1704063600000000000
production,line=A,station=cnc temp=81.9,qty=36i 1704067200000000000
production,line=A,station=wld temp=110.0,qty=22i 1704067200000000000
production,line=B,station=cnc temp=101.8,qty=44i 1704067200000000000
production,line=B,station=wld temp=105.7,qty=44i 1704067200000000000
production,line=A,station=cnc temp=82.2,qty=35i 1704070800000000000
production,line=A,station=wld temp=92.1,qty=30i 1704070800000000000
production,line=B,station=cnc temp=102.4,qty=43i 1704070800000000000
production,line=B,station=wld temp=106.5,qty=43i 1704070800000000000
```

---

{{% flex %}}

<!---------------------- BEGIN PARTITION EXAMPLES GROUP 1 --------------------->

{{% flex-content "half" %}}

##### Partition template parts

- `%Y-%m-%d` <em class="op50">time (by day, default format)</em>

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

- `line` <em class="op50">tag</em>
- `%d %b %Y` <em class="op50">time (by day, non-default format)</em>

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

- `line` <em class="op50">tag</em>
- `station` <em class="op50">tag</em>
- `%Y-%m-%d` <em class="op50">time (by day, default format)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | cnc | 2023-12-31`
- `A | wld | 2023-12-31`
- `B | cnc | 2023-12-31`
- `B | wld | 2023-12-31`
- `A | cnc | 2024-01-01`
- `A | wld | 2024-01-01`
- `B | cnc | 2024-01-01`
- `B | wld | 2024-01-01`

{{% /flex-content %}}

<!----------------------- END PARTITION EXAMPLES GROUP 3 ---------------------->

{{% /flex %}}

---

{{% flex %}}

<!---------------------- BEGIN PARTITION EXAMPLES GROUP 4 --------------------->

{{% flex-content "half" %}}

##### Partition template parts

- `line` <em class="op50">tag</em>
- `station,3` <em class="op50">tag bucket</em>
- `%Y-%m-%d` <em class="op50">time (by day, default format)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | 0 | 2023-12-31`
- `B | 0 | 2023-12-31`
- `A | 0 | 2024-01-01`
- `B | 0 | 2024-01-01`

{{% /flex-content %}}

<!----------------------- END PARTITION EXAMPLES GROUP 4 ---------------------->

{{% /flex %}}

---

{{% flex %}}

<!---------------------- BEGIN PARTITION EXAMPLES GROUP 5 --------------------->

{{% flex-content "half" %}}

##### Partition template parts

- `line` <em class="op50">tag</em>
- `station` <em class="op50">tag</em>
- `%Y-%m` <em class="op50">time (by month)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | cnc | 2023-12`
- `A | wld | 2023-12`
- `B | cnc | 2023-12`
- `B | wld | 2023-12`
- `A | cnc | 2024-01`
- `A | wld | 2024-01`
- `B | cnc | 2024-01`
- `B | wld | 2024-01`

{{% /flex-content %}}

<!----------------------- END PARTITION EXAMPLES GROUP 5 ---------------------->

{{% /flex %}}

---

{{% flex %}}

<!---------------------- BEGIN PARTITION EXAMPLES GROUP 6 --------------------->

{{% flex-content "half" %}}

##### Partition template parts

- `line` <em class="op50">tag</em>
- `station,50` <em class="op50">tag bucket</em>
- `%Y-%m` <em class="op50">time (by month)</em>

{{% /flex-content %}}
{{% flex-content %}}

##### Partition keys

- `A | 47 | 2023-12`
- `A | 9 | 2023-12`
- `B | 47 | 2023-12`
- `B | 9 | 2023-12`
- `A | 47 | 2024-01`
- `A | 9 | 2024-01`
- `B | 47 | 2024-01`
- `B | 9 | 2024-01`

{{% /flex-content %}}

<!----------------------- END PARTITION EXAMPLES GROUP 6 ---------------------->

{{% /flex %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Partitions in the query life cycle

When querying data:

1.  The [Catalog](/influxdb/version/reference/internals/storage-engine/#catalog)
    provides the v3 query engine ([Querier](/influxdb/version/reference/internals/storage-engine/#querier))
    with the locations of partitions that contain the queried time series data.
2.  The query engine reads all rows in the returned partitions to identify what
    rows match the logic in the query and should be included in the query result.

The faster the query engine can identify what partitions to read and then read
the data in those partitions, the more performant queries are.

_For more information about the query lifecycle, see
[InfluxDB 3 query life cycle](/influxdb/version/reference/internals/storage-engine/#query-life-cycle)._

##### Query example

Consider the following query that selects everything in the `production` table
where the `line` tag is `A` and the `station` tag is `cnc`:

```sql
SELECT *
FROM production
WHERE
  time >= now() - INTERVAL '1 week'
  AND line = 'A'
  AND station = 'cnc'
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
where `line` is `A` and `station` is `cnc`. This process takes valuable time
and results in less performant queries.

However, including tags in your partitioning strategy allows the query engine to 
identify partitions containing only the required tag values.
This avoids scanning rows for tag values.

For example, if you partition data by `line`, `station`, and day, although
the number of files increases, the query engine can quickly identify and read
only those with data relevant to the query:

{{% columns 4 %}}

- <strong class="req normal green">A | cnc | {{< datetime/current-date trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date trimTime=true >}}
- B | cnc | {{< datetime/current-date trimTime=true >}}
- B | wld | {{< datetime/current-date trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-1 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-1 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-1 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-1 trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-2 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-2 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-2 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-2 trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-3 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-3 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-3 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-3 trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-4 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-4 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-4 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-4 trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-5 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-5 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-5 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-5 trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-6 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-6 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-6 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-6 trimTime=true >}}
- <strong class="req normal green">A | cnc | {{< datetime/current-date offset=-7 trimTime=true >}}</strong>
- A | wld | {{< datetime/current-date offset=-7 trimTime=true >}}
- B | cnc | {{< datetime/current-date offset=-7 trimTime=true >}}
- B | wld | {{< datetime/current-date offset=-7 trimTime=true >}}

{{% /columns %}}

---

## Partition guides

{{< children >}}
