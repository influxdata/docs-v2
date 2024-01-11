---
title: influxd-ctl ldap
description: >
  The `influxd-ctl ldap` command and subcommands manage LDAP implementations in
  an InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
cascade:
  related: 
    - /enterprise_influxdb/v1/administration/configure/security/ldap/
---

The `influxd-ctl ldap` command and subcommands manage LDAP implementations in
an InfluxDB Enterprise cluster.

## Usage

```sh
influxd-ctl ldap [flags] [arguments]
```

## Subcommands

| Subcommand                                                                             | Description                                                                |
| :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| [get-config](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/get-config/)       | Get the LDAP configuration for the entire cluster                          |
| [set-config](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/set-config/)       | Set the LDAP configuration for the entire cluster                          |
| [sample-config](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/sample-config/) | Print out a sample LDAP configuration                                      |
| [verify](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/verify/)               | Attempt to authenticate using LDAP                                         |
| [purge-cache](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/purge-cache/)     | Clear the LDAP cache on all data nodes                                     |
| [warm-cache](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/warm-cache/)       | Download group membership from LDAP server and preload cache on data nodes |

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._




