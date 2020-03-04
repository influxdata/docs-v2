---
title: influx secret – Manage secrets
description: The 'influx secret' command manages secrets.
menu:
  v2_0_ref:
    name: influx secret
    parent: influx
weight: 101
v2.0/tags: [secrets]
---

The `influx secret` command manages secrets.

## Usage
```
influx secret [flags]
influx secret [subcommand]
```

## Subcommands
| Subcommand                                          | Description            |
|:----------                                          |:-----------            |
| [delete](/v2.0/reference/cli/influx/secret/delete/) | Delete a secret        |
| [list](/v2.0/reference/cli/influx/secret/list/)     | List secrets           |
| [update](/v2.0/reference/cli/influx/secret/update/) | Add or update a secret |

## Flags
| Flag           | Description                   |
|:----           |:-----------                   |
| `-h`, `--help` | Help for the `secret` command |

{{% cli/influx-global-flags %}}
