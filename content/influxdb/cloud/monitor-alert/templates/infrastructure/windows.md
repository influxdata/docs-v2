---
title: Monitor Windows
description: >
  Use the [Windows System Monitoring template](https://github.com/influxdata/community-templates/tree/master/windows_system) to monitor your Windows system.
menu:
  influxdb_cloud:
    parent: Monitor infrastructure
    name: Windows
weight: 207
---

Use the [Windows System Monitoring template](https://github.com/influxdata/community-templates/tree/master/windows_system) to monitor your Windows system. First, [apply the template](#apply-the-template), and then [view incoming data](#view-incoming-data).

The Windows System Monitoring template includes the following:

- one [dashboard](/influxdb/cloud/reference/glossary/#dashboard): **Windows System**
- one [bucket](/influxdb/cloud/reference/glossary/#bucket): `telegraf`, 7d retention
- label: `Windows System Template`, Telegraf plugin labels: `outputs.influxdb_v2`
- one [Telegraf configuration](/influxdb/cloud/telegraf-configs/): InfluxDB v2 output plugin, Windows Performance Counters input plugin
- two variables: `bucket`, `windows_host`

## Apply the template

1. Use the [`influx` CLI](/influxdb/cloud/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/windows_system/windows_system.yml
    ```
    For more information, see [influx apply](/influxdb/cloud/reference/cli/influx/apply/).

    > **Note:** Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](/influxdb/cloud/reference/cli/influx/config/).

2. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on a server with network access to both the Windows system and [InfluxDB v2 API](/influxdb/cloud/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/influxdb/cloud/telegraf-configs/), do the following:
    - Set the following environment variables:
      - INFLUX_TOKEN: Token must have permissions to read Telegraf configurations and write data to the `telegraf` bucket. See how to [view tokens](/influxdb/cloud/security/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/influxdb/cloud/organizations/view-orgs/).
      - INFLUX_URL: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.

4. [Start Telegraf](/influxdb/cloud/write-data/no-code/use-telegraf/auto-config/#start-telegraf).
5. To monitor multiple Windows systems, repeat steps 1-4 for each system.

## View incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open the **Windows System** dashboard to start monitoring.

   {{% note %}}
   If you're monitoring multiple Windows machines, switch between them using the `windows_host` filter at the top of the dashboard.
   {{% /note %}}
