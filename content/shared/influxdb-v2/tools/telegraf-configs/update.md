
Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/version/reference/cli/influx/)
to update InfluxDB Telegraf configurations.

To update a Telegraf configuration, do one of the following:

- [Use the InfluxDB UI](#use-the-influxdb-ui)
- [Use the `influx` CLI](#use-the-influx-cli)

{{% note %}}
Telegraf doesn't detect changes to remote configurations. If you edit a remote configuration, you must restart Telegraf or send it a SIGHUP command for your changes to take effect.
{{% /note %}}

## Use the InfluxDB UI

### Update the name or description  of a configuration

1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

2. Hover over the configuration you want to edit and click **{{< icon "pencil" >}}**
   to update the name or description.
3. Press **Return** or click out of the editable field to save your changes.

### Edit the configuration file directly in the UI

1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

2. To edit the configuration file:
  a. Click the name of the configuration.
  b. Add or update [Telegraf plugin settings](/telegraf/v1/plugins/) in the window that appears.
  {{% note %}}
  The text editor window doesn't detect if any plugins or settings are misconfigured. Any errors in your configuration that may cause Telegraf to fail when you restart it.
  {{% /note %}}
  c. Click **Save Changes** and then **Save** again to confirm.
3. To apply the updated configuration, restart Telegraf. To find the exact command to start Telegraf, click **Setup Instructions** on the **Telegraf** page.

### Download and verify the configuration file

1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

2. Click the **name** of the Telegraf configuration to customize.
3. Click **Download Config** to download the Telegraf configuration file to your
   local machine.
4. Review the configuration file. Add or update [Telegraf plugin](/telegraf/v1/plugins/) settings and
   save your changes.
5. [Use the `influx telegrafs update` command](#use-the-influx-cli) to upload your
   modified Telegraf configuration to InfluxDB and replace the existing configuration.
6. To apply the updated configuration, restart Telegraf. To find the exact command to start Telegraf, click **Setup Instructions** on the **Telegraf** page.

## Use the influx CLI

Use the [`influx telegrafs update` command](/influxdb/version/reference/cli/influx/telegrafs/update/)
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
