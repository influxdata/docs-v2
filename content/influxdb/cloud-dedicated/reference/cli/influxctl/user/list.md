---
title: influxctl user list
description: >
  The `influxctl user list` command lists all users associated with your InfluxDB
  Cloud Dedicated account ID.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl user
weight: 301
---

The `influxctl user list` command lists all users associated with your InfluxDB
Cloud Dedicated account ID.

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

## Usage

```sh
influxctl user list [command options]
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
