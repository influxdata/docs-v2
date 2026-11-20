---
title: influxdb3 uninstall
description: >
  The `influxdb3 uninstall` command and its subcommands remove Python packages
  from the InfluxDB 3 Enterprise processing engine environment.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 uninstall
weight: 300
---

The `influxdb3 uninstall` command and its subcommands remove Python packages
from the {{< product-name >}} Processing Engine environment.
This command is available in v3.12.3 and later.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 uninstall <SUBCOMMAND>
```

## Subcommands

| Subcommand | Description |
| :--------- | :---------- |
| [`package`](/influxdb3/enterprise/reference/cli/influxdb3/uninstall/package/) | Uninstall Python packages from the Processing Engine environment |
| `help` | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
