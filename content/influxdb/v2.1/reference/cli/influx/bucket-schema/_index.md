---
title: influx bucket-schema
description: The `influx bucket-schema` command and its subcommands manage schemas of buckets in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx bucket-schema
    parent: influx
weight: 101
influxdb/v2.1/tags: [buckets, bucket-schema]
cascade:
  related:
    - /influxdb/cloud/organizations/buckets/bucket-schema
    - /influxdb/cloud/organizations/buckets/
    - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
  metadata: [influx CLI 2.1.0+, InfluxDB Cloud only]
  prepend:
    block: cloud
    content: |
      #### Works with InfluxDB Cloud bucket schemas
      `influx bucket-schema` and its subcommands work with [InfluxDB Cloud bucket schemas](/influxdb/cloud/organizations/buckets/bucket-schema).
      This feature is not available in InfluxDB OSS v2.1.
---

The `influx bucket-schema` command and its subcommands manage
schemas for InfluxDB buckets.

## Usage

```
influx bucket-schema [flags]
influx bucket-schema [command]
```

## Subcommands

| Subcommand                                                         | Description            |
| :----------------------------------------------------------------- | :--------------------- |
| [create](/influxdb/v2.1/reference/cli/influx/bucket-schema/create) | Create a bucket schema |
| [list](/influxdb/v2.1/reference/cli/influx/bucket-schema/list)     | List bucket schemas    |
| [update](/influxdb/v2.1/reference/cli/influx/bucket-schema/update) | Update a bucket schema |

## Flags

| Flag |          | Description                          |
| :--- | :------- | :----------------------------------- |
| `-h` | `--help` | Help for the `bucket-schema` command |
