---
title: influx remote create
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote create
    parent: influx remote
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---


❯  bin/darwin/influx remote create
NAME:
   influx remote create - Create a new remote connection

USAGE:
   influx remote create [command options] [arguments...]

COMMON OPTIONS:
   --host value                     HTTP address of InfluxDB [$INFLUX_HOST]
   --skip-verify                    Skip TLS certificate chain and host name verification [$INFLUX_SKIP_VERIFY]
   --configs-path value             Path to the influx CLI configurations [$INFLUX_CONFIGS_PATH]
   --active-config value, -c value  Config name to use for command [$INFLUX_ACTIVE_CONFIG]
   --http-debug
   --json                           Output data as JSON [$INFLUX_OUTPUT_JSON]
   --hide-headers                   Hide the table headers in output data [$INFLUX_HIDE_HEADERS]
   --token value, -t value          Token to authenticate request [$INFLUX_TOKEN]

OPTIONS:
   --org-id value                 The ID of the organization [$INFLUX_ORG_ID]
   --org value, -o value          The name of the organization [$INFLUX_ORG]
   --name value, -n value         Name for the new remote connection
   --description value, -d value  Description for the new remote connection
   --remote-url value             The url for the remote database
   --remote-api-token value       The API token for the remote database
   --remote-org-id value          The ID of the remote organization
   --allow-insecure-tls           Allows insecure TLS

Error: Required flags "name, remote-url, remote-api-token, remote-org-id" not set
