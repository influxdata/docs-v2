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
2. Click **Organizations** in the left navigation menu.

    {{< nav-icon "orgs" >}}

3. Click on the name of your organization.
4. Click the **Telegraf** tab.
5. Click **{{< icon "plus" >}} Create Configuration**.
6. In the **Bucket** dropdown, select the bucket where Telegraf will store collected data.
7. Select one or more of the available plugin groups
   (e.g. **System**, **Docker**, **Kubernetes**, **NGINX**, or **Redis**), and click **Continue**.
   {{% note %}}
   All Telegraf plugins are supported, but only a subset are configurable using the InfluxDB UI.
   To use plugins other than those listed, you must [manually configure Telegraf](/v2.0/write-data/use-telegraf/manual-config).
   {{% /note %}}
8. Review the list of **Plugins to Configure** for configuration requirements.
   Plugins listed with a <span style="color:#32B08C">{{< icon "check" >}}</span>
   require no additional configuration.
   To configure a plugin or access plugin documentation, click the plugin name.
9. Provide a **Telegraf Configuration Name** and an optional **Telegraf Configuration Description**.
10. Click **Create and Verify**.
11. The **Test Your Configuration** page provides instructions for how to start
   Telegraf using the generated configuration.
   _See [Start Telegraf](#start-telegraf) below for detailed information about what each step does._
12. Once Telegraf is running, click **Listen for Data** to confirm Telegraf is successfully
   sending data to InfluxDB.
   Once confirmed, a **Connection Found!** message appears.
13. Click **Finish**. Your configuration name and the associated bucket name appears
   in the list of Telegraf connections.

## Start Telegraf

### Configure your API token as an environment variable
Requests to the [InfluxDB v2 API](/v2.0/reference/api/) must include an authentication token.
A token identifies specific permissions to the InfluxDB instance.

Define the `INFLUX_TOKEN` environment variable using your token.
_For information about viewing tokens, see [View tokens](/v2.0/security/tokens/view-tokens/)._

```sh
export INFLUX_TOKEN=YourAuthenticationToken
```

### Start the Telegraf service
Start the Telegraf service using the `-config` flag to specify the URL of your generated configuration file.
Telegraf starts using the Telegraf configuration pulled from InfluxDB API.

_See the configuration **Setup Instructions** for the exact command._

```sh
telegraf -config http://localhost:9999/api/v2/telegrafs/0xoX00oOx0xoX00o
```

## Manage Telegraf configurations
Create, view, and manage Telegraf configurations in the InfluxDB UI.

{{< children >}}
