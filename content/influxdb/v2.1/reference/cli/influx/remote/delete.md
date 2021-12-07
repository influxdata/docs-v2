---
title: influx remote delete
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote delete
    parent: influx remote
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Delete an existing remote connection

## Usage
```
influx remote delete [command options] [arguments...]
```

## Flags

| Flag |        | Description                               | Input type | {{< cli/mapped >}} |
|:-----|:-------|:------------------------------------------|:----------:|:-------------------|
| `-i` | `--id` | ID of the remote connection to be deleted |            |                    |

<!--
COMMON OPTIONS:
   --host value                     HTTP address of InfluxDB [$INFLUX_HOST]
   --skip-verify                    Skip TLS certificate chain and host name verification [$INFLUX_SKIP_VERIFY]
   --configs-path value             Path to the influx CLI configurations [$INFLUX_CONFIGS_PATH]
   --active-config value, -c value  Config name to use for command [$INFLUX_ACTIVE_CONFIG]
   --http-debug
   --json                           Output data as JSON [$INFLUX_OUTPUT_JSON]
   --hide-headers                   Hide the table headers in output data [$INFLUX_HIDE_HEADERS]
   --token value, -t value          Token to authenticate request [$INFLUX_TOKEN]

Error: Required flag "id" not set
  -->
