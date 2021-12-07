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

✗  bin/darwin/influx remote list -h
NAME:
   influx remote list - List all remote connections

USAGE:
   influx remote list [command options] [arguments...]


| Flag |                        | Description                                    | Input type | {{< cli/mapped >}} |
|:-----|:-----------------------|:-----------------------------------------------|:----------:|:-------------------|

--name value, -n value  Filter results to only connections with a specific name
--org-id value          Local org ID [$INFLUX_ORG_ID]
--org value, -o value   Local org name [$INFLUX_ORG]
--remote-url value      Filter results to only connections for a specific remote URL

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
