---
title: influxd downgrade
description: >
  The `influxd downgrade` command downgrades the metadata schema used by
  `influxd` to match the schema of an older release.
menu:
  influxdb_2_1_ref:
    parent: influxd
weight: 201
related:
  - /influxdb/v2.1/upgrade/downgrade/
---

Use the `influxd downgrade` command to downgrade the metadata schema used by
`influxd` to match the metadata schema of a older release.

InfluxDB does not guarantee backwards-compatibility with older releases in its embedded metadata stores.
Attempting to start an older `influxd` binary with a BoltDB or SQLite file that
has been migrated to a newer schema will result in a startup error.
This command downgrades metadata schemas to match the schemas of an older release
and allows the older `influxd` binary to boot successfully.

{{% note %}}
Run this command **prior** to downgrading the `influxd` binary.
{{% /note %}}

## Usage

```sh
influxd downgrade [flags] <target-version>
```

## Flags

| Flag |               | Description                                                       | Input type |
| :--- | :------------ | :---------------------------------------------------------------- | :--------: |
| `-m` | `--bolt-path` | Path to boltdb database (default is `~/.influxdbv2/influxd.bolt`) |   string   |
| `-h` | `--help`      | Help for `downgrade`                                              |            |
|      | `--log-level` | Log level (`debug`, `info` _(default_), `warn` or  `error`)       |   string   |

## Examples

##### Downgrade to InfluxDB 2.0
```sh
influxd downgrade 2.0
```