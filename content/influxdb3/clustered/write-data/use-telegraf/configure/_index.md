---
title: Configure Telegraf for InfluxDB
seotitle: Configure Telegraf to write data to InfluxDB
description: >
  Telegraf is a plugin-based agent with plugins that are enabled and configured in
  your Telegraf configuration file (`telegraf.conf`).
  Update existing or create new Telegraf configurations to use the `influxdb_v2`
  output plugin to write to InfluxDB.
  Start Telegraf using the custom configuration.
menu:
  influxdb3_clustered:
    name: Configure Telegraf
    parent: Use Telegraf
weight: 101
influxdb3/clustered/tags: [telegraf]
related:
  - /telegraf/v1/plugins/
alt_links:
  cloud: /influxdb/cloud/write-data/no-code/use-telegraf/manual-config/
aliases:
  - /influxdb3/clustered/write-data/use-telegraf/manual-config/
---

Use the Telegraf `influxdb_v2` output plugin to collect and write metrics to
{{< product-name >}}.
Learn how to enable the plugin in new and
existing Telegraf configurations,
and then start Telegraf using the custom configuration file.

> [!Note]
> _View the [requirements](/influxdb3/clustered/write-data/use-telegraf#requirements)
> for using Telegraf with {{< product-name >}}._

<!-- TOC -->

- [Configure Telegraf input and output plugins](#configure-telegraf-input-and-output-plugins)
  - [Add Telegraf plugins](#add-telegraf-plugins)
  - [Enable and configure the InfluxDB v2 output plugin](#enable-and-configure-the-influxdb-v2-output-plugin)
      - [urls](#urls)
      - [token](#token)
      - [organization](#organization)
      - [bucket](#bucket)
      - [Write to InfluxDB v1.x and {{< product-name >}}](#write-to-influxdb-v1x-and-influxdb-clustered)
  - [Other Telegraf configuration options](#other-telegraf-configuration-options)
- [Start Telegraf](#start-telegraf)

## Configure Telegraf input and output plugins

Configure Telegraf input and output plugins in the Telegraf configuration file (typically named `telegraf.conf`).
Input plugins collect metrics.
Output plugins define destinations where metrics are sent.

This guide assumes you followed [Setup instructions](/influxdb3/clustered/get-started/setup/) in the Get Started tutorial
to set up InfluxDB and [configure authentication credentials](/influxdb3/clustered/get-started/setup/?t=Telegraf).

### Add Telegraf plugins

To add any of the available [Telegraf plugins](/telegraf/v1/plugins/), follow the steps below.

1.  Find the plugin you want to enable from the complete list of available
    [Telegraf plugins](/telegraf/v1/plugins/).
2.  Click **View** to the right of the plugin name to open the plugin page on GitHub.
    For example, view the [MQTT plugin GitHub page](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mqtt_consumer/README.md).
3.  Copy and paste the example configuration into your Telegraf configuration file
    (typically named `telegraf.conf`).

### Enable and configure the InfluxDB v2 output plugin

To send data to {{< product-name >}}, enable the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in the `telegraf.conf`.

{{% code-placeholders "DATABASE_NAME" %}}
```toml
[[outputs.influxdb_v2]]
  urls = ["https://{{< influxdb/host >}}"]
  # INFLUX_TOKEN is an environment variable you created for your database WRITE token

  token = "${INFLUX_TOKEN}"
  organization = ""
  bucket = "DATABASE_NAME"
```
{{% /code-placeholders %}}

Replace the following:

- **`DATABASE_NAME`**: the name of the InfluxDB [database](/influxdb3/clustered/admin/databases/) to write data to

The InfluxDB output plugin configuration contains the following options:

##### urls

An array of URL strings.
To write to {{% product-name %}}, include your {{% product-name omit=" Clustered" %}} cluster URL using the HTTPS protocol:

```toml
["https://{{< influxdb/host >}}"]
```

##### token

Your {{% product-name %}} [database token](/influxdb3/clustered/admin/tokens/#database-tokens) with _write_ permission to the database.

In the examples, **`INFLUX_TOKEN`** is an environment variable assigned to a [database token](/influxdb3/clustered/admin/tokens/#database-tokens) that has _write_ permission to the database.

##### organization

For {{% product-name %}}, set this to an empty string (`""`).

##### bucket

The name of the {{% product-name %}} database to write data to.

> [!Note]
> ##### Write to InfluxDB v1.x and {{% product-name %}}
> 
> If a Telegraf agent is already writing to an InfluxDB v1.x database,
> enabling the InfluxDB v2 output plugin will write data to both v1.x and your {{< product-name omit="Clustered" >}} cluster.

### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB 3.

For more plugin options, see [`influxdb`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) on GitHub.

## Start Telegraf

Start the Telegraf service using the `--config` flag to specify the location of your `telegraf.conf`.

```sh
telegraf --config /path/to/custom/telegraf.conf
```
