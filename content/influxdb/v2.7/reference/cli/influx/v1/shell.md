---
title: influx v1 shell
description: >
  The `influx v1 shell` subcommand starts an InfluxQL shell (REPL).
menu:
  influxdb_2_7_ref:
    name: influx v1 shell
    parent: influx v1
weight: 101
influxdb/v2.7/tags: [InfluxQL]
related:
  - /influxdb/v2.7/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.7/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
  - /influxdb/v2.7/query-data/influxql/
  - /influxdb/v2.7/tools/influxql-shell/
metadata: [influx CLI 2.4.0+, InfluxDB 2.0.1+]
---

The `influx v1 shell` subcommand starts an InfluxQL shell (REPL).

{{% note %}}
#### Set up database and retention policy (DBRP) mapping

InfluxQL queries require a database and retention policy to query data.
In InfluxDB {{% current-version %}}, databases and retention policies have been
combined and replaced with [buckets](/influxdb/v2.7/reference/glossary/#bucket).
To use the InfluxQL to query an InfluxDB {{% current-version %}} bucket, first
map your DBRP combinations to an appropriate bucket. For more information, see
[Query data with InfluxQL](/influxdb/v2.7/query-data/influxql/).

{{% /note %}}

## Usage

```sh
influx v1 shell [flags]
```

## Flags

| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}     |
| :--- | :---------------- | :----------------------------------------------------------------------- | :--------: | :--------------------- |
| `-c` | `--active-config` | Config name to use for command                                           |   string   | `INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH`  |
|      | `--host`          | HTTP address of InfluxDB                                                 |   string   | `INFLUX_HOST`          |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                             |            |                        |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                   |   string   | `INFLUX_ORG`           |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                        |   string   | `INFLUX_ORG_ID`        |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            | `INFLUX_SKIP_VERIFY`   |
| `-t` | `--token`         | API token                                                                |   string   | `INFLUX_TOKEN`         |

## Examples

{{< cli/influx-creds-note >}}

##### Start an InfluxQL shell
```sh
influx v1 shell
```