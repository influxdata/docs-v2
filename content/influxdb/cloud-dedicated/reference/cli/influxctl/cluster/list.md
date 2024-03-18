---
title: influxctl cluster list
description: >
  The `influxctl cluster list` command information about all InfluxDB
  Cloud Dedicated clusters associated with your account ID.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl cluster
weight: 301
---

The `influxctl cluster list` command returns information about all InfluxDB
Cloud Dedicated clusters associated with your account ID.

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

## Usage

```sh
influxctl cluster list
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
