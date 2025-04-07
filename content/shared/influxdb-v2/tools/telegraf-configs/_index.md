
InfluxDB lets you automatically generate Telegraf configurations or upload custom
Telegraf configurations that collect metrics and write them to InfluxDB.
Telegraf retrieves configurations from InfluxDB on startup.

## Use InfluxDB Telegraf configurations
With a Telegraf configuration stored in InfluxDB, the `telegraf` agent can retrieve
the configuration from an InfluxDB HTTP(S) endpoint.

- Ensure Telegraf has network access to InfluxDB (OSS or Cloud).
- Start the `telegraf` agent using the `--config` flag to provide the URL of the
  InfluxDB Telegraf configuration. For example:

    ```sh
    telegraf --config http://localhost:8086/api/v2/telegrafs/<telegraf-config-id>
    ```

{{% note %}}
_[Setup instructions](/influxdb/version/tools/telegraf-configs/view/#view-setup-instructions) for
each Telegraf configuration are provided in the InfluxDB UI._
{{% /note %}}

## Manage Telegraf configurations

{{< children >}}
