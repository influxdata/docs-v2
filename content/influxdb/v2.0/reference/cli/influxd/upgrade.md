---
title: influxd upgrade
description: The `influxd upgrade` command upgrades a InfluxdDB 1.x instance to 2.0.
menu:
  influxdb_2_0_ref:
    parent: influxd
weight: 201
products: [oss]
---

Use the `influxd upgrade` command to upgrade an instance of InfluxDB 1.x to InfluxDB 2.0.
This command copies all data in [databases](/influxdb/v1.8/concepts/glossary/#database) and 
[retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp) (used in 1.x)
over to [buckets](/influxdb/v2.0/reference/glossary/#bucket) (used in 2.0).

{{% warn %}}
Be sure to back up all data before upgrading with `influx upgrade`.
{{% /warn %}}

## Usage

```
influxd upgrade [flags]
influxd upgrade [command]
```
    
## Flags

| Flag |                  | Description                                                                                   | Input type |
|:-----|:-----------------|:----------------------------------------------------------------------------------------------|:----------:|
| `-h` | `--help`         | Help for the `upgrade` command                                                                |            |
|      | `--config`       | (Optional) Custom InfluxDB path to 1.x config file to upgrade (default: `~/.influxdbv2/conf`) | string     |
|      | `--v1-meta-dir`  | Path to 1.x meta.db directory (default: `~/.influxdb/meta`)                                   | string     |
|      | `--v2-bolt-path` | Path to 2.0 BoltDB database (default: `~/.influxdbv2/influxd.bolt`)                           | string     |
