---
title: influx bucket update
description: The `influx bucket update` command updates information associated with buckets in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx bucket update
    parent: influx bucket
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/bucket/update/
related:
  - /influxdb/v2.0/organizations/buckets/update-bucket/
  - /influxdb/v2.0/reference/internals/shards/  
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx bucket update` command updates information associated with buckets in InfluxDB.

## Usage
```
influx bucket update [flags]
```

## Flags
| Flag |                          | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---                      |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config`        | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`         | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`          | Bucket description                                                    | string      |                       |
| `-h` | `--help`                 | Help for the `update` command                                         |             |                       |
|      | `--hide-headers`         | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`                 | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`                   | ({{< req >}}) Bucket ID                                               | string      |                       |
|      | `--json`                 | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`                 | New bucket name                                                       | string      | `INFLUX_BUCKET_NAME`  |
| `-r` | `--retention`            | New duration bucket will retain data                                  | duration    |                       |
|      | `--shard-group-duration` | Custom shard group duration for the bucket (OSS only)                    | string      |                       |
|      | `--skip-verify`          | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`                | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

{{% note %}}
Valid `--retention` units are nanoseconds (`ns`), microseconds (`us` or `µs`),
milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`).
{{% /note %}}

## Examples

{{< cli/influx-creds-note >}}

##### Update the name of a bucket
```sh
influx bucket update \
  --id 06c86c40a9f36000 \
  --name new-bucket-name
```

##### Update the retention period of a bucket
```sh
influx bucket update \
  --id 06c86c40a9f36000 \
  --retention 90d
```

##### Update the shard group duration of a bucket
Custom shard group durations are only supported in **InfluxDB OSS**.
The shard group duration must be shorter than the buckets retention period.

```sh
influx bucket update \
  --id 06c86c40a9f36000 \
  --shard-group-duration 2d
```
