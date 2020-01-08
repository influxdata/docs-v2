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
| Command                                              | Description                                                       |
|:-------                                              |:-----------                                                       |
| [export](/v2.0/reference/cli/influx/pkg/export/)     | Export existing resources as a package                            |
| [new](/v2.0/reference/cli/influx/pkg/new/)           | Create a reusable pkg to create resources in a declarative manner |
| [summary](/v2.0/reference/cli/influx/pkg/summary/)   | Summarize the provided package                                    |
| [validate](/v2.0/reference/cli/influx/pkg/validate/) | Validate the provided package                                     |

## Flags

| Flag              | Description                                                                            | Input Type |
|:----              |:-----------------------------                                                          |:---------- |
| `-c`, `--color`   | Enable color in output _(default is true) _                                            |            |
| `-f`, `--file`    | Path to package file                                                                   | string     |
| `--force`         | Ignore warnings about destructive changes                                              |            |
| `-h`, `--help`    | Help for the `pkg` command                                                             |            |
| `-o`, `--org`     | The name of the organization that owns the bucket                                      | string     |
| `--org-id`        | The ID of the organization that owns the bucket                                        | string     |
| `-q`, `--quiet`   | Disable output printing                                                                |            |
| `--secret`        | Secrets to provide alongside the package (format: `--secret=SECRET_KEY::SECRET_VALUE`) | string     |
| `--table-borders` | Enable table borders _(default is true)_                                               |            |

{{% influx-cli-global-flags %}}
