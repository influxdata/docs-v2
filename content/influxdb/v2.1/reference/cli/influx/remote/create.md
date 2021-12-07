---
title: influx remote create
description: Create a new remote connection
menu:
  influxdb_2_1_ref:
    name: influx remote create
    parent: influx remote
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Create a new remote connection


## Usage
```
influx remote create [commond options] [arguments...]
```

## Flags

| Flag |                        | Description                                    | Input type | {{< cli/mapped >}} |
|:-----|:-----------------------|:-----------------------------------------------|:----------:|:-------------------|
|      | `--org-id`             | The ID of the organization                     | string     | [$INFLUX_ORG_ID]   |
| `-o` | `--org`                | The name of the organization                   | string     | [$INFLUX_ORG]      |
| `-n` | `--name`               | Name for the new remote connection             | string     |                    |
| `-d` | `--description`        | Description for the new remote connection      | string     |                    |
|      | `--remote-url`         | The url for the remote database                | string     |                    |
|      | `--remote-api-token`   | The API token for the remote database          | string     |                    |
|      | `--remote-org-id`      | The ID of the remote organization              | string     |                    |
|      | `--allow-insecure-tls` | Allows insecure TLS (self-signed certificates) |            |                    |


COMMON OPTIONS:
   --host value                     HTTP address of InfluxDB [$INFLUX_HOST]
   --skip-verify                    Skip TLS certificate chain and host name verification [$INFLUX_SKIP_VERIFY]
   --configs-path value             Path to the influx CLI configurations [$INFLUX_CONFIGS_PATH]
   --active-config value, -c value  Config name to use for command [$INFLUX_ACTIVE_CONFIG]
   --http-debug
   --json                           Output data as JSON [$INFLUX_OUTPUT_JSON]
   --hide-headers                   Hide the table headers in output data [$INFLUX_HIDE_HEADERS]
   --token value, -t value          Token to authenticate request [$INFLUX_TOKEN]

