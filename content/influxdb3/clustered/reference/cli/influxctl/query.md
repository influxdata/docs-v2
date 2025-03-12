---
title: influxctl query
description: >
  The `influxctl query` command queries data from InfluxDB Clustered
  using SQL and prints results as a table or JSON.
menu:
  influxdb3_clustered:
    parent: influxctl
weight: 201
metadata: [influxctl 2.4.0+]
related:
  - /influxdb3/clustered/reference/sql/
  - /influxdb3/clustered/query-data/
---

The `influxctl query` command queries data from {{< product-name >}} using SQL
or InfluxQL and prints results as a table or JSON.

Provide the query in one of the following ways:

- a string on the command line
- a path to a file that contains the query
- as a single dash (`-`) to read the query from stdin

> [!Note]
> #### Important to note
> 
> - This command supports only one query per execution.
> - This command is not meant to be a full, feature-rich query tool.
>   It's meant for debug, triage, and basic data exploration.

### InfluxDB connection configuration

Your {{< product-name omit=" Clustered" >}} cluster host and port are
configured in your `influxctl`
[connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles).
Default uses TLS and port 443.
You can set a default database and token to use for the `query` and `write`
commands in your connection profile or pass them with the
command using the `--database` and `--token` flags.
Command line flags override settings in the connection profile. 

### Output format

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

When using the `table` format, by default, timestamps are formatted as RFC3339
timestamps. Use the `--time-format` flag to specify one of the available time formats:

- `rfc3339nano`: _(Default)_
  [RFC3339Nano-formatted timestamp](/influxdb3/clustered/reference/glossary/#rfc3339nano-timestamp)--for example:
  `2024-01-01T00:00:00.000000000Z`
- `unixnano`: [Unix nanosecond timestamp](/influxdb3/clustered/reference/glossary/#unix-timestamp)

## Usage

```sh
influxctl query [flags] <QUERY>
```

## Arguments

| Argument  | Description                                                                     |
| :-------- | :------------------------------------------------------------------------------ |
| **QUERY** | Query to execute (command line string, path to file, or `-` to read from stdin) |

## Flags

| Flag |                          | Description                                                            |
| :--- | :----------------------- | :--------------------------------------------------------------------- |
|      | `--database`             | Database to query                                                      |
|      | `--enable-system-tables` | Enable ability to query system tables                                  |
|      | `--format`               | Output format (`table` _(default)_ or `json`)                          |
|      | `--language`             | Query language (`sql` _(default)_ or `influxql`)                       |
|      | `--time-format`          | Time format for table output (`rfc3339nano` _(default)_ or `unixnano`) |
|      | `--token`                | Database token with read permissions on the queried database           |
| `-h` | `--help`                 | Output command help                                                    |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Query InfluxDB 3 with SQL](#query-influxdb-3-with-sql)
- [Query InfluxDB 3 with InfluxQL](#query-influxdb-3-with-influxql)
- [Query InfluxDB 3 and return results in table format](#query-influxdb-3-and-return-results-in-table-format)
- [Query InfluxDB 3 and return results in JSON format](#query-influxdb-3-and-return-results-in-json-format)
- [Query InfluxDB 3 and return results with Unix nanosecond timestamps](#query-influxdb-3-and-return-results-with-unix-nanosecond-timestamps)
- [Query InfluxDB 3 using credentials from the connection profile](#query-influxdb-3-using-credentials-from-the-connection-profile)
- [Query data from InfluxDB 3 system tables](#query-data-from-influxdb-3-system-tables)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with read access to the queried database
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to query

### Query InfluxDB 3 with SQL

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z'"
```
{{% /influxdb/custom-timestamps %}}
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

### Query InfluxDB 3 with InfluxQL

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --language influxql \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z'"
```
{{% /influxdb/custom-timestamps %}}
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

{{% /code-placeholders %}}

### Query InfluxDB 3 and return results in table format

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}
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
{{< /expand-wrapper >}}

### Query InfluxDB 3 and return results in JSON format

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --format json \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --format json \
  /path/to/query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./query.sql | influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --format json \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

{{< expand-wrapper >}}
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

### Query InfluxDB 3 and return results with Unix nanosecond timestamps

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --time-format unixnano \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --time-format unixnano \
  /path/to/query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./query.sql | influxctl query \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --time-format unixnano \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

{{< expand-wrapper >}}
{{% expand "View example table-formatted results" %}}
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

### Query InfluxDB 3 using credentials from the connection profile

The following example uses the `database` and `token` defined in the `default`
[connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles).

{{% influxdb/custom-timestamps %}}
```sh
influxctl query "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z'"
```
{{% /influxdb/custom-timestamps %}}

### Query data from InfluxDB 3 system tables

> [!Note]
> You must use **SQL** to query InfluxDB 3 system tables.

> [!Warning]
> Querying system tables can impact the overall performance of your
> {{< product-name omit=" Clustered" >}} cluster. System tables are not part of
> InfluxDB's stable API and are subject to change.

{{% code-placeholders "DATABASE_(TOKEN|NAME)|TABLE_NAME" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl query \
  --enable-system-tables \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "SELECT * FROM system.tables WHERE table_name = 'TABLE_NAME'"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl query \
  --enable-system-tables \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  /path/to/query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./query.sql | influxctl query \
  --enable-system-tables \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

{{% expand "View command updates" %}}

#### v2.9.0 {date="2024-05-06"}

- Add `--time-format` flag to specify which timestamp format to use in the
  `table` output format.

#### v2.8.0 {date="2024-04-11"}

- Add InfluxQL support and introduce the `--language` flag to specify the query
  language.
- Add `--enable-system-tables` flag to enable the ability to query InfluxDB 3
  system tables.

{{% /expand %}}
