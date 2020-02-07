---
title: influx pkg validate
description: >
  The 'influx pkg validate' command validates the provided package.
menu:
  v2_0_ref:
    parent: influx pkg
weight: 101
---

The `influx pkg validate` command validates the provided package.

## Usage
```
influx pkg validate [flags]
```

## Flags

| Flag               | Description                                                        | Input Type |
|:----               |:-----------                                                        |:---------- |
| `-e`, `--encoding` | Encoding of the input stream                                       | string     |
| `-f`, `--file`     | Package file to validate                                           | string     |
| `-h`, `--help`     | Help for the `validate` command                                    |            |
| `-R`, `--recurse`  | Recurse through files in the directory specified in `-f`, `--file` |            |
| `-u`, `--url`      | URL of a package file file                                         | string     |

{{% influx-cli-global-flags %}}
