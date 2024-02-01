---
title: Query plan
description: >
  A query plan is a sequence of steps that the query engine devises and executes to calculate the result of a query.
  The query engine tries to determine the optimal plan for the query structure and data.
  The InfluxDB v3 query engine includes DataFusion and InfluxDB operators that execute steps in the plan, including reading, deduplicating, filtering, and sorting data.
weight: 401
menu:
  influxdb_cloud_dedicated:
    name: Query plan
    parent: InfluxDB Cloud internals
influxdb/cloud-dedicated/tags: [query, sql, influxql]
related:
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/query-data/influxql/
  - /influxdb/cloud-dedicated/query-data/execute-queries/analyze-query-plan/
  - /influxdb/cloud-dedicated/query-data/execute-queries/troubleshoot/
---

A query plan is a sequence of steps that the [Querier](/influxdb/cloud-dedicated/reference/internals/storage-engine/#querier) devises and executes to calculate the result of a query.

Like many other databases, the InfluxDB v3 Querier contains a Query Optimizer.
The Querier builds the best-suited, optimal query plan that executes on the data from the cache and ingesters, and finishes in the least amount of time.
Similar to the [Ingester](/influxdb/cloud-dedicated/reference/internals/storage-engine/#ingester), the Querier uses DataFusion and Arrow to build and execute custom query plans for SQL queries.
The Querier takes advantage of data partitioning by the Ingester to parallelize the query plan and prune unnecessary data before executing the plan.
The Querier also applies common techniques of predicate and projection pushdown to further prune data as soon as possible.

InfluxDB v3 query plans include DataFusion and InfluxDB logical plan _operators_ and physical plan `ExecutionPlan` implementors for reading, deduplicating, filtering, aggregating, merging, projecting, and sorting data.

- [Logical plan](#logical-plan)
- [Physical plan](#physical-plan)
- [Example logical and physical plan](#example-logical-and-physical-plan)
- [Logical plan operators](#logical-plan-operators)
  - [TableScan](#tablescan)
  - [Projection](#projection)
  - [Filter](#filter)
  - [Sort](#sort)
- [Physical plan ExecutionPlans](#physical-plan-executionplans)
  - [DataFusion ExecutionPlans](#datafusion-executionplans)
  - [InfluxDB-specific ExecutionPlans](#influxdb-specific-executionplans)
- [Overlapping data and deduplication](#overlapping-data-and-deduplication)

## Logical plan

A logical plan for a query in InfluxDB v3:

- is a high-level representation of the query, independent of how a the query is physically executed
- is a Directed Acyclic Graph (DAG) of DataFusion and InfluxDB `LogicalPlan` expressions
- includes [relational operators](#logical-plan-operators) and optimizations for transforming input data to an output table
- doesn't consider cluster configuration, data source (Ingester data or Parquet file storage), or how data is organized or partitioned

## Physical plan

A physical plan (also called an _execution plan_) for a query in InfluxDB v3:

- is a low-level representation of the query that shows individual data transformation steps and their input and output arguments
- is a Directed Acyclic Graph (DAG) of DataFusion and InfluxDB `ExecutionPlan` expressions.
- derives from the [logical plan](#logical-plan) and considers the cluster configuration (for example, CPU and memory allocation), and the underlying data organization (for example: partitions, the number of files, and whether files overlap)
- is specific to your InfluxDB cluster configuration and your data at query time--if you run the same query with the same data on different clusters with different configurations, each cluster may generate a different physical plan for the query.
  Likewise, if you run the same query on the same cluster, but at different times, the cluster can generate different physical plans depending on the data at that time.
- if generated using `ANALYZE`, includes runtime metrics sampled from the execution  (for example, `DeduplicateExec`) during execution

For more information about DataFusion query plans and the DataFusion API used in InfluxDB v3, see the following:

- [Query Planning and Execution Overview](https://docs.rs/datafusion/latest/datafusion/index.html#query-planning-and-execution-overview) in the DataFusion documentation.

- [Plan representations](https://docs.rs/datafusion/latest/datafusion/#plan-representations) in the DataFusion documentation.

## Example logical and physical plan

The following query generates an `EXPLAIN` report that includes a logical and a physical plan:

```sql
EXPLAIN SELECT city, min_temp, time FROM h2o ORDER BY city ASC, time DESC;
```

The output is the following:

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

Each plan is composed of `LogicalPlan` or `ExecutionPlan` expressions--for example:

```text
ParquetExec: file_groups={...}, projection=[city, min_temp, time]
```

An expression represents an _operator_ that takes a stream of data and the relevant parts of the query as arguments, and then transforms the data before it flows to the next node in the plan.

The following diagram shows the data flow and sequence of `ExecutionPlans` in the [Figure 1](#query-plan-figure-1) physical plan:

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

{{% product-name %}} includes the following plan expressions:

## Logical plan operators

Each node in an {{% product-name %}} logical plan tree represents a DataFusion `LogicalPlan` operator.

### TableScan

[`Tablescan`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.TableScan.html) retrieves rows from a table provider by reference or from the context.

### Projection

[`Projection`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.Projection.html) evaluates an arbitrary list of expressions on the input; equivalent to an SQL `SELECT` statement with an expression list.

### Filter

[`Filter`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.Filter.html) filters rows from the input that do not satisfy the specified expression; equivalent to an SQL `WHERE` clause with a predicate expression.

### Sort

[`Sort`](https://docs.rs/datafusion/latest/datafusion/logical_expr/struct.Sort.html) sorts the input according to a list of sort expressions; used to implement SQL `ORDER BY`.

For details and other DataFusion operators, see [`Enum datafusion::logical_expr::LogicalPlan` Variants](https://docs.rs/datafusion/latest/datafusion/logical_expr/enum.LogicalPlan.html#variants) in the DataFusion documentation.

## Physical plan ExecutionPlans

Each node in an {{% product-name %}} physical plan represents an `ExecutionPlan` for one or more [logical plan operators](#logical-plan-operators).

The following are some `ExecutionPlan` implementors commonly used in InfluxDB physical plans.

### DataFusion ExecutionPlans

#### ParquetExec

[`ParquetExec`](https://docs.rs/datafusion/latest/datafusion/datasource/physical_plan/parquet/struct.ParquetExec.html) scans one or more Parquet partitions.

#### ProjectionExec

[`ProjectionExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/projection/struct.ProjectionExec.html) evaluates an arbitrary list of expressions on the input; the execution plan for the [`Projection`](#projection) operator.

#### FilterExec

[`FilterExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/filter/struct.FilterExec.html) evaluates a boolean predicate against all input batches to determine which rows to include in the output batches; the execution plan for the [`Filter`](#filter) operator.

#### SortExec

[`SortExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/sorts/sort/struct.SortExec.html): Supports sorting datasets that are larger than the memory allotted by the memory manager, by spilling to disk; the execution plan for the [`Sort`](#logical-plan-operators) operator.

#### SortPreservingMergeExec

[`SortPreservingMergeExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/sorts/sort_preserving_merge/struct.SortPreservingMergeExec.html) takes an input execution plan and a list of sort expressions and, provided each partition of the input plan is sorted with respect to these sort expressions, yields a single partition sorted with respect to them.

#### UnionExec

[`UnionExec`](https://docs.rs/datafusion/latest/datafusion/physical_plan/union/struct.UnionExec.html) is the `UNION ALL` execution plan for combining multiple inputs that have the same schema. `UnionExec` concatenates the partitions and does not mix or copy data within or across partitions.


For details and other DataFusion `ExecutionPlan` implementors, see [`Struct datafusion::datasource::physical_plan` Implementors](https://docs.rs/datafusion/latest/datafusion/physical_plan/trait.ExecutionPlan.html) in the DataFusion documentation.

### InfluxDB-specific ExecutionPlans

#### DeduplicateExec

`DeduplicateExec` takes an input stream of `RecordBatch` sorted on `sort_key` and applies IOx-specific deduplication logic. The output is dependent on the order of the input rows that have the same key.

#### RecordBatchesExec

`RecordBatchesExec` reads recently written, yet-to-be-persisted, data from the Ingester.

## Overlapping data and deduplication

_Overlapping data_ refers to files or batches in which the time ranges (represented by timestamps) intersect. Two _chunks_ of data overlap if there are portions of time for which data exists in both chunks.

For example, the following chunks represent line protocol written to InfluxDB.
Chunk 4 is persisted to a Parquet file in the Object store and spans the time range `400-600`.
Chunk 5 is yet-to-be persisted and spans the time range `550-700`.
Data in the chunks overlap the range `550-600`.

```text
// Chunk 4: stored parquet file
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
//   - overlaps & duplicates data in chunk 4
[
"h2o,state=MA,city=Bedford max_temp=88.75,area=742u 600", // overlaps chunk 4
"h2o,state=CA,city=SF min_temp=68.4,max_temp=85.7,area=500u 650",
"h2o,state=CA,city=SJ min_temp=68.5,max_temp=90.0 600", // duplicates row 2 in chunk 4
"h2o,state=CA,city=SJ min_temp=75.5,max_temp=84.08 700",
"h2o,state=MA,city=Boston min_temp=67.4 550", // overlaps chunk 4
]
```

If data overlaps at query time, the Querier must include the _deduplication_ process in the query plan, which uses the same multi-column sort-merge operators used by the Ingester.
Compared to an ingestion plan that uses sort-merge operators, a query plan is more complex and ensures that data streams through the plan after deduplication.
Because sort-merge operations used in deduplication have a non-trivial execution cost, InfluxDB v3 tries to avoid the need for deduplication.

Due to how InfluxDB organizes data, a Parquet file never contains duplicates of the data it stores; only overlapped data can contain duplicates.
During compaction, the [Compactor](/influxdb/cloud-dedicated/reference/internals/storage-engine/#compactor) sorts stored data to reduce overlaps and optimize query performance.
For data that doesn't have overlaps, the Querier doesn't need to include the deduplication process and the query plan can further distribute non-overlapping data for parallel operations.
