---
title: Monitor Raspberry Pi
description: >
  Use the Raspberry Pi system template to monitor your Raspberry Pi 4 or 400 Linux system. 
menu:
  influxdb_2_1:
    parent: Monitor infrastructure
    name: Raspberry Pi
weight: 201
---

Use the [Raspberry Pi Monitoring template](https://github.com/influxdata/community-templates/tree/master/raspberry-pi)
to monitor your Raspberry Pi 4 or 400 Linux system.

The Raspberry Pi template includes the following:

- one [bucket](/influxdb/v2.1/reference/glossary/#bucket): `rasp-pi` (7d retention)
- labels: `raspberry-pi` + Telegraf plugin labels
  - [Diskio input plugin](/{{< latest "telegraf" >}}/plugins//#diskio) 
  - [Mem input plugin](/{{< latest "telegraf" >}}/plugins//#mem) 
  - [Net input plugin](/{{< latest "telegraf" >}}/plugins//#net) 
  - [Processes input plugin](/{{< latest "telegraf" >}}/plugins//#processes) 
  - [Swap input plugin](/{{< latest "telegraf" >}}/plugins//#swap) 
  - [System input plugin](/{{< latest "telegraf" >}}/plugins//#system) 
- one [Telegraf configuration](/influxdb/v2.1/telegraf-configs/)
- one [dashboard](/influxdb/v2.1/reference/glossary/#dashboard): Raspberry Pi System
- two variables: `bucket` and `linux_host`

## Apply the template

1. Use the [`influx` CLI](/influxdb/v2.1/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/raspberry-pi/raspberry-pi-system.yml
    ```
    For more information, see [influx apply](/influxdb/v2.1/reference/cli/influx/apply/).
2.  [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on
    your Raspberry Pi and ensure your Raspberry Pi has network access to the
    [InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}} API](/influxdb/v2.1/reference/api/).
3. Add the following environment variables to your Telegraf environment:

    - `INFLUX_HOST`: {{% oss-only %}}Your [InfluxDB URL](/influxdb/v2.1/reference/urls/){{% /oss-only %}}
      {{% cloud-only %}}Your [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/){{% /cloud-only %}}
    - `INFLUX_TOKEN`: Your [InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}} API token](/influxdb/v2.1/security/tokens/)
    - `INFLUX_ORG`: Your InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}} organization name.
    
    ```sh
    export INFLUX_HOST=http://localhost:8086
    export INFLUX_TOKEN=mY5uP3rS3cr3T70keN
    export INFLUX_ORG=example-org
    ```

4. [Start Telegraf](/influxdb/v2.1/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View the incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Click the Raspberry Pi System link to open your dashboard, then select `rasp-pi`
as your bucket and select your linux_host. 
