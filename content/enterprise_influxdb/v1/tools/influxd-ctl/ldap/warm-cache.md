---
title: influxd-ctl ldap warm-cache
description: >
  The `influxd-ctl ldap warm-cache` command downloads LDAP group membership and
  loads the cache on all InfluxDB Enterprise data nodes with that information.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl ldap
---

The `influxd-ctl ldap warm-cache` command downloads LDAP group membership and
loads the cache on all InfluxDB Enterprise data nodes with that information.

## Usage

```sh
influxd-ctl ldap warm-cache [flags]
```

## Flags

| Flag      | Description                      |
| :-------- | :------------------------------- |
| `-cancel` | Cancel an in-progress cache warm |
| `-status` | Print cache warm status          |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

- [Warm the LDAP cache](#warm-the-ldap-cache)
- [View the status of cache warm operations](#view-the-status-of-cache-warm-operations)
- [Cancel an in-progress cache warm operation](#cancel-an-in-progress-cache-warm-operation)

### Warm the LDAP cache

```sh
influxd-ctl ldap warm-cache
```

### View the status of cache warm operations

```sh
influxd-ctl ldap warm-cache -status
```

### Cancel an in-progress cache warm operation

```sh
influxd-ctl ldap warm-cache -cancel
```
