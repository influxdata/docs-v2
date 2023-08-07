---
title: List databases
description: >
  Use the [`influxctl database list` command](/influxdb/clustered/reference/cli/influxctl/database/list/)
  to list databases in your InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: Manage databases
weight: 202
list_code_example: |
  ```sh
  influxctl database list
  ```
---

Use the [`influxctl database list` command](/influxdb/clustered/reference/cli/influxctl/database/list/)
to list databases in your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
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
# Insert table output
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```json
// Insert json output
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
