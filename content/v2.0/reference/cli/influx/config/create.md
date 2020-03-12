---
title: influx config create
description: The 'influx config create' command creates a new InfluxDB connection configuration.
menu:
  v2_0_ref:
    name: influx config create
    parent: influx config
weight: 201
---

The `influx config create` command creates a new InfluxDB connection configuration in the `config` file (by default, stored at `~/.influxdbv2/config`).

## Usage
```
influx config create [flags]
```

## Flags{
| Flag                | Description                      | Input type  | {< cli/mapped >}}   |
|:----                |:-----------                      |:----------: |:------------------   |
| `-h`, `--help`      | Help for the `create` command    |             |                      |
| `-n`, `--name`      | Bucket name                      | string      | `INFLUX_BUCKET_NAME` |
| `--org-id`          | Organization ID                  | string      | `INFLUX_ORG_ID`      |
| `-o`, `--org`       | Organization name                | string      | `INFLUX_ORG`         |

{{% cli/influx-global-flags %}}
