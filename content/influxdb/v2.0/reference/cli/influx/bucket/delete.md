---
title: influx bucket delete
description: The `influx bucket delete` command deletes a bucket from InfluxDB and all the data it contains.
menu:
  v2_0_ref:
    name: influx bucket delete
    parent: influx bucket
weight: 201
aliases:
  - /v2.0/reference/cli/influx/bucket/delete/
related:
  - /v2.0/organizations/buckets/delete-bucket/
---

The `influx bucket delete` command deletes a bucket from InfluxDB and all the data it contains.

## Usage
```
influx bucket delete [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `delete` command                                         |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`           | Bucket ID _(required if no `--name`)_                                 | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | Bucket name _(requires `--org` or `org-id`)_                          | string      |                       |
| `-o` | `--org`          | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
