---
title: Optimize queries
description: >
  Optimize your SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
weight: 401
menu:
  influxdb_cloud_dedicated:
    name: Optimize queries
    parent: Execute queries
influxdb/cloud-dedicated/tags: [query, sql, influxql]
related:
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/query-data/influxql/
  - /influxdb/cloud-dedicated/query-data/execute-queries/troubleshoot/
  - /influxdb/cloud-dedicated/reference/client-libraries/v3/
---

Optimize your queries to reduce their memory and compute (CPU) requirements.
Use tools to help you identify performance bottlenecks and troubleshoot problems in queries.

<!-- TOC -->

- [Strategies for improving query performance](#strategies-for-improving-query-performance)
- [EXPLAIN and ANALYZE](#explain-and-analyze)
- [Enable trace logging](#enable-trace-logging)
    - [Avoid unnecessary tracing](#avoid-unnecessary-tracing)
  - [Syntax](#syntax)
  - [Example](#example)
  - [Tracing response header](#tracing-response-header)
    - [Trace response header syntax](#trace-response-header-syntax)
  - [Inspect Flight response headers](#inspect-flight-response-headers)
- [Retrieve query information](#retrieve-query-information)


## Why is my query slow?

Query performance depends on time range and complexity.
If a query is slower than you expect, it might be due to the following reasons:

- It queries a large time-range of data.
- It includes intensive operations, such as `ORDER BY` on large amounts of data or querying many string values.

### Why isn't my query returning data?

If a query doesn't return any data, it might be due to the following:

- Your data falls outside the time range (or other conditions) in the query--for example, the InfluxQL `SHOW TAG VALUES` command uses a default time range of 1 day.
- The query (InfluxDB server) timed out.
- The query client timed out.

## Strategies for improving query performance

The following design strategies generally improve query performance and resource use:

- Follow [schema design best practices](/influxdb/cloud-dedicated/write-data/best-practices/schema-design/) to make querying easier and more performant.
- Query only the data you need--for example, include a [`WHERE` clause]() that contains a time range.
  InfluxDB v3 stores data in a parquet file for each measurement and day, and retrieves files from the object store to answer a query.
  The smaller the time range in your query, the fewer files InfluxDB needs to retrieve from the object store.
- [Downsample data](/influxdb/cloud-dedicated/process-data/downsample/) to reduce the amount of data you need to query.

Some bottlenecks may be out of your control and are the result of a suboptimal execution plan, such as:

- Applying the same sort (`ORDER BY`) to already sorted data.
- Retrieving many parquet files from object storage.
- Querying many overlapped parquet files.
- Performing a large number of table scans.

The `EXPLAIN` and `EXPLAIN ANALYZE` commands can help you identify why the query doesn't perform as you expect.
Learn how to [use `EXPLAIN` and `EXPLAIN ANALYZE` to troubleshoot the query plan](#analyze-an-explain-report-and-troubleshoot-the-query-plan).

## Use `EXPLAIN` and `EXPLAIN ANALYZE` to troubleshoot the query plan

To view the query engine's execution plan and metrics for an SQL or InfluxQL query, prepend [`EXPLAIN`](/influxdb/cloud-dedicated/reference/sql/explain/) or [`EXPLAIN ANALYZE`](/influxdb/cloud-dedicated/reference/sql/explain/#explain-analyze) to the query.
The `EXPLAIN` and `EXPLAIN ANALYZE` reports can reveal bottlenecks that affect the performance of your query.
By learning how to generate and interpret the `EXPLAIN` report, you can better understand how the query is executed and why it doesn't perform as you expect.

- [Execute an `EXPLAIN` query](#execute-an-explain-query)
- [Analyze an EXPLAIN report and troubleshoot the query plan](#analyze-an-explain-report-and-troubleshoot-the-query-plan)

### Execute an EXPLAIN query

The following example shows how to use the InfluxDB v3 Python client library and pandas to view `EXPLAIN` and `EXPLAIN ANALYZE` results for a query:

<!-- Import for tests and hide from users.
```python
import os
```
-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
<!--pytest-codeblocks:cont-->

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

{{< expand-wrapper >}}
{{% expand "View EXPLAIN example results" %}}
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

### Execute an EXPLAIN ANALYZE query

<!--pytest-codeblocks:cont-->

```python
sql_explain_analyze = '''EXPLAIN ANALYZE
                      SELECT *
                      FROM home
                      WHERE time >= now() - INTERVAL '90 days'
                      ORDER BY time'''

table = client.query(sql_explain_analyze)
df = table.to_pandas()
print(df.to_markdown(index=False))

assert df.shape == (1,2)
assert 'Plan with Metrics' in df.plan_type.values, "Expect plan metrics"

client.close()
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the specified database

{{< expand-wrapper >}}
{{% expand "View EXPLAIN ANALYZE example results" %}}
```SQL
| plan_type         | plan                                                                                                                   |
|:------------------|:-----------------------------------------------------------------------------------------------------------------------|
| Plan with Metrics | ProjectionExec: expr=[temp@0 as temp], metrics=[output_rows=0, elapsed_compute=1ns]                                    |
|             |   SortExec: expr=[time@1 ASC NULLS LAST], metrics=[output_rows=0, elapsed_compute=1ns, spill_count=0, spilled_bytes=0] |
|             |     EmptyExec: produce_one_row=false, metrics=[]
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Analyze an EXPLAIN report and troubleshoot the query plan

Learn how to analyze an `EXPLAIN` report, find bottlenecks, and identify potential problems in the query plan.

An `EXPLAIN` report shows the sequence of processes run during query execution.

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
