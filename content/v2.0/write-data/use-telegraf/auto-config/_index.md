---
title: Automatically configure Telegraf
seotitle: Automatically configure Telegraf for InfluxDB v2.0
description: >
  Use the InfluxDB UI to automatically generate a Telegraf configuration,
  then start Telegraf using the generated configuration file.
aliases:
  - /v2.0/collect-data/use-telegraf/auto-config
menu:
  v2_0:
    parent: Use Telegraf
weight: 201
---

The InfluxDB user interface (UI) provides a workflow that automatically creates
Telegraf configuration files based on user-selected Telegraf plugins.
This article describes how to create a Telegraf configuration in the InfluxDB UI and
start Telegraf using the generated configuration file.

{{% note %}}
_View the [requirements](/v2.0/write-data/use-telegraf#requirements)
for using Telegraf with InfluxDB v2.0._
{{% /note %}}

## Create a Telegraf configuration

1. Open the InfluxDB UI _(default: [localhost:9999](http://localhost:9999))_.
2. Click **Load Data** in the left navigation menu.

    {{< nav-icon "load data" >}}

3. Select **Telegrafs**.
4. Click **{{< icon "plus" >}} Create Configuration**.
5. In the **Bucket** dropdown, select the bucket where Telegraf will store collected data.
6. Select one or more of the available plugin groups
   (e.g. **System**, **Docker**, **Kubernetes**, **NGINX**, or **Redis**), and click **Continue**.
   {{% note %}}
   All Telegraf plugins are supported, but only a subset are configurable using the InfluxDB UI.
   To use plugins other than those listed, you must [manually configure Telegraf](/v2.0/write-data/use-telegraf/manual-config).
   {{% /note %}}
7. Review the list of **Plugins to Configure** for configuration requirements.
   Plugins listed with a <span style="color:#32B08C">{{< icon "check" >}}</span>
   require no additional configuration.
   To configure a plugin or access plugin documentation, click the plugin name.
8. Provide a **Telegraf Configuration Name** and an optional **Telegraf Configuration Description**.
9. Click **Create and Verify**.
10. The **Test Your Configuration** page provides instructions for how to start
   Telegraf using the generated configuration.
   _See [Start Telegraf](#start-telegraf) below for detailed information about what each step does._
11. Once Telegraf is running, click **Listen for Data** to confirm Telegraf is successfully
   sending data to InfluxDB.
   Once confirmed, a **Connection Found!** message appears.
12. Click **Finish**. Your Telegraf configuration name and the associated bucket name appears
   in the list of Telegraf configurations.

### Monitor a Windows machine

If you're using Telegraf to monitor a Windows machine, you must complete the following steps.

1. In the list of Telegraf configurations, double-click your Telegraf configuration, and then click **Download Config**.
2. Open the downloaded Telegraf configuration file and replace `[[inputs.processes]]` with
 `[[inputs.win_perf_counters]]` or `[inputs.win_services]]`, depending on your Windows configuration.
3. Save the file and place it in a directory where **Telegraf.exe** can access.

## Start Telegraf

Requests to the [InfluxDB v2 API](/v2.0/reference/api/) must include an authentication token.
A token identifies specific permissions to the InfluxDB instance.

### Configure your token as an environment variable

1. Find your authentication token. _For information about viewing tokens, see [View tokens](/v2.0/security/tokens/view-tokens/)._

2. To configure your token as the `INFLUX_TOKEN` environment variable, run the command appropriate for your operating system and command-line tool:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS or Linux](#)
[Windows PowerShell](#)
[Windows CMD](#)
{{% /tabs %}}

{{% tab-content %}}

```sh
export INFLUX_TOKEN=YourAuthenticationToken
```

{{% /tab-content %}}

{{% tab-content %}}

```sh
$env:INFLUX_TOKEN = “YourAuthenticationToken"
```

{{% /tab-content %}}

{{% tab-content %}}

```sh
set INFLUX_TOKEN=YourAuthenticationToken 
# Make sure to include a space character at the end of this command.
```

{{% /tab-content %}}

{{< /tabs-wrapper >}}

### Start the Telegraf service
Start the Telegraf service using the `-config` flag to specify the URL of your generated configuration file.
Telegraf starts using the Telegraf configuration pulled from InfluxDB API.

{{% note %}}
InfluxDB host URLs and ports differ between InfluxDB OSS and InfluxDB Cloud.
For the exact command, see the Telegraf configuration **Setup Instructions** in the InfluxDB UI.
{{% /note %}}

```sh
telegraf -config http://localhost:9999/api/v2/telegrafs/0xoX00oOx0xoX00o
```

## Manage Telegraf configurations
Create, view, and manage Telegraf configurations in the InfluxDB UI.

{{< children >}}
