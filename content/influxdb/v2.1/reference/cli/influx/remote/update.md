---
title: influx remote update
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote update
    parent: influx remote
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Update an existing remote connection.

## Usage
```
influx remote update [command options] [arguments...]
```

## Flags

| Flag |                      | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|----------------------|-----------------------------------------------------------------------|------------|-----------------------|
| `-i` | --id                 | Remote connection ID                                                  | string     |                       |
| `-n` | --name               | New name for the remote connection                                    | string     |                       |
| `-d` | --description        | New description for the remote connection                             | string     |                       |
|      | --remote-url         | New url for the remote database                                       | string     |                       |
|      | --remote-api-token   | New API token for the remote database                                 | string     |                       |
|      | --remote-org-id      | New ID of the remote organization                                     | string     |                       |
|      | --allow-insecure-tls | Allows insecure TLS                                                   |            |                       |
|      | `--host`             | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`      | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`     | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`    | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`       | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`             | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`     | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`            | API token                                                             | string     | `INFLUX_TOKEN`        |
