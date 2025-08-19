
[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is a data
collection agent for collecting and reporting metrics.
Its vast library of input plugins and "plug-and-play" architecture lets you
quickly and easily collect metrics from many different sources.

For a list of available plugins, see [Telegraf plugins](/telegraf/v1/plugins/).

#### Requirements

- **Telegraf 1.9.2 or greater**.
  _For information about installing Telegraf, see the
  [Telegraf Installation instructions](/telegraf/v1/install/)._

## Basic Telegraf usage

Telegraf is a plugin-based agent with plugins that are enabled and configured in
your Telegraf configuration file (`telegraf.conf`).
Each Telegraf configuration must **have at least one input plugin and one output plugin**.

Telegraf input plugins retrieve metrics from different sources.
Telegraf output plugins write those metrics to a destination.

Use the [`outputs.influxdb_v2`](/telegraf/v1/plugins/#output-influxdb_v2) plugin
to connect to the InfluxDB v2 write API included in {{% product-name %}} and
write metrics collected by Telegraf to {{< product-name >}}.

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}

```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://{{< influxdb/host >}}"]
  token = "AUTH_TOKEN"
  organization = ""
  bucket = "DATABASE_NAME"

# ...
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write data to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

_See how to [Configure Telegraf to write to {{% product-name %}}](/influxdb3/version/write-data/use-telegraf/configure/)._

## Use Telegraf with InfluxDB

{{< children >}}

{{< influxdbu "telegraf-102" >}}
