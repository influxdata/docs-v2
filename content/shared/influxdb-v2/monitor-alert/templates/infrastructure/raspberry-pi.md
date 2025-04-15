
Use the [Raspberry Pi Monitoring template](https://github.com/influxdata/community-templates/tree/master/raspberry-pi)
to monitor your Raspberry Pi 4 or 400 Linux system.

The Raspberry Pi template includes the following:

- one [bucket](/influxdb/version/reference/glossary/#bucket): `rasp-pi` (7d retention)
- labels: `raspberry-pi` + Telegraf plugin labels
  - [Diskio input plugin](/telegraf/v1/plugins//#diskio) 
  - [Mem input plugin](/telegraf/v1/plugins//#mem) 
  - [Net input plugin](/telegraf/v1/plugins//#net) 
  - [Processes input plugin](/telegraf/v1/plugins//#processes) 
  - [Swap input plugin](/telegraf/v1/plugins//#swap) 
  - [System input plugin](/telegraf/v1/plugins//#system) 
- one [Telegraf configuration](/influxdb/version/tools/telegraf-configs/)
- one [dashboard](/influxdb/version/reference/glossary/#dashboard): Raspberry Pi System
- two variables: `bucket` and `linux_host`

## Apply the template

1. Use the [`influx` CLI](/influxdb/version/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/raspberry-pi/raspberry-pi-system.yml
    ```
    For more information, see [influx apply](/influxdb/version/reference/cli/influx/apply/).
2.  [Install Telegraf](/telegraf/v1/introduction/installation/) on
    your Raspberry Pi and ensure your Raspberry Pi has network access to the
    [InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud{{% /show-in %}} API](/influxdb/version/reference/api/).
3. Add the following environment variables to your Telegraf environment:

    - `INFLUX_HOST`: {{% show-in "v2" %}}Your [InfluxDB URL](/influxdb/version/reference/urls/){{% /show-in %}}
      {{% show-in "cloud,cloud-serverless" %}}Your [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/){{% /show-in %}}
    - `INFLUX_TOKEN`: Your [InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud{{% /show-in %}} API token](/influxdb/version/admin/tokens/)
    - `INFLUX_ORG`: Your InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud{{% /show-in %}} organization name.
    
    ```sh
    export INFLUX_HOST=http://localhost:8086
    export INFLUX_TOKEN=mY5uP3rS3cr3T70keN
    export INFLUX_ORG=example-org
    ```

4. [Start Telegraf](/influxdb/version/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View the incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Click the Raspberry Pi System link to open your dashboard, then select `rasp-pi`
as your bucket and select your linux_host. 
