---
title: influxd-ctl ldap set-config
description: >
  The `influxd-ctl ldap set-config` command uploads the specified LDAP configuration
  to your InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl ldap
---

The `influxd-ctl ldap set-config` command uploads the specified LDAP configuration
to your InfluxDB Enterprise cluster.

## Usage

```sh
influxd-ctl ldap set-config <ldap-config-toml>
```

## Arguments

- **ldap-config-toml**: LDAP configuration filepath or use `-` to read from _stdin_.


## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

- [Apply an LDAP configuration from a file](#apply-an-ldap-configuration-from-a-file)
- [Apply an LDAP configuration from stdin](#apply-an-ldap-configuration-from-stdin)

### Apply an LDAP configuration from a file

```sh
influxd-ctl ldap set-config /path/to/ldap-config.toml
```

### Apply an LDAP configuration from stdin

```sh
cat ./ldap-config.toml | influxd-ctl ldap set-config -
```
