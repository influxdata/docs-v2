---
title: influxdb3 manage
introduced: v3.11.1
description: >
  The `influxdb3 manage` command performs maintenance operations on an
  InfluxDB 3 Enterprise cluster, such as cleaning up Parquet data after a
  storage engine upgrade.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 manage
weight: 300
related:
  - /influxdb3/enterprise/reference/internals/storage-engine/
---

Use `influxdb3 manage` to perform maintenance operations on an InfluxDB 3 Enterprise cluster.

> [!Note]
> These commands act on the [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/) (PachaTree) migration.
> They have no effect on a cluster that has never run the storage engine upgrade.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 manage <SUBCOMMAND>
```

## Subcommands

| Subcommand | Description |
| :--------- | :---------- |
| [cleanup-parquet](/influxdb3/enterprise/reference/cli/influxdb3/manage/cleanup-parquet/) | Remove pre-upgrade Parquet data after a storage engine upgrade |
| [retry-upgrade-to-pacha-tree](/influxdb3/enterprise/reference/cli/influxdb3/manage/retry-upgrade-to-pacha-tree/) | Retry a failed storage engine upgrade |
| help | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
