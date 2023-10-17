---
title: influxd-ctl entropy kill-repair
description: >
  The `influxd-ctl entropy kill-repair` command removes a shard from the entropy
  repair queue.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl entropy
weight: 301
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/entropy/show/
  - /enterprise_influxdb/v1/administration/configure/anti-entropy/
---

The `influxd-ctl entropy kill-repair` command removes a shard from the entropy
repair queue.

{{% note %}}
This only applies to shards in the repair queue.
It does not cancel repairs on shards that are in the process of being repaired.
Once a repair has started, it can't be canceled.
{{% /note %}}

## Usage

```sh
influxd-ctl entropy kill-repair <shard-id>
```

## Arguments

- **shard-id**: Shard ID to remove from the entropy repair queue

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

```sh
influxd-ctl entropy kill-repair 21179
```
