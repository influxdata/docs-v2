---
title: influx export stack
description: >
  The `influx export stack` command exports all resources associated with a stack as an InfluxDB template.
menu:
  influxdb_2_0_ref:
    parent: influx export
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/export/stack
related:
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx export stack` command exports all resources associated with a stack as a template.
All `metadata.name` fields remain the same.

{{% note %}}
To export resources as a template, you must use the **Operator token** created for
the initial InfluxDB user or an **All-Access token**.
For information about creating an All-Access API token, see [Create an API token](/influxdb/v2.0/security/tokens/create-token/).
{{% /note %}}

## Usage
```
influx export stack <stack_id> [flags]
```

## Flags
| Flag |                   | Description                                                                      | Input Type | {{< cli/mapped >}}    |
|:-----|:------------------|:---------------------------------------------------------------------------------|:-----------|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                             | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)            | string     | `INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions. | string     |                       |
| `-h` | `--help`          | Help for the `export stack` command                                              |            |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                       | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                                     | string     |                       |
| `-o` | `--org`           | Organization name that owns the resources (mutually exclusive with `--org-id`)   | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID that owns the resources (mutually exclusive with `--org`)        | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                                |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                                        | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Export a stack as a template
```sh
influx export stack $STACK_ID
```
