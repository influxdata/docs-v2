---
title: Influx organization management commands
description: placeholder
menu:
  v2_0_ref:
    name: influx org
    parent: influx
    weight: 1
---

Organization management commands

## Usage
```
influx org [flags]
influx org [command]
```

#### Aliases
`org`, `organization`

## Subcommands
| Subcommand | Description                      |
|:---------- |:-----------                      |
| create     | Create organization              |
| delete     | Delete organization              |
| find       | Find organizations               |
| members    | Organization membership commands |
| update     | Update organization              |

## Flags
| Flag           | Description              |
|:----           |:-----------              |
| `-h`, `--help` | Help for the org command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
