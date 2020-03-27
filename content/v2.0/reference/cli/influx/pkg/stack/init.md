---
title: influx pkg stack init
description: The 'influx pkg stack init' command initializes an InfluxDB stack.
menu:
  v2_0_ref:
    name: influx pkg stack init
    parent: influx pkg stack
weight: 201
v2.0/tags: [templates]
---

The `influx pkg stack init` command initializes an InfluxDB stack.

## Usage
```
influx pkg stack init [flags]
```

## Flags
| Flag                        | Description                           | Input type      | {{< cli/mapped >}}    |
|:----                        |:-----------                           |:----------:     |:------------------    |
| `-h`, `--help`              | Help for the `init` command           |                 |                       |
| `--json`                    | Output data as JSON (default `false`) |                 | `$INFLUX_OUTPUT_JSON` |
| `-o`, `--org`               | Organization name                     | string          | `$INFLUX_ORG`         |
| `--org-id`                  | Organization ID                       | string          | `$INFLUX_ORG_ID`      |
| `-u`, `--package-url`       | Package URLs to associate stack       | list of strings |                       |
| `-d`, `--stack-description` | Stack description                     | string          |                       |
| `-n`, `--stack-name`        | Stack name                            | string          |                       |
