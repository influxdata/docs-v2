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

Learn how to read and analyze a [query plan](/influxdb/cloud-dedicated/reference/glossary/#query-plan) to
understand query execution steps and data organization, and find performance bottlenecks.

When you query InfluxDB v3, the query engine devises a query plan for executing the query.
The engine tries to determine the optimal plan for the query structure and data.
By learning how to generate and interpret reports for the query plan, you can better understand how the query is executed and identify bottlenecks that affect the performance of your query.

For example, if the query plan reveals that your query reads a large number of Parquet files, you can then take steps to [optimize your query](/influxdb/cloud-dedicated/query-data/execute-queries/optimize-queries/), such as add filters to read less data or
configure your cluster to store fewer and larger files.

- [Use EXPLAIN keywords to view the query plan](#use-explain-keywords-to-view-the-query-plan)
- [Read an EXPLAIN report](#read-an-explain-report)
- [Read a query plan](#read-a-query-plan)
  - [Example physical plan for a SELECT...ORDER BY query](#example-physical-plan-for-a-selectorder-by-query)
- [Analyze a query plan for leading edge data](#analyze-a-query-plan-for-leading-edge-data)
  - [Sample data](#sample-data)
  - [Sample query](#sample-query)
  - [EXPLAIN report for the leading edge data query](#explain-report-for-the-leading-edge-data-query)
  - [Locate the physical plan](#locate-the-physical-plan)
  - [Read the physical plan](#read-the-physical-plan)
  - [Scan operators (ParquetExec and RecordBatchesExec)](#scan-operators-Parquetexec-and-recordbatchesexec)

## Use EXPLAIN keywords to view the query plan

Use the `EXPLAIN` keyword (and the optional [`ANALYZE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze) and [`VERBOSE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze-verbose) keywords) to generate a report and [view the query plan](#view-the-query-plan).

{{% expand-wrapper %}}
{{% expand "Use Python and pandas to view an EXPLAIN report" %}}

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

When you [execute `EXPLAIN` for a query](#execute-explain-for-a-query), the report contains the following:

- two columns: `plan_type` and `plan`
- one row for the [logical plan](/influxdb/cloud-dedicated/reference/internals/query-plan/#logical-plan) (`logical_plan`)
- one row for the [physical plan](/influxdb/cloud-dedicated/reference/internals/query-plan/#physical-plan) (`physical_plan`)

## Read a query plan

Whether reading a logical or physical plan, keep the following in mind:

- Plans are in _tree format_--each plan is an upside-down tree.
- Start at the furthest indented steps (the _leaf nodes_), and read upward.
- Execution and data flows from _leaf nodes_, the innermost steps in the plan, to outer _branch nodes_.
- At the top of the plan, the _root node_ represents the final, encompassing execution step.

In a physical plan, each step (or _node_) represents an [`ExecutionPlan`](/influxdb/cloud-dedicated/reference/internals/query-plan/#physical-plan-executionplans) expression that
starts with an [`ExecutionPlan`](/influxdb/cloud-dedicated/reference/internals/query-plan/#physical-plan-executionplans) name and contains the arguments passed to it.
DataFusion and InfluxDB [`ExecutionPlan`](/influxdb/cloud-dedicated/reference/internals/query-plan/#physical-plan-executionplans) names end in the _-Exec_ suffix (for example, `DeduplicateExec`).

Use the following steps to analyze a query plan and estimate how much work is required to complete the query.
The same steps apply regardless of how large or complex the plan might seem.

1.  Start from the furthest indented steps (the _leaf nodes_), and read upward.
2.  Understand the job of each [`ExecutionPlan`](/influxdb/cloud-dedicated/reference/internals/query-plan/#physical-plan-executionplans) node--for example, a `UnionExec` node encompassing the leaf nodes means that the `UnionExec` concatenates the output of all the leaves.
3.  For each expression, answer the following questions:
    - What is the shape and size of data input to the plan?
    - What is the shape and size of data output from the plan?

The remainder of this guide walks you through analyzing a physical plan.
Understanding the sequence, role, input, and output of nodes in your query plan can help you estimate the overall workload and find potential bottlenecks in the query.

### Example physical plan for a SELECT...ORDER BY query

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

Each step, or node, in the plan begins with the `ExecutionPlan` name and arguments--for example, the first node in the [Figure 1](#figure-1-explain-report) physical plan is a `ParquetExec` execution plan:

```text
ParquetExec: file_groups={...}, projection=[city, min_temp, time]
```

In InfluxDB, the leaf nodes in a physical plan are always `ParquetExec` or `RecordBatchesExec` execution plan expressions.
Because `ParquetExec` and `RecordBatchesExec` retrieve and read, or scan, data for a query, every query plan starts with one or more.

Each `ExecutionPlan` receives data and relevant parts of the query as arguments, and then processes and transforms data.
The output data then flows up to the next node in the plan.

The following diagram shows the data flow and sequence of operators in the [Figure 1](#figure-1-explain-report) physical plan:

#### Figure 2. Physical plan data flow

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
Figure 2. Execution and data flow in the [Figure 1](#figure-1-explain-report) physical plan.
`ParquetExec` nodes execute in parallel and `UnionExec` combines their output.
{{% /caption %}}

The following steps summarize the execution and data flow in the [Figure 1](#figure-1-explain-report) physical plan:

1.  Two `ParquetExec` plans, in parallel, read data from Parquet files.
    Each `ParquetExec` operator reads data sequentially from each file in its file group, and then outputs a stream of data to its corresponding `SortExec` operator.
2.  The `SortExec` operators, in parallel, sort the data by `city` (ascending) and `time` (descending).
3.  The `UnionExec` operator unions the output of the parallel `SortExec` operators.
4.  The `SortPreservingMergeExec` operator sorts and merges the `UnionExec` output.

## Analyze a query plan for leading edge data

This example guides you through analyzing a physical query plan for a typical time series use case--querying leading edge data.
Although the query and plan are more complex than in the [preceding example](#example-physical-plan-for-selectorder-by-query), you'll follow the same [steps to read the query plan](#read-a-query-plan).
After learning how to read the query plan, you'll have an understanding of `ExecutionPlans`, data flow, and potential bottlenecks in your own queries.

### Sample data

Consider the following `h20` data, represented as "chunks" of line protocol, written to InfluxDB:

```text
// h20 data
// The following data represents 5 batches, or "chunks", of line protocol
// written to InfluxDB.
//   - Chunks 1-4 are ingested and each is persisted to a separate partition file in storage.
//   - Chunk 5 is ingested and not yet persisted to storage.
//   - Chunks 1 and 2 cover short windows of time that don't overlap times in other chunks.
//   - Chunks 3 and 4 cover larger windows of time and the time ranges overlap each other.
//   - Chunk 5 contains the largest time range and overlaps with chunk 4, the Parquet file with the largest time-range.
//   - In InfluxDB, a chunk never duplicates its own data.
//
// Chunk 1: stored Parquet file
//   - time range: 50-249
//   - no duplicates in its own chunk
//   - no overlap with any other chunks
[
"h2o,state=MA,city=Bedford min_temp=71.59 150",
"h2o,state=MA,city=Boston min_temp=70.4, 50",
"h2o,state=MA,city=Andover max_temp=69.2, 249",
],

// Chunk 2: stored Parquet file
//   - time range: 250 - 349
//   - no duplicates in its own chunk
//   - no overlap with any other chunks
//   - adds a new field (area)
[
"h2o,state=CA,city=SF min_temp=79.0,max_temp=87.2,area=500u 300",
"h2o,state=CA,city=SJ min_temp=75.5,max_temp=84.08 349",
"h2o,state=MA,city=Bedford max_temp=78.75,area=742u 300",
"h2o,state=MA,city=Boston min_temp=65.4 250",
],

// Chunk 3: stored Parquet file
//   - time range: 350 - 500
//   - no duplicates in its own chunk
//   - overlaps chunk 4
[
"h2o,state=CA,city=SJ min_temp=77.0,max_temp=90.7 450",
"h2o,state=CA,city=SJ min_temp=69.5,max_temp=88.2 500",
"h2o,state=MA,city=Boston min_temp=68.4 350",
],

// Chunk 4: stored Parquet file
//   - time range: 400 - 600
//   - no duplicates in its own chunk
//   - overlaps chunk 3
[
 "h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 600",
 "h2o,state=CA,city=SJ min_temp=69.5,max_temp=89.2 600",  // duplicates row 3 in chunk 5
 "h2o,state=MA,city=Bedford max_temp=80.75,area=742u 400", // overlaps chunk 3
 "h2o,state=MA,city=Boston min_temp=65.40,max_temp=82.67 400", // overlaps chunk 3
],

// Chunk 5: Ingester data
//   - time range: 550 - 700
//   - overlaps and duplicates data in chunk 4
[
"h2o,state=MA,city=Bedford max_temp=88.75,area=742u 600", // overlaps chunk 4
"h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 650",
"h2o,state=CA,city=SJ min_temp=68.5,max_temp=90.0 600", // duplicates row 2 in chunk 4
"h2o,state=CA,city=SJ min_temp=75.5,max_temp=84.08 700",
"h2o,state=MA,city=Boston min_temp=67.4 550", // overlaps chunk 4
]
```

The following query selects all the data:

```sql
SELECT state, city, min_temp, max_temp, area, time
FROM h2o
ORDER BY state asc, city asc, time desc;
```

The output is the following:

```sql
+-------+---------+----------+----------+------+--------------------------------+
| state | city    | min_temp | max_temp | area | time                           |
+-------+---------+----------+----------+------+--------------------------------+
| CA    | SF      | 68.4     | 85.7     | 500  | 1970-01-01T00:00:00.000000650Z |
| CA    | SF      | 68.4     | 85.7     | 500  | 1970-01-01T00:00:00.000000600Z |
| CA    | SF      | 79.0     | 87.2     | 500  | 1970-01-01T00:00:00.000000300Z |
| CA    | SJ      | 75.5     | 84.08    |      | 1970-01-01T00:00:00.000000700Z |
| CA    | SJ      | 68.5     | 90.0     |      | 1970-01-01T00:00:00.000000600Z |
| CA    | SJ      | 69.5     | 88.2     |      | 1970-01-01T00:00:00.000000500Z |
| CA    | SJ      | 77.0     | 90.7     |      | 1970-01-01T00:00:00.000000450Z |
| CA    | SJ      | 75.5     | 84.08    |      | 1970-01-01T00:00:00.000000349Z |
| MA    | Andover |          | 69.2     |      | 1970-01-01T00:00:00.000000249Z |
| MA    | Bedford |          | 88.75    | 742  | 1970-01-01T00:00:00.000000600Z |
| MA    | Bedford |          | 80.75    | 742  | 1970-01-01T00:00:00.000000400Z |
| MA    | Bedford |          | 78.75    | 742  | 1970-01-01T00:00:00.000000300Z |
| MA    | Bedford | 71.59    |          |      | 1970-01-01T00:00:00.000000150Z |
| MA    | Boston  | 67.4     |          |      | 1970-01-01T00:00:00.000000550Z |
| MA    | Boston  | 65.4     | 82.67    |      | 1970-01-01T00:00:00.000000400Z |
| MA    | Boston  | 68.4     |          |      | 1970-01-01T00:00:00.000000350Z |
| MA    | Boston  | 65.4     |          |      | 1970-01-01T00:00:00.000000250Z |
| MA    | Boston  | 70.4     |          |      | 1970-01-01T00:00:00.000000050Z |
+-------+---------+----------+----------+------+--------------------------------+
```

### Sample query

The following query selects leading edge data from the [sample data](#sample-data):

```sql
SELECT city, count(1)
FROM h2o
WHERE time >= to_timestamp(200) AND time < to_timestamp(700)
  AND state = 'MA'
GROUP BY city
ORDER BY city ASC;
```

The output is the following:

```sql
+---------+-----------------+
| city    | COUNT(Int64(1)) |
+---------+-----------------+
| Andover | 1               |
| Bedford | 3               |
| Boston  | 4               |
+---------+-----------------+
```

### EXPLAIN report for the leading edge data query

The following query generates the `EXPLAIN` report for the preceding [sample query](#sample-query):

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
| plan_type     | plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
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
|               |                       ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/243db601-f3f1-401b-afda-82160d8cc1a8.Parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/f5fb7c7d-16ac-49ba-a811-69578d05843f.Parquet]]}, projection=[city, state, time], output_ordering=[state@1 ASC, city@0 ASC, time@2 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3                                           |
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
|               |                             ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/2cbb3992-4607-494d-82e4-66c480123189.Parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/9255eb7f-2b51-427b-9c9b-926199c85bdf.Parquet]]}, projection=[__chunk_order, city, state, time], output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3 |
```

{{% caption %}}
Figure 3. `EXPLAIN` report for a typical leading edge data query
{{% /caption %}}

{{% /expand %}}
{{< /expand-wrapper >}}

The comments in the [sample data](#sample-data) tell you which data chunks overlap or duplicate data in other chunks.
Two chunks of data _overlap_ if there are portions of time for which data exists in both chunks.
_You'll learn how to [recognize overlapping and duplicate data](#recognize-overlapping-and-duplicate-data) in a query plan later in this guide._

Unlike the sample data, your data likely doesn't tell you where overlaps or duplicates exist.
A physical plan can reveal overlaps and duplicates in your data and how they affect your queries--for example, after learning how to read a physical plan, you might summarize the data scanning steps as follows:

- Query execution starts with two `ParquetExec` and one `RecordBatchesExec` execution plans that run in parallel.
- The first `ParquetExec` node reads two files that don't overlap any other files and don't duplicate data; the files don't require deduplication.
- The second `ParquetExec` node reads two files that overlap each other and overlap the ingested data scanned in the `RecordBatchesExec` node; the query plan must include the deduplication process for these nodes before completing the query.

The remaining sections analyze the `ExecutionPlan` node structure and arguments.
The query plan includes [DataFusion plans](/influxdb/cloud-dedicated/reference/internals/query-plan/#datafusion-executionplans) and [InfluxDB-specific plans](/influxdb/cloud-dedicated/reference/internals/query-plan/#influxdb-specific-executionplans).

### Locate the physical plan

To begin analyzing the physical plan for the query, find the row in the [`EXPLAIN` report](#explain-report-for-a-leading-edge-data-query) where the `plan_type` column has the value `physical_plan`.
The `plan` column for the row contains the physical plan.

### Read the physical plan

The following sections follow the steps to [read a query plan](#read-a-query-plan) and examine the physical plan nodes and their input and output.

{{% note %}}
To [read the execution flow of a query plan](#read-a-query-plan), always start from the innermost (leaf) nodes and read up toward the outer (branch) nodes.
{{% /note %}}

#### Physical plan leaf nodes

{{< img-hd src="/img/influxdb/3-0-query-plan-tree.png" />}}

{{% caption %}}
Figure 3. Leaf node structures in the physical plan
{{% /caption %}}

### Scan operators (ParquetExec and RecordBatchesExec)

The [example physical plan](#physical-plan-leaf-nodes) contains three leaf nodes--the innermost nodes where the execution flow begins:

- [`ParquetExec`](/influxdb/cloud-dedicated/reference/internals/query-plan/#parquetexec) nodes retrieve and scan data from Parquet files in the [Object store](/influxdb/cloud-dedicated/reference/internals/storage-engine/#object-store)
- a [`RecordBatchesExec`](/influxdb/cloud-dedicated/reference/internals/query-plan/#recordbatchesexec) node retrieves recently written, yet-to-be-persisted data from the [Ingester](/influxdb/cloud-dedicated/reference/internals/storage-engine/#ingester)

Because `ParquetExec` and `RecordBatchesExec` operators are responsible for retrieving and scanning data for a query, every query plan starts with one or more.

The number of `ParquetExec` and `RecordBatchesExec` nodes and their parameter values can tell you which data (and how much) is retrieved for your query, and how efficiently the plan handles the organization (for example, partitions and duplicates) of your data.

For convenience, this guide uses the names _ParquetExec_A_ and _ParquetExec_B_ for the `ParquetExec` nodes in the [example physical plan](#physical-plan-leaf-nodes) .
Reading from the top of the physical plan, **ParquetExec_A** is the first leaf node in the physical plan and **ParquetExec_B** is the last (bottom) leaf node.
_The names indicate the nodes' locations in the report, not their order of execution._

- [ParquetExec_A](#ParquetExec_A)
- [RecordBatchesExec](#recordbatchesexec)
- [ParquetExec_B](#ParquetExec_B)

#### ParquetExec_A

```sql
ParquetExec: file_groups={2 groups: [[1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/243db601-f3f1-401b-afda-82160d8cc1a8.Parquet], [1/1/b862a7e9b329ee6a418cde191198eaeb1512753f19b87a81def2ae6c3d0ed237/f5fb7c7d-16ac-49ba-a811-69578d05843f.Parquet]]}, projection=[city, state, time], output_ordering=[state@1 ASC, city@0 ASC, time@2 ASC], predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA, pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3                                           |
```

{{% caption %}}
Figure 4. ParquetExec_A, the first ParquetExec node
{{% /caption %}}

ParquetExec_A has the following arguments:

##### file_groups

A _file group_ is a list of files for the operator to read.
Files are referenced by path:

- `1/1/b862a7e9b.../243db601-....Parquet`
- `1/1/b862a7e9b.../f5fb7c7d-....Parquet`

The path structure represents how your data is organized.
You can use the file paths to gather more information about the query--for example:

- to find file information (for example: size and number of rows) in the catalog
- to download the Parquet file from the object store for debugging
- to find how many partitions the query reads

A path has the following structure:

```text
<namespace_id>/<table_id>/<partition_hash_id>/<uuid_of_the_file>.Parquet
    1         /    1    /b862a7e9b329ee6a4.../243db601-f3f1-4....Parquet
```

- `namespace_id`: the namespace (database) being queried
- `table_id`: the table (measurement) being queried
- `partition_hash_id`: the partition this file belongs to.
You can count partition IDs to find how many partitions the query reads.
- `uuid_of_the_file`: the file identifier.

`ParquetExec` executes groups in parallel and reads the files in each group sequentially--for example:

ParquetExec_A receives two groups with one file per group:

```text
file_groups={2 groups:...}
```

Therefore, ParquetExec_A reads two files in parallel.

##### projection

`projection` lists the table columns that the query plan reads.
The parameter name `projection` refers to _projection pushdown_, the action of filtering columns.

The [sample data](#sample-data) contains many columns, but the [sample query](#sample-query) requires the Querier to read only three.

```text
projection=[city, state, time]
```

##### output ordering

`output_ordering` specifies the sort order for the operator output.
The planner passes the parameter if the output should be ordered and if the planner knows the order.

```text
output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC]
```

When storing data to Parquet files, InfluxDB sorts the data to improve storage compression and query efficiency and the planner tries to preserve that order for as long as possible.
Generally, the `output_ordering` value that  `ParquetExec` receives is the ordering (or a subset of the ordering) of stored data.
_By design, [`RecordBatchesExec`](#recordbatchesexec) data isn't sorted._

In the example, the planner specifies that ParquetExec_A use the existing sort order `state ASC, city ASC, time ASC,` for output.

{{% note %}}
To view the sort order of your stored data, generate an `EXPLAIN` report for a `SELECT ALL` query--for example:

```sql
EXPLAIN SELECT * FROM TABLE_NAME WHERE time > now() - interval '1 hour'
```

Reduce the time range if the query returns too much data.
{{% /note %}}

##### predicate

`predicate` is the data filter specified in the query.

```text
predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA
```

##### pruning predicate

`pruning_predicate` is created from the [`predicate`](#predicate) value and is the predicate actually used for pruning data and files from the chosen partitions.
The default filters files by `time`.

```text
pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3
```

_Before the physical plan is generated, an additional `partition pruning` step uses predicates on partitioning columns to prune partitions._

#### RecordbatchesExec

```sql
  |               |                               RecordBatchesExec: chunks=1, projection=[__chunk_order, city, state, time]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
```

{{% caption %}}Figure 5: RecordBatchesExec{{% /caption %}}

##### RecordBatchesExec arguments

##### chunks

`chunks` is the number of data chunks from the Ingester.
Data can arrive from the Ingester in many chunks, but often only one, as in the example.

```text
chunks=1
```

##### projection

In the example, the `RecordBatchesExec` `projection` argument specifies four columns to read and output:

_`__chunk_order`: an InfluxDB-generated column used to keep the chunks and files ordered for deduplication.
- `city`, `state`, and `time`: the same three columns specified in [`ParquetExec_A`](#projection-1)

```text
projection=[__chunk_order, city, state, time]
```

{{% note %}}
`__chunk_order` is a sign that the retrieved data has overlaps or duplicates.
{{% /note %}}

#### ParquetExec_B

The bottom leaf node in the [example physical plan](#physical-plan-leaf-nodes) is another `ParquetExec` operator, _ParquetExec_B_.

##### ParquetExec_B arguments

```sql
ParquetExec:
  file_groups={2 groups: [[1/1/b862a7e9b.../2cbb3992-....Parquet],
   [1/1/b862a7e9b.../9255eb7f-....Parquet]]},
  projection=[__chunk_order, city, state, time],
  output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC],
  predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA,
  pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3
```

{{% caption %}}Figure 6: Second ParquetExec{{% /caption %}}

ParquetExec_B has similar arguments as [ParquetExec_A](#Parquetexec_a), as well as the `__chunk_order` value you saw in [`RecordBatchesExec` `projection`](#projection-2).

{{% note %}}
`__chunk_order` is a sign that retrieved data has overlaps or duplicates.
{{% /note %}}

##### file_groups

If you compare [`file_group`](#file_groups) paths in [ParquetExec_A](#ParquetExec_A) with those in [ParquetExec_B](#Parquetexec_b-arguments), you'll notice that both contain files from the same partition:

{{% code-callout "b862a7e9b329ee6a4..." %}}

```text
1/1/b862a7e9b329ee6a4.../...
```

{{% /code-callout %}}

##### How a query plan distributes data for scanning

The planner may distribute files from the same partition to different scan operators for several reasons, including optimizations for handling [overlaps](#overlapped-files-and-duplicate-data)--for example:

- separating non-overlapped files from overlapped files to minimize the work required for deduplication (which is the case in this example)
- distributing non-overlapped files to increase parallel execution

#### Operator structure

In the example, the three leaf nodes have the following operator structure in common:

```sql
|               |                           CoalesceBatchesExec: target_batch_size=8192                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|               |                             FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA
```

- `FilterExec: time@3 >= 200 AND time@3 < 700 AND state@2 = MA`: filters data for the condition `time@3 >= 200 AND time@3 < 700 AND state@2 = MA`, and guarantees that all data is pruned.
- `CoalesceBatchesExec: target_batch_size=8192`: combines small batches into larger batches. See the DataFusion [`CoalesceBatchesExec`] documentation.

##### Sorting yet-to-be-persisted data

In the `RecordBatchesExec` branch, the next node that follows `CoalesceBatchesExec` is a `SortExec` node:

```sql
SortExec: expr=[state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]
```

This node sorts the yet-to-be-persisted data on the specified expression `state ASC, city ASC, time ASC, __chunk_order ASC`.
Neither ParquetExec_A nor ParquetExec_B contain a similar node because data in the Object store is already sorted (by the Compactor) in the given order; the query plan only needs to sort data that arrives from the Ingester.

##### Recognize overlapping and duplicate data

ParquetExec_B has the following additional structure--operators that appear above it in the plan:

```sql
|               |                   DeduplicateExec: [state@2 ASC,city@1 ASC,time@3 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|               |                     SortPreservingMergeExec: [state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|               |                       UnionExec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|               |                         SortExec: expr=[state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]
```

{{% caption %}}Figure 7: The second `ParquetExec` node{{% /caption %}}

- `UnionExec`: unions separate streams without merging them.
- `SortPreservingMergeExec: [state@2 ASC,city@1 ASC,time@3 ASC,__chunk_order@0 ASC]`: merges already sorted data; indicates that preceding data (from operators below it) is already sorted. The output data is a single sorted stream.
- `DeduplicateExec: [state@2 ASC,city@1 ASC,time@3 ASC]`: deduplicates sorted data from a single input stream.
  Because `SortPreservingMergeExec` ensures a single sorted stream, it often, but not always, precedes `DeduplicateExec`.

A `DeduplicateExec` node indicates that encompassed nodes have [_overlapped data_](/influxdb/cloud-dedicated/reference/internals/query-plan/#overlapping-data-and-deduplication)--data in a file or batch have timestamps in the same range as data in another file or batch.
Due to how InfluxDB organizes data, data is never duplicated _within_ a file.

In the example, because the `DeduplicateExec` node encompasses ParquetExec_B and the `RecordBatchesExec` node, you know that the ParquetExec_B [file group](#file_groups-1) and the yet-to-be persisted data _overlap_.

The following [sample data](#sample-data) excerpt shows overlapping data between a file and Ingester data:

```text
// Chunk 4: stored Parquet file
//   - time range: 400 - 600
[
 "h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 600",
 ...
 "h2o,state=MA,city=Boston min_temp=65.40,max_temp=82.67 400", // overlaps chunk 3
],

// Chunk 5: Ingester data
//   - time range: 550 - 700
//   - overlaps & duplicates data in chunk 4
[
"h2o,state=MA,city=Bedford max_temp=88.75,area=742u 600", // overlaps chunk 4
...
"h2o,state=MA,city=Boston min_temp=67.4 550", // overlaps chunk 4
]
```

If files or ingested data overlap, the Querier must include the `DeduplicateExec` in the query plan to remove any duplicates.
`DeduplicateExec` doesn't necessarily indicate that the data contains duplicates.
If a plan reads many files and performs deduplication on all of them, it might be for the following reasons:

- the files contain duplicate data.
- the Object store has many small overlapped files that the Compactor hasn't compacted yet. After compaction, your query may perform better because it has fewer files to read.
- the Compactor isn't keeping up. If the data isn't duplicated and you still have many small overlapping files after compaction, then you might want to check the Compactor's workload and add more resources as needed.

A leaf node that doesn't have a `DeduplicateExec` node in its branch doesn't require deduplication and doesn't overlap other files or Ingester data--for example, ParquetExec_A has no overlaps:

```sql
ProjectionExec:...
    CoalesceBatchesExec:...
        FilterExec:...
            ParquetExec:...
```

{{% caption %}}
Figure 8. No `DeduplicateExec` node means files don't overlap.
{{% /caption %}}

##### Data scan output

Before data from all three leaf nodes is combined, `ProjectionExec` nodes filter columns so that only the `city` column remains in the output:

```sql
`ProjectionExec: expr=[city@0 as city]`
```

##### Final processing

After deduplication and filtering of the data scanning nodes, the plan combines the output, then applies aggregation and sorting operators for the final result:

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

{{% caption %}}
Figure 9. Operator structure for aggregating, sorting, and final output.
{{% /caption %}}

- `UnionExec`: unions data streams. Note that the number of output streams is the same as the number of input streams. This `UnionExec` node is an intermediate step to downstream operators that actually merge or split data streams.
- `RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=3`: Splits three input streams into four output streams in round-robin fashion. The plan splits streams to increase parallel execution.
- `AggregateExec: mode=Partial, gby=[city@0 as city], aggr=[COUNT(Int64(1))]`:  Groups data as specified in the [query](#sample-query): `city, count(1)`.
  This node aggregates each of the four streams separately, and then outputs four streams, indicated by `mode=Partial`--the data isn't fully aggregated.
- `RepartitionExec: partitioning=Hash([city@0], 4), input_partitions=4`: Repartitions data on `Hash([city])` and into four streams--each stream contains data for one city.
- `AggregateExec: mode=FinalPartitioned, gby=[city@0 as city], aggr=[COUNT(Int64(1))]`: Applies the final aggregation (`aggr=[COUNT(Int64(1))]`) to the data. `mode=FinalPartitioned` indicates that the data is already partitioned (by city) and doesn't need further grouping by the `AggregateExec` operator.
- `SortExec: expr=[city@0 ASC NULLS LAST]`: Sorts the four streams of data, each on `city`, as specified in the query.
- `SortPreservingMergeExec: [city@0 ASC NULLS LAST]`: Merges and sorts the four sorted streams
  for the final output.

In the preceding examples, the `EXPLAIN` report shows you the query plan without executing the query.
If you want runtime metrics, such as execution time for a plan and its operators, use [`EXPLAIN ANALYZE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze) to generate the report and [tracing](/influxdb/cloud-dedicated/query-data/execute-queries/optimize-queries/#enable-trace-logging) for further debugging if necessary.
