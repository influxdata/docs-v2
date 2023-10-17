---
title: influxd-ctl ldap verify
description: >
  The `influxd-ctl ldap verify` command attempts to connect to and authenticate
  with LDAP using the specified credentials and outputs a verbose log.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl ldap
---

The `influxd-ctl ldap verify` command attempts to connect to and authenticate
with LDAP using the specified credentials and outputs a verbose log.

## Usage

```sh
influxd-ctl ldap verify [flags] <username> <password>
```

## Arguments

- **username**: Username to authenticate with
- **password**: Password to authenticate with

## Flags {#command-flags}

| Flag           | Description                                                |
| :------------- | :--------------------------------------------------------- |
| `-ldap-config` | LDAP configuration filepath (use `-` to read from _stdin_) |

{{% note %}}
If `-ldap-config` is not provided, the command uses the LDAP configuration
stored on the server.
{{% /note %}}

_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

## Examples

- [Verify LDAP authentication using a local configuration](#verify-ldap-authentication-using-a-local-configuration)
- [Verify LDAP authentication using the server configuration](#verify-ldap-authentication-using-the-server-configuration)

### Verify LDAP authentication using a local configuration

```sh
influxd-ctl ldap verify -ldap-config /path/to/ldap-config.toml username passw0rd
```

### Verify LDAP authentication using the server configuration

```sh
influxd-ctl ldap verify username passw0rd
```
