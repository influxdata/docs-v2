
Use the [HAProxy for InfluxDB v2 template](https://github.com/influxdata/community-templates/tree/master/haproxy) to monitor your HAProxy instances. First, [apply the template](#apply-the-template), and then [view incoming data](#view-incoming-data).
This template uses the [HAProxy input plugin](/telegraf/v1/plugins//#haproxy) to collect metrics stored in an HAProxy instance and display these metrics in a dashboard.

The HAProxy for InfluxDB v2 template includes the following:

- one [dashboard](/influxdb/version/reference/glossary/#dashboard): **HAProxy**
- one [bucket](/influxdb/version/reference/glossary/#bucket): `haproxy`
- label: `haproxy`
- one [Telegraf configuration](/influxdb/version/tools/telegraf-configs/): HAProxy input plugin, InfluxDB v2 output plugin
- one variable: `bucket`

## Apply the template

1. Use the [`influx` CLI](/influxdb/version/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/haproxy/haproxy.yml
    ```
    For more information, see [influx apply](/influxdb/version/reference/cli/influx/apply/).

    > **Note:** Ensure your `influx` CLI is configured with your account credentials and that configuration is active. For more information, see [influx config](/influxdb/version/reference/cli/influx/config/).

2. [Install Telegraf](/telegraf/v1/introduction/installation/) on a server with network access to both the HAProxy instances and [InfluxDB v2 API](/influxdb/version/reference/api/).
3. In your [Telegraf configuration file (`telegraf.conf`)](/influxdb/version/tools/telegraf-configs/), do the following:
    - Set the following environment variables:
      - INFLUX_TOKEN: Token must have permissions to read Telegraf configurations and write data to the `haproxy` bucket. See how to [view tokens](/influxdb/version/admin/tokens/view-tokens/).
      - INFLUX_ORG: Name of your organization. See how to [view your organization](/influxdb/version/admin/organizations/view-orgs/).
      - INFLUX_HOST: Your InfluxDB host URL, for example, localhost, a remote instance, or InfluxDB Cloud.

4. [Start Telegraf](/influxdb/version/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View incoming data

1. In the InfluxDB user interface (UI), select **Dashboards** in the left navigation.

    {{< nav-icon "dashboards" >}}
    
2. Open the **HAProxy** dashboard to start monitoring.
