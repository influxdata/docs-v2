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

{{% influx-cli-global-flags %}}
