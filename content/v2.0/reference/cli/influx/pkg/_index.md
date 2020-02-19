---
title: influx pkg – package management commands
description: The 'influx pkg' command and its subcommands manage packages in InfluxDB.
menu:
  v2_0_ref:
    name: influx pkg
    parent: influx
weight: 101
v2.0/tags: [templates]
---

The `influx pkg` command manages packages in InfluxDB.

## Usage
```
influx pkg [flags]
influx pkg [command]
```

## Available commands
| Command                                              | Description                                                       |
|:-------                                              |:-----------                                                       |
| [export](/v2.0/reference/cli/influx/pkg/export/)     | Export existing resources as a package                            |
| [summary](/v2.0/reference/cli/influx/pkg/summary/)   | Summarize the provided package                                    |
| [validate](/v2.0/reference/cli/influx/pkg/validate/) | Validate the provided package                                     |

## Flags

| Flag                      | Description                                                                                     | Input Type |
|:----                      |:-----------------------------                                                                   |:---------- |
| `-c`, `--disable-color`   | Disable color in output                                                                         |            |
| `--disable-table-borders` | Disable table borders                                                                           |            |
| `-e`, `--encoding`        | Encoding of the input stream                                                                    | string     |
| `--env-ref`               | Environment references to provide alongside the package (format: `--env-ref=REF_KEY=REF_VALUE`) | string     |
| `-f`, `--file`            | Path to package file                                                                            | string     |
| `--force`                 | Ignore warnings about destructive changes                                                       |            |
| `-h`, `--help`            | Help for the `pkg` command                                                                      |            |
| `-o`, `--org`             | The name of the organization that owns the bucket                                               | string     |
| `--org-id`                | The ID of the organization that owns the bucket                                                 | string     |
| `-q`, `--quiet`           | Disable output printing                                                                         |            |
| `-R`, `--recurse`         | Recurse through files in the directory specified in `-f`, `--file`                              |            |
| `--secret`                | Secrets to provide alongside the package (format: `--secret=SECRET_KEY=SECRET_VALUE`)           | string     |
| `-u`, `--url`             | URL of package file                                                                             | string     |

{{% influx-cli-global-flags %}}
