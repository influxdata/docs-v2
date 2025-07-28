---
title: influxd-ctl show-shards
description: >
  The `influxd-ctl show-shards` command returns information about shards in an
  InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/truncate-shards/
---

The `influxd-ctl show-shards` command returns information about shards in an
InfluxDB Enterprise cluster.

## Usage

```sh
influxd-ctl show-shards [flags]
```

Information includes:

- Shard ID
- Database
- Retention Policy
- Number of desired replicas
- Shard group
- Shard start time
- Shard end time
- Shard expiration
- Shard owners

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```sh
Shards
==========
ID  Database    Retention Policy  Desired Replicas  Shard Group  Start                 End                   Expires               Owners
51  telegraf    autogen           2                 37           2023-01-01T00:00:00Z  2023-01-08T00:00:00Z  2023-07-08T00:00:00Z  [{26 data1:8088} {33 data3:8088}]
52  telegraf    autogen           2                 37           2023-01-01T00:00:00Z  2023-01-08T00:00:00Z  2023-07-08T00:00:00Z  [{5 data2:8088} {26 data1:8088}]
```
{{% /expand %}}
{{< /expand-wrapper >}}

You can also use the `-m` flag to output "inconsistent" shards which are shards
that are either in metadata but not on disk or on disk but not in metadata.

## Flags

| Flag | Description                       |
| :--- | :-------------------------------- |
| `-v` | Return detailed shard information |
| `-m` | Return inconsistent shards        |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples
