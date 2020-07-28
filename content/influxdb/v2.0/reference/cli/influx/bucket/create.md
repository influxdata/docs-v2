---
title: influx bucket create
description: The `influx bucket create` command creates a new bucket in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx bucket create
    parent: influx bucket
weight: 201
aliases:
  - /v2.0/reference/cli/influx/bucket/create/
---

The `influx bucket create` command creates a new bucket in InfluxDB.

## Usage
```
influx bucket create [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`  | Bucket description                                                    | string      |                       |
| `-h` | `--help`         | Help for the `create` command                                         |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | Bucket name                                                           | string      | `INFLUX_BUCKET_NAME`  |
| `-o` | `--org`          | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |
| `-r` | `--retention`    | Duration bucket will retain data (0 is infinite, default is 0)        | duration    |                       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

{{% note %}}
Valid `--retention` units are nanoseconds (`ns`), microseconds (`us` or `µs`),
milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`).
{{% /note %}}
