---
title: influx bucket-schema create
description: The `influx bucket-schema create` command creates a measurement schema for an InfluxDB bucket.
menu:
  influxdb_cloud_ref:
    name: influx bucket-schema create
    parent: influx bucket-schema
weight: 201
related:
  - /influxdb/cloud/organizations/bucket-schema
---

The `influx bucket-schema create` command creates a measurement schema for an InfluxDB bucket.

{{% note %}}
{{< bucket-schema-type >}}
```sh
{{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
```
{{% /note %}}

## Usage

```sh
influx bucket-schema create --bucket <string> --name <string> --columns-file <path> [flags]
```

## Flags

| Flag |                     | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :------------------ | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config`   | CLI configuration to use for command                                  |   string   |                       |
| `-n` | `--bucket`          | Bucket name (mutually exclusive with `--bucket-id`)                   |   string   |                       |
| `-i` | `--bucket-id`       | Bucket ID (mutually exclusive with `--bucket`)                        |   string   |                       |
|      | `--columns-file`    | Path to column definitions file                                       |   string   |                       |
|      | `--columns-format`  | Columns file format (`csv`, `ndjson`, `json`, default: `auto`)        |   string   |                       |             
|      | `--configs-path`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-x` | `--extended-output` | Print column information for each measurement (default: false)        |            |                       |
| `-h` | `--help`            | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`    | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`            | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--json`            | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`            | Measurement name                                                       |   string   |                       |
| `-o` | `--org`             | Organization name (mutually exclusive with `--org-id`)                |   string   | `INFLUX_ORG`          |
|      | `--org-id`          | Organization ID (mutually exclusive with `--org`)                     |   string   | `INFLUX_ORG_ID`       |
|      | `--skip-verify`     | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`           | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |


## Examples

{{< cli/influx-creds-note >}}

## Columns file syntax

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[columns.csv](#)
[columns.json](#)
[columns.ndjson](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{< get-assets-text "bucket-schema/bucket-schema-columns.csv" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{{< get-assets-text "bucket-schema/bucket-schema-columns.json" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{{< get-assets-text "bucket-schema/bucket-schema-columns.ndjson" >}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Create a bucket schema using the influx CLI

{{% note %}}
  Before creating a bucket schema, set the bucket's schema-type to **explicit**:

  ```sh
  {{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
  ```
{{% /note %}}

```sh
influx bucket-schema create \
  --bucket example-bucket \
  --name temperature \
  --columns-file columns.csv
```

## Create a bucket schema and print column information
```sh
influx bucket-schema create \
  --bucket example-bucket \
  --name cpu \
  --columns-file columns.csv \
  --extended-output
```

## Create a bucket schema, specifying the columns format
```sh
influx bucket-schema create \
  --bucket example-bucket \
  --name cpu \
  --columns-file columns.json \
  --columns-format ndjson \
  --extended-output
```
