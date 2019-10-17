---
title: influxd - InfluxDB daemon
description: The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
v2.0/tags: [influxd, cli]
menu:
  v2_0_ref:
    name: influxd
    parent: Command line tools
weight: 102
---

The `influxd` daemon starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [flags]
influxd [command]
```

## Commands

| Command                                          | Description                                       |
|:-------                                          |:-----------                                       |
| [generate](/v2.0/reference/cli/influxd/generate) | Generate time series data sets using TOML schema. |
| [inspect](/v2.0/reference/cli/influxd/inspect)   | Inspect on-disk database data.                    |
| [run](/v2.0/reference/cli/influxd/run)           | Start the influxd server _**(default)**_          |

## Flags

| Flag                         | Description                                                                                           | Input type |
| :---------------------       | :---------------------------------------------------------------------------------------------------- | :--------: |
| `--assets-path`              | Override default assets by serving from a specific directory (developer mode)                         | string     |
| `--bolt-path`                | Path to boltdb database (default `~/.influxdbv2/influxd.bolt`)                                        | string     |
| `--e2e-testing`              | Add /debug/flush endpoint to clear stores; used for end-to-end tests (default `false`)                |            |
| `--engine-path`              | Path to persistent engine files (default `~/.influxdbv2/engine`)                                      | string     |
| `-h`, `--help`               | Help for `influxd`                                                                                    |            |
| `--http-bind-address`        | Bind address for the REST HTTP API (default `:9999`)                                                  | string     |
| `--log-level`                | Supported log levels are debug, info, and error (default `info`)                                      | string     |
| `--reporting-disabled`       | Disable sending telemetry data to **https:<nolink>//telemetry.influxdata.com**                        |            |
| `--secret-store`             | Data store for secrets (bolt or vault) (default `bolt`)                                               | string     |
| `--session-length`           | TTL in minutes for newly created sessions (default `60`)                                              | integer    |
| `--session-renew-disabled`   | Disables automatically extending session TTL on request                                               |            |
| `--store`                    | Data store for REST resources (bolt or memory) (default `bolt`)                                       | string     |
| `--tracing-type`             | Supported tracing types (log or jaeger)                                                               | string     |
| `--vault-address`            | Address of the Vault server (for example: `https://127.0.0.1:8200/`).                                 | string     |
| `--vault-ca-cert`            | Path to a PEM-encoded CA certificate file.                                                            | string     |
| `--vault-ca-path`            | Path to a directory of PEM-encoded CA certificate files.                                              | string     |
| `--vault-client-cert`        | Path to a PEM-encoded client certificate.                                                             | string     |
| `--vault-client-key`         | Path to an unencrypted, PEM-encoded private key which corresponds to the matching client certificate. | string     |
| `--vault-client-max-retries` | Maximum number of retries when encountering a 5xx error code (default `2`).                           | integer    |
| `--vault-client-timeout`     | Vault client timeout (default `60s`).                                                                 | duration   |
| `--vault-skip-verify`        | Skip certificate verification when communicating with Vault.                                          |            |
| `--vault-tls-server-name`    | Name to use as the SNI host when connecting to Vault via TLS.                                         | string     |
