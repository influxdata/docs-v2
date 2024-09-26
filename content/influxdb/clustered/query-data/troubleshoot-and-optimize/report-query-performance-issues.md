---
title: Report query performance issues
description: >
  A comprehensive guide on ensuring a quick turnaround when troubleshooting query performance.
menu:
  influxdb_clustered:
    name: Report query performance issues
    parent: Troubleshoot and optimize queries
weight: 402
related:
  - /influxdb/clustered/admin/query-system-data/
---

These guidelines are intended to faciliate collaboration between InfluxData
engineers and you. They allow engineers to conduct timely analyses of any performance
issues that you have not been able to resolve following our [guide on
troubleshooting and optimizing
queries](/influxdb/clustered/query-data//troubleshoot-and-optimize).

1. [Send InfluxData output artifacts](#send-influxdata-output-artifacts)
2. [Document your test process](#document-your-test-process)
3. [Document your environment](#document-your-environment)
4. [Document your data schema](#document-your-data-schema)
5. [Establish query performance degradation conditions](#establish-query-performance-degradation-conditions)
6. [Reduce query noise](#reduce-query-noise)
7. [Establish baseline single-query performance](#establish-baseline-single-query-performance)
8. [Run queries at multiple load scales](#run-queries-at-multiple-load-scales)
9. [Gather debug information](#gather-debug-information)
   1. [Kubernetes-specific information](#kubernetes-specific-information)
   2. [Clustered-specific information](#clustered-specific-information)
   3. [Query analysis](#query-analysis)
      1. [EXPLAIN](#explain)
      2. [EXPLAIN VERBOSE](#explain-verbose)
      3. [EXPLAIN ANALYZE](#explain-analyze)
10. [Gather system information](#gather-system-information)
    - [Collect table information](#collect-table-information)
    - [Collect compaction information for the table](#collect-compaction-information-for-the-table)
    - [Collect partition information for multiple tables](#collect-partition-information-for-multiple-tables)

{{% note %}}
Please note that this document may change from one support engagement to the
next as our process and tooling improves.
{{% /note %}}

### Send InfluxData output artifacts

As you follow these guidelines, package all produced output artifacts in the following form:

**Outputs:**

- `test-artifact-name.tar.gz`

Send InfluxData engineers all produced artifacts for analysis.

### Document your test process

There currently is no standardized performance test suite that you can run in
your environment, so please document your process so it can be replicated.
Include the following:

- The steps you take when performance testing.
- Timestamps of the tests you perform so they can be correlated with associated logs.

### Document your environment

Provide as much detail about your environment as your organization allows,
including the following:

- Your kubernetes cluster
- The cloud provider where it runs or indicate that it's "on-prem"
- The hardware it runs on
- The type and size of disk in use--for example: hard disk,  SSD, NVMe, etc.
- CPU and memory resources set on each type of InfluxDB pod
- The number of pods in each InfluxDB StatefulSet and Deployment
- The type of object store used and how it is hosted
- How the Catalog (PostgreSQL-compatible database) is hosted
- Indicate if either the Object store or the Catalog is shared by more than one InfluxDB
  Clustered product
  - If so, describe the network-level topology of your setup

{{% note %}}
#### If possible, provide a synthetic dataset

If you can reproduce the performance issue with a synthetic dataset and your
process and environment are well-documented, InfluxData engineers _may_
be able to reproduce the issue, shorten the feedback cycle, and resolve the
issue sooner.
{{% /note %}}

### Document your data schema

Document your the data schema to help InfluxData engineers better understand the
conditions that reproduce your issue.

### Establish query performance degradation conditions

The most effective way to investigate query performance is to have a good understanding of
the conditions in which you don't see the expected performance. Things to think about
and provide:

- Does this always happen, or only sometimes?
  - If only sometimes, is it at a consistent time of day or over a consistent period?
- Will a single query execution reproduce the issue, or does it only appear with multiple queries
  are running at the same time?
- How are you executing the queries? For example:
  - `influxctl`
  - Client libraries
  - Other environments or tools

### Reduce query noise

To get a sense of the baseline performance of your system without the
noise of additional queries, test in an environment that doesn't have periodic
or intermittent queries running concurrently.

Additionally, when running multiple tests with different queries, let the system
recover between tests by waiting at least a minute after receiving a query result
before executing the next query.

### Establish baseline single-query performance

To get a sense of the baseline performance of your system without the
noise of additional queries, perform at least some of your testing with
single queries in isolation from one another.

This is may be useful for the purposes of analysis by InfluxData engineers even if a
single query in isolation isn't enough to reproduce the issue you are having.

### Run queries at multiple load scales

Once you've established baseline performance with a single query and your
performance issue can't be replicated with a single query, use a systematic
approach to identify the scale at which it does become a problem.
This involves systematic incremental increases to your query
concurrency until you identify a threshold at which the issue can be
reproduced.

This, along with information about your Kubernetes environment, can provide 
insight necessary to recommend changes to your configuration to improve
query performance characteristis as your usage scales.

As an example, consider the following test plan outline:

1. Turn off intermittent or periodic InfluxDB queries and allow the cluster to recover.
2. Run Query A and allow the cluster to recover for 1 minute.
3. Run 5 concurrent instances of Query A and allow the cluster to recover for 1 minute.
4. Run 10 concurrent instances of Query A and allow the cluster to recover for 1 minute.
5. Run 20 concurrent instances of Query A and allow the cluster to recover for 1 minute.
6. Run 40 concurrent instances of Query A and allow the cluster to recover for 1 minute.
7. Provide InfluxData the debug information [described below](#gather-debug-information).

{{% note %}}
This is just an example. You don't have to go beyond the scale where queries get slower
but you may also need to go further than what's outlined here.
{{% /note %}}

<!-- Don't mention dashboards until they're working working in a future Clustered release --

### Capture dashboard screens

If you have set up alerts and dashboards for monitoring your cluster, capture
screenshots of dashboard events for Queriers, Compactors, and Ingesters.

-->

### Gather debug information

The following debug information should be collected shortly _after_ a
 problematic query has been tried against your InfluxDB cluster.

#### Kubernetes-specific information

**Outputs:**

- `${DATETIME}-cluster-info.tar.gz`

```
DATETIME="$(date -Iminutes)"
kubectl cluster-info dump --namespace influxdb --output-directory "${DATETIME}-cluster-info/"
tar -czf "${DATETIME}-cluster-info.tar.gz" "${DATETIME}-cluster-info/"
```

#### Clustered-specific information

**Outputs:**

- `app-instance.yml`: Provide a copy of your `AppInstance` manifest.

#### Query analysis

**Outputs (InfluxQL):**

- `explain.csv`
- `explain-verbose.csv`
- `explain-analyze.csv`

**Outputs (SQL):**

- `explain.txt`
- `explain-verbose.txt`
- `explain-analyze.txt`

For any known long-running queries, it may be helpful to execute variations of
the `EXPLAIN` command on them.

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  The name of the database to query
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  A database token with read permissions on the queried database
- {{% code-placeholder-key %}}`YOUR_QUERY`{{% /code-placeholder-key %}}:
  Your long-running query (formatted as a single line with escaped double quotes (`\"`))

##### EXPLAIN

{{% code-placeholders "DATABASE_(NAME|TOKEN)|YOUR_QUERY" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```
influxctl \
  --config config.toml \
    query \
  --database DATABASE_NAME \
  --format table \
  --token DATABASE_TOKEN \
  "EXPLAIN YOUR_QUERY;" > explain.txt
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```
curl --get "https://{{< influxdb/host >}}/query" \
  --output "./explain.csv" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=EXPLAIN YOUR_QUERY"
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

##### EXPLAIN VERBOSE

{{% code-placeholders "DATABASE_(NAME|TOKEN)|YOUR_QUERY" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```
influxctl \
  --config config.toml \
    query \
  --database DATABASE_NAME \
  --format table \
  --token DATABASE_TOKEN \
  "EXPLAIN VERBOSE YOUR_QUERY;" > explain-verbose.txt
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```
curl --get "https://{{< influxdb/host >}}/query" \
  --output "./explain-verbose.csv" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=EXPLAIN VERBOSE YOUR_QUERY"
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

##### EXPLAIN ANALYZE

{{% code-placeholders "DATABASE_(NAME|TOKEN)|YOUR_QUERY" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```
influxctl \
  --config config.toml \
    query \
  --database DATABASE_NAME \
  --format table \
  --token DATABASE_TOKEN \
  "EXPLAIN ANALYZE YOUR_QUERY;" > explain-analyze.txt
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```
curl --get "https://{{< influxdb/host >}}/query" \
  --output "./explain-analyze.csv" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=EXPLAIN ANALYZE YOUR_QUERY"
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

### Gather system information

{{% warn %}}
#### May impact cluster performance

Querying InfluxDB v3 system tables may impact write and query
performance of your {{< product-name omit=" Clustered" >}} cluster.
Use filters to [optimize queries to reduce impact to your cluster](/influxdb/clustered/admin/query-system-data/#optimize-queries-to-reduce-impact-to-your-cluster).

<!--------------- UPDATE THE DATE BELOW AS EXAMPLES ARE UPDATED --------------->

#### System tables are subject to change

System tables are not part of InfluxDB's stable API and may change with new releases.
The provided schema information and query examples are valid as of **September 20, 2024**.
If you detect a schema change or a non-functioning query example, please
[submit an issue](https://github.com/influxdata/docs-v2/issues/new/choose).

<!--------------- UPDATE THE DATE ABOVE AS EXAMPLES ARE UPDATED --------------->
{{% /warn %}}

If queries are slow for a specific table, run the following system queries to collect information for troubleshooting.

- [Collect table information](#collect-table-information)
- [Collect compaction information for the table](#collect-compaction-information-for-the-table)
- [Collect partition information for multiple tables](#collect-partition-information-for-multiple-tables)

To [optimize system queries](/influxdb/clustered/admin/query-system-data/#optimize-queries-to-reduce-impact-to-your-cluster), use `table_name`, `partition_key`, and
`partition_id` filters.
In your queries, replace the following:

- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the table to retrieve partitions for
- {{% code-placeholder-key %}}`PARTITION_ID`{{% /code-placeholder-key %}}: a [partition ID](/influxdb/clustered/admin/query-system-data/#retrieve-a-partition-id) (int64) 
- {{% code-placeholder-key %}}`PARTITION_KEY`{{% /code-placeholder-key %}}: a [partition key](/influxdb/clustered/admin/custom-partitions/#partition-keys)
   derived from the table's partition template.
   The default format is `%Y-%m-%d` (for example, `2024-01-01`).

#### Collect table information

{{% code-placeholders "TABLE_NAME" %}}
```sql
SELECT *
FROM system.tables
WHERE table_name = 'TABLE_NAME';
```
{{% /code-placeholders%}}

#### Collect compaction information for the table

Query the `system.compactor` table to collect compaction information--for example, run one of the following
queries:

{{% code-placeholders "TABLE_NAME|PARTITION_KEY" %}}

```sql
SELECT * 
FROM system.compactor 
WHERE
  table_name = 'TABLE_NAME' 
    AND partition_key = 'PARTITION_KEY';
```

{{% /code-placeholders %}}

{{% code-placeholders "TABLE_NAME|PARTITION_ID" %}}

```sql
SELECT * 
FROM system.compactor 
WHERE
  table_name = 'TABLE_NAME' 
    AND partition_id = 'PARTITION_ID';
```

{{% /code-placeholders %}}

#### Collect partition information for multiple tables

If the same queries are slow on more than 1 table, also run the following query to collect the size and
number of partitions for all tables:

{{% code-placeholders "TABLE_NAME" %}}
```sql
SELECT table_name,
  COUNT(*) as partition_count,
  MAX(last_new_file_created_at) as last_new_file_created_at,
  SUM(total_size_mb) as total_size_mb
FROM system.partitions
WHERE table_name IN ('foo', 'bar', 'baz')
GROUP BY table_name;
```
{{% /code-placeholders%}}
