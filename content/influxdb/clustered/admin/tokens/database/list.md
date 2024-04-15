---
title: List database tokens
description: >
  Use the [`influxctl token list` command](/influxdb/clustered/reference/cli/influxctl/token/list/)
  to list tokens in your InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: Database tokens
weight: 202
list_code_example: |
  ```sh
  influxctl token list
  ```
aliases:
  - /influxdb/clustered/admin/tokens/list/
---

Use the [`influxctl token list` command](/influxdb/clustered/reference/cli/influxctl/token/list/)
to list database tokens in your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run `influxctl token list` with the following:

    - _Optional_: [Output format](#output-formats)

```sh
influxctl token list --format table
```

### Output formats

The `influxctl token list` command supports two output formats: `table` and `json`.
By default, the command outputs the list of tokens formatted as a table.
For easier programmatic access to the command output, include `--format json`
with your command to format the token list as JSON.

#### Example output

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[table](#)
[json](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
+--------------------------------------+----------------------+
| ID                                   | DESCRIPTION          |
+--------------------------------------+----------------------+
| 000x0000-000x-0000-X0x0-X0X00000x000 | read/write for mydb1 |
| 000x000X-Xx0X-0000-0x0X-000xX000xx00 | read-only for mydb2  |
| 00XXxXxx-000X-000X-x0Xx-00000xx00x00 | write-only for myb3  |
+--------------------------------------+----------------------+
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```json
[
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "id": "000x0000-000x-0000-X0x0-X0X00000x000",
    "description": "read/write for mydb1",
    "permissions": {}
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "id": "000x000X-Xx0X-0000-0x0X-000xX000xx00",
    "description": "read-only for mydb2",
    "permissions": {}
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "id": "00XXxXxx-000X-000X-x0Xx-00000xx00x00",
    "description": "write-only for myb3",
    "permissions": {}
  }
]
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
