---
title: Create a Telegraf configuration
seotitle: Create a Telegraf configuration
description: >
  Use the InfluxDB UI to create Telegraf configurations for collecting metrics data
menu:
  v2_0:
    name : Create a Telegraf configuration
    parent: Collect data
    weight: 2
---

>**Note:**

* Telegraf 1.9.2 or later must be used
* Telegraf 1.9.x is required to use the `https://` option.
* All plugins are not currently supported. Check back for additional plugin support!
* If you have a Telegraf agent (v. 1.8 or later) running, you can enable the InfluxDB v2 output plugin to "dual land" data using both your existing InfluxDB 1.x and InfluxDB 2.0 instances.

## Create a Telegraf configuration

Follow the steps below to use the InfluxDB UI to create a Telegraf configuration for collecting time series data.

1. Open a web browser to access the InfluxDB 2.0 user interface
   ([localhost:9999](http://localhost:9999)). The login screen appears.
2. Log in using your username and password. The **Getting started with   InfluxDB 2.0** screen appears.
3. To access the **Telegraf Configurations** page, you can use either of the following two paths:
    * Click **Organizations** in the navigation bar on the far left of the page, click on an organization, and then click the **Telegraf** tab.

    OR

    * Click **Configure a Data Collector** and then select the **Telegraf** tab.
4. Click **Create Configuration**. The **Data Loading** page appears with the heading "Select Telegraf Plugins to add to your bucket."
5. Select your predefined **Bucket**, select one or more of the available options (**System**, **Docker**, **Kubernetes**, **NGINX**, or **Redis**), and then click **Continue**. A page with **Plugins to Configure** appears.
6. Review the list of **Plugins to Configure** for any configuration requirements.
    * Plugins listed with a green checks in front require no additional configuration steps.
    * To configure a plugin or access plugin documentation, click the plugin name.
    * Click **Continue** repeatedly to cycle through information on each of the plugins and then continue to the next step. Alternatively, you can click **Skip to Verify** to immediately proceed to the next step.
7. On the **Listen for Telegraf Data** page, complete the three steps to install Telegraf, configure your API Token, and start Telegraf on your local instance.
8. Verify that you have correctly completed the steps by clicking **Listen for Data** (if you don't see this button, scroll down the internal frame or create a larger browser window). A **Connection Found!** message appears.
9. Click **Finish**. Your configuration name
   and the associated bucket name appears in the list of Telegraf connections.

You have configured Telegraf plugins that can collect data and add them to your InfluxDB buckets.

## Next steps

Now that you have a bucket of data ready for exploration, you can:

* **Query data.** To get started querying the data stored in InfluxDB buckets using the InfluxDB user interface (UI) and the `influx` command line interface (CLI), see [Query data in InfluxDB](/v2.0/query-data).

* **Visualize data.** To learn how to build dashboards for visualizing your data, see [Visualize data with the InfluxDB UI](/v2.0/visualize-data).
