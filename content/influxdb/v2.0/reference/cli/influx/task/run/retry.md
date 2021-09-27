---
title: influx task run retry
description: The `influx task run retry` command retries to run a task in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx task run retry
    parent: influx task run
weight: 301
---

The `influx task run retry` command retries to run a task in InfluxDB.

## Usage
```
influx task run retry [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `retry` command                                          |            |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
| `-r` | `--run-id`        | ({{< req >}}) Run ID                                                  | string     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-i` | `--task-id`       | ({{< req >}}) Task ID                                                 | string     |                       |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

{{% note %}}
#### Required permissions
Use an [{{% oss-only %}}**Operator** or{{% /oss-only %}} <span>**All-Access**</span> token](/influxdb/v2.0/security/tokens/) to retry tasks.
{{% /note %}}

##### Retry a task run
```sh
influx task run retry \
  --task-id 0Xx0oox00XXoxxoo1 \
  --run-id ox0Xx0ooxx00XXoo2
```
