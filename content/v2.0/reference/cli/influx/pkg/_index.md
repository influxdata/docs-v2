---
title: influx pkg – package management commands
description: The 'influx pkg' command and its subcommands manage packages in InfluxDB.
menu:
  v2_0_ref:
    name: influx pkg
    parent: influx
weight: 101
v2.0/tags: [packages]
---

The `influx pkg` command manages packages in InfluxDB.

## Usage
```
influx pkg [flags]
influx pkg [command]
```

## Available commands
| Command | Description                                                    |
|:--------|----------------------------------------------------------------|
| `all`   | Export all existing resources for an organization as a package |

## Flags

| Flag                  | Description                                                                     | Input Type      |
|:----------------------|:--------------------------------------------------------------------------------|-----------------|
| `--buckets`           | Comma-separated list of bucket IDs                                              | list of strings |
| `--dashboards`        | Comma-separated list of dashboard IDs                                           | list of strings |
| `-d`, `--description` | Package description                                                             | string          |
| `-f`, `--file`        | Package output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string          |
| `-h`, `--help`        | Help for the `export` command                                                   |                 |
| `--labels`            | Comma-separated list of label IDs                                               | list of strings |
| `-n`, `--name`        | Package name                                                                    | string          |
| `--resource-type`     | Resource type associated with all IDs via stdin                                 | string          |
| `--variables`         | Comma-separated list of variable IDs                                            | list of strings |
| `-v`, `--version`     | Package version                                                                 | string          |

{{% influx-cli-global-flags %}}
