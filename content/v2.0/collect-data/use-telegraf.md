---
title: Use Telegraf to collect data
weight: 103
seotitle: Use Telegraf to collect and write data
description: >
  Use Telegraf to collect and write data in InfluxDB v2.0. Create Telegraf configurations
  in the InfluxDB UI or manually configure Telegraf.
aliases:
  - /v2.0/collect-data/advanced-telegraf
menu:
  v2_0:
    name : Use Telegraf
    parent: Collect data

---

[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is InfluxData's
data collection agent for collecting and reporting metrics.
Its vast library of input plugins and "plug-and-play" architecture lets you quickly
and easily collect metrics from many different sources.
This article walks through using Telegraf to collect and store data in InfluxDB v2.0.

#### Requirements
- **Telegraf 1.9.2 or greater** installed on the machine from which metrics are collected.
  _For information about installing Telegraf, see the
  [Telegraf Installation instructions](https://docs.influxdata.com/telegraf/latest/introduction/installation/)._

## Configure Telegraf
All Telegraf input and output plugins are enabled and configured in Telegraf's configuration file (`telegraf.conf`).
You have the following options for configuring Telegraf:

- [Create a Telegraf configuration in the InfluxDB user interface (UI)](#create-a-telegraf-configuration-in-the-influxdb-ui)
- [Manually configure Telegraf](#manually-configure-telegraf)

### Create a Telegraf configuration in the InfluxDB UI

1. Open the InfluxDB UI in your web browser
   _(default: [localhost:9999](http://localhost:9999))_.
2. Access the **Telegraf Configurations** page by either of the following paths:
    - Click **Organizations** in the left navigation menu, click on an organization,
      then click the **Telegraf** tab.
    - From the InfluxDB UI landing page, click **Configure a Data Collector**,
      then select the **Telegraf** tab.
3. Click **Create Configuration**.
   The **Data Loading** page appears with the heading "Select Telegraf Plugins to add to your bucket."
4. Select the **Bucket** in which Telegraf will store the collected data.
5. Select one or more of the available "plugin groups"
   (e.g. **System**, **Docker**, **Kubernetes**, **NGINX**, or **Redis**), and click **Continue**.
   {{% note %}}
   All Telegraf plugins are supported, but only a subset are configurable using the InfluxDB UI.
   To use plugins other than those listed, you must [manually configure Telegraf](#manually-configure-telegraf).
   {{% /note %}}
6. Review the list of **Plugins to Configure** for any configuration requirements.
    - Plugins listed with a green checkmarks require no additional configuration steps.
    - To configure a plugin or access plugin documentation, click the plugin name.
    - Click **Continue** on each plugin to cycle through information and continue to the next step.
      Alternatively, you can click **Skip to Verify** to immediately proceed to the next step.
7. The **Test Your Configuration** page provides instructions for how to start
   Telegraf using the generated configuration.
  The [Start Telegraf](#start-telegraf) section below covers these steps in detail.
8. Once Telegraf is running, click **Listen for Data** to confirm Telegraf is successfully
   sending data to InfluxDB.
   Once confirmed, a **Connection Found!** message appears.
9. Click **Finish**. Your configuration name and the associated bucket name appears
   in the list of Telegraf connections.

### Manually configure Telegraf
Configure your Telegraf agents's input and output plugins in your `telegraf.conf`.
[Input plugins](https://docs.influxdata.com/telegraf/v1.9/plugins/inputs/) collect metrics.
[Output plugins](https://docs.influxdata.com/telegraf/v1.9/plugins/outputs/) define destinations to which metrics are sent.

#### Enable and configure the InfluxDB v2 output plugin
To have Telegraf to write data to InfluxDB v2.0, enable in the
[`influxdb_v2` output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md)
in your `telegraf.conf`.

The following settings are required:

##### urls
The URLs of the InfluxDB instances.

##### token
Your InfluxDB v2.0 authorization token.

{{% note %}}
To prevent having InfluxDB authentication tokens stored in plain text in your `config.toml`,
store your token in the `INFLUX_TOKEN` environment variable and read it into your config.
{{% /note %}}

##### organization
The name of the organization to which to write.

##### bucket
The name of the bucket to which to write.

#### Example influxdb_v2 configuration
```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://localhost:9999"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

{{% note %}}
##### Write to InfluxDB v1.x and v2.0
For existing Telegraf agents already writing to an existing InfluxDB v1.x database,
enabling the InfluxDB v2 output plugin will "dual land" data in your InfluxDB v1.x
and InfluxDB v2.0 instances.
{{% /note %}}


## Start Telegraf

### Configure your API token as an environment variable
Requests to the InfluxDB v2.0 API must include an authentication token.
Tokens represents given sets of permissions and grant access to your InfluxDB v2.0 instance.

Define the `INFLUX_TOKEN` environment variable using your token.
For information about viewing tokens, see [View tokens](/v2.0/users/tokens/view-tokens/).

```sh
export INFLUX_TOKEN=YourAuthenticationToken
```

_If creating a configuration through the UI, the setup instructions include this
command with your actual token in place._

### Start the Telegraf service
Start the Telegraf service using the `-config` flag to specify the location of your `telegraf.conf`.
This can be either a file path or a URL.

Each Telegraf configuration generated through the InfluxDB UI is accessible via the InfluxDB v2 API.
The exact command, including the URL, is provided in the **Setup Details** for the configuration.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[URL](#)
[File path](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```sh
telegraf -config http://localhost:9999/api/v2/telegrafs/0xoX00oOx0xoX00o
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```sh
telegraf -config /path/to/custom/telegraf.conf
```
{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}

## Next steps

Now that you have data ready for exploration, you can:

* **Query data.** To get started querying the data stored in InfluxDB buckets using the InfluxDB user interface (UI) and the `influx` command line interface (CLI), see [Query data in InfluxDB](/v2.0/query-data).

* **Process data.** To learn about creating tasks for processing and analyzing data, see [Process data with InfluxDB tasks](/v2.0/process-data)

* **Visualize data.** To learn how to build dashboards for visualizing your data, see [Visualize data with the InfluxDB UI](/v2.0/visualize-data).
