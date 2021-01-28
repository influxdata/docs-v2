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

2. Hover over the configuration you want to edit and click **{{< icon "pencil" >}}**
   to update the name or description.
3. Press **Return** or click out of the editable field to save your changes.
4. Click on a .
5. The Telegraf configuration will pop up and you can edit settings or add additional Telegraf plugins directly in the editor. Note: The editor here acts as a basic text editor, it will not detect if any plugins or settings are misconfigured. Any errors in your configuration that may cause Telegraf to fail will be displayed when you run Telegraf in the CLI.
6. Click "Save Changes" and confirm that you are okay that these changes to your Telegraf config cannot be undone by clicking "Save".
7. Run your updated Telegraf configuration. You can follow the "Setup Instructions" included below the description of your Telegraf configuration.
Note: Once you have updated your Telegraf configuration in the Influx UI, you must re-run the configuration. Telegraf currently does not detect changes made to a remote configuration.

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

## Customize an existing Telegraf configuration
1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

2. Click the **name** of the Telegraf configuration to customize.
3. Click **Download Config** to download the Telegraf configuration file to your
   local machine.
4. Add or update [Telegraf plugin](/{{< latest "telegraf" >}}/plugins/) settings and
   save your changes.
5. [Use the `influx telegrafs update` command](#use-the-influx-cli) to upload your
   modified Telegraf configuration to InfluxDB and replace the existing configuration.
