---
title: influxd print-config
description: >
  The `influxd print-config` command prints a full InfluxDB configuration resolved
  from the current `influxd` environment.
influxdb/v2.1/tags: [influxd, cli]
menu:
  influxdb_2_1_ref:
    parent: influxd
weight: 201
related:
  - /influxdb/v2.1/reference/config-options/
---

The `influxd print-config` command prints a full InfluxDB configuration resolved
from the current `influxd` environment.
The command formats output as YAML.

## Usage

```
influxd print-config [flags]
```


{{% note %}}
For information about available InfluxDB configuration methods, see
[InfluxDB configuration options](/influxdb/v2.1/reference/config-options/).
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
