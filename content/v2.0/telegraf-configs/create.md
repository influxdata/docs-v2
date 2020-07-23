---
title: Create a Telegraf configuration
description: >
  Use the InfluxDB UI and the [`influx` CLI](/v2.0/reference/cli/influx/)
  to create new InfluxDB Telegraf configurations.
weight: 101
menu:
  v2_0:
    name: Create a config
    parent: Telegraf configurations
related:
  - /v2.0/write-data/no-code/use-telegraf/manual-config/
  - /v2.0/write-data/no-code/use-telegraf/auto-config/
  - /v2.0/telegraf-configs/update/
---

Use the InfluxDB user interface (UI) and the [`influx` CLI](/v2.0/reference/cli/influx/)
to create new InfluxDB Telegraf configurations.

- [Use the InfluxDB UI](#use-the-influxdb-ui)
- [Use the `influx` CLI](#use-the-influx-cli)
- [Create custom InfluxDB Telegraf configurations](#create-custom-influxdb-telegraf-configurations)

## Use the InfluxDB UI
Use the InfluxDB UI to automatically generate and store new Telegraf configurations in InfluxDB.
The Telegraf configuration creation in the UI process lets you select from popular
technologies and generates a Telegraf configuration to collect metrics from those technologies.
For more information, see [Automatically configure Telegraf](/v2.0/write-data/no-code/use-telegraf/auto-config/).

Telegraf has an extensive list of plugins for many different technologies and use cases.
Not all options are available through the InfluxDB UI, but you can
[create and upload custom Telegraf configurations to InfluxDB](#create-custom-influxdb-telegraf-configurations).

## Use the influx CLI
Use the [`influx telegrafs create` command](/v2.0/reference/cli/influx/telegrafs/create/)
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

## Create custom InfluxDB Telegraf configurations
To create and upload a custom Telegraf configuration to InfluxDB:

1. Create a custom Telegraf configuration file that includes the `outputs.influxdb_v2`
   output plugin. _See [Manually configure Telegraf](/v2.0/write-data/no-code/use-telegraf/manual-config/)_
   for more information.
2. Add and customize [Telegraf plugins](/v2.0/reference/telegraf-plugins) and save your changes.
3. [Use the `influx telegrafs create` command](#use-the-influx-cli) to upload your
   custom Telegraf configuration to InfluxDB.
