---
title: Monitor Docker
description: >
  Use the [Docker Monitoring template](https://github.com/influxdata/community-templates/tree/master/docker) to monitor your Docker containers.
menu:
  influxdb_2_1:
    parent: Monitor infrastructure
    name: Docker
weight: 202
---

Use the [Docker Monitoring template](https://github.com/influxdata/community-templates/tree/master/docker) to monitor your Docker containers. First, [apply the template](#apply-the-template), and then [view incoming data](#view-incoming-data).
This template uses the [Docker input plugin](/{{< latest "telegraf" >}}/plugins//#docker) to collect metrics stored in InfluxDB and display these metrics in a dashboard.

The Docker Monitoring template includes the following:

- one [dashboard](/influxdb/v2.1/reference/glossary/#dashboard): **Docker**
- one [bucket](/influxdb/v2.1/reference/glossary/#bucket): `docker, 7d retention`
- labels: Docker input plugin labels
- one [Telegraf configuration](/influxdb/v2.1/telegraf-configs/): Docker input plugin
- one variable: `bucket`
- four [checks](/influxdb/v2.1/reference/glossary/#check): `Container cpu`, `mem`, `disk`, `non-zero exit`
- one [notification endpoint](/influxdb/v2.1/reference/glossary/#notification-endpoint): `Http Post`
- one [notification rule](/influxdb/v2.1/reference/glossary/#notification-rule): `Crit Alert`

For more information about how checks, notification endpoints, and notifications rules work together, see [monitor data and send alerts](/influxdb/v2.1/monitor-alert/).

## Apply the template

1. Use the [`influx` CLI](/influxdb/v2.1/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml
    ```
    For more information, see [influx apply](/influxdb/v2.1/reference/cli/influx/apply/).

    {{% note %}}
Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](/influxdb/v2.1/reference/cli/influx/config/).
    {{% /note %}}

2. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on a server with network access to both the Docker containers and [InfluxDB v2 API](/influxdb/v2.1/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/influxdb/v2.1/telegraf-configs/), do the following:
    - Depending on how you run Docker, you may need to customize the [Docker input plugin](/{{< latest "telegraf" >}}/plugins//#docker) configuration, for example, you may need to specify the `endpoint` value.
    - Set the following environment variables:
      - INFLUX_TOKEN: Token must have permissions to read Telegraf configurations and write data to the `telegraf` bucket. See how to [view tokens](/influxdb/v2.1/security/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/influxdb/v2.1/organizations/view-orgs/).
      - INFLUX_HOST: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.

4. [Start Telegraf](/influxdb/v2.1/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View incoming data

1. In the InfluxDB user interface (UI), select **Dashboards** in the left navigation.

    {{< nav-icon "dashboards" >}}

2. Open the **Docker** dashboard to start monitoring.
