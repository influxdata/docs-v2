---
title: Monitor Raspberry Pi
description: >
  Use the Raspberry Pi system template to monitor your Raspberry Pi 4 or 400 Linux system. 
menu:
  influxdb_cloud:
    parent: Monitor infrastructure
    name: Raspberry Pi
weight: 201
---

Use the [Raspberry Pi Monitoring template](https://github.com/influxdata/community-templates/tree/master/raspberry-pi) to monitor data from the Raspberry Pi system template to monitor your Raspberry Pi 4 or 400 Linux system. 

The Raspberry Pi template includes the following:

- one [bucket](/influxdb/cloud/reference/glossary/#bucket): `rasp-pi` (7d retention)
- labels: `raspberry-pi` + Telegraf plugin labels
  - [Diskio input plugin](/{{< latest "telegraf" >}}/plugins//#diskio) 
  - [Mem input plugin](/{{< latest "telegraf" >}}/plugins//#mem) 
  - [Net input plugin](/{{< latest "telegraf" >}}/plugins//#net) 
  - [Processes input plugin](/{{< latest "telegraf" >}}/plugins//#processes) 
  - [Swap input plugin](/{{< latest "telegraf" >}}/plugins//#swap) 
  - [System input plugin](/{{< latest "telegraf" >}}/plugins//#system) 
- one [Telegraf configuration](/influxdb/cloud/telegraf-configs/)
- one [dashboards](/influxdb/cloud/reference/glossary/#dashboard): Raspberry Pi System
- two variables: `bucket` and `linux_host`

## Apply the template

1. Use the [`influx` CLI](/influxdb/cloud/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/raspberry-pi/raspberry-pi-system.yml
    ```
    For more information, see [influx apply](/influxdb/cloud/reference/cli/influx/apply/).
2. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on a server with network access to both your Raspberry Pi and the [InfluxDB v2 API](/influxdb/cloud/reference/api/).
3. In your Telegraf configuration file (`telegraf.conf`), find the following example `influxdb_v2` output plugins, and then **replace** the `urls` to specify the servers to monitor:

   ```sh
    ## cloudv2 sample
    [[outputs.influxdb_v2]]
     urls = ["$INFLUX_HOST"]
     token = "$INFLUX_TOKEN"
     organization = "$INFLUX_ORG"
     bucket = “rasp-pi"
   ```
4. [Start Telegraf](/influxdb/cloud/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View the incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Click the Raspberry Pi System link to open your dashboard, then select `rasp-pi` as your bucket and select your linux_host. 
