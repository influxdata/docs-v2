---
title: Optimize queries
description: >
  Optimize your SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
weight: 401
menu:
  influxdb_clustered:
    name: Optimize queries
    parent: Execute queries
influxdb/clustered/tags: [query, sql, influxql]
related:
  - /influxdb/clustered/query-data/sql/
  - /influxdb/clustered/query-data/influxql/
  - /influxdb/clustered/query-data/execute-queries/troubleshoot/
  - /influxdb/clustered/reference/client-libraries/v3/
---

Optimize your queries to reduce their memory and compute (CPU) requirements.
Use tools to help you identify performance bottlenecks and troubleshoot problems in queries.

<!-- TOC -->

- [Strategies for improving query performance](#strategies-for-improving-query-performance)
- [EXPLAIN and ANALYZE](#explain-and-analyze)


## Strategies for improving query performance

A query may be slow due to the following reasons:

- It queries a large time-range of data.
- It includes intensive operations, such as `ORDER BY`.
- The query plan isn't optimal--for example, applying the same sort (`ORDER BY`) to already sorted data.
- It needs to retrieve many parquet files from object storage. The same query performs better if it retrieves fewer - though, larger - files.
- It queries many overlapped parquet files.
- It queries many string values. A query against a field that stores integers outperforms a query against string data.

Follow these strategies to help improve query performance:

- Follow [schema design best practices](/influxdb/clustered/write-data/best-practices/schema-design/) to make your data easier to query.
- [Downsample data](/influxdb/clustered/process-data/downsample/).
- Use custom-partitioning for your data. (How?)
- If resource usage and costs allow, “prewarm” query caches by running the query a few times.
(Qualify this? For example, if query speed is more important than cost or resource use?)
- "Prewarm" query caches by running the query a few times.

### EXPLAIN and ANALYZE

To view the query engine's execution plan and metrics for an SQL query, prepend [`EXPLAIN`](/influxdb/clustered/reference/sql/explain/) or [`EXPLAIN ANALYZE`](/influxdb/clustered/reference/sql/explain/#explain-analyze) to the query.
The report can reveal query bottlenecks such as a large number of table scans or parquet files, and can help triage the question, "Is the query slow due to the amount of work required or due to a problem with the schema, compactor, etc.?"

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
|               |   Sort: home.time ASC NULLS LAST                                                                                                                                                |
|               |     Projection: home.temp, home.time                                                                                                                                            |
|               |       TableScan: home projection=[room, temp, time], full_filters=[home.time >= TimestampNanosecond(1688676582918581320, None), home.room = Dictionary(Int32, Utf8("Kitchen"))] |
| physical_plan | ProjectionExec: expr=[temp@0 as temp]                                                                                                                                           |
|               |   SortExec: expr=[time@1 ASC NULLS LAST]                                                                                                                                        |
|               |     EmptyExec: produce_one_row=false                                                                                                                                            |
{{% /expand %}}
{{< /expand-wrapper >}}

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
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/clustered/admin/tokens/) with sufficient permissions to the specified database

{{< expand-wrapper >}}
{{% expand "View EXPLAIN ANALYZE example results" %}}
| plan_type         | plan                                                                                                                  |
|:------------------|:-----------------------------------------------------------------------------------------------------------------------|
| Plan with Metrics | ProjectionExec: expr=[temp@0 as temp], metrics=[output_rows=0, elapsed_compute=1ns]                                    |
|                   |   SortExec: expr=[time@1 ASC NULLS LAST], metrics=[output_rows=0, elapsed_compute=1ns, spill_count=0, spilled_bytes=0] |
|                   |     EmptyExec: produce_one_row=false, metrics=[]
{{% /expand %}}
{{< /expand-wrapper >}}
