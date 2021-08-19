---
title: influx org update
description: The `influx org update` command updates information related to organizations in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx org update
    parent: influx org
weight: 201
---

The `influx org update` command updates information related to organizations in InfluxDB.

## Usage
```
influx org update [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}       |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:-------------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                          |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH`    |
| `-d` | `--description`   | New description for the organization                                  | string     | `INFLUX_ORG_DESCRIPTION` |
| `-h` | `--help`          | Help for the `update` command                                         |            |                          |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS`    |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`            |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                          |
| `-i` | `--id`            | ({{< req >}}) Organization ID                                         | string     | `INFLUX_ORG_ID`          |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`     |
| `-n` | `--name`          | New organization name                                                 | string     | `INFLUX_ORG`             |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                          |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`           |

## Examples

{{< cli/influx-creds-note >}}

##### Update the name of an organization
```sh
influx org update \
  --id 0Xx0oox00XXoxxoo1
  --name new-org-name
```

##### Update the description of an organization
```sh
influx org update \
  --id 0Xx0oox00XXoxxoo1
  --description "New example organization description"
```
