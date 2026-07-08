---
title: influxdb3 import
description: >
  The `influxdb3 import` command manages bulk imports of Parquet data into
  InfluxDB 3 Enterprise databases and tables.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 import
weight: 300
related:
  - /influxdb3/enterprise/admin/import-data/
---

The `influxdb3 import` command manages bulk imports of Parquet data into
{{< product-name >}} databases and tables.

> [!Note]
> Bulk import requires the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/)
> (`--use-pacha-tree`).
> The target database and table must exist before importing.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 import <SUBCOMMAND>
```

## Subcommands

| Subcommand | Description |
| :--------- | :---------- |
| [upload](/influxdb3/enterprise/reference/cli/influxdb3/import/upload/) | Upload Parquet files into a database and table |
| [list](/influxdb3/enterprise/reference/cli/influxdb3/import/list/) | List import jobs |
| help | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
