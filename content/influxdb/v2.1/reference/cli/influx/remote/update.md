---
title: influx remote update
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote update
    parent: influx remote
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Update an existing remote connection.

## Usage
```
influx remote update [command options] [arguments...]
```

## Flags

   --id value, -i value           Remote connection ID
   --name value, -n value         New name for the remote connection
   --description value, -d value  New description for the remote connection
   --remote-url value             New url for the remote database
   --remote-api-token value       New API token for the remote database
   --remote-org-id value          New ID of the remote organization
   --allow-insecure-tls           Allows insecure TLS

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
