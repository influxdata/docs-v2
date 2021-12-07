---
title: influx remote
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote
    parent: influx
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

The `influx remote` command 

## Usage
```
influx remote [flags]
```

❯  bin/darwin/influx remote
NAME:
   influx remote - Remote connection management commands

USAGE:
   influx remote command [command options] [arguments...]

COMMANDS:
   create          Create a new remote connection
   delete          Delete an existing remote connection
   list, find, ls  List all remote connections
   update          Update an existing remote connection

OPTIONS:
   --help, -h  show help

<!-- To use the Flux REPL, you must first authenticate with a [token](/influxdb/v2.1/security/tokens/view-tokens/). -->

<!-- ## Flags -->
<!-- | Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    | -->
<!-- |:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------| -->
<!-- | `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       | -->
<!-- |      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` | -->
<!-- | `-h` | `--help`          | Help for the `repl` command                                           |            |                       | -->
<!-- |      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         | -->
<!-- |      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       | -->
<!-- | `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          | -->
<!-- |      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       | -->
<!-- |      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  | -->
<!-- | `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        | -->
