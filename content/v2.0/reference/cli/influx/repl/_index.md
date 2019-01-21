---
title: Influx repl command
description: placeholder
menu:
  v2_0_ref:
    name: influx repl
    parent: influx
    weight: 1
---

Interactive REPL (read-eval-print-loop)

## Usage
```
influx repl [flags]
```

## Flags
| Flag           | Description                     | Input type |
|:----           |:-----------                     |:----------:|
| `-h`, `--help` | Help for the repl command       |            |
| `-o`, `--org`  | The name of the organization    | string     |
| `--org-id`     | The ID of organization to query | string     |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
