
Use the Telegraf [`influxdb_v2` output plugin](/telegraf/v1/output-plugins/influxdb_v2/)
to collect and write metrics to {{< product-name >}}.
This plugin uses the InfluxDB v2 HTTP API write endpoint available with 
{{% product-name %}}.
Learn how to enable and configure the `influxdb_v2` output plugin to write data
to {{% product-name %}}.

> [!Note]
> _View the [requirements](/influxdb3/version/write-data/use-telegraf#requirements)
> for using Telegraf with {{< product-name >}}._

<!-- TOC -->

- [Configure Telegraf input and output plugins](#configure-telegraf-input-and-output-plugins)
  - [Add Telegraf plugins](#add-telegraf-plugins)
  - [Enable and configure the InfluxDB v2 output plugin](#enable-and-configure-the-influxdb-v2-output-plugin)
    - [urls](#urls)
    - [token](#token)
    - [organization](#organization)
    - [bucket](#bucket)
  - [Other Telegraf configuration options](#other-telegraf-configuration-options)
- [Start Telegraf](#start-telegraf)

## Configure Telegraf input and output plugins

Configure Telegraf input and output plugins in the Telegraf configuration file
(typically named `telegraf.conf`).
Input plugins collect metrics.
Output plugins define destinations where metrics are sent.

This guide assumes you have already [installed {{% product-name %}}](/influxdb3/version/install/)
and have been through the [getting started guide](/influxdb3/version/get-started/).

### Add Telegraf plugins

To add any of the available [Telegraf plugins](/telegraf/v1/plugins/), follow
the steps below.

1.  Find the plugin you want to enable from the complete list of available
    [Telegraf plugins](/telegraf/v1/plugins/).
2.  Click **View** to the right of the plugin name to open the plugin page on GitHub.
    For example, view the [MQTT plugin GitHub page](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mqtt_consumer/README.md).
3.  Copy and paste the example configuration into your Telegraf configuration file
    (typically named `telegraf.conf`).

### Enable and configure the InfluxDB v2 output plugin

To send data to {{< product-name >}}, enable the
[`influxdb_v2` output plugin](/telegraf/v1/output-plugins/influxdb_v2/)
in the `telegraf.conf`.

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```toml
[[outputs.influxdb_v2]]
  urls = ["http://{{< influxdb/host >}}"]
  token = "AUTH_TOKEN"
  organization = ""
  bucket = "DATABASE_NAME"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write data to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

The InfluxDB output plugin configuration contains the following options:

#### urls

An array of URL strings.
To write to {{% product-name %}}, include your {{% product-name %}} URL:

```toml
["http://{{< influxdb/host >}}"]
```

#### token

Your {{% product-name %}} authorization token.

> [!Tip]
>
> ##### Store your authorization token as an environment variable
>
> To prevent a plain text token in your Telegraf configuration file, we
> recommend that you store the token as an environment variable and then
> reference the environment variable in your configuration file using string
> interpolation. For example:
> 
> ```toml
> [[outputs.influxdb_v2]]
>   urls = ["http://{{< influxdb/host >}}"]
>   token = "${INFLUX_TOKEN}"
>   # ...
> ```

#### organization

For {{% product-name %}}, set this to an empty string (`""`).

#### bucket

The name of the {{% product-name %}} database to write data to.

> [!Note]
> An InfluxDB v2 _**bucket**_ is synonymous with an {{% product-name %}} _**database**_.

### Other Telegraf configuration options

For more plugin configuration options, see the
[`influxdb_v2` output plugin README](/telegraf/v1/output-plugins/influxdb_v2/)
on GitHub.

## Start Telegraf

Start the Telegraf service using the `--config` flag to specify the location of
your `telegraf.conf`.

```sh
telegraf --config /path/to/custom/telegraf.conf
```
