---
title: influx bucket-schema list
description: The `influx bucket-schema list` command lists the schemas of an InfluxDB bucket that has the `explicit` schema-type.
menu:
  influxdb_cloud_ref:
    name: influx bucket-schema list
    parent: influx bucket-schema
weight: 201
related:
  - /influxdb/cloud/organizations/buckets/bucket-schema
---

The `influx bucket-schema list` command lists the schemas of an
InfluxDB bucket that has the `explicit` schema-type.

## Usage

```sh
influx bucket-schema list [flags]
```

## Flags

| Flag |                     | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :------------------ | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config`   | CLI configuration to use for command                                  |   string   |                       |
| `-n` | `--bucket`          | Bucket name (mutually exclusive with `--bucket-id`)                   |   string   |                       |
| `-i` | `--bucket-id`       | Bucket ID (mutually exclusive with `--bucket`)                        |   string   |                       |
|      | `--configs-path`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-x` | `--extended-output` | Print column information for each measurement schema (default: false)        |            |                       |
| `-h` | `--help`            | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`    | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`            | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--json`            | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`            | Measurement name                                                      |   string   |                       |
| `-o` | `--org`             | Organization name (mutually exclusive with `--org-id`)                |   string   | `INFLUX_ORG`          |
|      | `--org-id`          | Organization ID (mutually exclusive with `--org`)                     |   string   | `INFLUX_ORG_ID`       |
|      | `--skip-verify`     | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`           | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

## List all schemas of a bucket and print column information

```sh
influx bucket-schema list \
  --bucket example-bucket
  --extended-output
```

## Print column details for a single measurement
```sh
influx bucket-schema list \
  --bucket example-bucket \
  --name cpu \
  --extended-output
```
