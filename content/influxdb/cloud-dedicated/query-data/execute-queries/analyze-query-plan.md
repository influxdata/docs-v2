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

The report includes the [logical plan](#logical-plan) and the [physical plan](#physical-plan) annotated with execution counters, number of rows produced, and runtime metrics sampled during the query execution.

### View the detailed query plan for debugging

If a query plan requires the query engine to read lots of data files, `EXPLAIN` shows a truncated list of files.
To include all of the data file names and additional plan details, prepend [`EXPLAIN VERBOSE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze) to the query--for example:

```SQL
EXPLAIN VERBOSE SELECT temp FROM home
WHERE time >= now() - INTERVAL '90 days' AND room = 'Kitchen'
ORDER BY time
```

The report includes the following:

- Information truncated in the `EXPLAIN` report--for example, the paths for all [files](#file_groups) retrieved for the query.
- All intermediate physical plans that the IOx querier and DataFusion generate before the query engine generates the final physical plan--helpful in debugging to see when an _operator_ is added or removed in a plan, and how InfluxDB and DataFusion optimize the query.

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

When you [execute `EXPLAIN` for a query](#execute-explain-for-a-query), the output contains the following:

- two columns: `plan_type` and `plan`
- one row for the [logical plan](#logical-plan) (`logical_plan`)
- one row for the [physical plan](#physical-plan) (`physical_plan`)

A query plan is a sequence of steps that the query engine follows to calculate the result of the query and includes reading (_scanning_), deduplicating, filtering, and sorting data.

### Logical plan

A logical plan for an SQL or InfluxQL query in InfluxDB v3:

- is a high-level representation of the query
- includes relational operators, transformations, and optimizations for computing the query result
- doesn't consider cluster configuration, data source (ingestor data or storage), or how data is organized or partitioned

- ### Physical plan

A physical plan (also called an _execution plan_) for a query in InfluxDB v3:

- is a low-level representation of the query and includes runtime metrics sampled from _operators_ (for example, `DeduplicateExec`) during execution
- is derived from the [logical plan](#logical-plan) and takes into account the cluster configuration (for example, CPU and memory allocation), and the underlying data organization (for example: partitions, the number of files, and whether files overlap)
- is specific to your InfluxDB cluster configuration and your data at query time--if you run the same query with the same data on different clusters with different configurations, each cluster may generate a different physical plan for the query.
Likewise, if you run the same query on the same cluster, but at different times, the cluster can generate different physical plans depending on the data at that time.

For more information about query planning and the DataFusion API used in InfluxDB v3, see the [Query Planning and Execution Overview](https://docs.rs/datafusion/latest/datafusion/index.html#query-planning-and-execution-overview) in the DataFusion documentation.

## Read a query plan

Use the following steps to analyze a query plan and estimate how much work it does to complete the query.
The same steps apply regardless of how large or complex the plan might seem.

1.  Read the query plan from the bottom, innermost steps (the _leaf nodes_), up.
    - Plans are in _tree format_--each plan is an upside-down tree.
    - Execution starts at the _leaf nodes_ the bottom, innermost steps in the plan.
    - At the top, the _root node_ represents the final, encompassing execution step.
    - Data flows from bottom to top.
    - Each [physical plan](#physical-plan) node starts with the _operator_ name and contains the arguments passed to the operator.
    - DataFusion and InfluxDB operator names end in the (_-Exec_) suffix--for example: `DeduplicateExec`.
2.  Read one operator at a time and understand its job.
    Most operators are described in the [DataFusion Physical Plan documentation](https://docs.rs/datafusion/latest/datafusion/physical_plan/index.html).
    Operators not included in DataFusion may be specific to InfluxDB. TODO: need a list [IOx repo](https://github.com/influxdata/influxdb_iox).
3.  For each operator, answer the following questions:
    - What is the shape and size of data input to the operator?
    - What is the shape and size of data output from the operator?

The remainder of this guide walks you through analyzing physical plans.
Understanding the sequence, role, and data for operators in your query can help you estimate the overall workload and find potential bottlenecks in the query.

### Example physical plan for SELECT...ORDER BY query

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

Each step, or node, in the plan begins with the operator name and arguments--for example, the first node in the [Figure 1](#figure-1-explain-report) physical plan is an `ParquetExec` operator:

```text
ParquetExec: file_groups={...}, projection=[city, min_temp, time]
```

Operators receive data and relevant parts of the query as arguments, and then process and transform data before sending it to the next node in the plan.

The following diagram shows the data flow and sequence of operators in the [Figure 1](#query-plan-figure-1) physical plan:

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
Figure 2. Execution flow in the [Figure 1](#figure-1-explain-report) physical plan
{{% /caption %}}

The following steps use the operator sequence to summarize the execution and data flow in the [Figure 1](#figure-1-explain-report) physical plan:

1.  Two `ParquetExec` operators, in parallel, read data from parquet files.
    Each `ParquetExec` operator reads data sequentially from each file in its file group, and then outputs a stream of data to its corresponding `SortExec` operator.
2.  The `SortExec` operators, in parallel, sort the data by `city` (ascending) and `time` (descending).
3.  The `UnionExec` operator unions the output of the parallel `SortExec` operators.
4.  The `SortPreservingMergeExec` operator sorts and merges the `UnionExec` output.

## Analyze a query plan for leading edge data

This example guides you through analyzing a physical query plan for a typical time series use case--querying leading edge data.

After learning how to read a query plan, you'll have an understanding of operators and recognize potential bottlenecks in your own queries--for example, the data scanning operations in the [example query plan](#explain-report-for-a-leading-edge-data-query) can be summarized as follows:

- Query execution starts with two `ParquetExec` and one `RecordBatchesExec` operator nodes.
-  `RecordBatchesExec`: retrieves recently [ingested data](/influxdb/cloud-dedicated/reference/internals/durability/) not yet in storage; indicates that data is being ingested.
-  `ParquetExec`: retrieves four parquet files from storage:

   -  In the first node (_ParquetExec_1_ in the following diagram), two files don't [_overlap_](#overlapped-files-and-duplicate-data) in time with any other files, and don't duplicate data; no deduplication of the data is required.
   -  In the second node, two files [_overlap_](#overlapped-files-and-duplicate-data) each other and with the ingested data; the plan must deduplicate data before sending it to the next operator.

The remaining sections guide you through analyzing the structure and arguments of operators in a leading edge data query.
The query plan includes InfluxDB-specific operators as well as common [DataFusion](https://arrow.apache.org/datafusion/) operators.

### Retrieve the query plan

#### Sample data

```text

```

#### Execute the query

The following SQL generates an `EXPLAIN` report for the query:

```sql
EXPLAIN SELECT city, count(1)
FROM h2o
WHERE time >= to_timestamp(200) AND time < to_timestamp(700)
  AND state = 'MA'
GROUP BY city
ORDER BY city ASC;
```

{{< expand-wrapper >}}
{{% expand "EXPLAIN report for a leading edge data query" %}}

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
Figure 3. `EXPLAIN` report with query plans for a typical leading edge data query
{{% /caption %}}

{{% /expand %}}
{{< /expand-wrapper >}}

2.  In the `EXPLAIN` report, find the row where the `plan_type` column has the value `physical_plan`.
    The `plan` column contains the physical plan.

### Data scanning, an example summary

{{% note %}}
To [read the execution flow of a query plan](#read-a-query-plan), always start from the bottom, innermost nodes (the leaf nodes) and read up.
{{% /note %}}

The leaf node operators in the physical plan are  `ParquetExec` and `RecordBatchesExec`, which retrieve data from file storage and the ingester, respectively, and read (_scan_) the data.

The number of `ParquetExec` and `RecordBatchesExec` nodes and their parameter values can tell you which data (and how much) is retrieved for your query, and how efficiently the plan handles the organization (for example, partitions and duplicates) of your data.


### Overlapped files and duplicate data

#### Distribution of overlapped and non-overlapped data

```text
                               Time
─────────────────────────────────────────────────────────────────▶
  ┌──────────────────────┐  ┌────────────────────┐
  │     ParquetExec_1    │  │    ParquetExec_2   │
  │┌─────────┐ ┌────────┐│  │┌──────────┐        │
  ││ File_1  │ │ File_2 ││  ││  File_3  │        │
  │└─────────┘ └────────┘│  │└──────────┘        │
  └──────────────────────┘  │         ┌─────────┐│
                            │         │ File_4  ││
                            │         └─────────┘│
                            └────────────────────┘
                                             ┌──────────────────┐
                                             │RecordBatchesExec │
                                             │┌────────────────┐│
                                             ││ Ingesting data ││
                                             │└────────────────┘│
                                             └──────────────────┘
```

{{% caption %}}
Figure 3. Files scanned by `ParquetExec_1` don't overlap.
Files scanned by `ParquetExec_2` overlap with respect to time and duplicate data retrieved by `RecordBatchesExec`.{{% /caption %}}

_Overlapped_ files contain duplicate data between them, and the query plan must deduplicate the data.
Due to how InfluxDB organizes data, data is never duplicated _within_ a file.
Therefore, non-overlapping files don't require deduplication.

### Understanding operators in the physical plan

The following sections walk through the steps to [read the query plan](#read-a-query-plan) and examine the operators, their input, and output.

### Data scanning (ParquetExec and RecordBatchesExec)

`ParquetExec` operators read data from files in storage.
`RecordBatchesExec` operators read recently written data (not yet in storage) from the ingester.
Because `ParquetExec` and `RecordBatchesExec` operators are responsible for retrieving  and scanning data for a query,
every query plan starts with one or both.

The example physical plan contains three leaf nodes--the innermost nodes where the execution flow begins.
For convenience, the two `ParquetExec` nodes are referred to as _ParquetExec_1_ and _ParquetExec_2_.

- [ParquetExec_1](#parquetexec_1)
- [RecordBatchesExec](#recordbatchesexec)
- [ParquetExec_2](#parquetexec_2)

#### ParquetExec_1

```sql
ParquetExec:
  file_groups={2 groups: [[1/1/b862a7e9b.../2cbb3992-....parquet],
   [1/1/b862a7e9b.../9255eb7f-....parquet]]},
  projection=[__chunk_order, city, state, time],
  output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC],
  predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA,
  pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3
```

{{% caption %}}
Figure 4. ParquetExec_1, the first ParquetExec node
{{% /caption %}}

ParquetExec_1 has the following arguments:

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

- `1/1/b862a7e9b.../2cbb3992-....parquet`
- `1/1/b862a7e9b.../9255eb7f-....parquet`

A file path has the following structure:

{{% code-callout " 1 | " %}}
```text
<namespace_id>/<table_id>/<partition_hash_id>/<uuid_of_the_file>.parquet
    1         /    1    /b862a7e9b329ee6a4.../2cbb3992-4607-4....parquet
```

{{% /code-callout %}}

- `namespace_id`: the namespace (database) being queried
- `table_id`: the table (measurement) being queried
- `partition_hash_id`: the partition this file belongs to.
You can count partition IDs to find how many partitions the query reads.
- `uuid_of_the_file`: the file identifier.
You can use this to find file information (for example: size and number of rows) in the catalog or to download and debug the file locally.

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

ParquetExec_1 outputs data sorted by `state ASC, city ASC, time ASC, __chunk_order ASC`, the existing sort order in the file.
InfluxDB automatically sorts parquet files when storing them to improve storage compression and query efficiency.

```text
output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC]
```

##### predicate

`predicate` is the data filter as specified in the query.

```text
predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA
```

##### pruning predicate

`pruning_predicate` is created from the [`predicate`](#predicate) value and is the predicate actually used for pruning data and files from the chosen partitions.
Default is to filter files by `time`.

```text
pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3
```

Before the physical plan is generated, an additional `partition pruning` step uses predicates on partitioning columns to prune partitions.

#### RecordbatchesExec

```sql
  |               |                               RecordBatchesExec: chunks=1, projection=[__chunk_order, city, state, time]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
```

{{% caption %}}Figure 5: RecordBatchesExec{{% /caption %}}

##### chunks

`chunks` is the number of data chunks from the ingester.
Data can arrive from the ingester in many chunks, but often there is only one.

This example has one data chunk.

```text
chunks=1
```

##### projection

As in the preceding `ParquetExec` operator, `projection` specifies 4 columns to read and output:

```text
projection=[__chunk_order, city, state, time]
```

#### ParquetExec_2 node

##### ParquetExec_2 arguments

The second `ParquetExec` node (_ParquetExec_2_) arguments and operator structure are similar arguments to ParquetExec_1.

```sql
ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/243db601-f3f1-401b-afda-82160d8cc1a8.parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/f5fb7c7d-16ac-49ba-a811-69578d05843f.parquet]]}, projection=[city, state, time], output_ordering=[state@1 ASC, city@0 ASC, time@2 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3                                           |
```

{{% caption %}}Figure 6: Second ParquetExec{{% /caption %}}

##### How a query plan distributes data for scanning

If you compare the `file_group` paths in ParquetExec_1 with those in ParquetExec_2, you'll notice that the files are from the same partition:

{{% code-callout "b862a7e9b329ee6a4..." %}}

```text
1/1/b862a7e9b329ee6a4.../...
```

{{% /code-callout %}}

The planner may distribute files from the same partition to different scan operators for several reasons, including optimizations for handling overlaps--for example:

- to minimize the work required for deduplication by handling non-overlaps separately from [overlaps](#overlapped-files-and-duplicate-data) (which is the case in this example)
- to increase parallel execution by distributing non-overlaps

##### ParquetExec_2 operator structure

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
|               |                             ParquetExec:...|
```

{{% caption %}}Figure 7: The second `ParquetExec` node{{% /caption %}}

- `FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA`: filters data for the condition `time@3 >= 200 AND time@3 < 700 AND state@2 = MA`, and guarantees that all data is pruned
- `CoalesceBatchesExec: target_batch_size=8192`: combines small batches into larger batches. See the DataFusion [`CoalesceBatchesExec`] documentation.
- `SortExec: expr=[state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]` : this sorts data on `state ASC, city ASC, time ASC, __chunk_order ASC`. Note that this sort operator is only applied on data from ingesters because data from files is already sorted on that order.
- `UnionExec` is simply a place to pull many streams together. It does not merge anything.
- `SortPreservingMergeExec: [state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]` : this merges the already sorted data. When you see this, you know data below must be sorted. The output data is in one sorted stream.
- `DeduplicateExec: [state@2 ASC,city@1 ASC,time@3 ASC]` : this deduplicated sorted data coming from strictly one input stream. That is why you often see under `DeduplicateExec` is `SortPreservingMergeExec` but it is not a must. As long as the input to `DeduplicateExec` is one sorted stream of data, it will work correctly.

#### DeduplicatExec

The ParquetExec_1 and ParquetExec_2 nodes are both followed by a similar operator structure, with one important difference-- the `DeduplicateExec` node in `ParquetExec_2`.


##### A signal of overlapping data

In a query plan, `DeduplicationExec` indicates that the data that precedes it (_below_ `DeduplicationExec`) is overlapping.
In the example, data in two files overlaps and overlaps with data from the ingesters.

The `DeduplicationExec` node in Figure 7 has the following parameters:

##### FilterExec

```sql
FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA
```

Filters out data that satisfies the conditions `time@3 >= 200 AND time@3 < 700 AND state@2 = MA`.
Ensures that all data is fully filtered job.
The previous pruning removes data when possible, but doesn't guarantee all the data is pruned. - `CoalesceBatchesExec: target_batch_size=8192` is just a way to group smaller data to larger groups if possible. Refer to DF document for how it works
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
