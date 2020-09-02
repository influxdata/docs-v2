---
title: influx template validate
description: >
  The `influx template validate` command validates the provided InfluxDB template.
menu:
  influxdb_2_0_ref:
    parent: influx template
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/validate/
---

The `influx template validate` command validates the provided InfluxDB template.

## Usage
```
influx template validate [flags]
```

## Flags

| Flag |                  | Description                                                        | Input Type |
|:---- |:---              |:-----------                                                        |:---------- |
| `-e` | `--encoding`     | Encoding of the input stream                                       | string     |
| `-f` | `--file`         | Path to template file (supports HTTP(S) URLs or file paths)        | string     |
| `-h` | `--help`         | Help for the `validate` command                                    |            |
| `-R` | `--recurse`      | Recurse through files in the directory specified in `-f`, `--file` |            |
| `-u` | `--template-url` | URL of template file to validate                                   | string     |
