---
title: Analyze a query plan
description: >
  Learn how to read and analyze a query plan to
  understand how a query is executed and find performance bottlenecks.
weight: 401
menu:
  influxdb_cloud_dedicated:
    name: Analyze a query plan
    parent: Execute queries
influxdb/cloud-dedicated/tags: [query, sql, influxql]
related:
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/query-data/influxql/
  - /influxdb/cloud-dedicated/query-data/execute-queries/optimize-queries/
  - /influxdb/cloud-dedicated/query-data/execute-queries/troubleshoot/
  - /influxdb/cloud-dedicated/reference/client-libraries/v3/
---

Learn how to read and analyze a query plan to
understand how a query is executed and find performance bottlenecks.

When you query InfluxDB v3, the query engine devises a _query plan_ for executing the query.
The engine tries to determine the optimal plan for the query structure and data.
By learning how to generate and interpret reports for the query plan, you can better understand how the query is executed and identify bottlenecks that affect the performance of your query.

For example, if the query plan reveals that your query reads a large number of parquet files, you can then take steps to [optimize your query](/influxdb/cloud-dedicated/query-data/execute-queries/optimize-queries/), such as add filters to read less data or
configure your cluster to store fewer and larger files.

- [Use `EXPLAIN` to view the query plan](#use-explain-keywords-to-troubleshoot-the-query-plan)
  - [View the query plan](#view-the-query-plan)
  - [View the query plan with runtime metrics](#view-the-query-plan-with-runtime-metrics)
  - [View the detailed query plan for debugging](#view-the-detailed-query-plan-for-debugging)
  - [Execute EXPLAIN for a query](#execute-explain-for-a-query)
  - [Analyze an EXPLAIN report and troubleshoot the query plan](#analyze-an-explain-report-and-troubleshoot-the-query-plan)

## Use EXPLAIN keywords to view the query plan

Use the `EXPLAIN` keyword (and the optional `ANALYZE` and `VERBOSE` keywords) to generate a report and [view the query plan](#view-the-query-plan).

### View the query plan

To generate a report and view the query plan without running the query, prepend the [`EXPLAIN`](/influxdb/cloud-dedicated/reference/sql/explain/)
keyword to your SQL or InfluxQL query--for example:

```SQL
EXPLAIN SELECT temp FROM home
WHERE time >= now() - INTERVAL '90 days' AND room = 'Kitchen'
ORDER BY time
```

The report includes the [logical plan]() and the [physical plan]() for the query.

### View the query plan with runtime metrics

To run the query and generate a report that includes runtime metrics for each process in the query plan, prepend [`EXPLAIN ANALYZE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze) to the query--for example:

```SQL
EXPLAIN ANALYZE SELECT temp FROM home
WHERE time >= now() - INTERVAL '90 days' AND room = 'Kitchen'
ORDER BY time
```

The report includes the [logical plan]() and the [physical plan]() with operator metrics sampled during the query execution.

### View the detailed query plan for debugging

If a query plan requires the query engine to read lots of data files, `EXPLAIN` shows a truncated list of files.
To include all of the data file names and additional plan details, prepend [`EXPLAIN VERBOSE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze) to the query--for example:

```SQL
EXPLAIN VERBOSE SELECT temp FROM home
WHERE time >= now() - INTERVAL '90 days' AND room = 'Kitchen'
ORDER BY time
```

The report includes the following:

- All truncated information in the `EXPLAIN` report, such as parquet files retrieved for the query
- All intermediate physical plans that the IOx querier and DataFusion generate before the query engine generates the final physical plan--helpful in debugging to see when an _operator_ is added to or removed from a plan

Like `EXPLAIN`, `EXPLAIN VERBOSE` doesn't run the query and doesn't include runtime metrics.

{{% expand-wrapper %}}
{{% expand "View the Python example to run EXPLAIN for a query" %}}

The following example shows how to use the InfluxDB v3 Python client library and pandas to view the `EXPLAIN` report for a query:

<!-- Import for tests and hide from users.
```python
import os
```
-->

<!--pytest-codeblocks:cont-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}

```python
from influxdb_client_3 import InfluxDBClient3
import pandas as pd
import tabulate # Required for pandas.to_markdown()

# Instantiate an InfluxDB client.
client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                        host = f"{{< influxdb/host >}}",
                        database = f"DATABASE_NAME")

sql_explain = '''EXPLAIN
              SELECT temp
              FROM home
              WHERE time >= now() - INTERVAL '90 days'
              AND room = 'Kitchen'
              ORDER BY time'''

table = client.query(sql_explain)
df = table.to_pandas()
print(df.to_markdown(index=False))

assert df.shape == (2, 2), f'Expect {df.shape} to have 2 columns, 2 rows'
assert 'physical_plan' in df.plan_type.values, "Expect physical_plan"
assert 'logical_plan' in df.plan_type.values, "Expect logical_plan"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the specified database

{{% /expand %}}
{{% /expand-wrapper %}}

{{< expand-wrapper >}}
{{% expand "View the EXPLAIN report" %}}
| plan_type     | plan                                                                                                                                                                           |
|:--------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| logical_plan  | Projection: home.temp                                                                                                                                                           |
|         |   Sort: home.time ASC NULLS LAST                                                                                                                                                |
|         |     Projection: home.temp, home.time                                                                                                                                            |
|         |       TableScan: home projection=[room, temp, time], full_filters=[home.time >= TimestampNanosecond(1688676582918581320, None), home.room = Dictionary(Int32, Utf8("Kitchen"))] |
| physical_plan | ProjectionExec: expr=[temp@0 as temp]                                                                                                                                           |
|         |   SortExec: expr=[time@1 ASC NULLS LAST]                                                                                                                                        |
|         |     EmptyExec: produce_one_row=false                                                                                                                                            |
{{% /expand %}}
{{< /expand-wrapper >}}

## Read an EXPLAIN report

When you [execute `EXPLAIN` for a query](#execute-explain-for-a-query), the report includes a [logical plan]() and a [physical plan]().

### Logical plan

A logical plan is generated for a specific SQL or InfluxQL query without knowledge of the underlying data organization or cluster configuration.
Because InfluxDB v3 is built on the [DataFusion](https://github.com/apache/arrow-datafusion) engine, the logical plan is the same as if you use DataFusion with any data format or storage.

### Physical plan

A physical plan is generated from its corresponding [logical plan](#logical-plan) plus the consideration of the cluster configuration (for example, the number of CPUs) and the underlying data organization (for example, the number of files, and whether files overlap).
The physical plan is specific to your InfluxDB cluster configuration and your data.
If you run the same query with the same data on different clusters with different configurations, each cluster may generate a different physical plan for the query.
Likewise, if you run the same query on the same cluster, but at different times, the cluster can generate different physical plans depending on the data at that time.

## Read a query plan

A query plan contains the sequence of steps run during query execution.
Each plan in an `EXPLAIN` report is formatted as an upside-down tree where each step is a _node_ that contains the _operator_ name and a description of the input data that the operator will process.

Use the following steps to analyze a query plan and estimate how much work it does to complete the query. The same steps apply regardless of how large or complex the plan might seem.

1.  Always read the plan from the bottom up.
2.  Read one operator at a time and understand its job.
    Most operators are described in the [DataFusion Physical Plan documentation](https://docs.rs/datafusion/latest/datafusion/physical_plan/index.html).
    Operators not included in DataFusion may be specific to InfluxDB. TODO: need a list [IOx repo](https://github.com/influxdata/influxdb_iox).
3.  For each operator, answer the following questions:
    - What is the shape and size of data input to the operator?
    - What is the shape and size of data output from the operator?

Understanding the sequence, role, and data for the operators in your query can help you estimate the overall workload in the query.

### Example query plan for SELECT...ORDER BY query

The following example shows how to read an `EXPLAIN` report and a physical query plan.

Given `h20` measurement data and the following query:

```sql
EXPLAIN SELECT city, min_temp, time FROM h2o ORDER BY city ASC, time DESC;
```

The output is similar to the following:

#### Figure 1. EXPLAIN report

```sql
| plan_type     | plan                                                                     |
+---------------+--------------------------------------------------------------------------+
| logical_plan  | Sort: h2o.city ASC NULLS LAST, h2o.time DESC NULLS FIRST                 |
|               |   TableScan: h2o projection=[city, min_temp, time]                       |
| physical_plan | SortPreservingMergeExec: [city@0 ASC NULLS LAST,time@2 DESC]             |
|               |   UnionExec                                                              |
|               |     SortExec: expr=[city@0 ASC NULLS LAST,time@2 DESC]                   |
|               |       ParquetExec: file_groups={...}, projection=[city, min_temp, time]  |
|               |     SortExec: expr=[city@0 ASC NULLS LAST,time@2 DESC]                   |
|               |       ParquetExec: file_groups={...}, projection=[city, min_temp, time]  |
|               |                                                                          |
```

{{% caption %}}
Output from `EXPLAIN SELECT city, min_temp, time FROM h2o ORDER BY city ASC, time DESC;`
{{% /caption %}}

The output contains two columns (`plan_type` and `plan`), a row for the [`logical_plan`](#logical-plan), and a row for the [`physical_plan`](#physical-plan).
In the report, each `plan` value contains the sequence of steps that the query engine follows when running the query.
A plan is formatted as an upside-down tree and you read it from the bottom up.
Each step, or node, in the plan begins with the name of the _operator_ for that node--for example, the first node in the [Figure 1](#figure-1-explain-report) physical plan is an `ParquetExec` operator:

```text
ParquetExec: file_groups={...}, projection=[city, min_temp, time]
```

Operators process and transform data before sending it to the next node in the plan.
Operator names contain the _Exec_ suffix.

The following data flow diagram shows the sequence of operators in the [Figure 1](#query-plan-figure-1) physical plan:

#### Figure 2. Physical plan in tree format

```text
                   ┌─────────────────────────┐
                   │ SortPreservingMergeExec │
                   └─────────────────────────┘
                                ▲
                                │
                   ┌─────────────────────────┐
                   │        UnionExec        │
                   └─────────────────────────┘
                                ▲
             ┌──────────────────┴─────────────────┐
             │                                    │
┌─────────────────────────┐          ┌─────────────────────────┐
│        SortExec         │          │        SortExec         │
└─────────────────────────┘          └─────────────────────────┘
             ▲                                    ▲
             │                                    │
             │                                    │
┌─────────────────────────┐          ┌─────────────────────────┐
│       ParquetExec       │          │       ParquetExec       │
└─────────────────────────┘          └─────────────────────────┘
```

{{% caption %}}
The [Figure 1](#figure-1-explain-report) physical plan in tree format
{{% /caption %}}

The [Figure 1](#figure-1-explain-report) physical plan has the following steps:

1.  Two `ParquetExec` operators, in parallel, read data from parquet files.
    Each `ParquetExec` operator reads data sequentially from each file in its file group, and then outputs a stream of data to its corresponding `SortExec` operator.
2.  The `SortExec` operators, in parallel, sort the data by `city` (ascending) and `time` (descending).
3.  The `UnionExec` operator unions the output of the parallel `SortExec` operators.
4.  The `SortPreservingMergeExec` operator sorts and merges the `UnionExec` output.

## Analyze a query plan for leading edge data

This example guides you through analyzing a physical query plan for a typical time series use case: querying leading edge data.
The query plan includes InfluxDB-specific operators as well as common DataFusion operators.

### Retrieve the query plan

Given `h20` measurement data,
the following SQL generates an `EXPLAIN` report for the query:

```sql
EXPLAIN SELECT city, count(1)
FROM h2o
WHERE time >= to_timestamp(200) AND time < to_timestamp(700)
  AND state = 'MA'
GROUP BY city
ORDER BY city ASC;
```

{{< expand-wrapper >}}
{{% expand "View the EXPLAIN report" %}}

```sql
+---------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| plan_type     | plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
+---------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| logical_plan  | Sort: h2o.city ASC NULLS LAST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|               |   Aggregate: groupBy=[[h2o.city]], aggr=[[COUNT(Int64(1))]]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|               |     TableScan: h2o projection=[city], full_filters=[h2o.time >= TimestampNanosecond(200, None), h2o.time < TimestampNanosecond(700, None), h2o.state = Dictionary(Int32, Utf8("MA"))]                                                                                                                                                                                                                                                                                                                                                                                                                   |
| physical_plan | SortPreservingMergeExec: [city@0 ASC NULLS LAST]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|               |   SortExec: expr=[city@0 ASC NULLS LAST]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|               |     AggregateExec: mode=FinalPartitioned, gby=[city@0 as city], aggr=[COUNT(Int64(1))]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|               |       CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|               |         RepartitionExec: partitioning=Hash([city@0], 4), input_partitions=4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|               |           AggregateExec: mode=Partial, gby=[city@0 as city], aggr=[COUNT(Int64(1))]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|               |             RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|               |               UnionExec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|               |                 ProjectionExec: expr=[city@0 as city]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                   CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|               |                     FilterExec: time@2 >= 200 AND time@2 < 700 AND state@1 = MA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|               |                       ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/243db601-f3f1-401b-afda-82160d8cc1a8.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/f5fb7c7d-16ac-49ba-a811-69578d05843f.parquet]]}, projection=[city, state, time], output_ordering=[state@1 ASC, city@0 ASC, time@2 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3                                           |
|               |                 ProjectionExec: expr=[city@1 as city]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                   DeduplicateExec: [state@2 ASC,city@1 ASC,time@3 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|               |                     SortPreservingMergeExec: [state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|               |                       UnionExec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|               |                         SortExec: expr=[state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|               |                           CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                             FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|               |                               RecordBatchesExec: chunks=1, projection=[__chunk_order, city, state, time]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|               |                         CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|               |                           FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                             ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/2cbb3992-4607-494d-82e4-66c480123189.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/9255eb7f-2b51-427b-9c9b-926199c85bdf.parquet]]}, projection=[__chunk_order, city, state, time], output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3 |
|               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
+---------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```
{{% caption %}}
Figure 3: A query plan for a typical leading edge data query
{{% /caption %}}

{{% /expand %}}
{{< /expand-wrapper >}}

Like [Example 1](#example-query-plan-for-selectorder-by-query), this example analyzes the _physical_ query plan.
In the `EXPLAIN` report, find the row where the `plan_type` column has the value `physical_plan`. The `plan` column contains the physical plan.


### How the query plan reads data, an example summary

As you follow the steps to [read the query plan](#read-a-query-plan),
starting at the bottom (the _leaf_ nodes) and reading up, the first operators you see are `ParquetExec` and `RecordBatchesExec`, which retrieve data from storage and the ingester, respectively.
The number of `ParquetExec` and `RecordBatchesExec` nodes and their parameter values can tell you which data (and how much) is retrieved for your query, and how efficiently the plan handles the organization (for example, partitions and duplicates) of your data.

With an understanding of the `ParquetExec` and `RecordBatchesExec` operators, you could summarize their nodes in Figure 3 as follows:

- The query plan includes 3 bottom leaf operators: 2 `ParquetExec` and 1 `RecordBatchesExec`.
-  `RecordBatchesExec`: retrieves recently [ingested data]() not yet in storage; indicates that data is being ingested.
-  `ParquetExec`: retrieved 4 parquet files from storage:

   -  Two files [_overlap_](#overlapped-files-and-duplicate-data) each other and with the ingested data; the plan must deduplicate data before sending it to the next operator.
   -  Two files don't overlap any files; no deduplication of the data is required.

This summary demonstrates the information you can glean by understanding query plan operators and their arguments.
The following sections walk through the steps to [read the query plan](#read-a-query-plan) and examine the operators, their input, and output.

{{% note %}}

#### Overlapped files and duplicate data

_Overlapped_ files contain duplicate data between them, and the query plan must deduplicate the data.
Due to how InfluxDB organizes data, data is never duplicated _within_ a file.
Therefore, non-overlapping files don't require deduplication.

{{% /note %}}

### Reading data (ParquetExec and RecordBatchesExec operators)

`ParquetExec` operators read data from files in storage.
`RecordBatchesExec` operators read data from the ingester (recently written data not yet in storage).
Because `ParquetExec` and `RecordBatchesExec` operators are responsible for retrieving data for a query,
every query plan starts with one or both.

- [First ParquetExec]()
- [Second ParquetExec]()
- [RecordBatchesExec]()

#### First ParquetExec

```sql
ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/2cbb3992-4607-494d-82e4-66c480123189.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/9255eb7f-2b51-427b-9c9b-926199c85bdf.parquet]]}, projection=[__chunk_order, city, state, time], output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3 |
```

Figure 4: First ParquetExec

This node has the following arguments:

##### file_groups

A file group is a list of data file paths for the operator to read.
A file group can contain many files.
Groups are executed in parallel, and files in each group are read sequentially.

The example operator reads two groups of files:

```text
file_groups={2 groups:...}
```

And each group contains one file.
Therefore, the operator reads two files in parallel.

A group references files by path (in S3):

- `1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/2cbb3992-4607-494d-82e4-66c480123189.parquet`
- `1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/9255eb7f-2b51-427b-9c9b-926199c85bdf.parquet`

A path has the following structure:

```text
<namespace_id>/<table_id>/<partition_hash_id>/<uuid_of_the_file>.parquet
    1         /    1    /b862a7e9b329ee6a4.../2cbb3992-4607-4....parquet
```

- `namespace_id`: the namespace (database) being queried
- `table_id`: the table (measurement) being queried
- `partition_hash_id`: the partition this file belongs to.
You can count partition IDs to find how many partitions the query reads.
- `uuid_of_the_file`: the file identifier.
You can use this to find file information (for example: size and number of rows) in the catalog or to download and debug the file locally.

{{% note %}}

#### Download a parquet file for debugging

To download a data file to your local system:

[Serverless](https://github.com/influxdata/docs.influxdata.io/blob/main/content/operations/specifications/iox_runbooks/querier/querier-diagnose-repro-an-issue.md#iii-download-files-and-reproduce-the-problem-locally)
[Dedicated](https://github.com/influxdata/docs.influxdata.io/blob/main/content/operations/specifications/iox_runbooks/querier/querier-cst-access.md#down-load-files-and-rebuild-catalog-to-reproduce-the-issue-locally)

{{% /note %}}

##### projection

`projection` lists the table columns that the query plan reads.
The parameter name `projection` refers to _projection pushdown_, the action of filtering columns.

The example table contains many columns, but only four are read for the query.

```text
projection=[__chunk_order, city, state, time]
```

`__chunk_order` is an InfluxDB-generated column used to keep the chunks and files in order for deduplication.

##### output ordering

`output_ordering` specifies the sort order for the operator output.

This `ParquetExec` operator will output data sorted by `state ASC, city ASC, time ASC, __chunk_order ASC`, the existing sort order in the file.

```text
output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC]
```

##### predicate

`predicate` is the data filter as specified in the query.

```text
predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA
```

##### pruning predicate

`pruning_predicate` is transformed from the [`predicate`](#predicate) value and used for pruning data and files (for example, by partition) and used for pruning data and files (for example, by partition).
Default is to filter files by `time`.

```text
pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3
```

Before the physical plan is generated, an additional `partition pruning` step uses predicates on partitioning columns to prune partitions.


#### RecordbatchesExec

```sql
  |               |                               RecordBatchesExec: chunks=1, projection=[__chunk_order, city, state, time]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
```

Figure 5: RecordBacthesExec

##### chunks

`chunks` is the number of data chunks from the ingester.
Data can arrive from the ingester in many chunks.

This example only has one data chunk.

```text
chunks=1
```

##### projection

As in the preceding `ParquetExec` operator, `projection` specifies 4 columns to read and output:

```text
projection=[__chunk_order, city, state, time]
```

**Second ParquetExec**

```sql
|               |                       ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/243db601-f3f1-401b-afda-82160d8cc1a8.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/f5fb7c7d-16ac-49ba-a811-69578d05843f.parquet]]}, projection=[city, state, time], output_ordering=[state@1 ASC, city@0 ASC, time@2 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3                                           |
```
Figure 6: Second ParquetExec

The readings are similar to the one above. Note that these files and the ones in the first ParquetExec belong to the same partition

### Data-scanning structures

So the question is why we split parquet files into different ParquetExec while they are in the same partition? There are many reasons but two major ones are:
1. Split the non-overlaps from the overlaps so we only need to apply the expensive deduplication operatotion on the overlaps. This is the case of this example.
2. Split the non-overlaps to increase parallel execution

##### When we know there are ovelaps?

```sql
|               |                   DeduplicateExec: [state@2 ASC,city@1 ASC,time@3 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|               |                     SortPreservingMergeExec: [state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|               |                       UnionExec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|               |                         SortExec: expr=[state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|               |                           CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                             FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|               |                               RecordBatchesExec: chunks=1, projection=[__chunk_order, city, state, time]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|               |                         CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|               |                           FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                             ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/2cbb3992-4607-494d-82e4-66c480123189.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/9255eb7f-2b51-427b-9c9b-926199c85bdf.parquet]]}, projection=[__chunk_order, city, state, time], output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3 |

```
Figure 7: DeduplicationExec is a signal of overlapped data

This structure tells us that since there are `DeduplicationExec`, data underneat it overlaps. More specifically, data in 2 files overlaps or/and overlap with the data from the Ingesters.

- `FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA`: This is the place we filter out everything that meets the conditions `time@3 >= 200 AND time@3 < 700 AND state@2 = MA`. The pruning before just prune data when possible, it does not guarantee all of them are pruned. We need this filter to do the fully filtering job.
- `CoalesceBatchesExec: target_batch_size=8192` is just a way to group smaller data to larger groups if possible. Refer to DF document for how it works
- `SortExec: expr=[state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]` : this sorts data on `state ASC, city ASC, time ASC, __chunk_order ASC`. Note that this sort operator is only applied on data from ingesters because data from files is already sorted on that order.
- `UnionExec` is simply a place to pull many streams together. It does not merge anything.
- `SortPreservingMergeExec: [state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]` : this merges the already sorted data. When you see this, you know data below must be sorted. The output data is in one sorted stream.
- `DeduplicateExec: [state@2 ASC,city@1 ASC,time@3 ASC]` : this deduplicated sorted data coming from strictly one input stream. That is why you often see under `DeduplicateExec` is `SortPreservingMergeExec` but it is not a must. As long as the input to `DeduplicateExec` is one sorted stream of data, it will work correctly.

##### When we know there are no overlaps?

```sql
|               |                 ProjectionExec: expr=[city@0 as city]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                   CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|               |                     FilterExec: time@2 >= 200 AND time@2 < 700 AND state@1 = MA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|               |                       ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/243db601-f3f1-401b-afda-82160d8cc1a8.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/f5fb7c7d-16ac-49ba-a811-69578d05843f.parquet]]}, projection=[city, state, time], output_ordering=[state@1 ASC, city@0 ASC, time@2 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3                                           |
|
```
Figure 8: No `DeduplicateExec` means files not overlap

Deduplicate is not in this structure and above it means the files here do not overlap

- `ProjectionExec: expr=[city@0 as city]` : this will filter column data and only send out data of column `city`


### Other operators

Now let us look at the rest of the plan

```sql
| physical_plan | SortPreservingMergeExec: [city@0 ASC NULLS LAST]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|               |   SortExec: expr=[city@0 ASC NULLS LAST]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|               |     AggregateExec: mode=FinalPartitioned, gby=[city@0 as city], aggr=[COUNT(Int64(1))]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|               |       CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|               |         RepartitionExec: partitioning=Hash([city@0], 4), input_partitions=4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|               |           AggregateExec: mode=Partial, gby=[city@0 as city], aggr=[COUNT(Int64(1))]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|               |             RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|               |               UnionExec
```
Figure 9: The rest of the plan structure


- `UnionExec`: union data streams. Note that the number of output streams is the same is the numner of input streams. The operator above it is responsible to do actual merge or split streams further. This UnionExec is just here as an intermediate steps of the merge/split.
- `RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=3`: This split 3 input streams into 4 output streams in round-robin fashion. The reason to split is to increase the parallel execution.
- `AggregateExec: mode=Partial, gby=[city@0 as city], aggr=[COUNT(Int64(1))]`:  This group data as specified in `city, count(1)`. Becasue there are 4 input streams, each stream is aggregated separately and hence the output also 4 streams which means the output data is not fully aggregated and the `mode=Partial` signals us that.
- `RepartitionExec: partitioning=Hash([city@0], 4), input_partitions=4` : this repartitions data on hash(`city`) into 4 streams which means the same city will go into the same stream
- `AggregateExec: mode=FinalPartitioned, gby=[city@0 as city], aggr=[COUNT(Int64(1))]`: Since  rows of same city are in the same stream, we only need to do the final aggregation.
- `SortExec: expr=[city@0 ASC NULLS LAST]` : Sort 4 streams of data each on `city` per the query request
- `SortPreservingMergeExec: [city@0 ASC NULLS LAST]`: (Sort) merge 4 sorted streams to return the final results

# For your questions and references

If you see the plan reads a lof of files but do dedplication on all of them you may want ask: "do all of them overlap or not?" The asnwer is either yes or no depending on the situation. There are other reasons that we deduplicate non-overlap files due to memory limitation but they will be topics for future documentation.

See [slow queries](https://github.com/influxdata/docs.influxdata.io/blob/main/content/operations/specifications/iox_runbooks/slow-queries.md) for common use cases

In the preceding examples, the `EXPLAIN` report only shows you the plan without executing it.
If you want to know exactly how long a plan and each of its operators take, you need [tools that show the runtime for each operator]().

#### Measure the runtime for each operator

Use the following tools to view runtime metrics for each query plan operator:

- [Collect traces for {{% product-name %}}](#enable-trace-logging) and use Jaeger to read them.
- Run `EXPLAIN ANALYZE` with the query to view the `EXPLAIN` report plus runtime metrics.

{{% note %}}

`EXPLAIN VERBOSE` doesn't provide runtime metrics, but it does provide additional detail for debugging--particularly, the full list of parquet files retrieved and all intermediate physical plans.

{{% /note %}}


- `ProjectionExec`: reports the columns in the query `SELECT` statement and marks the start of executing the query over a batch of parquet files.
- `UnionExec`: the query is processing file batches in parallel and then combining ("unioning") the results; parallel execution is generally more performant than sequential.
  For {{% product-name %}}, the number of file groups can be configured to determine when files are processed in parallel vs. sequentially.
- To count the total number of parquet files within a `UnionExec` process, add the counts from each `ParquetExec: file_groups` process.
- `DeduplicateExec`: the query engine is de-duplicating overlapped files; a more expensive operation that may indicate a suboptimal query plan.
  If your query runs `DeduplicateExec` for more than 10 total files, see how to [get help resolving query issues](#get-help-resolving-issues).
- `SortPreserveMergeExec`: indicates a file is already sorted (by tags and time) and doesn't require re-sorting.
- `SortExec` indicates re-sorting a file; within a `DeduplicateExec` process, `SortExec` is a more expensive operation that may indicate a suboptimal query plan.
- `ParquetExec: file_groups`: the set of unique parquet files retrieved and queried within the given `ProjectionExec`.

#### Example

```SQL
ProjectionExec: expr=[cluster_id@1 as cluster_id, device@2 as device, free@3 as free, fstype@4 as fstype, host@5 as host, inodes_free@6 as inodes_free, inodes_total@7 as inodes_total, inodes_used@8 as inodes_used, mode@9 as mode, path@10 as path, time@11 as time, total@12 as total, used@13 as used, used_percent@14 as used_percent]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
  DeduplicateExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    SortPreservingMergeExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
      SortExec: expr=[cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
        CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
          FilterExec: time@11 >= 1687885391398358371 AND (time@11 < -9223372036854775808 OR time@11 > 1656349451399264154)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
            ParquetExec: file_groups={8 groups: [[<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], ...]}, projection=[__chunk_order, cluster_id, device, free, fstype, host, inodes_free, inodes_total, inodes_used, mode, path, time, total, used, used_percent], predicate=time@10 >= 1687885391398358371 AND (time@10 < -9223372036854775808 OR time@10 > 1656349451399264154), pruning_predicate=time_max@0 >= 1687885391398358371 AND (time_min@1 < -9223372036854775808 OR time_max@0 > 1656349451399264154) |
ProjectionExec: expr=[cluster_id@1 as cluster_id, device@2 as device, free@3 as free, fstype@4 as fstype, host@5 as host, inodes_free@6 as inodes_free, inodes_total@7 as inodes_total, inodes_used@8 as inodes_used, mode@9 as mode, path@10 as path, time@11 as time, total@12 as total, used@13 as used, used_percent@14 as used_percent]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
  DeduplicateExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    SortPreservingMergeExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
      SortExec: expr=[cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
        CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
          FilterExec: time@11 >= 1687885391398358371 AND (time@11 < -9223372036854775808 OR time@11 > 1656349451399264154)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
            ParquetExec: file_groups={8 groups: [[<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], ...]}, projection=[__chunk_order, cluster_id, device, free, fstype, host, inodes_free, inodes_total, inodes_used, mode, path, time, total, used, used_percent], predicate=time@10 >= 1687885391398358371 AND (time@10 < -9223372036854775808 OR time@10 > 1656349451399264154), pruning_predicate=time_max@0 >= 1687885391398358371 AND (time_min@1 < -9223372036854775808 OR time_max@0 > 1656349451399264154) |
```

The following describes the processes in the `EXPLAIN` report's `physical_plan` row and their role in query performance:

```SQL
ProjectionExec: expr=[cluster_id@1 as cluster_id, device@2 as device, free@3 as free, fstype@4 as fstype, host@5 as host, inodes_free@6 as inodes_free, inodes_total@7 as inodes_total, inodes_used@8 as inodes_used, mode@9 as mode, path@10 as path, time@11 as time, total@12 as total, used@13 as used, used_percent@14 as used_percent] |
```

`ProjectionExec`: columns in the `SELECT` statement.

```SQL
  DeduplicateExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC]
```

`DeduplicateExec`: de-duplicating overlapped files. Given the total file count (`file_groups` >= 40 files) exceeds 10 files, `DeduplicateExec` may be a bottleneck.

```SQL
    SortPreservingMergeExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]
```

`SortPreservingMergeExec`: files are already sorted (by tags and time), and don't require re-sorting.

```sql
      SortExec: expr=[cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]
```

`SortExec`: indicates the file is re-sorted; within a `DeduplicateExec` indicates a more expensive operation.

```SQL
        CoalesceBatchesExec: target_batch_size=8192
```

```SQL
          FilterExec: time@11 >= 1687885391398358371 AND (time@11 < -9223372036854775808 OR time@11 > 1656349451399264154)
```

```SQL
            ParquetExec: file_groups={8 groups: [[<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], ...]}, projection=[__chunk_order, cluster_id, device, free, fstype, host, inodes_free, inodes_total, inodes_used, mode, path, time, total, used, used_percent], predicate=time@10 >= 1687885391398358371 AND (time@10 < -9223372036854775808 OR time@10 > 1656349451399264154), pruning_predicate=time_max@0 >= 1687885391398358371 AND (time_min@1 < -9223372036854775808 OR time_max@0 > 1656349451399264154)
```

```SQL
| plan |
| ProjectionExec: expr=[cluster_id@1 as cluster_id, device@2 as device, free@3 as free, fstype@4 as fstype, host@5 as host, inodes_free@6 as inodes_free, inodes_total@7 as inodes_total, inodes_used@8 as inodes_used, mode@9 as mode, path@10 as path, time@11 as time, total@12 as total, used@13 as used, used_percent@14 as used_percent]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|   DeduplicateExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|     SortPreservingMergeExec: [cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|       SortExec: expr=[cluster_id@1 ASC,host@5 ASC,time@11 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|         CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|           FilterExec: time@11 >= 1687885391398358371 AND (time@11 < -9223372036854775808 OR time@11 > 1656349451399264154)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|             ParquetExec: file_groups={8 groups: [[<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], [<file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, <file_id>.parquet, ...], ...]}, projection=[__chunk_order, cluster_id, device, free, fstype, host, inodes_free, inodes_total, inodes_used, mode, path, time, total, used, used_percent], predicate=time@10 >= 1687885391398358371 AND (time@10 < -9223372036854775808 OR time@10 > 1656349451399264154), pruning_predicate=time_max@0 >= 1687885391398358371 AND (time_min@1 < -9223372036854775808 OR time_max@0 > 1656349451399264154) |
```

#### Example

```SQL
----------
| plan_type    | plan    |
----------
| logical_plan    | Sort: time DESC NULLS FIRST    |
|    |   Projection: h2o.state, h2o.city, h2o.min_temp AS time, h2o.area    |
|    |     TableScan: h2o projection=[area, city, min_temp, state], full_filters=[h2o.min_temp IS NOT NULL]    |
| physical_plan    | SortPreservingMergeExec: [time@2 DESC]    |
|    |   SortExec: expr=[time@2 DESC]    |
|    |     ProjectionExec: expr=[state@3 as state, city@1 as city, min_temp@2 as time, area@0 as area]    |
|    |       UnionExec    |
|    |         CoalesceBatchesExec: target_batch_size=8192    |
|    |     FilterExec: min_temp@2 IS NOT NULL    |
|    |       ParquetExec: file_groups={1 group: [[<file_id>.parquet]]}, projection=[area, city, min_temp, state], output_ordering=[state@3 ASC, city@1 ASC], predicate=min_temp@3 IS NOT NULL    |
|    |         CoalesceBatchesExec: target_batch_size=8192    |
|    |     FilterExec: min_temp@2 IS NOT NULL    |
|    |       RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=1    |
|    |         ProjectionExec: expr=[area@1 as area, city@3 as city, min_temp@4 as min_temp, state@5 as state]    |
|    |           DeduplicateExec: [state@5 ASC,city@3 ASC,time@2 ASC]    |
|    |             SortPreservingMergeExec: [state@5 ASC,city@3 ASC,time@2 ASC,__chunk_order@0 ASC]    |
|    |               ParquetExec: file_groups={2 groups: [[<file_id>.parquet], [<file_id>.parquet]]}, projection=[__chunk_order, area, time, city, min_temp, state], output_ordering=[state@5 ASC, city@3 ASC, time@2 ASC, __chunk_order@0 ASC]    |
|    |         CoalesceBatchesExec: target_batch_size=8192    |
|    |     FilterExec: min_temp@2 IS NOT NULL    |
|    |       RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=1    |
|    |         ProjectionExec: expr=[area@1 as area, city@3 as city, min_temp@4 as min_temp, state@5 as state]    |
|    |           DeduplicateExec: [city@3 ASC,state@5 ASC,time@2 ASC]    |
|    |             SortExec: expr=[city@3 ASC,state@5 ASC,time@2 ASC,__chunk_order@0 ASC]    |
|    |               RecordBatchesExec: chunks=1, projection=[__chunk_order, area, time, city, min_temp, state]    |
|    |    |
----------
```

#### Query includes an intensive process or large time range

 See (#strategies-for-improving-query-performance)

#### Query plan applies the same sort (`ORDER BY`) to already sorted data

#### Query retrieves many parquet files from object storage

 The same query performs better if it retrieves fewer - though, larger - files.

 See (#strategies-for-improving-query-performance)

#### Querying many overlapped parquet files

#### Performing a large number of table scans

See how to analyze and troubleshoot queries to find performance bottlenecks.


## Get help resolving issues

## Enable trace logging

When you enable trace logging for a query, InfluxDB propagates your _trace ID_ through system processes and collects additional log information.

InfluxDB Support can then use the trace ID that you provide to filter, collate, and analyze log information for the query run.
The tracing system follows the [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) model for providing observability into a request.

{{% warn %}}
#### Avoid unnecessary tracing

Only enable tracing for a query when you need to request troubleshooting help from InfluxDB Support.
To manage resources, InfluxDB has an upper limit for the number of trace requests.
Too many traces can cause InfluxDB to evict log information.
{{% /warn %}}

To enable tracing for a query, include the `influx-trace-id` header in your query request.

### Syntax

Use the following syntax for the `influx-trace-id` header:

```http
influx-trace-id: TRACE_ID:1112223334445:0:1
```

In the header value, replace the following:

- `TRACE_ID`: a unique string, 8-16 bytes long, encoded as hexadecimal (32 maximum hex characters).
  The trace ID should uniquely identify the query run.
- `:1112223334445:0:1`: InfluxDB constant values (required, but ignored)

### Example

The following examples show how to create and pass a trace ID to enable query tracing in InfluxDB:

{{< tabs-wrapper >}}
{{% tabs %}}
[Python with FlightCallOptions](#)
[Python with FlightClientMiddleware](#python-with-flightclientmiddleware)
{{% /tabs %}}
{{% tab-content %}}
<!---- BEGIN PYTHON WITH FLIGHTCALLOPTIONS ---->
Use the `InfluxDBClient3` InfluxDB Python client and pass the `headers` argument in the
`query()` method.

<!-- Import for tests and hide from users.
```python
import os
```
-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}

<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3
import secrets

def use_flightcalloptions_trace_header():
  print('# Use FlightCallOptions to enable tracing.')
  client = InfluxDBClient3(token=f"DATABASE_TOKEN",
                          host=f"{{< influxdb/host >}}",
                          database=f"DATABASE_NAME")

  # Generate a trace ID for the query:
  # 1.  Generate a random 8-byte value as bytes.
  # 2.  Encode the value as hexadecimal.
  random_bytes = secrets.token_bytes(8)
  trace_id = random_bytes.hex()

  # Append required constants to the trace ID.
  trace_value = f"{trace_id}:1112223334445:0:1"

  # Encode the header key and value as bytes.
  # Create a list of header tuples.
  headers = [((b"influx-trace-id", trace_value.encode('utf-8')))]

  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"
  influxql = "SELECT * FROM home WHERE time >= -90d"

  # Use the query() headers argument to pass the list as FlightCallOptions.
  client.query(sql, headers=headers)

  client.close()

use_flightcalloptions_trace_header()
```

{{% /code-placeholders %}}
<!---- END PYTHON WITH FLIGHTCALLOPTIONS ---->
{{% /tab-content %}}
{{% tab-content %}}
<!---- BEGIN PYTHON WITH MIDDLEWARE ---->
Use the `InfluxDBClient3` InfluxDB Python client and `flight.ClientMiddleware` to pass and inspect headers.

### Tracing response header

With tracing enabled and a valid trace ID in the request, InfluxDB's `DoGet` action response contains a header with the trace ID that you sent.

#### Trace response header syntax

```http
trace-id: TRACE_ID
```

### Inspect Flight response headers

To inspect Flight response headers when using a client library, pass a `FlightClientMiddleware` instance.
that defines a middleware callback function for the `onHeadersReceived` event (the particular function name you use depends on the client library language).

The following example uses Python client middleware that adds request headers and extracts the trace ID from the `DoGet` response headers:

<!-- Import for tests and hide from users.
```python
import os
```
-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}

<!--pytest-codeblocks:cont-->

```python
import pyarrow.flight as flight

class TracingClientMiddleWareFactory(flight.ClientMiddleware):
  # Defines a custom middleware factory that returns a middleware instance.
    def __init__(self):
        self.request_headers = []
        self.response_headers = []
        self.traces  = []

    def addRequestHeader(self, header):
        self.request_headers.append(header)

    def addResponseHeader(self, header):
        self.response_headers.append(header)

    def addTrace(self, traceid):
        self.traces.append(traceid)

    def createTrace(self, traceid):
      # Append InfluxDB constants to the trace ID.
      trace = f"{traceid}:1112223334445:0:1"

      # To the list of request headers,
      # add a tuple with the header key and value as bytes.
      self.addRequestHeader((b"influx-trace-id", trace.encode('utf-8')))

    def start_call(self, info):
        return TracingClientMiddleware(info.method, self)

class TracingClientMiddleware(flight.ClientMiddleware):
  # Defines middleware with client event callback methods.
    def __init__(self, method, callback_obj):
        self._method = method
        self.callback = callback_obj

    def call_completed(self, exception):
      print('callback: call_completed')
      if(exception):
        print(f"  ...with exception: {exception}")

    def sending_headers(self):
      print('callback: sending_headers: ', self.callback.request_headers)
      if len(self.callback.request_headers) > 0:
        return dict(self.callback.request_headers)

    def received_headers(self, headers):
      self.callback.addResponseHeader(headers)
      # For the DO_GET action, extract the trace ID from the response headers.
      if str(self._method) == "FlightMethod.DO_GET" and "trace-id" in headers:
          trace_id = headers["trace-id"][0]
          self.callback.addTrace(trace_id)

from influxdb_client_3 import InfluxDBClient3
import secrets

def use_middleware_trace_header():
  print('# Use Flight client middleware to enable tracing.')

  # Instantiate the middleware.
  res = TracingClientMiddleWareFactory()

  # Instantiate the client, passing in the middleware instance that provides
  # event callbacks for the request.
  client = InfluxDBClient3(token=f"DATABASE_TOKEN",
                          host=f"{{< influxdb/host >}}",
                          database=f"DATABASE_NAME",
                          flight_client_options={"middleware": (res,)})

  # Generate a trace ID for the query:
  # 1.  Generate a random 8-byte value as bytes.
  # 2.  Encode the value as hexadecimal.
  random_bytes = secrets.token_bytes(8)
  trace_id = random_bytes.hex()

  res.createTrace(trace_id)

  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"

  client.query(sql)
  client.close()
  assert trace_id in res.traces[0], "Expect trace ID in DoGet response."

use_middleware_trace_header()
```
{{% /code-placeholders %}}
<!---- END PYTHON WITH  MIDDLEWARE ---->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the specified database

{{% note %}}
Store or log your query trace ID to ensure you can provide it to InfluxDB Support for troubleshooting.
{{% /note %}}

After you run your query with tracing enabled, do the following:

- Remove the tracing header from subsequent runs of the query (to [avoid unnecessary tracing](#avoid-unnecessary-tracing)).
- Provide the trace ID in a request to InfluxDB Support.

## Retrieve query information

In addition to the SQL standard `information_schema`, {{% product-name %}} contains _system_ tables that provide access to
InfluxDB-specific information.
The information in each system table is scoped to the namespace you're querying;
you can only retrieve system information for that particular instance.

To get information about queries you've run on the current instance, use SQL to query the [`system.queries` table](/influxdb/cloud-dedicated/reference/internals/system-tables/#systemqueries-measurement), which contains information from the querier instance currently handling queries.
If you [enabled trace logging for the query](#enable-trace-logging-for-a-query), the `trace-id` appears in the `system.queries.trace_id` column for the query.

The `system.queries` table is an InfluxDB v3 **debug feature**.
To enable the feature and query `system.queries`, include an `"iox-debug"` header set to `"true"` and use SQL to query the table.

The following sample code shows how to use the Python client library to do the following:

1.  Enable tracing for a query.
2.  Retrieve the trace ID record from `system.queries`.

<!-- Import for tests and hide from users.
```python
import os
```
-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}

<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3
import secrets
import pandas

def get_query_information():
  print('# Get query information')

  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                    host = f"{{< influxdb/host >}}",
                    database = f"DATABASE_NAME")

  random_bytes = secrets.token_bytes(16)
  trace_id = random_bytes.hex()
  trace_value = (f"{trace_id}:1112223334445:0:1").encode('utf-8')
  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"

  try:
    client.query(sql, headers=[(b'influx-trace-id', trace_value)])
    client.close()
  except Exception as e:
    print("Query error: ", e)

  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                    host = f"{{< influxdb/host >}}",
                    database = f"DATABASE_NAME")

  import time
  df = pandas.DataFrame()

  for i in range(0, 5):
    time.sleep(1)
    # Use SQL
    # To query the system.queries table for your trace ID, pass the following:
    #   - the iox-debug: true request header
    #   - an SQL query for the trace_id column
    reader = client.query(f'''SELECT compute_duration, query_type, query_text,
                          success, trace_id
                          FROM system.queries
                          WHERE issue_time >= now() - INTERVAL '1 day'
                            AND trace_id = '{trace_id}'
                          ORDER BY issue_time DESC
                        ''',
                        headers=[(b"iox-debug", b"true")],
                        mode="reader")

    df = reader.read_all().to_pandas()
    if df.shape[0]:
      break

  assert df.shape == (1, 5), f"Expect a row for the query trace ID."
  print(df)

get_query_information()
```
{{% /code-placeholders %}}

The output is similar to the following:

```text
compute_duration query_type                        query_text  success  trace_id
          0 days        sql  SELECT compute_duration, quer...     True  67338...
```
