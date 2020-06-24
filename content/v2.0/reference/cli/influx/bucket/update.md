---
title: influx bucket update
description: The 'influx bucket update' command updates information associated with buckets in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket update
    parent: influx bucket
weight: 201
---

The `influx bucket update` command updates information associated with buckets in InfluxDB.

## Usage
```
influx bucket update [flags]
```

## Flags
| Flag |                  | Description                                                | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                |:----------: |:------------------    |
| `-d` | `--description`  | Bucket description                                         | string      |                       |
| `-h` | `--help`         | Help for the `update` command                              |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                       |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`         |
| `-i` | `--id`           | **(Required)** Bucket ID                                   | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                      |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | New bucket name                                            | string      | `INFLUX_BUCKET_NAME`  |
| `-r` | `--retention`    | New duration bucket will retain data                       | duration    |                       |
|      | `--skip-verify`  | Skip TLS certificate verification                          |             |                       |
| `-t` | `--token`        | Authentication token                                       | string      | `INFLUX_TOKEN`        |
