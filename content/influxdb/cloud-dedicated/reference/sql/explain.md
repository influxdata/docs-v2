---
title: EXPLAIN command
description: > 
  The `EXPLAIN` command shows the logical and physical execution plan for the
  specified SQL statement.
menu:
  influxdb_cloud_dedicated:
    name: EXPLAIN command
    parent: SQL reference
weight: 207
---

The `EXPLAIN` command returns the logical and physical execution plan for the
specified SQL statement.

```sql
EXPLAIN [ANALYZE] [VERBOSE] statement
```

- [EXPLAIN](#explain)
- [EXPLAIN ANALYZE](#explain-analyze)

## EXPLAIN

Returns the execution plan of a statement.
To output more details, use `EXPLAIN VERBOSE`.

##### Example EXPLAIN ANALYZE

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

Returns the execution plan and metrics of a statement.
To output more information, use `EXPLAIN ANALYZE VERBOSE`.

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