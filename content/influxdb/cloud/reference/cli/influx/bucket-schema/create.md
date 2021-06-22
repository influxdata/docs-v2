---
title: influx bucket-schema create
description: The `influx bucket-schema create` command creates a measurement schema for a bucket in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx bucket-schema create
    parent: influx bucket-schema
weight: 201
related:
  - /influxdb/cloud/organizations/bucket-schema
---

The `influx bucket-schema create` command creates a measurement schema for a bucket in InfluxDB.

Creating a bucket schema requires a bucket of [schema-type **explicit**](influxdb/cloud/reference/cli/influx/bucket/create/#create-a-bucket-for-an-explicit-measurement-schema).

## Usage

```sh
influx bucket-schema create --bucket <string> --name <string> --columns-file <path> [flags]
```

## Flags

| Flag |                          | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :----------------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config`        | CLI configuration to use for command                                  |   string   |                       |
| `-n` | `--bucket`               | The bucket name, org or org-id will be required by choosing this      |   string   |                       |
| `-i` | `--bucket-id`            | The bucket ID, required if name isn't provided                        |   string   |
|      | `--columns-file`         | A path referring to list of column definitions                        |   string   |                       |
|      | `--columns-format`       | The format of the columns file. `auto` will attempt to guess the format. (`csv`, `ndjson`, `json`, default: `auto`) | string | |             |
|      | `--configs-path`         | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-x` | `--extended-output`      | Print column information for each measurement (default: false)        |            |                       |
| `-h` | `--help`                 | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`         | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`                 | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--json`                 | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`                 | Name of the measurement                                               |   string   |                       |
| `-o` | `--org`                  | Organization name (mutually exclusive with `--org-id`)                |   string   | `INFLUX_ORG`          |
|      | `--org-id`               | Organization ID (mutually exclusive with `--org`)                     |   string   | `INFLUX_ORG_ID`       |
|      | `--skip-verify`          | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`                | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |


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
  --bucket example-bucket
  --name temperature
  --columns-file columns.csv
```

## Create a bucket schema and print column information
```sh
influx bucket-schema create \
  --bucket example-bucket
  --name cpu
  --columns-file columns.csv
  -x
```

## Create a bucket schema, specifying the columns format
```sh
influx bucket-schema create \
  --bucket example-bucket
  --name cpu
  --columns-file columns.json
  --columns-format ndjson
  -x
```
