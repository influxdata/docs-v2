---
title: influx ping
description: >
  The `influx ping` command checks the health of a running InfluxDB instance by
  querying the `/health` endpoint.
menu:
  influxdb_cloud_ref:
    name: influx ping
    parent: influx
weight: 101
influxdb/cloud/tags: [ping, health]
---

The `influx ping` command checks the health of a running InfluxDB instance by
querying the `/health` endpoint.
It does not require an authorization token.

## Usage
```
influx ping [flags]
```

## Flags
| Flag |                 | Description                                               | Input type | {{< cli/mapped >}} |
|:---- |:---             |:-----------                                               |:---------- |:-----------------  |
| `-h` | `--help`        | Help for the `ping` command                               |            |                    |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost9999`) | string     | `INFLUX_HOST`      |
|      | `--skip-verify` | Skip TLS certificate verification                         |            |                    |
