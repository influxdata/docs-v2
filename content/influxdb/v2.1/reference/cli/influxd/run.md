---
title: influxd run
description: The `influxd run` command is the default `influxd` command and starts the influxd server.
influxdb/v2.1/tags: [influxd, cli]
menu:
  influxdb_2_1_ref:
    parent: influxd
weight: 201
related:
  - /influxdb/v2.1/reference/config-options/
products: [oss]
---

The `influxd run` command is the default command for `influxd`.
It starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd run [flags]
```


{{% note %}}
Because `run` is the default command for `influxd`, the following commands are the same:

```bash
influxd
influxd run
```
{{% /note %}}

{{% note %}}
For information about other available InfluxDB configuration methods, see
[InfluxDB configuration options](/influxdb/v2.1/reference/config-options/).
{{% /note %}}

## Flags

{{% cli/influxd-flags %}}
