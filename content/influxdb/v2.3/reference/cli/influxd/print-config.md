---
title: influxd print-config
description: >
  The `influxd print-config` command prints a full InfluxDB configuration resolved
  from the current `influxd` environment.
influxdb/v2.2/tags: [influxd, cli]
menu:
  influxdb_2_3_ref:
    parent: influxd
weight: 201
related:
  - /influxdb/v2.2/reference/config-options/
  - /influxdb/v2.2/reference/cli/influx/server-config/
---

The `influxd print-config` command prints a full InfluxDB configuration resolved
from the current `influxd` environment.
The command formats output as YAML.

{{% warn %}}

#### Use influx CLI server-config

`influxd print-config` is deprecated in InfluxDB v2.2.

To display the runtime server configuration, use the [`influx server-config` command](/influxdb/v2.2/reference/cli/influx/server-config/)
or the [`/api/v2/config`](/influxdb/v2.2/api/#operation/GetConfig) InfluxDB API endpoint.
For more information, see [how to view your server configuration](/influxdb/v2.2/reference/config-options/#view-your-runtime-server-configuration).
{{% /warn %}}

`influxd print-config` does not output the configuration of the running server. Rather, it evaluates the current environment, config file, and _flags passed to the `influxd print-config` command_. It is unaware of configuration options passed to the `influxd` command at runtime.

For example, with the following configuration value:
```sh
# Configuration file
...
log-level: info
...
```

and `--log-level` provided at startup:

```
influxd --log-level warn
```

`influxd print-config` displays

```sh
...
log-level: info
...
```

`influxd print-config log-level warn` displays

```sh
...
log-level: warn
...
```

## Usage

```
influxd print-config [flags]
```


{{% note %}}
For information about available InfluxDB configuration methods, see
[InfluxDB configuration options](/influxdb/v2.2/reference/config-options/).
{{% /note %}}

## Flags

| Flag |              | Description                                     | Input type |
|:---- | ---          |:-----------                                     |:----------:|
| `-h` | `--help`     | Help for `print-config`                         |            |
|      | `--key-name` | Print the value of a specific configuration key | string     |


## Examples

##### Print full influxd configuration
```sh
influxd print-config
```

##### Print the value of a specific influxd configuration setting
```sh
influxd print-config --key-name=http-bind-address
```
