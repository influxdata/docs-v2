---
title: influx pkg summary
description: >
  The 'influx pkg summary' command summarizes the provided InfluxDB template.
menu:
  v2_0_ref:
    parent: influx pkg
weight: 101
---

The `influx pkg summary` command summarizes the provided InfluxDB template.

## Usage
```
influx pkg summary [flags]
```

## Flags

| Flag                      | Description                                                        | Input Type |
|:----                      |:-----------                                                        |:---------- |
| `-c`, `--disable-color`   | Disable color in output                                            |            |
| `--disable-table-borders` | Disable table borders                                              |            |
| `-e`, `--encoding`        | Encoding of the input stream                                       | string     |
| `-f`, `--file`            | Package file to summarize                                          | string     |
| `-h`, `--help`            | Help for the `summary` command                                     |            |
| `-R`, `--recurse`         | Recurse through files in the directory specified in `-f`, `--file` |            |
| `-u`, `--url`             | URL of template file to summarize                                  | string     |


{{% cli/influx-global-flags %}}
