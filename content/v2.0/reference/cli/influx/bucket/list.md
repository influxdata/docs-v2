---
title: influx bucket list
description: The 'influx bucket list' command lists and searches for buckets in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket list
    parent: influx bucket
weight: 201
aliases:
  - /v2.0/reference/cli/influx/bucket/find
---

The `influx bucket list` command lists and searches for buckets in InfluxDB.

## Usage
```
influx bucket list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag           | Description                  | Input type  |
|:----           |:-----------                  |:----------: |
| `-h`, `--help` | Help for the `list` command  |             |
| `-i`, `--id`   | The bucket ID                | string      |
| `-n`, `--name` | The bucket name              | string      |
| `-o`, `--org`  | The bucket organization name | string      |
| `--org-id`     | The bucket organization ID   | string      |

{{% influx-cli-global-flags %}}
