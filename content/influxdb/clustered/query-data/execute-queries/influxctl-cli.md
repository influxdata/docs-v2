---
title: Use the influxctl CLI to query data
list_title: Use the influxctl CLI
description: >
  Use the `influxctl query` command to query data in InfluxDB Clustered with SQL.
weight: 301
menu:
  influxdb_clustered:
    parent: Execute queries
    name: Use the influxctl CLI
influxdb/clustered/tags: [query, sql, influxql, influxctl, CLI]
related:
  - /influxdb/clustered/reference/cli/influxctl/query/
  - /influxdb/clustered/get-started/query/#execute-an-sql-query, Get started querying data
  - /influxdb/clustered/reference/sql/
  - /influxdb/clustered/reference/influxql/
list_code_example: |
  ```sh
  influxctl query \
    --token DATABASE_TOKEN \
    --database DATABASE_NAME \
    "SELECT * FROM home"
  ```
---

Use the [`influxctl query` command](/influxdb/clustered/reference/cli/influxctl/query/)
to query data in {{< product-name >}} with SQL or InfluxQL.

Provide the following with your command:

- **Database token**: A [database token](/influxdb/clustered/admin/tokens/#database-tokens)
  with read permissions on the queried database. By default, this uses
  the `database` setting from the [`influxctl` connection profile](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: The name of the database to query. By default, this uses
  the `database` setting from the [`influxctl` connection profile](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)
  or the `--database` command flag.
- **Query language** <em class="op65">(Optional)</em>: The query language of the query.
  Use the `--language` flag to specify one of the following query languages:
  
  - `sql` _(default)_
  - `influxql`

- **Query**: SQL or InfluxQL query to execute.
  Pass the query in one of the following ways:

  - a string on the command line
  - a path to a file that contains the query
  - a single dash (`-`) to read the query from stdin

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}

{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "SELECT * FROM home"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  /path/to/query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./query.sql | influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}

{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --language influxql \
  "SELECT * FROM home"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --language influxql \
  /path/to/query.influxql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./query.influxql | influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --language influxql \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with read access to the queried database
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to query

## Output format

The `influxctl query` command supports the following output formats:

- `table` _(default)_
- `json`

Use the `--format` flag to specify the output format:

{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --format json \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}

{{< expand-wrapper >}}
{{% expand "View example table-formatted results" %}}
{{% influxdb/custom-timestamps %}}
```
+-------+--------+---------+------+----------------------+
|    co |    hum | room    | temp | time                 |
+-------+--------+---------+------+----------------------+
|     0 |   35.9 | Kitchen |   21 | 2022-01-01T08:00:00Z |
|     0 |   36.2 | Kitchen |   23 | 2022-01-01T09:00:00Z |
|     0 |   36.1 | Kitchen | 22.7 | 2022-01-01T10:00:00Z |
|     0 |     36 | Kitchen | 22.4 | 2022-01-01T11:00:00Z |
|     0 |     36 | Kitchen | 22.5 | 2022-01-01T12:00:00Z |
+-------+--------+---------+------+----------------------+
| TOTAL | 5 ROWS |         |      |                      |
+-------+--------+---------+------+----------------------+
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-formatted results" %}}
{{% influxdb/custom-timestamps %}}
```json
[
  {
    "co": 0,
    "hum": 35.9,
    "room": "Kitchen",
    "temp": 21,
    "time": 1641024000000000000
  },
  {
    "co": 0,
    "hum": 36.2,
    "room": "Kitchen",
    "temp": 23,
    "time": 1641027600000000000
  },
  {
    "co": 0,
    "hum": 36.1,
    "room": "Kitchen",
    "temp": 22.7,
    "time": 1641031200000000000
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.4,
    "time": 1641034800000000000
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.5,
    "time": 1641038400000000000
  }
]
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Timestamp format

When using the `table` [output format](#output-format), you can specify which of
the following timestamp formats to use to display timestamp values in the query
results:

- `rfc3339nano`: _(Default)_
  [RFC3339Nano-formatted timestamp](/influxdb/clustered/reference/glossary/#rfc3339nano-timestamp)--for example:
  `2024-01-01T00:00:00.000000000Z`
- `unixnano`: [Unix nanosecond timestamp](/influxdb/clustered/reference/glossary/#unix-timestamp)

{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --time-format unixnano \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}

{{< expand-wrapper >}}
{{% expand "View example results with unix nanosecond timestamps" %}}
{{% influxdb/custom-timestamps %}}
```
+-------+--------+---------+------+---------------------+
|    co |    hum | room    | temp |                time |
+-------+--------+---------+------+---------------------+
|     0 |   35.9 | Kitchen |   21 | 1641024000000000000 |
|     0 |   36.2 | Kitchen |   23 | 1641027600000000000 |
|     0 |   36.1 | Kitchen | 22.7 | 1641031200000000000 |
|     0 |     36 | Kitchen | 22.4 | 1641034800000000000 |
|     0 |     36 | Kitchen | 22.5 | 1641038400000000000 |
+-------+--------+---------+------+---------------------+
| TOTAL | 5 ROWS |         |      |                     |
+-------+--------+---------+------+---------------------+
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}
