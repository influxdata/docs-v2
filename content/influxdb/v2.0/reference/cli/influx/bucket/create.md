---
title: influx bucket create
description: The `influx bucket create` command creates a bucket in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx bucket create
    parent: influx bucket
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/bucket/create/
related:
  - /influxdb/v2.0/organizations/buckets/create-bucket/
  - /influxdb/v2.0/reference/internals/shards/
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx bucket create` command creates a bucket in InfluxDB.

## Usage

```sh
influx bucket create [flags]
```

## Flags

| Flag |                          | Description                                                                                                                                                                 | Input type | {{< cli/mapped >}}    |
|:-----|:-------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config`        | CLI configuration to use for command                                                                                                                                        | string     |                       |
|      | `--configs-path`         | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                                                                                                       | string     | `INFLUX_CONFIGS_PATH` |
| `-d` | `--description`          | Bucket description                                                                                                                                                          | string     |                       |
| `-h` | `--help`                 | Help for the `create` command                                                                                                                                               |            |                       |
|      | `--hide-headers`         | Hide table headers (default `false`)                                                                                                                                        |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`                 | HTTP address of InfluxDB (default `http://localhost:8086`)                                                                                                                  | string     | `INFLUX_HOST`         |
|      | `--http-debug`           | Inspect communication with InfluxDB servers.                                                                                                                                | string     |                       |
|      | `--json`                 | Output data as JSON (default `false`)                                                                                                                                       |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`                 | Bucket name                                                                                                                                                                 | string     | `INFLUX_BUCKET_NAME`  |
| `-o` | `--org`                  | Organization name (mutually exclusive with `--org-id`)                                                                                                                      | string     | `INFLUX_ORG`          |
|      | `--org-id`               | Organization ID (mutually exclusive with `--org`)                                                                                                                           | string     | `INFLUX_ORG_ID`       |
| `-r` | `--retention`            | Duration bucket retains data (0 is infinite, default is 0)                                                                                                                  | duration   |                       |
|      | `--schema-type`          | Bucket schema type (`explicit`, default `implicit`) _(Cloud only)_. For more information, see [Manage bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/). | string     |                       |
|      | `--shard-group-duration` | Bucket shard group duration (OSS only)                                                                                                                                      | string     |                       |
|      | `--skip-verify`          | Skip TLS certificate verification                                                                                                                                           |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`                | API token                                                                                                                                                                   | string     | `INFLUX_TOKEN`        |

{{% note %}}
Valid `--retention` units are nanoseconds (`ns`), microseconds (`us` or `µs`),
milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`).
{{% /note %}}

## Examples

{{< cli/influx-creds-note >}}

- [Create a bucket with infinite data retention](#create-a-bucket-with-infinite-data-retention)
- [Create a bucket that retains data for 30 days](#create-a-bucket-that-retains-data-for-30-days)
- [Create a bucket with a description](#create-a-bucket-with-a-description)
- [Create a bucket with a custom shard group duration](#create-a-bucket-with-a-custom-shard-group-duration)
- [Create a bucket with an explicit schema](#create-a-bucket-with-an-explicit-schema)

##### Create a bucket with infinite data retention

```sh
influx bucket create --name example-bucket
```

##### Create a bucket that retains data for 30 days

```sh
influx bucket create \
  --name example-bucket \
  --retention 30d
```

##### Create a bucket with a description

```sh
influx bucket create \
  --name example-bucket \
  --description "Example bucket description"
```

##### Create a bucket with a custom shard group duration

Custom shard group durations are only supported in **InfluxDB OSS**.
The shard group duration must be shorter than the bucket's retention period. For more information, see [InfluxDB shards and shard groups](/influxdb/v2.0/reference/internals/shards/).

```sh
influx bucket create \
  --name example-bucket \
  --retention 30d \
  --shard-group-duration 2d
```

##### Create a bucket with an explicit schema

{{% cloud %}}
[Explicit bucket schemas](/influxdb/cloud/reference/cli/influx/bucket-schema) are only
supported in **InfluxDB Cloud**.
For more information, see [Manage bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/).
{{% /cloud %}}

```sh
{{< get-shared-text "bucket-schema/bucket-schema-type.sh" >}}
```
