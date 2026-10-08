
Use the Telegraf [`influxdb_v3` output plugin](/telegraf/v1/output-plugins/influxdb_v3/)
to collect and write metrics to {{< product-name >}}.
This plugin uses the {{% product-name %}} native HTTP API
[`/api/v3/write_lp` endpoint](/influxdb3/version/write-data/http-api/v3-write-lp/)
and requires **Telegraf 1.38 or greater**.
Learn how to enable and configure the `influxdb_v3` output plugin to write data
to {{% product-name %}}.

If you use an earlier version of Telegraf or bring an existing Telegraf
configuration from InfluxDB v1 or v2, you can use the
[`influxdb_v2`](#use-the-influxdb-v2-output-plugin) or
[`influxdb`](#use-the-influxdb-v1-output-plugin) (v1) output plugins to write
to {{% product-name %}}
[compatibility APIs](/influxdb3/version/write-data/http-api/compatibility-apis/).

> [!Note]
> _View the [requirements](/influxdb3/version/write-data/use-telegraf#requirements)
> for using Telegraf with {{< product-name >}}._

<!-- TOC -->

- [Configure Telegraf input and output plugins](#configure-telegraf-input-and-output-plugins)
  - [Add Telegraf plugins](#add-telegraf-plugins)
  - [Enable and configure the InfluxDB v3 output plugin](#enable-and-configure-the-influxdb-v3-output-plugin)
    - [urls](#urls)
    - [token](#token)
    - [database](#database)
    - [Additional plugin options](#additional-plugin-options)
  - [Use the InfluxDB v2 output plugin](#use-the-influxdb-v2-output-plugin)
  - [Use the InfluxDB v1 output plugin](#use-the-influxdb-v1-output-plugin)
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

### Enable and configure the InfluxDB v3 output plugin

To send data to {{< product-name >}}, enable the
[`influxdb_v3` output plugin](/telegraf/v1/output-plugins/influxdb_v3/)
in the `telegraf.conf`.

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[outputs.influxdb_v3]]
  urls = ["{{< influxdb/host-url >}}"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write data to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

The InfluxDB v3 output plugin configuration contains the following options:

#### urls

An array of URL strings.
To write to {{% product-name %}}, include your {{% product-name %}} URL:

```toml
["{{< influxdb/host-url >}}"]
```

If you specify multiple URLs, Telegraf randomly selects one of them for each
write interval and fails over to another if the write doesn't succeed.

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
> [[outputs.influxdb_v3]]
>   urls = ["{{< influxdb/host-url >}}"]
>   token = "${INFLUX_TOKEN}"
>   # ...
> ```

#### database

The name of the {{% product-name %}} database to write data to.

#### Additional plugin options

The plugin provides additional options for controlling write behavior,
including:

- **`database_tag`**: the metric tag to use to determine the destination
  database, overriding `database`.
- **`sync`**: set to `false` to acknowledge writes before WAL persistence
  completes, which reduces write latency but increases the risk of data loss.
  Default is `true`.
  _See [Use no_sync for immediate write responses](/influxdb3/version/write-data/http-api/v3-write-lp/#use-no_sync-for-immediate-write-responses)._
- **`content_encoding`**: the plugin compresses write request bodies with gzip
  by default.

For all plugin options, see the
[`influxdb_v3` output plugin](/telegraf/v1/output-plugins/influxdb_v3/) reference.

### Use the InfluxDB v2 output plugin

If you bring an existing InfluxDB v2 write workload or use a Telegraf version
earlier than 1.38, use the
[`influxdb_v2` output plugin](/telegraf/v1/output-plugins/influxdb_v2/)
to write to {{< product-name >}} through the InfluxDB
[v2 compatibility API](/influxdb3/version/write-data/http-api/compatibility-apis/#influxdb-v2-compatibility).

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[outputs.influxdb_v2]]
  urls = ["{{< influxdb/host-url >}}"]
  token = "AUTH_TOKEN"
  organization = ""
  bucket = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write data to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}

For {{% product-name %}}, set the following v2-specific options:

- **`organization`**: set to an empty string (`""`).
- **`bucket`**: the name of the database to write data to.

> [!Note]
> An InfluxDB v2 _**bucket**_ is synonymous with an {{% product-name %}} _**database**_.

### Use the InfluxDB v1 output plugin

If you bring an existing InfluxDB v1 write workload, use the
[`influxdb` output plugin](/telegraf/v1/output-plugins/influxdb/)
to write to {{< product-name >}} through the InfluxDB
[v1 compatibility API](/influxdb3/version/write-data/http-api/compatibility-apis/#influxdb-v1-compatibility).

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[outputs.influxdb]]
  urls = ["{{< influxdb/host-url >}}"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  username = "ignored"
  password = "AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write data to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}

For {{% product-name %}}, set the following v1-specific options:

- **`skip_database_creation`**: set to `true`.
  {{% product-name %}} doesn't support creating databases through the v1 API.
- **`password`**: your authorization token.
  The v1 compatibility API authenticates with the token passed as the password
  credential and ignores `username`.

### Other Telegraf configuration options

For more plugin configuration options, see the
[`influxdb_v3`](/telegraf/v1/output-plugins/influxdb_v3/),
[`influxdb_v2`](/telegraf/v1/output-plugins/influxdb_v2/), and
[`influxdb` (v1)](/telegraf/v1/output-plugins/influxdb/) output plugin
references.

## Start Telegraf

Start the Telegraf service using the `--config` flag to specify the location of
your `telegraf.conf`.

```sh
telegraf --config /path/to/custom/telegraf.conf
```
