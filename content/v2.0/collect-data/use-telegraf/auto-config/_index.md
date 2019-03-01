---
title: Automatically configure Telegraf
seotitle: Automatically configure Telegraf for InfluxDB v2.0
description: >
  Use the InfluxDB UI to automatically generate a Telegraf configuration,
  then start Telegraf using the generated configuration.
menu:
  v2_0:
    parent: Use Telegraf
weight: 201
---

The InfluxDB user interface (UI) provides a workflow that automatically creates
Telegraf configuration files based on user-selected Telegraf Plugins.
This article walks through creating a Telegraf configuration in the InfluxDB UI and
then starting Telegraf using the generated configuration file.

{{% note %}}
_View the [requirements](/v2.0/collect-data/use-telegraf#requirements)
for using Telegraf with InfluxDB v2.0._
{{% /note %}}

## Create a Telegraf configuration in the InfluxDB UI

1. Open the InfluxDB UI in your web browser
   _(default: [localhost:9999](http://localhost:9999))_.
2. Access the **Telegraf Configurations** page by either of the following paths:
    1. Click **Organizations** in the left navigation menu.

        {{< nav-icon "orgs" >}}

        Click on an organization, then click the **Telegraf** tab.

    2. From the InfluxDB UI landing page, click **Configure a Data Collector**,
      then select the **Telegraf** tab.
3. Click **{{< icon "plus" >}} Create Configuration**.
4. From the **Bucket** dropdown, select the bucket in which Telegraf will store the collected data.
5. Select one or more of the available "plugin groups"
   (e.g. **System**, **Docker**, **Kubernetes**, **NGINX**, or **Redis**), and click **Continue**.
   {{% note %}}
   All Telegraf plugins are supported, but only a subset are configurable using the InfluxDB UI.
   To use plugins other than those listed, you must [manually configure Telegraf](/v2.0/collect-data/use-telegraf/manual-config).
   {{% /note %}}
6. Review the list of **Plugins to Configure** for any configuration requirements.
   Plugins listed with a green checkmarks require no additional configuration steps.
   To configure a plugin or access plugin documentation, click the plugin name.
7. Provide a **Telegraf Configuration Name** and an optional **Telegraf Configuration Description**.
8. Click **Create and Verify**.
9. The **Test Your Configuration** page provides instructions for how to start
   Telegraf using the generated configuration.
   _See [Start Telegraf](#start-telegraf) below for detailed information about what each step does._
10. Once Telegraf is running, click **Listen for Data** to confirm Telegraf is successfully
   sending data to InfluxDB.
   Once confirmed, a **Connection Found!** message appears.
11. Click **Finish**. Your configuration name and the associated bucket name appears
   in the list of Telegraf connections.

## Start Telegraf

### Configure your API token as an environment variable
Requests to the InfluxDB v2.0 API must include an authentication token.
Tokens represent given sets of permissions and grant access to your InfluxDB v2.0 instance.

Define the `INFLUX_TOKEN` environment variable using your token.
_For information about viewing tokens, see [View tokens](/v2.0/users/tokens/view-tokens/)._

```sh
export INFLUX_TOKEN=YourAuthenticationToken
```

### Start the Telegraf service
Start the Telegraf service using the `-config` flag to specify the URL of your generated configuration file.
Telegraf will pull the configuration file from the InfluxDB API and start using the configured settings.

_The exact command, including the URL, is provided in the **Setup Details** for the configuration._

```sh
telegraf -config http://localhost:9999/api/v2/telegrafs/0xoX00oOx0xoX00o
```

## Manage Telegraf configurations
Telegraf configurations created through the InfluxDB UI can be viewed and managed
through the UI as well.

{{< children >}}
