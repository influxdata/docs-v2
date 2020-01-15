---
title: influx pkg summary
description: >
  The 'influx pkg summary' command summarizes the provided package.
menu:
  v2_0_ref:
    parent: influx pkg
weight: 101
---

The `influx pkg summary` command summarizes the provided package.

## Usage
```
influx pkg summary [flags]
```

## Flags

| Flag              | Description                                 | Input Type |
|:----              |:-----------                                 |:---------- |
| `-c`, `--color`   | Enable color in output _(default is true) _ |            |
| `-f`, `--file`    | Package file to summarize                   | string     |
| `-h`, `--help`    | Help for the `summary` command              |            |
| `--table-borders` | Enable table borders _(default is true)_    |            |

{{% influx-cli-global-flags %}}
