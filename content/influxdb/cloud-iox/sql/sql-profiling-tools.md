---
title: SQL query profiling tools
description: >
  Use EXPLAIN and EXPLAIN ANALYZE to analyze the execution plans of SQL queries.
menu:
  influxdb_cloud_iox:
    name: SQL query profiling tools
    parent: Query data with SQL
weight: 185
---

SQL query profiling tools tell you where SQL allocates time in your query and why.

 - The `EXPLAIN` command shows the execution plan of a SQL statement.
 - The `EXPLAIN VERBOSE` command provides a more verbose execution plan of a statement.
 - The `EXPLAIN ANALYZE` command provides the execution plan and metrics of a statement. 

## Syntax

```sql
EXPLAIN [ANALYZE] [VERBOSE] <SQL query>

EXPLAIN SELECT SUM(x) FROM table GROUP BY a

EXPLAIN ANALYZE SELECT SUM(x) FROM table GROUP BY a
```

## Examples

```sql

EXPLAIN SELECT AVG(water_level)
FROM h2o_feet
GROUP BY water_level
```

Results:

```sql
plan_type:  logical_plan
Projection: AVG(h2o_feet.water_level) Aggregate: groupBy=[[h2o_feet.water_level]], aggr=[[AVG(h2o_feet.water_level)]] TableScan: h2o_feet projection=[water_level]

plan_type: physical_plan
ProjectionExec: expr=[AVG(h2o_feet.water_level)@1 as AVG(h2o_feet.water_level)] AggregateExec: mode=FinalPartitioned, gby=[water_level@0 as water_level], aggr=[AVG(h2o_feet.water_level)] 
CoalesceBatchesExec: target_batch_size=4096 RepartitionExec: partitioning=Hash([Column { name: "water_level", index: 0 }], 4) AggregateExec: mode=Partial, gby=[water_level@0 as water_level], aggr=[AVG(h2o_feet.water_level)] ParquetExec: limit=None, partitions={4 groups: [[999/4159/133/14035/ee0ee487-a848-411e-b505-6ffdf8aade04.parquet, 999/4159/133/14040/ba6dbb99-a1bc-4006-9929-f01cb7b4892d.parquet, 999/4159/133/14044/15206ce8-56d9-4682-a341-dbe08fa53a9f.parquet, 999/4159/133/14048/2b0e7e23-4f7a-462a-99f1-faa5b7f6c98c.parquet, 999/4159/133/14052/de9ef5e9-4b9d-4159-8e7b-9f450f5f9b47.parquet, 999/4159/133/14056/f25bb1c0-6c50-497b-b48b-7b47a2425a7d.parquet, 999/4159/133/14060/e069dd9c-bfa4-41c9-ae8c-b81131ef5e55.parquet, 999/4159/133/14064/d4414774-92a3-49f9-af2f-18c5371d27ad.parquet], [999/4159/133/14037/4fe9b9cf-9a0f-43b3-b22f-8f7ead229e0c.parquet, 999/4159/133/14041/f7dd9ea4-dc84-47b5-be67-9b082e84dc16.parquet, 999/4159/133/14045/15598510-730e-44d6-9db2-693e60b6540c.parquet, 999/4159/133/14049/4051b769-1f1d-476f-bf17-e105c3d1c8f5.parquet, 999/4159/133/14053/23515838-5004-43cd-9d20-0e66358d2010.parquet, 999/4159/133/14057/4d99f274-1f67-4a6f-8ba3-695e9f00ae52.parquet, 999/4159/133/14061/87b37eb3-a947-4893-b59a-49a2cc8bbd2e.parquet, 999/4159/133/14065/1f1c5235-87fa-432a-904d-b763a1de66e0.parquet], [999/4159/133/14038/786dd9d6-3919-4b8b-8237-17b93006469d.parquet, 999/4159/133/14042/520b4e5c-86c1-4754-bbe5-f462c5aad44d.parquet, 999/4159/133/14046/99ad07dc-0644-440a-9170-c4be2b015070.parquet, 999/4159/133/14050/3628ff69-0f92-4cb0-b7aa-832ee9ccad89.parquet, 999/4159/133/14054/fb4184e4-142f-47c5-8f1c-cbb7064bbc85.parquet, 999/4159/133/14058/fb04f3e6-c7d8-40cb-88e1-8cbe43ce3781.parquet, 999/4159/133/14062/5be6336c-0449-49d1-81dc-83a2668de979.parquet, 999/4159/133/14066/c5872c96-8ffe-48a0-b1e7-ee1fe219a292.parquet], [999/4159/133/14039/c11be384-e5dd-4a13-8c0b-87db271df346.parquet, 999/4159/133/14043/da6b34fa-1bc4-4f28-9103-4784f209129d.parquet, 999/4159/133/14047/83bd0348-8e3a-442d-ac96-c373a5ed054f.parquet, 999/4159/133/14051/b032a728-5e4c-43f9-bd0a-2455e974c2b1.parquet, 999/4159/133/14055/32e60c16-abdb-46c7-9c3a-75791122afa3.parquet, 999/4159/133/14059/bc06f602-f914-4fc6-996c-f095dc2e53d7.parquet, 999/4159/133/14063/87f22849-e55f-402e-aedd-b07c9231778f.parquet, 999/4159/133/14067/521e39b7-54d5-4f47-b6d3-ed6a59aaabb4.parquet]]}, projection=[water_level]	
```

```sql
EXPLAIN ANALYZE SELECT AVG(water_level)
FROM h2o_feet
GROUP BY water_level
```

Results:

```sql
CoalescePartitionsExec, metrics=[output_rows=2926, elapsed_compute=6.97µs, spill_count=0, spilled_bytes=0, mem_used=0] ProjectionExec: expr=[AVG(h2o_feet.water_level)@1 as AVG(h2o_feet.water_level)], metrics=[output_rows=2926, elapsed_compute=2.407µs, spill_count=0, spilled_bytes=0, mem_used=0] 
AggregateExec: mode=FinalPartitioned, gby=[water_level@0 as water_level], aggr=[AVG(h2o_feet.water_level)], metrics=[output_rows=2926, elapsed_compute=2.266774ms, spill_count=0, spilled_bytes=0, mem_used=0] CoalesceBatchesExec: target_batch_size=4096, metrics=[output_rows=7905, elapsed_compute=122.111µs, spill_count=0, spilled_bytes=0, mem_used=0] 
RepartitionExec: partitioning=Hash([Column { name: "water_level", index: 0 }], 4), metrics=[repart_time=130.617µs, fetch_time=1.552122013s, send_time=39.332µs] 
AggregateExec: mode=Partial, gby=[water_level@0 as water_level], aggr=[AVG(h2o_feet.water_level)], metrics=[output_rows=7905, elapsed_compute=8.768244ms, spill_count=0, spilled_bytes=0, mem_used=0] 
ParquetExec: limit=None, partitions={4 groups: [[999/4159/133/14035/ee0ee487-a848-411e-b505-6ffdf8aade04.parquet, 999/4159/133/14040/ba6dbb99-a1bc-4006-9929-f01cb7b4892d.parquet, 999/4159/133/14044/15206ce8-56d9-4682-a341-dbe08fa53a9f.parquet, 999/4159/133/14048/2b0e7e23-4f7a-462a-99f1-faa5b7f6c98c.parquet, 999/4159/133/14052/de9ef5e9-4b9d-4159-8e7b-9f450f5f9b47.parquet, 999/4159/133/14056/f25bb1c0-6c50-497b-b48b-7b47a2425a7d.parquet, 999/4159/133/14060/e069dd9c-bfa4-41c9-ae8c-b81131ef5e55.parquet, 999/4159/133/14064/d4414774-92a3-49f9-af2f-18c5371d27ad.parquet], [999/4159/133/14037/4fe9b9cf-9a0f-43b3-b22f-8f7ead229e0c.parquet, 999/4159/133/14041/f7dd9ea4-dc84-47b5-be67-9b082e84dc16.parquet, 999/4159/133/14045/15598510-730e-44d6-9db2-693e60b6540c.parquet, 999/4159/133/14049/4051b769-1f1d-476f-bf17-e105c3d1c8f5.parquet, 999/4159/133/14053/23515838-5004-43cd-9d20-0e66358d2010.parquet, 999/4159/133/14057/4d99f274-1f67-4a6f-8ba3-695e9f00ae52.parquet, 999/4159/133/14061/87b37eb3-a947-4893-b59a-49a2cc8bbd2e.parquet, 999/4159/133/14065/1f1c5235-87fa-432a-904d-b763a1de66e0.parquet], [999/4159/133/14038/786dd9d6-3919-4b8b-8237-17b93006469d.parquet, 999/4159/133/14042/520b4e5c-86c1-4754-bbe5-f462c5aad44d.parquet, 999/4159/133/14046/99ad07dc-0644-440a-9170-c4be2b015070.parquet, 999/4159/133/14050/3628ff69-0f92-4cb0-b7aa-832ee9ccad89.parquet, 999/4159/133/14054/fb4184e4-142f-47c5-8f1c-cbb7064bbc85.parquet, 999/4159/133/14058/fb04f3e6-c7d8-40cb-88e1-8cbe43ce3781.parquet, 999/4159/133/14062/5be6336c-0449-49d1-81dc-83a2668de979.parquet, 999/4159/133/14066/c5872c96-8ffe-48a0-b1e7-ee1fe219a292.parquet], [999/4159/133/14039/c11be384-e5dd-4a13-8c0b-87db271df346.parquet, 999/4159/133/14043/da6b34fa-1bc4-4f28-9103-4784f209129d.parquet, 999/4159/133/14047/83bd0348-8e3a-442d-ac96-c373a5ed054f.parquet, 999/4159/133/14051/b032a728-5e4c-43f9-bd0a-2455e974c2b1.parquet, 999/4159/133/14055/32e60c16-abdb-46c7-9c3a-75791122afa3.parquet, 999/4159/133/14059/bc06f602-f914-4fc6-996c-f095dc2e53d7.parquet, 999/4159/133/14063/87f22849-e55f-402e-aedd-b07c9231778f.parquet, 999/4159/133/14067/521e39b7-54d5-4f47-b6d3-ed6a59aaabb4.parquet]]}, 
projection=[water_level], 
metrics=[output_rows=15258, 
elapsed_compute=4ns, 
spill_count=0, 
spilled_bytes=0,
mem_used=0, 
page_index_rows_filtered=0, 
bytes_scanned=97022, 
pushdown_rows_filtered=0, 
predicate_evaluation_errors=0, 
row_groups_pruned=0, 
num_predicate_creation_errors=0, 
page_index_eval_time=64ns, 
pushdown_eval_time=64ns, 
time_elapsed_scanning=3.090043ms, 
time_elapsed_processing=11.731954ms, 
time_elapsed_opening=1539226411s]                                                                                                                                                                                                                 plan_type:  Metrics with Metrics
 ```