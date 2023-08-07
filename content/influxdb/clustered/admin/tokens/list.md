---
title: List tokens
description: >
  Use the [`influxctl token list` command](/influxdb/clustered/reference/cli/influxctl/token/list/)
  to list tokens in your InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: Manage tokens
weight: 202
list_code_example: |
  ```sh
  influxctl token list
  ```
---

Use the [`influxctl token list` command](/influxdb/clustered/reference/cli/influxctl/token/list/)
to list database tokens in your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run `influxctl token list` with the following:

    - _(Optional)_ [Output format](#output-formats)

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
# Insert table output
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```json
// Insert json output
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
