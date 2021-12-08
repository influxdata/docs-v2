---
title: influx replication delete
description: Manage replication connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx replication delete
    parent: influx replication
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

NAME:
   influx replication delete - Delete an existing replication stream

USAGE:
   influx replication delete [command options] [arguments...]

OPTIONS:
   --id value, -i value  ID of the replication stream to be deleted

Error: Required flag "id" not set



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
