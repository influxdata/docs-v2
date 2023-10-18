---
title: influxd-ctl entropy show
description: >
  The `influxd-ctl entropy show` command returns all shards with detected entropy.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl entropy
weight: 301
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/entropy/repair/
  - /enterprise_influxdb/v1/administration/configure/anti-entropy/
---

The `influxd-ctl entropy show` command returns all shards with detected entropy.

## Usage

```sh
influxd-ctl entropy show
```

Output includes the following:

- Shard ID
- Database
- Retention policy
- Shard start time
- Shard end time
- Shard expiration time
- Shard entropy status

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```sh
Entropy
==========
ID     Database  Retention Policy  Start                          End                            Expires                        Status
21179  statsdb   1hour             2023-10-09 00:00:00 +0000 UTC  2023-10-16 00:00:00 +0000 UTC  2024-10-22 00:00:00 +0000 UTC  diff
25165  statsdb   1hour             2023-11-20 00:00:00 +0000 UTC  2023-11-27 00:00:00 +0000 UTC  2024-12-03 00:00:00 +0000 UTC  diff
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
