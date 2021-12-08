---
title: influx remote list
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote list
    parent: influx remote
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

List all remote connections.

## Usage

```
influx remote list [command options] [arguments...]
```

## Flags

| Flag |                | Description                                                  | Input type | {{< cli/mapped >}} |
|:-----|----------------|--------------------------------------------------------------|------------|--------------------|
| `-n` | `--name`       | Filter results to only connections with a specific name      |            |                    |
|      | `--org-id`     | Local org ID [$INFLUX_ORG_ID]                                |            |                    |
| `-o` | `--org`        | Local org name [$INFLUX_ORG]                                 |            |                    |
|      | `--remote-url` | Filter results to only connections for a specific remote URL |            |                    |

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
-->
