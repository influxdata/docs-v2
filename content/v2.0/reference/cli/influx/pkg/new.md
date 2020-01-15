---
title: influx pkg new
description: >
  The 'influx pkg new' command creates a reusable package that create resources
  in a declarative manner.
menu:
  v2_0_ref:
    parent: influx pkg
weight: 101
---

The `influx pkg new` command creates a reusable package that create resources in
a declarative manner.

## Usage
```
influx pkg new [flags]
```

## Flags

| Flag                  | Description                                                                     | Input Type      |
|:----------------------|:--------------------------------------------------------------------------------|-----------------|
| `-d`, `--description` | Package description                                                             | string          |
| `-f`, `--file`        | Package output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string          |
| `-h`, `--help`        | Help for the `new` command                                                      |                 |
| `-n`, `--name`        | Package name                                                                    | string          |
| `-q`, `--quiet`       | Skip interactive mode                                                           |                 |
| `-v`, `--version`     | Package version                                                                 | string          |

{{% influx-cli-global-flags %}}
