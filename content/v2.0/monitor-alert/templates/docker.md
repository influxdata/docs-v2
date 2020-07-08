---
title: Monitor Docker
description: >
  Use the [Docker Monitoring template](https://https://github.com/influxdata/community-templates/tree/master/docker) to monitor your Docker containers.
menu:
  v2_0:
    parent: Monitor with templates
    name: Docker
weight: 202
---

Use the [Docker Monitoring template](https://https://github.com/influxdata/community-templates/tree/master/docker) to monitor your Docker containers.
This template uses the [Docker input plugin](/v2.0/reference/telegraf-plugins/#docker) to collect metrics stored in InfluxDB and display these metrics in a dashboard.

The Docker Monitoring template includes the following:

- one dashboard: **Docker**
- one bucket: `docker, 7d retention`
- labels: Telegraf plugin labels
- one Telegraf configuration: Docker input plugin
- one variable: `bucket`
- four alerts: `Container cpu`, `mem`, `disk`, `non-zero exit`
- one notification endpoint: `Http Post`
- one notification rule: `Crit Alert`

## Apply the template

1. Use the [`influx` CLI](/v2.0/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f hhttps://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml
    ```
    For more information, see [influx apply](/v2.0/reference/cli/influx/apply/).

   > **Note:** Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](https://v2.docs.influxdata.com/v2.0/reference/cli/influx/config/).

2. [Install Telegraf](/telegraf/latest/introduction/installation/) on a server with network access to both the Docker containers and [InfluxDB v2 API](/v2.0/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/v2.0/write-data/no-code/use-telegraf/auto-config/view-telegraf-config/), do the following:
    - Depending on how you run Docker, you may need to customize the [Docker input plugin](/v2.0/reference/telegraf-plugins/#docker) configuration, for example, you may need to specify the `endpoint value`.
    - Set the following environment variables:
      - INFLUX_TOKEN: Token with the permissions to read Telegraf configurations and write data to the `telegraf` bucket. For example, use your master token to get started. See how to [view tokens](/v2.0/security/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/v2.0/organizations/view-orgs/).
      - INFLUX_HOST: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.

4. [Start Telegraf](/v2.0/write-data/no-code/use-telegraf/auto-config/#start-telegraf).
5. View the incoming data. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
6. Open the **Docker** dashboard to start monitoring.
