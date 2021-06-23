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
    - /influxdb/cloud/organizations/bucket-schema/
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
| [create](/influxdb/v2.0/reference/cli/influx/bucket-schema/create) | Create a bucket schema |
| [help](/influxdb/v2.0/reference/cli/influx/bucket-schema/help)     | Help for the `bucket-schema` command |
| [list](/influxdb/v2.0/reference/cli/influx/bucket-schema/list)     | List bucket schemas |
| [update](/influxdb/v2.0/reference/cli/influx/bucket-schema/update) | Update a bucket schema |

## Flags
| Flag |                   | Description                                                 | Input type | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                 |:---------- |:------------------   |
| `-h` | `--help`          | Help for the `bucket-schema` command                        |            |                      |
