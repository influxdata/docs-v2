<!--Allow shortcode-->
{{< product-name >}} stores partition information in InfluxDB 3 system tables.
Query partition information to view partition templates and verify partitions
are working as intended.

- [Query partition information from system tables](#query-partition-information-from-system-tables)
- [Partition-related queries](#partition-related-queries)

> [!Warning]
> #### Querying system tables may impact overall cluster performance
> 
> Partition information is stored in InfluxDB 3 system tables.
> Querying system tables may impact the overall write and query performance of
> your {{< product-name omit=" Clustered" >}} cluster.
> 
> <!--------------- UPDATE THE DATE BELOW AS EXAMPLES ARE UPDATED --------------->
> 
> #### System tables are subject to change
> 
> System tables are not part of InfluxDB's stable API and may change with new releases.
> The provided schema information and query examples are valid as of **September 24, 2024**.
> If you detect a schema change or a non-functioning query example, please
> [submit an issue](https://github.com/influxdata/docs-v2/issues/new/choose).
> 
> <!--------------- UPDATE THE DATE ABOVE AS EXAMPLES ARE UPDATED --------------->

## Query partition information from system tables

Use the [`influxctl query` command](/influxdb/version/reference/cli/influxctl/query/)
and SQL to query partition-related information from InfluxDB system tables.
 Provide the following:

- **Enable system tables** with the `--enable-system-tables` command flag.
- **Database token**: A [database token](/influxdb/version/admin/tokens/#database-tokens)
  with read permissions on the specified database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb/version/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: The name of the database to query information about.
  Uses the `database` setting from the
  [`influxctl` connection profile](/influxdb/version/reference/cli/influxctl/#configure-connection-profiles)
  or the `--database` command flag.
- **SQL query**: The SQL query to execute.
  Pass the query in one of the following ways:

  - a string on the command line
  - a path to a file that contains the query
  - a single dash (`-`) to read the query from stdin

{{% code-placeholders "DATABASE_(TOKEN|NAME)|SQL_QUERY" %}}

```bash
influxctl query \
  --enable-system-tables \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  "SQL_QUERY"
```

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

## Partition-related queries

Use the following queries to return information about partitions in your
{{< product-name omit=" Clustered" >}} cluster.

- [View partition templates of all tables](#view-partition-templates-of-all-tables)
- [View the partition template of a specific table](#view-the-partition-template-of-a-specific-table)
- [View all partitions for a table](#view-all-partitions-for-a-table)
- [View the number of partitions per table](#view-the-number-of-partitions-per-table)
- [View the number of partitions for a specific table](#view-the-number-of-partitions-for-a-specific-table)

---

In the examples below, replace {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}
with the name of the table you want to query information about.

---

{{% code-placeholders "TABLE_NAME_(1|2|3)|TABLE_NAME" %}}

### View the partition template of a specific table

```sql
SELECT * FROM system.tables WHERE table_name = 'TABLE_NAME'
```

#### Example results

| table_name | partition_template                                                                         |
| :--------- | :----------------------------------------------------------------------------------------- |
| weather    | `{"parts":[{"timeFormat":"%Y-%m-%d"},{"bucket":{"tagName":"location","numBuckets":250}}]}` |

> [!Note]
> If a table doesn't include a partition template in the output of this command,
> the table uses the default (1 day) partition strategy and doesn't partition
> by tags or tag buckets.

### View all partitions for a table

```sql
SELECT * FROM system.partitions WHERE table_name = 'TABLE_NAME'
```

### Example results

| partition_id | table_name | partition_key     | last_new_file_created_at | num_files | total_size_mb |
| -----------: | :--------- | :---------------- | -----------------------: | --------: | ------------: |
|         1362 | weather    | 43 \| 2020-05-27  |      1683747418763813713 |         1 |             0 |
|          800 | weather    | 234 \| 2021-08-02 |      1683747421899400796 |         1 |             0 |
|          630 | weather    | 325 \| 2022-03-17 |      1683747417616689036 |         1 |             0 |
|         1401 | weather    | 12 \| 2021-01-09  |      1683747417786122295 |         1 |             0 |
|         1012 | weather    | 115 \| 2022-07-04 |      1683747417614219148 |         1 |             0 |

### View the number of partitions per table

```sql
SELECT
  table_name,
  COUNT(*) AS partition_count
FROM
  system.partitions
WHERE
  table_name IN ('TABLE_NAME_1', 'TABLE_NAME_2', 'TABLE_NAME_3')
GROUP BY
  table_name
```

### Example results

| table_name | partition_count |
| :--------- | --------------: |
| weather    |            1096 |
| home       |              24 |
| numbers    |               1 |

### View the number of partitions for a specific table

```sql
SELECT
  COUNT(*) AS partition_count
FROM
  system.partitions
WHERE
  table_name = 'TABLE_NAME'
```

### Example results

| table_name | partition_count |
| :--------- | --------------: |
| weather    |            1096 |

{{% /code-placeholders %}}
