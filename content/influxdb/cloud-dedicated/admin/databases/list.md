---
title: List databases
description: >
  Use the [`influxctl database list` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/list/)
  to list databases in your InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: Manage databases
weight: 202
list_code_example: |
  ```sh
  influxctl database list
  ```
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/database/list/
---

Use the [`influxctl database list` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/list/)
to list databases in your InfluxDB Cloud Dedicated cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run `influxctl database list` with the following:

    - _(Optional)_ [Output format](#output-formats)

```sh
influxctl database list --format table
```

### Output formats

The `influxctl database list` command supports two output formats: `table` and `json`.
By default, the command outputs the list of databases formatted as a table.
For easier programmatic access to the command output, include `--format json`
with your command to format the database list as JSON.

#### Example output

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[table](#)
[json](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
+---------------+------------------+------------+-----------------------+
| DATABASE NAME | RETENTION PERIOD | MAX TABLES | MAX COLUMNS PER TABLE |
+---------------+------------------+------------+-----------------------+
| mydb1         | infinite         |        500 |                   250 |
| mydb2         | infinite         |        500 |                   200 |
| mydb3         | 24h              |        100 |                   200 |
+---------------+------------------+------------+-----------------------+
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```json
[
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "database_name": "mydb1",
    "retention_period_ns": 0,
    "max_tables": 500,
    "max_columns_per_table": 250
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "database_name": "mydb2",
    "retention_period_ns": 0,
    "max_tables": 500,
    "max_columns_per_table": 200
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "database_name": "mydb3",
    "retention_period_ns": 86400000000000,
    "max_tables": 100,
    "max_columns_per_table": 200
  },
]
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
