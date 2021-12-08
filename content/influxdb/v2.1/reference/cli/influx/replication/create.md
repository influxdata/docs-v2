---
title: influx replication create
description: Manage replication connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx replication create
    parent: influx replication
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

   influx replication create - Create a new replication stream

USAGE:
   influx replication create [command options] [arguments...]

OPTIONS:
   --name value, -n value         Name for new replication stream
   --description value, -d value  Description for new replication stream
   --org-id value                 The ID of the local organization [$INFLUX_ORG_ID]
   --org value, -o value          The name of the local organization [$INFLUX_ORG]
   --remote-id value              Remote connection the new replication stream should send data to
   --local-bucket value           ID of local bucket data should be replicated from
   --remote-bucket value          ID of remote bucket data should be replicated to
   --max-queue-bytes value        Max queue size in bytes (default: 67108860)
   --drop-non-retryable-data      Drop data when a non-retryable error is encountered instead of retrying
   --no-drop-non-retryable-data   Do not drop data when a non-retryable error is encountered

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
