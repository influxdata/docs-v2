---
title: influx pkg validate
description: >
  The 'influx pkg validate' command validates the provided InfluxDB template.
menu:
  v2_0_ref:
    parent: influx pkg
weight: 101
---

The `influx pkg validate` command validates the provided InfluxDB template.

## Usage
```
influx pkg validate [flags]
```

## Flags

| Flag               | Description                                                        | Input Type | {{< cli/mapped >}}   |
|:----               |:-----------                                                        |:---------- |:------------------   |
| `-e`, `--encoding` | Encoding of the input stream                                       | string     |                      |
| `-f`, `--file`     | Package file to validate                                           | string     |                      |
| `-h`, `--help`     | Help for the `validate` command                                    |            |                      |
| `--json`           | Output data as JSON (default `false`)                              |            | `INFLUX_OUTPUT_JSON` |
| `-R`, `--recurse`  | Recurse through files in the directory specified in `-f`, `--file` |            |                      |
| `-u`, `--url`      | URL of template file to validate                                   | string     |                      |

{{% cli/influx-global-flags %}}
