---
title: influxdb3 loadcap
introduced: v3.10.0
description: >
  The `influxdb3 loadcap` command captures and manages anonymized workload
  profiles in InfluxDB 3 Enterprise.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 loadcap
weight: 300
related:
  - /influxdb3/enterprise/admin/load-capture/
---

Use `influxdb3 loadcap` to capture and manage anonymized workload profiles on a query-capable InfluxDB 3 Enterprise node.

> [!Note]
> Load capture requires the [upgraded storage engine](/influxdb3/enterprise/performance-preview/)--the default for new clusters.
> On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
> Send requests to a node with an explicit `--mode` setting that includes `query`, for example, `--mode query` or `--mode ingest --mode query --mode compact`.
> Load capture isn't available on a node that uses the default `--mode all` configuration.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 loadcap <SUBCOMMAND>
```

## Subcommands

| Subcommand | Description |
| :--------- | :---------- |
| [start](/influxdb3/enterprise/reference/cli/influxdb3/loadcap/start/) | Start a timed capture |
| [list](/influxdb3/enterprise/reference/cli/influxdb3/loadcap/list/) | List capture profiles |
| [files](/influxdb3/enterprise/reference/cli/influxdb3/loadcap/files/) | List files in a profile |
| [preview](/influxdb3/enterprise/reference/cli/influxdb3/loadcap/preview/) | Preview a profile |
| [download](/influxdb3/enterprise/reference/cli/influxdb3/loadcap/download/) | Download a profile archive |
| [delete](/influxdb3/enterprise/reference/cli/influxdb3/loadcap/delete/) | Delete a profile |
| help | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
