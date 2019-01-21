---
title: Influx authorization management commands
description: placeholder
menu:
  v2_0_ref:
    name: influx auth
    parent: influx
    weight: 1
---

Authorization management commands

## Usage
```
influx auth [flags]
influx auth [command]
```

#### Aliases
`auth`, `authorization`

## Subcommands
| Subcommand | Description            |
|:---------- |:-----------            |
| active     | Active authorization   |
| create     | Create authorization   |
| delete     | Delete authorization   |
| find       | Find authorization     |
| inactive   | Inactive authorization |

## Flags
| Flag           | Description               |
|:----           |:-----------               |
| `-h`, `--help` | Help for the auth command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
