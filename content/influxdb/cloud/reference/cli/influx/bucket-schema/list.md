---
title: influx bucket-schema list
description: The `influx bucket-schema list` command lists measurement schema of an InfluxDB bucket.
menu:
  influxdb_cloud_ref:
    name: influx bucket-schema list
    parent: influx bucket-schema
weight: 201
related:
  - /influxdb/cloud/organizations/bucket-schema
---

The `influx bucket-schema list` command lists the measurement schema of an
InfluxDB bucket.

## Usage

```sh
influx bucket-schema list --bucket <string>
```

## Flags

| Flag |                          | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :----------------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config`        | CLI configuration to use for command                                  |   string   |                       |
| `-n` | `--bucket`               | The bucket name, org or org-id will be required by choosing this      |   string   |                       |
| `-i` | `--bucket-id`            | The bucket ID, required if name isn't provided                        |   string   |
|      | `--configs-path`         | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-x` | `--extended-output`      | Print column information for each measurement (default: false)        |            |                       |
| `-h` | `--help`                 | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`         | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`                 | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--json`                 | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`                 | Name of single measurement to find                                    |   string   |                       |
| `-o` | `--org`                  | Organization name (mutually exclusive with `--org-id`)                |   string   | `INFLUX_ORG`          |
|      | `--org-id`               | Organization ID (mutually exclusive with `--org`)                     |   string   | `INFLUX_ORG_ID`       |
|      | `--skip-verify`          | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`                | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

## List all measurement schema of a bucket

```sh
influx bucket-schema list \
  --bucket example-bucket
```

## List a single measurement schema of a bucket and print column information
```sh
influx bucket-schema list \
  --bucket example-bucket
  --name cpu
  -x
```
