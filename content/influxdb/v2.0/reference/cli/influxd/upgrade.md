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

| Flag |                  | Description                                                                                   | Input type |
|:-----|:-----------------|:----------------------------------------------------------------------------------------------|:----------:|
| `-h` | `--help`         | Help for the `upgrade` command                                                                |            |
|      | `--config`       | (Optional) Custom InfluxDB path to 1.x config file to upgrade (default: `~/.influxdbv2/conf`) | string     |
|      | `--v1-meta-dir`  | Path to 1.x meta.db directory (default: `~/.influxdb/meta`)                                   | string     |
|      | `--v2-bolt-path` | Path to 2.0 BoltDB database (default: `~/.influxdbv2/influxd.bolt`)                           | string     |

<!--
Flags:
  -m, --bolt-path string             path for boltdb database (default "/home/ubuntu/.influxdbv2/influxd.bolt")
  -b, --bucket string                primary bucket name
      --config-file string           optional: Custom InfluxDB 1.x config file path, else the default config file (default "/etc/influxdb/influxdb.conf")
  -e, --engine-path string           path for persistent engine files (default "/home/ubuntu/.influxdbv2/engine")
  -f, --force                        skip the confirmation prompt
  -h, --help                         help for upgrade
      --influx-command-path string   path to influx command (default "/mnt/c/git/influxdb/bin/linux/influx")
      --log-path string              optional: custom log file path (default "/home/ubuntu/upgrade.log")
  -o, --org string                   primary organization name
  -p, --password string              password for username
  -r, --retention string             optional: duration bucket will retain data. 0 is infinite. The default is 0.
      --security-script string       optional: generated security upgrade script path (default "/home/ubuntu/influxd-upgrade-security.sh")
  -t, --token string                 optional: token for username, else auto-generated
  -u, --username string              primary username
      --v1-dir string                path to source 1.x db directory containing meta, data and wal sub-folders (default "/home/ubuntu/.influxdb")
  -v, --verbose                      verbose output (default true)
 -->
