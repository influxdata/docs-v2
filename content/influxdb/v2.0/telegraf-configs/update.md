---
title: Update a Telegraf configuration
description: >
  Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
  to update InfluxDB Telegraf configurations.
weight: 103
menu:
  influxdb_2_0:
    name: Update a config
    parent: Telegraf configurations
aliases:
  - /influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/update-telegraf-config/
  - /influxdb/v2.0/collect-data/use-telegraf/auto-config/update-telegraf-config
---

Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
to update InfluxDB Telegraf configurations.

To update a Telegraf configuration, do one of the following:

- [Use the InfluxDB UI](#use-the-influxdb-ui)
- [Use the `influx` CLI](#use-the-influx-cli)
- [Customize an existing Telegraf configuration](#customize-an-existing-telegraf-configuration)

## Use the InfluxDB UI

1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

2. To update the name or description:
  - Hover over the configuration you want to edit and click **{{< icon "pencil" >}}**
   to update the name or description.
  - Press **Return** or click out of the editable field to save your changes.
4. To edit the configuration file:
  - Click the name of the configuration.
  - Add or update [Telegraf plugin settings](/telegraf/latest/plugins/) in the window that appears.
  {{% note %}}
  The text editor window doesn't detect if any plugins or settings are misconfigured. Any errors in your configuration that may cause Telegraf to fail will be displayed when you run Telegraf in the CLI.
  {{% /note %}}
  - Click **Save Changes** and then **Save** again to confirm.
5. Run your updated Telegraf configuration using the `-config` flag. To find the exact command for your configuration file, click **Setup Instructions** from the **Telegraf** page.

## Use the influx CLI
Use the [`influx telegrafs update` command](/influxdb/v2.0/reference/cli/influx/telegrafs/update/)
to update an existing InfluxDB Telegraf configuration name, description, or settings
from a Telegraf configuration file on your local machine.

Provide the following:

- **Telegraf configuration ID** (shown in the output of `influx telegrafs`)
- **Telegraf configuration name**
- **Telegraf configuration description**
- **Telegraf configuration file**

{{% warn %}}
If a **name** and **description** are not provided, they are replaced with empty strings.
{{% /warn %}}

<!--  -->
```sh
# Syntax
influx telegrafs update \
  -i <telegraf-config-id> \
  -n <telegraf-config-name> \
  -d <telegraf-config-description> \
  -f /path/to/telegraf.conf

# Example
influx telegrafs update \
  -i 12ab34de56fg78hi
  -n "Example Telegraf config"
  -d "This is a description for an example Telegraf configuration."
  -f /path/to/telegraf.conf
```
