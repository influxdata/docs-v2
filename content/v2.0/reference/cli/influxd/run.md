---
title: influxd run
description: The `influxd run` command is the default `influxd` command and starts the influxd server.
v2.0/tags: [influxd, cli]
menu:
  v2_0_ref:
    parent: influxd
weight: 201
related:
  - /v2.0/reference/config-options/
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

## Flags

{{% cli/influxd-flags %}}
