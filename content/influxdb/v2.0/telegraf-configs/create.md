---
title: Create a Telegraf configuration
description: >
  Use the InfluxDB UI or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
  to create an Telegraf configuration.
weight: 101
menu:
  influxdb_2_0:
    name: Create a config
    parent: Telegraf configurations
related:
  - /influxdb/v2.0/write-data/no-code/use-telegraf/manual-config/
  - /influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/
  - /influxdb/v2.0/telegraf-configs/update/
---
Telegraf has an extensive list of plugins for many different technologies and use cases.
Not all plugins are available through the InfluxDB UI, but you can
[create and upload custom Telegraf configurations](#create-a-custom-telegraf-configuration)
to include any of the available [Telegraf plugins](/{{< latest "telegraf" >}}/plugins/).

Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
to create a Telegraf configuration.

To create a Telegraf configuration, do one of the following:

- [Use the InfluxDB UI](#use-the-influxdb-ui)
- [Use the `influx` CLI](#use-the-influx-cli)
- [Create a custom Telegraf configuration](#create-a-custom-telegraf-configuration)

## Use the InfluxDB UI
Use the InfluxDB UI to automatically generate and store new Telegraf configurations in InfluxDB.
Creating the configuration in the UI lets you select from a list of available technologies and generates a Telegraf configuration to collect metrics from those technologies.
For more information, see [Automatically configure Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/).

## Use the influx CLI
Use the [`influx telegrafs create` command](/influxdb/v2.0/reference/cli/influx/telegrafs/create/)
to upload a Telegraf configuration file from your local machine and create a new Telegraf
configuration in InfluxDB.

Provide the following:

- **Telegraf configuration name**
- **Telegraf configuration description**
- **Telegraf configuration file**

{{% note %}}
If a **name** and **description** are not provided, they are set to empty strings.
{{% /note %}}

<!--  -->
```sh
# Syntax
influx telegrafs create \
  -n <telegraf-config-name> \
  -d <telegraf-config-description> \
  -f /path/to/telegraf.conf

# Example
influx telegrafs create \
  -n "Example Telegraf config"
  -d "This is a description for an example Telegraf configuration."
  -f /path/to/telegraf.conf
```

## Create a custom Telegraf configuration

1. Create a custom Telegraf configuration file that includes the `outputs.influxdb_v2`
   output plugin. _See [Manually configure Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/manual-config/)_
   for more information.
2. Add and customize [Telegraf plugins](/{{< latest "telegraf" >}}/plugins/) and save your changes.
3. [Use the `influx telegrafs create` command](#use-the-influx-cli) to upload your
   custom Telegraf configuration to InfluxDB.
