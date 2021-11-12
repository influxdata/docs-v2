---
title: Monitor vSphere
description: >
  Use the [vSphere Dashboard for InfluxDB v2 template](https://github.com/influxdata/community-templates/tree/master/vsphere) to monitor your vSphere host.
menu:
  influxdb_2_1:
    parent: Monitor infrastructure
    name: vSphere
weight: 206
---

Use the [vSphere Dashboard for InfluxDB v2 template](https://github.com/influxdata/community-templates/tree/master/vsphere) to monitor your vSphere host. First, [apply the template](#apply-the-template), and then [view incoming data](#view-incoming-data).
This template uses the [Docker input plugin](/{{< latest "telegraf" >}}/plugins//#docker) to collect metrics stored in InfluxDB and display these metrics in a dashboard.

The Docker Monitoring template includes the following:

- one [dashboard](/influxdb/v2.1/reference/glossary/#dashboard): **vsphere**
- one [bucket](/influxdb/v2.1/reference/glossary/#bucket): `vsphere`
- label: vsphere
- one [Telegraf configuration](/influxdb/v2.1/telegraf-configs/): InfluxDB v2 output plugin, vSphere input plugin
- one variable: `bucket`

## Apply the template

1. Use the [`influx` CLI](/influxdb/v2.1/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/vsphere/vsphere.yml
    ```
    For more information, see [influx apply](/influxdb/v2.1/reference/cli/influx/apply/).

    {{% note %}}
Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](/influxdb/v2.1/reference/cli/influx/config/).
    {{% /note %}}

2. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on a server with network access to both the vSphere host and [InfluxDB v2 API](/influxdb/v2.1/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/influxdb/v2.1/telegraf-configs/), do the following:
    - Set the following environment variables:
      - INFLUX_TOKEN: Token must have permissions to read Telegraf configurations and write data to the `telegraf` bucket. See how to [view tokens](/influxdb/v2.1/security/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/influxdb/v2.1/organizations/view-orgs/).
      - INFLUX_HOST: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.
      - INFLUX_BUCKET: Bucket to store data in. To use the bucket included, you must export the variable: `export INFLUX_BUCKET=vsphere`
4.    - Set the host address to the vSphere and provide the `username` and `password` as variables:
        ```sh
        vcenters = [ "https://$VSPHERE_HOST/sdk" ]
        username = "$vsphere-user"
        password = "$vsphere-password"
        ```

4. [Start Telegraf](/influxdb/v2.1/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View incoming data

1. In the InfluxDB user interface (UI), select **Dashboards** in the left navigation.

    {{< nav-icon "dashboards" >}}

2. Open the **vsphere** dashboard to start monitoring.
