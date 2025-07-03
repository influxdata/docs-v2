---
title: Query plans
description: >
  A query plan is a sequence of steps that the InfluxDB Querier devises and executes to calculate the result of a query in the least amount of time.
  InfluxDB query plans include DataFusion and InfluxDB logical plan and execution plan nodes for scanning, deduplicating, filtering, merging, and sorting data.
weight: 201
menu:
  influxdb3_clustered:
    name: Query plans
    parent: InfluxDB internals
influxdb/clustered/tags: [query, sql, influxql]
related:
  - /influxdb3/clustered/query-data/sql/
  - /influxdb3/clustered/query-data/influxql/
  - /influxdb3/clustered/query-data/execute-queries/analyze-query-plan/
  - /influxdb3/clustered/query-data/execute-queries/troubleshoot/
  - /influxdb3/clustered/reference/internals/storage-engine/
---

A query plan is a sequence of steps that the InfluxDB 3 [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) devises and executes to calculate the result of a query.
The Querier uses DataFusion and Arrow to build and execute query plans
that call DataFusion and InfluxDB-specific operators that read data from the [Object store](/influxdb3/clustered/reference/internals/storage-engine/#object-store), and the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester), and apply query transformations, such as deduplicating, filtering, aggregating, merging, projecting, and sorting to calculate the final result.

Like many other databases, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) contains a Query Optimizer.
After it parses an incoming query, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) builds a _logical plan_--a sequence of high-level steps such as scanning, filtering, and sorting, required for the query.
Following the logical plan, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) then builds the optimal _physical plan_ to calculate the correct result in the least amount of time.
The plan takes advantage of data partitioning by the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester) to parallelize plan operations and prune unnecessary data before executing the plan.
The [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) also applies common techniques of predicate and projection pushdown to further prune data as early as possible.

- [Display syntax](#display-syntax)
  - [Example logical and physical plan](#example-logical-and-physical-plan)
- [Data flow](#data-flow)
- [Logical plan](#logical-plan)
- [`LogicalPlan` nodes](#logicalplan-nodes)
  - [`TableScan`](#tablescan)
  - [`Projection`](#projection)
  - [`Filter`](#filter)
  - [`Sort`](#sort)
- [Physical plan](#physical-plan)
- [`ExecutionPlan` nodes](#executionplan-nodes)
  - [`DeduplicateExec`](#deduplicateexec)
  - [`EmptyExec`](#emptyexec)
  - [`FilterExec`](#filterexec)
  - [`ParquetExec`](#parquetexec)
  - [`ProjectionExec`](#projectionexec)
  - [`RecordBatchesExec`](#recordbatchesexec)
  - [`SortExec`](#sortexec)
  - [`SortPreservingMergeExec`](#sortpreservingmergeexec)
- [Overlapping data and deduplication](#overlapping-data-and-deduplication)
  - [Example of overlapping data](#example-of-overlapping-data)
- [DataFusion query plans](#datafusion-query-plans)

## Display syntax

[Logical](#logical-plan) and [physical query plans](#physical-plan) are represented (for example, in an `EXPLAIN` report) in _tree syntax_.

- Each plan is represented as an upside-down tree composed of _nodes_.
- A parent node awaits the output of its child nodes.
- Data flows up from the bottom innermost nodes of the tree to the outermost _root node_ at the top.

### Example logical and physical plan

The following query generates an `EXPLAIN` report that includes a logical and a physical plan:

```sql
EXPLAIN SELECT city, min_temp, time FROM h2o ORDER BY city ASC, time DESC;
```

The output is the following:

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

The leaf nodes in the [Figure 1](#figure-1-explain-report) physical plan are parallel `ParquetExec` nodes:

```text
      ParquetExec: file_groups={...}, projection=[city, min_temp, time]
...
      ParquetExec: file_groups={...}, projection=[city, min_temp, time]
```

## Data flow

A [physical plan](#physical-plan) node represents a specific implementation of `ExecutionPlan` that receives an input stream, applies expressions for filtering and sorting, and then yields an output stream to its parent node.

The following diagram shows the data flow and sequence of `ExecutionPlan` nodes in the [Figure 1](#figure-1-explain-report) physical plan:

<!-- BEGIN Query plan diagram -->
{{< html-diagram/query-plan >}}
<!-- END Query plan diagram -->

{{% product-name %}} includes the following plan expressions:

## Logical plan

A logical plan for a query:

- is a high-level plan that expresses the "intent" of a query and the steps required for calculating the result.
- requires information about the data schema
- is independent of the [physical execution](#physical-plan), cluster configuration, data source (Ingester or Object store), or how data is organized or partitioned
- is displayed as a tree of [DataFusion `LogicalPlan` nodes](#logical-plan-nodes)

## `LogicalPlan` nodes

Each node in an {{% product-name %}} logical plan tree represents a [`LogicalPlan` implementation](https://docs.rs/datafusion/latest/datafusion/logical_expr/enum.LogicalPlan.html#variants) that receives criteria extracted from the query and applies relational operators and optimizations for transforming input data to an output table.

The following are some `LogicalPlan` nodes used in InfluxDB logical plans.

### `TableScan`

[`Tablescan`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.TableScan.html) retrieves rows from a table provider by reference or from the context.

### `Projection`

[`Projection`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.Projection.html) evaluates an arbitrary list of expressions on the input; equivalent to an SQL `SELECT` statement with an expression list.

### `Filter`

[`Filter`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.Filter.html) filters rows from the input that do not satisfy the specified expression; equivalent to an SQL `WHERE` clause with a predicate expression.

### `Sort`

[`Sort`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.Sort.html) sorts the input according to a list of sort expressions; used to implement SQL `ORDER BY`.

For details and a list of `LogicalPlan` implementations, see [`Enum datafusion::logical_expr::LogicalPlan` Variants](https://docs.rs/datafusion/latest/datafusion/logical_expr/enum.LogicalPlan.html#variants) in the DataFusion documentation.

## Physical plan

A physical plan, or _execution plan_, for a query:

- is an optimized plan that derives from the [logical plan](#logical-plan) and contains the low-level steps for query execution.
- considers the cluster configuration (for example, CPU and memory allocation) and data organization (for example: partitions, the number of files, and whether files overlap)--for example:
  - If you run the same query with the same data on different clusters with different configurations, each cluster may generate a different physical plan for the query.
  - If you run the same query on the same cluster at different times, the physical plan may differ each time, depending on the data at query time.
- if generated using `ANALYZE`, includes runtime metrics sampled during query execution
- is displayed as a tree of [`ExecutionPlan` nodes](#execution-plan-nodes)

## `ExecutionPlan` nodes

Each node in an {{% product-name %}} physical plan represents a call to a specific implementation of the [DataFusion `ExecutionPlan`](https://docs.rs/datafusion/latest/datafusion/physical_plan/trait.ExecutionPlan.html)
that receives input data, query criteria expressions, and an output schema.

The following are some `ExecutionPlan` nodes used in InfluxDB physical plans.

### `DeduplicateExec`

InfluxDB `DeduplicateExec` takes an input stream of `RecordBatch` sorted on `sort_key` and applies InfluxDB-specific deduplication logic.
The output is dependent on the order of the input rows that have the same key.

### `EmptyExec`

DataFusion [`EmptyExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/empty/struct.EmptyExec.html) is an execution plan for an empty relation and indicates that the table doesn't contain data for the time range of the query.

### `FilterExec`

The execution plan for the [`Filter`](#filter) `LogicalPlan`.

DataFusion [`FilterExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/filter/struct.FilterExec.html) evaluates a boolean predicate against all input batches to determine which rows to include in the output batches.

### `ParquetExec`

DataFusion [`ParquetExec`](https://docs.rs/datafusion/latest/datafusion/datasource/physical_plan/parquet/struct.ParquetExec.html) scans one or more Parquet partitions.

#### `ParquetExec` expressions

##### `file_groups`

A _file group_ is a list of files to scan.
Files are referenced by path:

- `1/1/b862a7e9b.../243db601-....parquet`
- `1/1/b862a7e9b.../f5fb7c7d-....parquet`

In InfluxDB 3, the path structure represents how data is organized.

A path has the following structure:

```text
<namespace_id>/<table_id>/<partition_hash_id>/<uuid_of_the_file>.parquet
    1         /    1    /b862a7e9b329ee6a4.../243db601-f3f1-4....parquet
```

- `namespace_id`: the namespace (database) being queried
- `table_id`: the table (measurement) being queried
- `partition_hash_id`: the partition this file belongs to.
You can count partition IDs to find how many partitions the query reads.
- `uuid_of_the_file`: the file identifier.

`ParquetExec` processes groups in parallel and reads the files in each group sequentially.

##### `projection`

`projection` lists the table columns that the query plan needs to read to execute the query.
The parameter name `projection` refers to _projection pushdown_, the action of filtering columns.

Consider the following sample data that contains many columns:

```text
h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 600
```

| table | state | city | min_temp | max_temp | area | time |
|:-----:|:-----:|:----:|:--------:|:--------:|:----:|:----:|
| h2o   | CA    | SF   | 68.4     | 85.7     | 500u | 600  |

However, the following SQL query specifies only three columns (`city`, `state`, and `time`):

```sql
SELECT city, count(1)
FROM h2o
WHERE time >= to_timestamp(200) AND time < to_timestamp(700)
  AND state = 'MA'
GROUP BY city
ORDER BY city ASC;
```

When processing the query, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) specifies the three required columns in the projection and the projection is "pushed down" to leaf nodes--columns not specified are pruned as early as possible during query execution.

```text
projection=[city, state, time]
```

##### `output_ordering`

`output_ordering` specifies the sort order for the output.
The Querier specifies `output_ordering` if the output should be ordered and if the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) knows the order.

When storing data to Parquet files, InfluxDB sorts the data to improve storage compression and query efficiency and the planner tries to preserve that order for as long as possible.
Generally, the `output_ordering` value that  `ParquetExec` receives is the ordering (or a subset of the ordering) of stored data.

_By design, [`RecordBatchesExec`](#recordbatchesexec) data isn't sorted._

In the following example, the query planner specifies the output sort order `state ASC, city ASC, time ASC,`:

```text
output_ordering=[state@2 ASC, city@1 ASC, time@3 ASC, __chunk_order@0 ASC]
```

##### `predicate`

`predicate` is the data filter specified in the query and used for row filtering when scanning Parquet files.

For example, given the following SQL query:

```sql
SELECT city, count(1)
FROM h2o
WHERE time >= to_timestamp(200) AND time < to_timestamp(700)
  AND state = 'MA'
GROUP BY city
ORDER BY city ASC;
```

The `predicate` value is the boolean expression in the `WHERE` statement:

```text
predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA
```

##### `pruning predicate`

`pruning_predicate` is created from the [`predicate`](#predicate) value and is used for pruning data and files from the chosen partitions.

For example, given the following `predicate` parsed from the SQL:

```text
predicate=time@5 >= 200 AND time@5 < 700 AND state@4 = MA,
```

The Querier creates the following `pruning_predicate`:

```text
pruning_predicate=time_max@0 >= 200 AND time_min@1 < 700 AND state_min@2 <= MA AND MA <= state_max@3
```

The default filters files by `time`.

_Before the physical plan is generated, an additional `partition pruning` step uses predicates on partitioning columns to prune partitions._

### `ProjectionExec`

DataFusion [`ProjectionExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/projection/struct.ProjectionExec.html) evaluates an arbitrary list of expressions on the input; the execution plan for the [`Projection`](#projection) `LogicalPlan`.

### `RecordBatchesExec`

The InfluxDB `RecordBatchesExec` implementation retrieves and scans recently written, yet-to-be-persisted, data from the InfluxDB 3 [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester).

When generating the plan, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) sends the query criteria, such as database, table, and columns, to the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester) to retrieve data not yet persisted to Parquet files.
If the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester) has data that meets the criteria (the chunk size is non-zero), then the plan includes `RecordBatchesExec`.

#### `RecordBatchesExec` attributes

##### `chunks`

`chunks` is the number of data chunks from the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester).
Often one (`1`), but it can be many.

##### `projection`

`projection` specifies a list of columns to read and output.

`__chunk_order` in a list of columns is an InfluxDB-generated column used to keep the chunks and files ordered for deduplication--for example:

```text
projection=[__chunk_order, city, state, time]
```

For details and other DataFusion `ExecutionPlan` implementations, see [`Struct datafusion::datasource::physical_plan` implementors](https://docs.rs/datafusion/latest/datafusion/physical_plan/trait.ExecutionPlan.html) in the DataFusion documentation.

### `SortExec`

The execution plan for the [`Sort`](#sort) `LogicalPlan`.

DataFusion [`SortExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/sorts/sort/struct.SortExec.html) supports sorting datasets that are larger than the memory allotted by the memory manager, by spilling to disk.

### `SortPreservingMergeExec`

DataFusion [`SortPreservingMergeExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/sorts/sort_preserving_merge/struct.SortPreservingMergeExec.html) takes an input execution plan and a list of sort expressions and, provided each partition of the input plan is sorted with respect to these sort expressions, yields a single partition sorted with respect to them.

#### `UnionExec`

DataFusion [`UnionExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/union/struct.UnionExec.html) is the `UNION ALL` execution plan for combining multiple inputs that have the same schema.
`UnionExec` concatenates the partitions and does not mix or copy data within or across partitions.

## Overlapping data and deduplication

_Overlapping data_ refers to files or batches in which the time ranges (represented by timestamps) intersect.
Two _chunks_ of data overlap if both chunks contain data for the same portion of time.

### Example of overlapping data

For example, the following chunks represent line protocol written to InfluxDB:

```text
// Chunk 4: stored parquet file
// - time range: 400-600
// - no duplicates in its own chunk
// - overlaps chunk 3
[
 "h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 600",
 "h2o,state=CA,city=SJ min_temp=69.5,max_temp=89.2 600",  // duplicates row 3 in chunk 5
 "h2o,state=MA,city=Bedford max_temp=80.75,area=742u 400", // overlaps chunk 3
 "h2o,state=MA,city=Boston min_temp=65.40,max_temp=82.67 400", // overlaps chunk 3
],

// Chunk 5: Ingester data
// - time range: 550-700
// - overlaps & duplicates data in chunk 4
[
"h2o,state=MA,city=Bedford max_temp=88.75,area=742u 600", // overlaps chunk 4
"h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 650",
"h2o,state=CA,city=SJ min_temp=68.5,max_temp=90.0 600", // duplicates row 2 in chunk 4
"h2o,state=CA,city=SJ min_temp=75.5,max_temp=84.08 700",
"h2o,state=MA,city=Boston min_temp=67.4 550", // overlaps chunk 4
]
```

- `Chunk 4` spans the time range `400-600` and represents data persisted to a Parquet file in the [Object store](/influxdb3/clustered/reference/internals/storage-engine/#object-store).
- `Chunk 5` spans the time range `550-700` and represents yet-to-be persisted data from the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester).
- The chunks overlap the range `550-600`.

If data overlaps at query time, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) must include the _deduplication_ process in the query plan, which uses the same multi-column sort-merge operators used by the [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester).
Compared to an ingestion plan that uses sort-merge operators, a query plan is more complex and ensures that data streams through the plan after deduplication.

Because sort-merge operations used in deduplication have a non-trivial execution cost, InfluxDB 3 tries to avoid the need for deduplication.
Due to how InfluxDB organizes data, a Parquet file never contains duplicates of the data it stores; only overlapped data can contain duplicates.
During compaction, the [Compactor](/influxdb3/clustered/reference/internals/storage-engine/#compactor) sorts stored data to reduce overlaps and optimize query performance.
For data that doesn't have overlaps, the [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) doesn't need to include the deduplication process and the query plan can further distribute non-overlapping data for parallel processing.

## DataFusion query plans

For more information about DataFusion query plans and the DataFusion API used in InfluxDB 3, see the following:

- [Query Planning and Execution Overview](https://docs.rs/datafusion/latest/datafusion/index.html#query-planning-and-execution-overview) in the DataFusion documentation.
- [Plan representations](https://docs.rs/datafusion/latest/datafusion/#plan-representations) in the DataFusion documentation.
