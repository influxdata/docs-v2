---
title: Use the influxctl CLI to query data
list_title: Use the influxctl CLI
description: >
  Use the `influxctl query` command to query data in InfluxDB Cloud Dedicated
  with SQL.
weight: 301
menu:
  influxdb_cloud_dedicated:
    parent: Execute queries
    name: Use the influxctl CLI
influxdb/cloud-dedicated/tags: [query, sql, influxctl, CLI]
metadata: [SQL]
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/query/
  - /influxdb/cloud-dedicated/get-started/query/#execute-an-sql-query, Get started querying data
  - /influxdb/cloud-dedicated/reference/sql/
list_code_example: |
  ```sh
  influxctl query \
    --token DATABASE_TOKEN \
    --database DATABASE_NAME \
    "q=SELECT * FROM home"
  ```
---

Use the [`influxctl query` command](/influxdb/cloud-dedicated/reference/cli/influxctl/query/)
to query data in {{< product-name >}} with SQL.

{{% note %}}
The `influxctl query` command only supports SQL queries; not InfluxQL.
{{% /note %}}

Provide the following with your command:

- **Database token**: [Database token](/influxdb/cloud-dedicated/admin/tokens/)
  with read permissions on the queried database. Uses the `token` setting from
  the [`influxctl` connection profile](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
  or the `--token` command flag.
- **Database name**: Name of the database to query. Uses the `database` setting
  from the [`influxctl` connection profile](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
  or the `--database` command flag.
- **SQL query**: SQL query to execute.
  Pass the query in one of the following ways:

  - a string on the command line
  - a path to a file that contains the query
  - a single dash (`-`) to read the query from stdin

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

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
    "time": "2022-01-01T08:00:00Z"
  },
  {
    "co": 0,
    "hum": 36.2,
    "room": "Kitchen",
    "temp": 23,
    "time": "2022-01-01T09:00:00Z"
  },
  {
    "co": 0,
    "hum": 36.1,
    "room": "Kitchen",
    "temp": 22.7,
    "time": "2022-01-01T10:00:00Z"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.4,
    "time": "2022-01-01T11:00:00Z"
  },
  {
    "co": 0,
    "hum": 36,
    "room": "Kitchen",
    "temp": 22.5,
    "time": "2022-01-01T12:00:00Z"
  }
]
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

