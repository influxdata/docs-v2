---
title: EXPLAIN command
description: > 
  The `EXPLAIN` command returns the [ogical plan and [physical execution plan) for the specified SQL statement.
menu:
  influxdb_cloud_dedicated:
    name: EXPLAIN command
    parent: SQL reference
weight: 207
---

The `EXPLAIN` command returns the [logical plan]() and the [physical execution plan]() for the
specified SQL statement.

```sql
EXPLAIN [ANALYZE] [VERBOSE] statement
```

- [EXPLAIN](#explain)
- [EXPLAIN ANALYZE](#explain-analyze)

## EXPLAIN

Returns the execution plan of a statement.
To output more details, use `EXPLAIN VERBOSE`.

`EXPLAIN` doesn't execute the statement.
To execute the statement and view runtime metrics, use [`EXPLAIN ANALYZE`](#explain-analyze).

### Example EXPLAIN

```sql
EXPLAIN
SELECT
  room,
  avg(temp) AS temp
FROM home
GROUP BY room
```

{{< expand-wrapper >}}
{{% expand "View `EXPLAIN` example output" %}}

| plan_type     | plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logical_plan  | Projection: home.room, AVG(home.temp) AS temp Aggregate: groupBy=[[home.room]], aggr=[[AVG(home.temp)]] TableScan: home projection=[room, temp]                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| physical_plan | ProjectionExec: expr=[room@0 as room, AVG(home.temp)@1 as temp] AggregateExec: mode=FinalPartitioned, gby=[room@0 as room], aggr=[AVG(home.temp)] CoalesceBatchesExec: target_batch_size=8192 RepartitionExec: partitioning=Hash([Column { name: "room", index: 0 }], 4), input_partitions=4 RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=1 AggregateExec: mode=Partial, gby=[room@0 as room], aggr=[AVG(home.temp)] ParquetExec: limit=None, partitions={1 group: [[136/316/1120/1ede0031-e86e-06e5-12ba-b8e6fd76a202.parquet]]}, projection=[room, temp] |

{{% /expand %}}
{{< /expand-wrapper >}}

## EXPLAIN ANALYZE

Executes a statement and returns the execution plan and runtime metrics of the statement.
The report includes the [logical plan](#logical-plan) and the [physical plan](#physical-plan) annotated with execution counters, number of rows produced, and runtime metrics sampled during the query execution.

`EXPLAIN` and `EXPLAIN ANALYZE` may show a truncated list of the files scanned for a query if the plan requires reading lots of data files,
To output more information, including intermediate plans and paths for all scanned parquet files, use [`EXPLAIN ANALYZE VERBOSE`](#explain-analyze-verbose).

##### Example EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT
  room,
  avg(temp) AS temp
FROM home
GROUP BY room
```

{{< expand-wrapper >}}
{{% expand "View `EXPLAIN ANALYZE` example output" %}}

| plan_type         | plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan with Metrics | CoalescePartitionsExec, metrics=[output_rows=2, elapsed_compute=8.892µs, spill_count=0, spilled_bytes=0, mem_used=0] ProjectionExec: expr=[room@0 as room, AVG(home.temp)@1 as temp], metrics=[output_rows=2, elapsed_compute=3.608µs, spill_count=0, spilled_bytes=0, mem_used=0] AggregateExec: mode=FinalPartitioned, gby=[room@0 as room], aggr=[AVG(home.temp)], metrics=[output_rows=2, elapsed_compute=121.771µs, spill_count=0, spilled_bytes=0, mem_used=0] CoalesceBatchesExec: target_batch_size=8192, metrics=[output_rows=2, elapsed_compute=23.711µs, spill_count=0, spilled_bytes=0, mem_used=0] RepartitionExec: partitioning=Hash([Column { name: "room", index: 0 }], 4), input_partitions=4, metrics=[repart_time=25.117µs, fetch_time=1.614597ms, send_time=6.705µs] RepartitionExec: partitioning=RoundRobinBatch(4), input_partitions=1, metrics=[repart_time=1ns, fetch_time=319.754µs, send_time=2.067µs] AggregateExec: mode=Partial, gby=[room@0 as room], aggr=[AVG(home.temp)], metrics=[output_rows=2, elapsed_compute=75.615µs, spill_count=0, spilled_bytes=0, mem_used=0] ParquetExec: limit=None, partitions={1 group: [[136/316/1120/1ede0031-e86e-06e5-12ba-b8e6fd76a202.parquet]]}, projection=[room, temp], metrics=[output_rows=26, elapsed_compute=1ns, spill_count=0, spilled_bytes=0, mem_used=0, pushdown_rows_filtered=0, bytes_scanned=290, row_groups_pruned=0, num_predicate_creation_errors=0, predicate_evaluation_errors=0, page_index_rows_filtered=0, time_elapsed_opening=100.37µs, page_index_eval_time=2ns, time_elapsed_scanning_total=157.086µs, time_elapsed_processing=226.644µs, pushdown_eval_time=2ns, time_elapsed_scanning_until_data=116.875µs] |

{{% /expand %}}
{{< /expand-wrapper >}}

## EXPLAIN ANALYZE VERBOSE

Executes a statement and returns the execution plan, runtime metrics, and additional details helpful for debugging the statement.

The report includes the following:

- the [logical plan](#logical-plan)
- the [physical plan](#physical-plan) annotated with execution counters, number of rows produced, and runtime metrics sampled during the query execution
- Information truncated in the `EXPLAIN` report--for example, the paths for all [files](#file_groups) retrieved for the query.
- All intermediate physical plans that the IOx querier and DataFusion generate before the query engine generates the final physical plan--helpful in debugging to see when an _operator_ is added or removed in a plan, and how InfluxDB and DataFusion optimize the query.
The report includes:

### Example EXPLAIN ANALYZE VERBOSE

```SQL
EXPLAIN VERBOSE SELECT temp FROM home
WHERE time >= now() - INTERVAL '90 days' AND room = 'Kitchen'
ORDER BY time
```
