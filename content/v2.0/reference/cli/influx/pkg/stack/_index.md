---
title: influx pkg stack
description: The 'influx pkg stack' command and its subcommands manage InfluxDB stacks.
menu:
  v2_0_ref:
    name: influx pkg stack
    parent: influx pkg
weight: 101
v2.0/tags: [templates]
---

The `influx pkg stack` command manages InfluxDB stacks.

## Usage
```
influx pkg stack [flags]
influx pkg stack [command]
```

## Subcommands
| Subcommand                                             | Description        |
|:-------                                                |:-----------        |
| [init](/v2.0/reference/cli/influx/pkg/stack/init/)     | Initialize a stack |
| [list](/v2.0/reference/cli/influx/pkg/stack/list/)     | List stacks        |
| [remove](/v2.0/reference/cli/influx/pkg/stack/remove/) | Remove a stack     |

## Flags
| Flag           | Description                  |
|:----           |:-----------                  |
| `-h`, `--help` | Help for the `stack` command |

{{% cli/influx-global-flags %}}
