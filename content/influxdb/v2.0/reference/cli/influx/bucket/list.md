---
title: influx bucket list
description: The `influx bucket list` command lists and searches for buckets in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx bucket list
    parent: influx bucket
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/bucket/find
  - /influxdb/v2.0/reference/cli/influx/bucket/list/
---

The `influx bucket list` command lists and searches for buckets in InfluxDB.

## Usage
```
influx bucket list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                                  | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :--------------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                         |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)        |   string   | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                                  |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                         |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                   |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                                 |   string   |                       |
| `-i` | `--id`            | Bucket ID                                                                    |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                        |            | `INFLUX_OUTPUT_JSON`  |
|      | `--limit`         | Total number of buckets to fetch from the server, or 0 to return all buckets |   string   |                       |
| `-n` | `--name`          | Bucket name                                                                  |   string   | `INFLUX_BUCKET_NAME`  |
|      | `--offset`        | Number of buckets to skip over in the list                                   |            | `INFLUX_ORG`          |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                       |   string   | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                            |   string   | `INFLUX_ORG_ID`       |
|      | `--page-size`     | Number of buckets to fetch per request to the server (default 20)            |            |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                            |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                                    |   string   | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [List all buckets](#list-all-buckets)
- [List a bucket by name](#list-a-bucket-by-name)
- [List a bucket by ID](#list-a-bucket-by-id)

##### List all buckets
```sh
influx bucket list
```

##### List a bucket by name
```sh
influx bucket list --name example-bucket
```

##### List a bucket by ID
```sh
influx bucket list --id 06c86c40a9f36000
```
