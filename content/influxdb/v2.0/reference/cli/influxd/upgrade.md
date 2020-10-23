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

<!--
   Upgrades a 1.x version of InfluxDB by performing the following actions:
      1. Reads 1.x config file and creates 2.x config file with matching options. Unsupported 1.x options are reported.
      2. Copies and upgrades 1.x database files.
      3. Creates a script for creating tokens that correspond to 1.x users. This script needs to be revised and run manually after starting 2.x.

    If the config file is not available, 1.x db folder (--v1-dir options) is taken as an input.
    Target 2.x database dir is specified by the --engine-path option. If changed, the bolt path should be changed as well.
 -->

## Usage

```
influxd upgrade [flags]
influxd upgrade [command]
```

## Flags

| Flag |                         | Description                                                                                        | Input type |
|:-----|:------------------------|:---------------------------------------------------------------------------------------------------|:----------:|
| `-m` | `--bolt-path`           | Path for boltdb database (default "~/.influxdbv2/influxd.bolt")                                    | string     |
| `-b` | `--bucket`              | Primary bucket name                                                                                | string     |
|      | `--config-file`         | (Optional) Custom InfluxDB 1.x config file path, else the default config file                      | string     |
| `-e` | `--engine-path`         | Path for persistent engine files (default "~/.influxdbv2/engine")                                  | string     |
| `-f` | `--force`               | Skip the confirmation prompt                                                                       |            |
| `-h` | `--help`                | Help for `influxd upgrade`                                                                         |            |
|      | `--influx-command-path` | Path to influx command (default "~/go/bin/influx")                                                 | string     |
|      | `--log-path`            | (Optional) custom log file path (default "~/upgrade.log")                                          | string     |
| `-o` | `--org`                 | Primary organization name                                                                          | string     |
| `-p` | `--password`            | Password for username                                                                              | string     |
| `-r` | `--retention`           | (Optional) duration bucket will retain data. 0 is infinite. The default is 0.                      | string     |
|      | `--security-script`     | (Optional) generated security upgrade script path (default "~/influxd-upgrade-security.sh")        | string     |
| `-t` | `--token`               | (Optional) token for username, else auto-generated                                                 | string     |
| `-u` | `--username`            | Primary username                                                                                   | string     |
|      | `--v1-dir`              | Path to source 1.x db directory containing meta, data, and wal sub-folders (default "~/.influxdb") | string     |
| `-v` | `--verbose`             | Verbose output (default: `true`)                                                                   | boolean    |
