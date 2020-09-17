---
title: Monitor HAProxy
description: >
  Use the [HAProxy for InfluxDB v2 template](https://github.com/influxdata/community-templates/tree/master/haproxy) to monitor your HAProxy instance.
menu:
  influxdb_cloud:
    parent: Monitor networks
    name: HAproxy
weight: 201
---

Use the [HAProxy for InfluxDB v2 template](https://github.com/influxdata/community-templates/tree/master/haproxy) to monitor your HAProxy instances. First, [apply the template](#apply-the-template), and then [view incoming data](#view-incoming-data).
This template uses the [HAProxy input plugin](/{{< latest "telegraf" >}}/plugins//#haproxy) to collect metrics stored in an HAProxy instance and display these metrics in a dashboard.

The HAProxy for InfluxDB v2 template includes the following:

- one [dashboard](/influxdb/cloud/reference/glossary/#dashboard): **HAProxy**
- one [bucket](/influxdb/cloud/reference/glossary/#bucket): `haproxy`
- label: `haproxy`
- one [Telegraf configuration](/influxdb/cloud/telegraf-configs/): HAProxy input plugin, InfluxDB v2 output plugin
- one variable: `bucket`

## Apply the template

1. Use the [`influx` CLI](/influxdb/cloud/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/haproxy/haproxy.yml
    ```
    For more information, see [influx apply](/influxdb/cloud/reference/cli/influx/apply/).

    > **Note:** Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](/influxdb/cloud/reference/cli/influx/config/).

2. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on a server with network access to both the HAProxy instances and [InfluxDB v2 API](/influxdb/cloud/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/influxdb/cloud/telegraf-configs/), do the following:
    - Set the following environment variables:
      - INFLUX_TOKEN: Token must have permissions to read Telegraf configurations and write data to the `haproxy` bucket. See how to [view tokens](/influxdb/cloud/security/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/influxdb/cloud/organizations/view-orgs/).
      - INFLUX_HOST: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.

4. [Start Telegraf](/influxdb/cloud/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open the **HAProxy** dashboard to start monitoring.
