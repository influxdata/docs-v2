---
title: influx pkg export all
description: >
  The 'influx pkg' command exports all existing resources for an organization as a package.
menu:
  v2_0_ref:
    parent: influx pkg export
weight: 201
---

The `influx pkg export all` command exports all existing resources for an
organization as a package.

## Usage
```
influx pkg export all [flags]
```

## Flags

| Flag                  | Description                                                                     | Input Type |
|:----                  |:-----------                                                                     |:---------- |
| `-d`, `--description` | Package description                                                             | string     |
| `-f`, `--file`        | Package output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |
| `-h`, `--help`        | Help for the `export` command                                                   |            |
| `-n`, `--name`        | Package name                                                                    | string     |
| `-o`, `--org`         | The name of the organization that owns the resources                            | string     |
| `--org-id`            | The ID of the organization that owns the resources                              | string     |
| `-v`, `--version`     | Package version                                                                 | string     |

{{% influx-cli-global-flags %}}
