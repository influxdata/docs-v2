---
title: influx bucket-schema
description: The `influx bucket-schema` command and its subcommands manage measurement schemas of buckets in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx bucket-schema
    parent: influx
weight: 101
influxdb/cloud/tags: [buckets, bucket-schema]
cascade:
  related:
    - /influxdb/cloud/organizations/buckets/bucket-schema
    - /influxdb/cloud/organizations/buckets/
    - /influxdb/cloud/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/cloud/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx bucket-schema` command and its subcommands manage measurement
schemas for InfluxDB buckets.

## Usage

```
influx bucket-schema [flags]
influx bucket-schema [command]
```

## Subcommands

| Subcommand                                                         | Description   |
|:----------                                                         |:-----------   |
| [create](/influxdb/cloud/reference/cli/influx/bucket-schema/create) | Create a bucket schema |
| [list](/influxdb/cloud/reference/cli/influx/bucket-schema/list)     | List bucket schemas |
| [update](/influxdb/cloud/reference/cli/influx/bucket-schema/update) | Update a bucket schema |

## Flags

| Flag |                   | Description                                                 | Input type | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                 |:---------- |:------------------   |
| `-h` | `--help`          | Help for the `bucket-schema` command                        |            |                      |

## Create a columns file

Create a measurement schema **columns file** using CSV, JSON, or [Newline delimited JSON (NDJSON)](http://ndjson.org/). Define the name, type, and data type of each column. For more information, see [InfluxDB data elements](/influxdb/cloud/reference/key-concepts/data-elements/).
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
