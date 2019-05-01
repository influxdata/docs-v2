---
title: influx ping – Check the health of InfluxDB
description: >
  The `influx ping` command checks the health of a running InfluxDB instance by
  querying the `/health` endpoint.
menu:
  v2_0_ref:
    name: influx ping
    parent: influx
weight: 101
v2.0/tags: [ping, health]
---

The `influx ping` command checks the health of a running InfluxDB instance by
querying the `/health` endpoint.
It does not require an authorization token.

## Usage
```
influx ping [flags]
```

## Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `ping` command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
