---
title: influx secret update
description: The 'influx secret update' command adds and updates secrets.
menu:
  v2_0_ref:
    name: influx secret update
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret update` command adds and updates secrets.
Provide the secret key with the `-k` or `--key` flag.
When prompted, enter and confirm the secret value.

## Usage
```
influx secret update [flags]
```

## Flags
| Flag           | Description                 | Input type |
|:----           |:-----------                 |:----------:|
| `-h`, `--help` | Help for `secret update`    |            |
| `-k`, `--key`  | Secret key _**(required)**_ | string     |
| `-o`, `--org`  | Organization name           | string     |
| `--org-id`     | Organization ID             | string     |

{{% influx-cli-global-flags %}}
