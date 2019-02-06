---
title: influx repl – Enter an interactive REPL
description: >
  The 'influx repl' command opens and interactive read-eval-print-loop (REPL)
  from which you can run Flux commands.
menu:
  v2_0_ref:
    name: influx repl
    parent: influx
weight: 101
---

The `influx repl` command opens and interactive read-eval-print-loop (REPL)
from which you can run Flux commands.

## Usage
```
influx repl [flags]
```

## Flags
| Flag           | Description                     | Input type |
|:----           |:-----------                     |:----------:|
| `-h`, `--help` | Help for the `repl` command     |            |
| `-o`, `--org`  | The name of the organization    | string     |
| `--org-id`     | The ID of organization to query | string     |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
