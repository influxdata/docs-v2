---
title: influx secret
description: The `influx secret` command manages secrets.
menu:
  influxdb_2_1_ref:
    name: influx secret
    parent: influx
weight: 101
influxdb/v2.1/tags: [secrets]
cascade:
  related:
    - /influxdb/v2.1/security/secrets/
    - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
  metadata: [influx CLI 2.0.0+, InfluxDB 2.0.0+]
---

The `influx secret` command manages [secrets](/influxdb/v2.1/reference/glossary/#secret).

## Usage
```
influx secret [flags]
influx secret [subcommand]
```

## Subcommands
| Subcommand                                                   | Description            |
|:----------                                                   |:-----------            |
| [delete](/influxdb/v2.1/reference/cli/influx/secret/delete/) | Delete a secret        |
| [list](/influxdb/v2.1/reference/cli/influx/secret/list/)     | List secrets           |
| [update](/influxdb/v2.1/reference/cli/influx/secret/update/) | Add or update a secret |

## Flags
| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `secret` command |
