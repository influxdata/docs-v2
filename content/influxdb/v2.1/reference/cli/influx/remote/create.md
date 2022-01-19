---
title: influx remote create
description: Create a new remote connection
menu:
  influxdb_2_1_ref:
    name: influx remote create
    parent: influx remote
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Create a new remote connection

## Usage
```
influx remote create [commond options] [arguments...]
```

## Flags

| Flag |                        | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:-----------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
|      | `--org-id`             | The ID of the organization                                            | string     | `INFLUX_ORG_ID`       |
| `-o` | `--org`                | The name of the organization                                          | string     | `INFLUX_ORG`          |
| `-n` | `--name`               | Name for the new remote connection                                    | string     |                       |
| `-d` | `--description`        | Description for the new remote connection                             | string     |                       |
|      | `--remote-url`         | The url for the remote database                                       | string     |                       |
|      | `--remote-api-token`   | The API token for the remote database                                 | string     |                       |
|      | `--remote-org-id`      | The ID of the remote organization                                     | string     |                       |
|      | `--allow-insecure-tls` | Allows insecure TLS (self-signed certificates)                        |            |                       |
|      | `--host`               | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`        | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`       | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`      | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`         | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`               | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`       | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`              | API token                                                             | string     | `INFLUX_TOKEN`        |
