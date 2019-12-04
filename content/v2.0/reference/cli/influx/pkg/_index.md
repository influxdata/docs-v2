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

| Flag                  | Description                                                                                                                             |
|:----------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| `--buckets`           | List of bucket ids comma separated                                                                                                      |
| `--dashboards`        | List of dashboard ids comma separated                                                                                                   |
| `-d`, `--description` | description for new pkg                                                                                                                 |
| `-f`, `--file`        | output file for created pkg; defaults to std out if no file provided; the extension of provided file (.yml/.json) will dictate encoding |
| `-h`, `--help`        | Help for the export command                                                                                                             |
| `--labels`            | List of label ids comma separated                                                                                                       |
| `-n`, `--name`        | name for new pkg                                                                                                                        |
| `--resource-type`     | The resource type provided will be associated with all IDs via stdin.                                                                   |
| `--variables`         | List of variable ids comma separated                                                                                                    |
| `-v`, `--version`     | version for new pkg                                                                                                                     |

{{% influx-cli-global-flags %}}
