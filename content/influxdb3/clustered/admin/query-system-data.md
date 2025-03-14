--- 
title: Query system data
description: >
  Query system tables in your InfluxDB cluster to see data related
  to queries, tables, partitions, and compaction in your cluster.
menu:
  influxdb3_clustered:
    parent: Administer InfluxDB Clustered
    name: Query system data
weight: 105
related:
  - /influxdb3/clustered/reference/cli/influxctl/query/
  - /influxdb3/clustered/reference/internals/system-tables/
--- 

{{< product-name >}} stores data related to queries, tables, partitions, and
compaction in _system tables_ within your cluster.
System tables contain time series data used by and generated from the
{{< product-name >}} internal monitoring system.
You can query the cluster system tables for information about your cluster.

- [Query system tables](#query-system-tables)
  - [Optimize queries to reduce impact to your cluster](#optimize-queries-to-reduce-impact-to-your-cluster)
- [System tables](#system-tables)
  - [Understanding system table data distribution](#understanding-system-table-data-distribution)
  - [system.queries](#systemqueries)
  - [system.tables](#systemtables)
  - [system.partitions](#systempartitions)
  - [system.compactor](#systemcompactor)
- [System query examples](#system-query-examples)
  - [Query logs](#query-logs)
  - [Partitions](#partitions)
  - [Storage usage](#storage-usage)
  - [Compaction](#compaction)

> [!Warning]
> #### May impact cluster performance
> 
> Querying InfluxDB 3 system tables may impact write and query
> performance of your {{< product-name omit=" Clustered" >}} cluster.
> Use filters to [optimize queries to reduce impact to your cluster](#optimize-queries-to-reduce-impact-to-your-cluster).
> 
> <!--------------- UPDATE THE DATE BELOW AS EXAMPLES ARE UPDATED --------------->
> 
> #### System tables are subject to change
> 
> System tables are not part of InfluxDB's stable API and may change with new releases.
> The provided schema information and query examples are valid as of **September 18, 2024**.
> If you detect a schema change or a non-functioning query example, please
> [submit an issue](https://github.com/influxdata/docs-v2/issues/new/choose).
> 
> <!--------------- UPDATE THE DATE ABOVE AS EXAMPLES ARE UPDATED --------------->

## Query system tables

> [!Note]
> Querying system tables with `influxctl` requires **`influxctl` v2.8.0 or newer**.

Use the [`influxctl query` command](/influxdb3/clustered/reference/cli/influxctl/query/)
and SQL to query system tables.
Provide the following:

- **Enable system tables** with the `--enable-system-tables` command flag.
- **Database token**: A [database token](/influxdb3/clustered/admin/tokens/#database-tokens)
  with read permissions on the specified database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: The name of the database to query information about.
  Uses the `database` setting from the
  [`influxctl` connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--database` command flag.
- **SQL query**: The SQL query to execute.

  Pass the query in one of the following ways:

  - a string on the command line
  - a path to a file that contains the query
  - a single dash (`-`) to read the query from stdin

{{% code-placeholders "DATABASE_(TOKEN|NAME)|SQL_QUERY" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --enable-system-tables \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  "SQL_QUERY"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --enable-system-tables \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  /path/to/query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./query.sql | influxctl query \
  --enable-system-tables \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  A database token with read access to the specified database
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  The name of the database to query information about.
- {{% code-placeholder-key %}}`SQL_QUERY`{{% /code-placeholder-key %}}:
  The SQL query to execute. For examples, see
  [System query examples](#system-query-examples).

When prompted, enter `y` to acknowledge the potential impact querying system
tables may have on your cluster.

### Optimize queries to reduce impact to your cluster

Querying InfluxDB 3 system tables may impact the performance of your
{{< product-name omit=" Clustered" >}} cluster.
As you write data to a cluster, the number of partitions and Parquet files
can increase to a point that impacts system table performance.
Queries that took milliseconds with fewer files and partitions might take 10
seconds or longer as files and partitions increase.

Use the following filters to optimize your system table queries and reduce the impact on your
cluster's performance.

In your queries, replace the following:

- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the table to retrieve partitions for
- {{% code-placeholder-key %}}`PARTITION_ID`{{% /code-placeholder-key %}}: a [partition ID](#retrieve-a-partition-id) (int64) 
- {{% code-placeholder-key %}}`PARTITION_KEY`{{% /code-placeholder-key %}}: a [partition key](/influxdb3/clustered/admin/custom-partitions/#partition-keys)
   derived from the table's partition template.
   The default format is `%Y-%m-%d` (for example, `2024-01-01`).

##### Filter by table name

When querying the `system.tables`, `system.partitions`, or `system.compactor` tables, use the
`WHERE` clause to filter by `table_name` . 

{{% code-placeholders "TABLE_NAME" %}}
```sql
SELECT * FROM system.partitions WHERE table_name = 'TABLE_NAME'
```
{{% /code-placeholders%}}

##### Filter by partition key 

When querying the `system.partitions` or `system.compactor` tables, use the `WHERE` clause to
filter by `partition_key`.

{{% code-placeholders "PARTITION_KEY" %}}
```sql
SELECT * FROM system.partitions WHERE partition_key = 'PARTITION_KEY'
```
{{% /code-placeholders %}}

To further improve performance, use `AND` to pair `partition_key` with `table_name`--for example: 

{{% code-placeholders "TABLE_NAME|PARTITION_KEY" %}}
```sql
SELECT * 
FROM system.partitions 
WHERE
  table_name = 'TABLE_NAME' 
    AND partition_key = 'PARTITION_KEY';
```
{{% /code-placeholders %}}

{{% code-placeholders "TABLE_NAME|PARTITION_KEY" %}}
```sql
SELECT * 
FROM system.compactor
WHERE
  table_name = 'TABLE_NAME' 
    AND partition_key = 'PARTITION_KEY';
```
{{% /code-placeholders %}}

##### Filter by partition ID 

When querying the `system.partitions` or `system.compactor` table, use the `WHERE` clause to
filter by `partition_id` .

{{% code-placeholders "PARTITION_ID" %}}
```sql
SELECT * FROM system.partitions WHERE partition_id = PARTITION_ID
```
{{% /code-placeholders %}}

For the most optimized approach, use `AND` to pair `partition_id` with `table_name`--for example:

{{% code-placeholders "TABLE_NAME|PARTITION_ID" %}}
```sql
SELECT * 
FROM system.partitions 
WHERE
  table_name = 'TABLE_NAME' 
    AND partition_id = PARTITION_ID;
```
{{% /code-placeholders %}}

Although you don't need to pair `partition_id` with `table_name` (because a partition ID is unique within a cluster),
it's the most optimized approach, _especially when you have many tables in a database_.

###### Retrieve a partition ID

To retrieve a partition ID, query `system.partitions` for a `table_name` and `partition_key` pair--for example:

{{% code-placeholders "TABLE_NAME|PARTITION_KEY" %}}
```sql
SELECT
  table_name,
  partition_key,
  partition_id 
FROM system.partitions
WHERE
  table_name = 'TABLE_NAME'
    AND partition_key = 'PARTITION_KEY';
```
{{% /code-placeholders %}}

The result contains the `partition_id`:

| table_name | partition_key     | partition_id |
| :--------- | :---------------- | -----------: |
| weather    | 43 \| 2020-05-27  |         1362 |

##### Combine filters for performance improvement

Use the `AND`, `OR`, or `IN` keywords to combine filters in your query.

- **Use `OR` or `IN` conditions when filtering for different values in the same column**--for example:
  
  ```sql
  WHERE partition_id = 1 OR partition_id = 2
  ```

  Use `IN` to make multiple `OR` conditions more readable--for example:
  
  ```sql
  WHERE table_name IN ('foo', 'bar', 'baz')
  ```

- **Avoid mixing different columns in `OR` conditions**, as this won't improve performance--for example:
  
  ```sql
  WHERE table_name = 'foo' OR partition_id = 2  -- This will not improve performance
  ```

## System tables

> [!Warning]
> _System tables are [subject to change](#system-tables-are-subject-to-change)._

### Understanding system table data distribution

Data in `system.tables`, `system.partitions`, and `system.compactor` includes
data for all [InfluxDB Queriers](/influxdb3/clustered/reference/internals/storage-engine/#querier) in your cluster.
The data comes from the catalog, and because all the queriers share one catalog,
the results from these three tables derive from the same source data,
regardless of which querier you connect to.

However, the `system.queries` table is different--data is local to each Querier.
`system.queries` contains a non-persisted log of queries run against the current
querier to which your query is routed.
The query log is specific to the current Querier and isn't shared across
queriers in your cluster.
Logs are scoped to the specified database.

- [system.queries](#systemqueries)
- [system.tables](#systemtables)
- [system.partitions](#systempartitions)
- [system.compactor](#systemcompactor)

### system.queries

The `system.queries` table stores log entries for queries executed for the provided namespace (database) on the node that is _currently handling queries_.
`system.queries` reflects a process-local, in-memory, namespace-scoped query log.

While this table may be useful for debugging and monitoring queries, keep the following in mind:

- Records stored in `system.queries` are transient and volatile
  - InfluxDB deletes `system.queries` records during pod restarts.
  - Queries for one namespace can evict records from another namespace.
- Data reflects the state of a specific pod answering queries for the namespace.
  - Data isn't shared across queriers in your cluster.
  - A query for records in `system.queries` can return different results
    depending on the pod the request was routed to.

{{< expand-wrapper >}}
{{% expand "View `system.queries` schema" %}}

The `system.queries` table contains the following columns:

- id
- phase
- **issue_time**: timestamp when the query was issued
- **query_type**: type (syntax: `sql`, `flightsql`, or `influxql`) of the query
- **query_text**: query statement text
- partitions
- parquet_files
- plan_duration
- permit_duration
- execute_duration
- end2end_duration
- compute_duration
- max_memory
- **success**: execution status (boolean) of the query
- running
- cancelled
- **trace_id**: trace ID for debugging and monitoring events

{{% /expand %}}
{{< /expand-wrapper >}}

> [!Note]
> _When listing measurements (tables) available within a namespace,
> some clients and query tools may include the `queries` table in the list of
> namespace tables._

### system.tables

The `system.tables` table contains information about tables in the specified database.

{{< expand-wrapper >}}
{{% expand "View `system.tables` schema" %}}

The `system.tables` table contains the following columns:

- table_name
- partition_template

{{% /expand %}}
{{< /expand-wrapper >}}

### system.partitions

The `system.partitions` table contains information about partitions associated
with the specified database.

{{< expand-wrapper >}}
{{% expand "View `system.partitions` schema" %}}

The `system.partitions` table contains the following columns:

- partition_id
- table_name
- partition_key
- last_new_file_created_at
- num_files
- total_size_mb

{{% /expand %}}
{{< /expand-wrapper >}}

### system.compactor

The `system.compactor` table contains information about compacted partition Parquet
files associated with the specified database.

{{< expand-wrapper >}}
{{% expand "View `system.compactor` schema" %}}

The `system.compactor` table contains the following columns:

- partition_id
- table_name 
- partition_key
- total_l0_files
- total_l1_files
- total_l2_files
- total_l0_bytes
- total_l1_bytes
- total_l2_bytes
- skipped_reason

{{% /expand %}}
{{< /expand-wrapper >}} 

## System query examples

> [!Warning]
> #### May impact cluster performance
> 
> Querying InfluxDB 3 system tables may impact write and query
> performance of your {{< product-name omit=" Clustered" >}} cluster.
> 
> The examples in this section include `WHERE` filters to [optimize queries and reduce impact to your cluster](#optimize-queries-to-reduce-impact-to-your-cluster).

- [Query logs](#query-logs)
  - [View all stored query logs](#view-all-stored-query-logs)
  - [View query logs for queries with end-to-end durations above a threshold](#view-query-logs-for-queries-with-end-to-end-durations-above-a-threshold)
  - [View query logs for a specific query within a time interval](#view-query-logs-for-a-specific-query-within-a-time-interval)
- [Partitions](#partitions)
  - [View the partition template of a specific table](#view-the-partition-template-of-a-specific-table)
  - [View all partitions for a table](#view-all-partitions-for-a-table)
  - [View the number of partitions per table](#view-the-number-of-partitions-per-table)
  - [View the number of partitions for a specific table](#view-the-number-of-partitions-for-a-specific-table)
- [Storage usage](#storage-usage)
  - [View the size in megabytes of a specific table](#view-the-size-in-megabytes-of-a-specific-table)
  - [View the size in megabytes per table](#view-the-size-in-megabytes-per-table)
  - [View the total size in bytes of compacted partitions per table](#view-the-total-size-in-bytes-of-compacted-partitions-per-table)
  - [View the total size in bytes of compacted partitions for a specific table](#view-the-total-size-in-bytes-of-compacted-partitions-for-a-specific-table)
- [Compaction](#compaction)
  - [View compaction totals for each table](#view-compaction-totals-for-each-table)
  - [View compaction totals for a specific table](#view-compaction-totals-for-a-specific-table)

In the examples below, replace {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}
with the name of the table you want to query information about.

--- 

{{% code-placeholders "TABLE_NAME" %}}

### Query logs

#### View all stored query logs

```sql
SELECT * FROM system.queries
```

#### View query logs for queries with end-to-end durations above a threshold

The following returns query logs for queries with an end-to-end duration greater
than 50 milliseconds.

```sql
SELECT *
FROM
  system.queries
WHERE
  end2end_duration::BIGINT > (50 * 1000000)
```

### View query logs for a specific query within a time interval

{{< code-tabs >}}
{{% tabs %}}
[SQL](#)
[Python](#)
{{% /tabs %}}
{{% code-tab-content %}}
<!-----------------------------------BEGIN SQL------------------------------>
```sql
SELECT *
FROM system.queries
WHERE issue_time >= now() - INTERVAL '1 day'
  AND query_text LIKE '%select * from home%'
```
<!-----------------------------------END SQL------------------------------>
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-----------------------------------BEGIN PYTHON------------------------------>
```python
from influxdb_client_3 import InfluxDBClient3
client = InfluxDBClient3(token = DATABASE_TOKEN,
                          host = HOSTNAME,
                          org = '',
                          database=DATABASE_NAME)
client.query('select * from home')
reader = client.query('''
                      SELECT *
                      FROM system.queries
                      WHERE issue_time >= now() - INTERVAL '1 day'
                      AND query_text LIKE '%select * from home%'
                      ''',
                    language='sql',
                    headers=[(b"iox-debug", b"true")],
                    mode="reader")
```
<!-----------------------------------END PYTHON------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs >}}

--- 

### Partitions

#### View the partition template of a specific table

```sql
SELECT *
FROM
  system.tables
WHERE
  table_name = 'TABLE_NAME'
```

#### View all partitions for a table

```sql
SELECT *
FROM
  system.partitions
WHERE
  table_name = 'TABLE_NAME'
```

#### View the number of partitions per table

```sql
SELECT
  table_name,
  COUNT(*) AS partition_count
FROM
  system.partitions
WHERE
  table_name IN ('foo', 'bar', 'baz')
GROUP BY
  table_name
```

#### View the number of partitions for a specific table

```sql
SELECT
  COUNT(*) AS partition_count
FROM
  system.partitions
WHERE
  table_name = 'TABLE_NAME'
```

--- 

### Storage usage

#### View the size in megabytes of a specific table

```sql
SELECT
  SUM(total_size_mb) AS total_size_mb
FROM
  system.partitions
WHERE
  table_name = 'TABLE_NAME'
```

#### View the size in megabytes per table

```sql
SELECT
  table_name,
  SUM(total_size_mb) AS total_size_mb
FROM
  system.partitions
WHERE
  table_name IN ('foo', 'bar', 'baz')
GROUP BY
  table_name
```

#### View the total size in bytes of compacted partitions per table

```sql
SELECT
  table_name,
  SUM(total_l0_bytes) + SUM(total_l1_bytes) + SUM(total_l2_bytes) AS total_bytes
FROM
  system.compactor
WHERE
  table_name IN ('foo', 'bar', 'baz')
GROUP BY
  table_name
```

#### View the total size in bytes of compacted partitions for a specific table

```sql
SELECT
  SUM(total_l0_bytes) + SUM(total_l1_bytes) + SUM(total_l2_bytes) AS total_bytes
FROM
  system.compactor
WHERE
  table_name = 'TABLE_NAME'
```

--- 

### Compaction

#### View compaction totals for each table

```sql
SELECT
  table_name,
  SUM(total_l0_files) AS total_l0_files,
  SUM(total_l1_files) AS total_l1_files,
  SUM(total_l2_files) AS total_l2_files,
  SUM(total_l0_bytes) AS total_l0_bytes,
  SUM(total_l1_bytes) AS total_l1_bytes,
  SUM(total_l2_bytes) AS total_l2_bytes
FROM
  system.compactor
WHERE
  table_name IN ('foo', 'bar', 'baz')
GROUP BY
  table_name
```

#### View compaction totals for a specific table

```sql
SELECT
  SUM(total_l0_files) AS total_l0_files,
  SUM(total_l1_files) AS total_l1_files,
  SUM(total_l2_files) AS total_l2_files,
  SUM(total_l0_bytes) AS total_l0_bytes,
  SUM(total_l1_bytes) AS total_l1_bytes,
  SUM(total_l2_bytes) AS total_l2_bytes
FROM
  system.compactor
WHERE
  table_name = 'TABLE_NAME'
```

{{% /code-placeholders %}}
