---
title: influxd-ctl entropy repair
description: >
  The `influxd-ctl entropy repair` command adds a shard to the entropy repair queue.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl entropy
weight: 301
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/entropy/show/
  - /enterprise_influxdb/v1/administration/configure/anti-entropy/
---

The `influxd-ctl entropy repair` command adds a shard to the entropy repair queue.

## Usage

```sh
influxd-ctl entropy repair <shard-id>
```

## Arguments

- **shard-id**: Shard ID to add to the entropy repair queue

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

```sh
influxd-ctl entropy repair 21179
```
