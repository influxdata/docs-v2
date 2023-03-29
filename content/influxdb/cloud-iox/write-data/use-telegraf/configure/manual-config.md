---
title: Manually configure Telegraf
seotitle: Manually configure Telegraf for InfluxDB
description: >
  Update existing or create new Telegraf configurations to use the `influxdb_v2`
  output plugin to write to InfluxDB.
  Start Telegraf using the custom configuration.
menu:
  influxdb_cloud_iox:
    name: Manually
    parent: Configure Telegraf
weight: 202
influxdb/cloud-iox/tags: [telegraf]
related:
  - /{{< latest "telegraf" >}}/plugins//
  - /influxdb/cloud-iox/use-telegraf/telegraf-configs/create/
  - /influxdb/cloud-iox/use-telegraf/telegraf-configs/update/
---

Use the Telegraf `influxdb_v2` output plugin to collect and write metrics into
an InfluxDB {{< current-version >}} bucket.
This article describes how to enable the `influxdb_v2` output plugin in new and
existing Telegraf configurations,
then start Telegraf using the custom configuration file.

{{< youtube qFS2zANwIrc >}}

{{% note %}}
_View the [requirements](/influxdb/cloud-iox/write-data/use-telegraf#requirements)
for using Telegraf with InfluxDB {{< current-version >}}._
{{% /note %}}

## Configure Telegraf input and output plugins

Configure Telegraf input and output plugins in the Telegraf configuration file (typically named `telegraf.conf`).
Input plugins collect metrics.
Output plugins define destinations where metrics are sent.

_See [Telegraf plugins](/{{< latest "telegraf" >}}/plugins/) for a complete list of available plugins._

### Manually add Telegraf plugins

To manually add any of the available [Telegraf plugins](/{{< latest "telegraf" >}}/plugins//), follow the steps below.

1.  Find the plugin you want to enable from the complete list of available
    [Telegraf plugins](/{{< latest "telegraf" >}}/plugins/).
2.  Click **View** to the right of the plugin name to open the plugin page on GitHub.
    For example, view the [MQTT plugin GitHub page](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mqtt_consumer/README.md).
3.  Copy and paste the example configuration into your Telegraf configuration file
    (typically named `telegraf.conf`).

### Enable and configure the InfluxDB v2 output plugin

To send data to an InfluxDB {{< current-version >}} instance, enable in the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in the `telegraf.conf`.

To find an example InfluxDB v2 output plugin configuration in the UI:

1. In the navigation menu on the left, select **Load Data** > **Telegraf**.

    {{< nav-icon "load data" >}}

2. Click **InfluxDB Output Plugin**.
3. Click **Copy to Clipboard** to copy the example configuration or **Download Config** to save a copy.
4. Paste the example configuration into your `telegraf.conf` and specify the options below.

The InfluxDB output plugin configuration contains the following options:

##### urls

An array of URLs for your InfluxDB {{< current-version >}} instances.
See [InfluxDB Cloud regions](/influxdb/cloud-iox/reference/regions/) for
information about which URLs to use.
**{{< cloud-name "short">}} requires HTTPS**.

##### token

Your InfluxDB {{< current-version >}} authorization token.
For information about viewing tokens, see [View tokens](/influxdb/cloud-iox/security/tokens/view-tokens/).

{{% note %}}
###### Avoid storing tokens in `telegraf.conf`

We recommend storing your tokens by setting the `INFLUX_TOKEN` environment
variable and including the environment variable in your configuration file.

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS or Linux](#)
[Windows](#)
{{% /tabs %}}

{{% tab-content %}}
```sh
export INFLUX_TOKEN=YourAuthenticationToken
```
{{% /tab-content %}}

{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[PowerShell](#)
[CMD](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```sh
$env:INFLUX_TOKEN = "YourAuthenticationToken"
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```sh
set INFLUX_TOKEN=YourAuthenticationToken
# Make sure to include a space character at the end of this command.
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

_See the [example `telegraf.conf` below](#example-influxdb_v2-configuration)._
{{% /note %}}

##### organization

The name of the organization that owns the target bucket.

##### bucket

The name of the bucket to write data to.

#### Example influxdb_v2 configuration

The example below illustrates an `influxdb_v2` configuration.

```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

{{% note %}}
##### Write to InfluxDB v1.x and v2.6

If a Telegraf agent is already writing to an InfluxDB v1.x database,
enabling the InfluxDB v2 output plugin will write data to both v1.x and v2.6 instances.
{{% /note %}}

## Add a custom Telegraf configuration to InfluxDB

To add a custom or manually configured Telegraf configuration to your collection
of Telegraf configurations in InfluxDB, use the [`influx telegrafs create`](/influxdb/cloud-iox/reference/cli/influx/telegrafs/create/)
or [`influx telegrafs update`](/influxdb/cloud-iox/reference/cli/influx/telegrafs/update/) commands.
For more information, see:

- [Create a Telegraf configuration](/influxdb/cloud-iox/telegraf-configs/create/#use-the-influx-cli)
- [Update a Telegraf configuration](/influxdb/cloud-iox/telegraf-configs/update/#use-the-influx-cli)

## Start Telegraf

Start the Telegraf service using the `--config` flag to specify the location of your `telegraf.conf`.

```sh
telegraf --config /path/to/custom/telegraf.conf
```
