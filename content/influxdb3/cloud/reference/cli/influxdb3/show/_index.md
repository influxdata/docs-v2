---
title: influxdb3 show
description: >
  The `influxdb3 show` command lists resources in your {{% product-name %}}
  instance.
menu:
  influxdb3_cloud:
    parent: influxdb3 CLI
    name: influxdb3 show
weight: 300
---

The `influxdb3 show` command lists resources in your {{% product-name %}}
instance.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                            | Description                                    |
| :-------------------------------------------------------------------- | :--------------------------------------------- |
| [databases](/influxdb3/cloud/reference/cli/influxdb3/show/databases/) | List databases                                 |
| [tokens](/influxdb3/cloud/reference/cli/influxdb3/show/tokens/)       | List authentication tokens                     |
| help                                                                  | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
