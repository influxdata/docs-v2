---
title: Influx task management commands
description: placeholder
menu:
  v2_0_ref:
    name: influx task
    parent: influx
    weight: 1
---

Task management commands

### Usage
```
influx task [flags]
influx task [command]
```

### Subcommands
| Subcommand | Description          |
|:---------- |:-----------          |
| create     | Create task          |
| delete     | Delete task          |
| find       | Find tasks           |
| log        | Log related commands |
| retry      | retry a run          |
| run        | Run related commands |
| update     | Update task          |

### Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `task` command |

### Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
