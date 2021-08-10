---
title: influx ping
description: >
  The `influx ping` command checks the health of a running InfluxDB instance by
  querying the `/health` endpoint.
menu:
  influxdb_2_0_ref:
    name: influx ping
    parent: influx
weight: 101
influxdb/v2.0/tags: [ping, health]
related:
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx ping` command checks the health of a running InfluxDB instance by
querying the `/health` endpoint.
It does not require an API token.

## Usage
```
influx ping [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------- | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `ping` command                                           |            |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
