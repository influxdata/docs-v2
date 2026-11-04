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

> [!Important]
> Bulk import requires the [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)—the default for new clusters.
> On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
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
| [from-object-store](/influxdb3/enterprise/reference/cli/influxdb3/import/from-object-store/) | Import Parquet files directly from object storage, without streaming file bytes through the client |
| [list](/influxdb3/enterprise/reference/cli/influxdb3/import/list/) | List import jobs |
| help | Print command help or the help of a subcommand |

## Permissions

- `upload` and `from-object-store` need the `write` action on the target
  database.
- `list` needs the `describe` action on at least one database, and only
  returns import jobs for databases your token can describe.

For details, see [Permissions](/influxdb3/enterprise/admin/import-data/#permissions)
in the bulk import guide.

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
