---
title: influx replication
description: >
menu:
  influxdb_2_1_ref:
    name: influx replication
    parent: influx
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/remote
---

The `influx repl` command opens an interactive Read-Eval-Print Loop (REPL)
from which you can run Flux commands.

## Usage
```
influx repl [flags]
```

{{% note %}}
Use **ctrl + d** to exit the REPL.
{{% /note %}}

To use the Flux REPL, you must first authenticate with a [token](/influxdb/v2.1/security/tokens/view-tokens/).

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `repl` command                                           |            |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
