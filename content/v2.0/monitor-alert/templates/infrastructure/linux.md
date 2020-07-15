---
title: Monitor Linux
description: >
  Use the Linux System Monitoring template to monitor data in a [Linux](https://www.linux.org/) system.
menu:
  v2_0:
    parent: Monitor infrastructure
    name: Linux
weight: 204
---

Use the [Linux System Monitoring template](https://github.com/influxdata/community-templates/tree/master/linux_system) to monitor data in a [Linux](https://www.linux.org/) system. First, [apply the template](#apply-the-template), and then [view incoming data](#view-incoming-data).
This template uses the [Docker input plugin](/v2.0/reference/telegraf-plugins/#docker) to collect metrics stored in InfluxDB and display these metrics in a dashboard.
 
The Linux System Monitoring template includes the following:
 
- one [dashboard](/v2.0/reference/glossary/#dashboard): **Linux System**
- one [bucket](/v2.0/reference/glossary/#bucket): `telegraf, 7d retention`
- two labels: `Linux System Template`, Telegraf Plugin Labels: `inputs.cpu`, `inputs.disk`, `inputs.diskio`, `inputs.kernel`, `inputs.mem`, `inputs.net`, `inputs.processes`, `inputs.swap`, `inputs.system`, `outputs.influxdb_v2`
- two variables: `bucket` and `linux_host`
- one [Telegraf configuration](/v2.0/write-data/no-code/use-telegraf/auto-config/view-telegraf-config/): InfluxDB v2 output plugin, CPU input plugin, Disk input plugin, Diskio input plugin, Kernel input plugin, Mem input plugin, Net input plugin, Processes input plugin, Swap input plugin, and System input plugin

## Apply the template

1. Use the [`influx` CLI](/v2.0/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
    ```
    For more information, see [influx apply](/v2.0/reference/cli/influx/apply/).

    > **Note:** Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](https://v2.docs.influxdata.com/v2.0/reference/cli/influx/config/).

2. [Install Telegraf](/telegraf/latest/introduction/installation/) on a server with network access to both the Linux system and [InfluxDB v2 API](/v2.0/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/v2.0/write-data/no-code/use-telegraf/auto-config/view-telegraf-config/), do the following:
    - Set the following environment variables:
      - INFLUX_TOKEN: Token must have permissions to read Telegraf configurations and write data to the `telegraf` bucket. See how to [view tokens](/v2.0/security/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/v2.0/organizations/view-orgs/).
      - INFLUX_HOST: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.

4. [Start Telegraf](/v2.0/write-data/no-code/use-telegraf/auto-config/#start-telegraf).
5. If you'd like to monitor multiple Linux machines, repeat steps 1-4 for each machine.  

## View incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open the **Linux System** dashboard to start monitoring.

   {{% note %}}
   If you're monitoring multiple Linux machines, switch between them using the `linux_host` filter at the top of the dashboard.
   {{% /note %}}
