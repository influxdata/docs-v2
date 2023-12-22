---
title: Optimize queries
description: >
  Optimize your SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
weight: 401
menu:
  influxdb_cloud_serverless:
    name: Optimize queries
    parent: Query data
influxdb/cloud-serverless/tags: [query, sql, influxql]
related:
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/query-data/influxql/
  - /influxdb/cloud-serverless/query-data/execute-queries/troubleshoot/
  - /influxdb/cloud-serverless/reference/client-libraries/v3/
aliases:
  - /influxdb/cloud-serverless/query-data/execute-queries/optimize-queries/
---

## Troubleshoot query performance

Use the following tools to help you identify performance bottlenecks and troubleshoot problems in queries:

- [Troubleshoot query performance](#troubleshoot-query-performance)
  - [EXPLAIN and ANALYZE](#explain-and-analyze)
  - [Enable trace logging](#enable-trace-logging)

### EXPLAIN and ANALYZE

To view the query engine's execution plan and metrics for an SQL query, prepend [`EXPLAIN`](/influxdb/cloud-serverless/reference/sql/explain/) or [`EXPLAIN ANALYZE`](/influxdb/cloud-serverless/reference/sql/explain/#explain-analyze) to the query.
The report can reveal query bottlenecks such as a large number of table scans or parquet files, and can help triage the question, "Is the query slow due to the amount of work required or due to a problem with the schema, compactor, etc.?"

The following example shows how to use the InfluxDB v3 Python client library and pandas to view `EXPLAIN` and `EXPLAIN ANALYZE` results for a query:

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->

{{% code-placeholders "BUCKET_NAME|API_TOKEN|APP_REQUEST_ID" %}}
```python
from influxdb_client_3 import InfluxDBClient3
import pandas as pd
import tabulate # Required for pandas.to_markdown()

def explain_and_analyze():
  print('Use SQL EXPLAIN and ANALYZE to view query plan information.')

  # Instantiate an InfluxDB client.
  client = InfluxDBClient3(token = f"API_TOKEN",
                          host = f"{{< influxdb/host >}}",
                          database = f"BUCKET_NAME")

  sql_explain = '''EXPLAIN SELECT *
        FROM home
        WHERE time >= now() - INTERVAL '90 days'
        ORDER BY time'''

  table = client.query(sql_explain)
  df = table.to_pandas()

  sql_explain_analyze = '''EXPLAIN ANALYZE SELECT *
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time'''

  table = client.query(sql_explain_analyze)

  # Combine the Dataframes and output the plan information.
  df = pd.concat([df, table.to_pandas()])

  assert df.shape == (3, 2) and df.columns.to_list() == ['plan_type', 'plan']
  print(df[['plan_type', 'plan']].to_markdown(index=False))

  client.close()

explain_and_analyze()
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: the [bucket](/influxdb/cloud-serverless/admin/buckets/) to query
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified database

The output is similar to the following:

```markdown
| plan_type         | plan                                                                                                                                         |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| logical_plan      | Sort: home.time ASC NULLS LAST                                                                                                               |
|                   |   TableScan: home projection=[co, hum, room, sensor, temp, time], full_filters=[home.time >= TimestampNanosecond(1688491380936276013, None)] |
| physical_plan     | SortExec: expr=[time@5 ASC NULLS LAST]                                                                                                       |
|                   |   EmptyExec: produce_one_row=false                                                                                                           |
| Plan with Metrics | SortExec: expr=[time@5 ASC NULLS LAST], metrics=[output_rows=0, elapsed_compute=1ns, spill_count=0, spilled_bytes=0]                         |
|                   |   EmptyExec: produce_one_row=false, metrics=[]
```

### Enable trace logging

Customers with an {{% product-name %}} [annual or support contract](https://www.influxdata.com/influxdb-cloud-pricing/) can [contact InfluxData Support](https://support.influxdata.com/) to enable tracing and request help troubleshooting your query.
With tracing enabled, InfluxDB Support can trace system processes and analyze log information for a query instance.
The tracing system follows the [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) model for providing observability into a request.
