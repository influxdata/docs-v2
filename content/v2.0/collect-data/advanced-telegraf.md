---
title: Collect metrics using Telegraf
seotitle: Create a Telegraf configuration to collect system metrics
description: >
  Create a Telegraf configuration to collect system metrics
menu:
  v2_0:
    name : Collect metrics using Telegraf
    parent: Collect data
    weight: 2
---

>**Note:**

* Telegraf 1.9.2 or later must be used
* Telegraf 1.9.x is required to use the `https://` option.
* All plugins are not currently supported. Check back for additional plugin support!
* If you have a Telegraf agent (v. 1.8 or later) running, you can enable the InfluxDB v2 output plugin to "dual land" data using both your existing InfluxDB 1.x and InfluxDB 2.0 instances.

## Configure a Telegraf connection to use the System Telegraf plugins

Follow the steps below to configure your Telegraf plugins and connection for
collecting system statistics.

1. Open a web browser to your InfluxDB 2.0 instance [localhost:9999](http://localhost:9999).
   The login screen for the UI (user interface) appears.
2. Log in using your username and password. The **Getting started with InfluxDB 2.0** screen appears.
3. Click **Configure a Data Collector**. A new dialog appears with the **Telegraf** selected.
4. Click **Create Configuration**. The **Data Loading** page appears with the heading **Select Telegraf Plugins to add to your bucket**.
5. Select your predefined **Bucket**, click the **System** option, and then
   click **Continue**. A page with **Plugins to Configure** appears.
6. Review the list of **Plugins to Configure**. Click **Continue** repeatedly to cycle through
   information on each of the System plugins and then continue to the next step. Alternatively, click **Skip to Verify** to immediately proceed to the next step.
7. On the **Listen for Telegraf Data** page, follow the three listed steps to install Telegraf,
   configure your API Token, and start Telegraf on your local instance.
8. Verify that you correctly completed these steps by clicking **Listen for Data** (if you don't
   see this, scroll down the internal frame). A "Connection Found!" message appears.
9. After verifying your new connection, click **Finish**. Your configuration name
   and the associated bucket name appears in the list of Telegraf connections.

After configuring your Telegraf plugins and connection, you can create a dashboard
that displays your system statistics.

## Create a dashboard to display system statistics

The steps below will guide you to creating a dashboard and adding a cell that
displays a system measurement that your InfluxDB 2.0 server instance is now collecting.

1. Click **Dashboards** in the navigation bar on the left. You should see the
   **Dashboards** page that lists any existing dashboards.
2. Click **Create Dashboard**. A new dashboard appears.
3. Click **Name this Dashboard** and enter a name (for example, "System Stats").
4. Click **Add Cell**. A new page appears to define a cell to appear in your
   new dashboard.
5. Click **Name this Cell** and enter a cell name (for example, "Maximum CPU Usage").
6. In the lower left, select the bucket that is collecting your system statistics.
   Under **_measurement**, a listing of available measurements appears.
7. Click **cpu**. A new **_field** listing appears.
8. Scroll down the list and select **usage_system**. A new **cpu** listing appears.
9. In the **cpu** listing, select **cpu-total**.
10. In the **AGGREGATE FUNCTIONS** listing on the right, select **max**.
11. Click **Submit**, located above **AGGREGATE FUNCTIONS**. A line graph displaying
    recently collected data appears.
12. To finish adding the cell, click the green box with a check symbol (located in the
    upper right of the page). Your new dashboard with one cell now appears.

You have now created a dashboard with one cell displaying a system measurement based on
data collected using the Telegraf plugins and connection that you configured. You can
continue to explore the new time series data being collected in your bucket by creating
new cells and trying out different visualizations and cell displays.

For more information on creating InfluxDB 2.0 dashboards, see [Visualize data with InfluxDB](http://v2.dpcs.influxdata.com/v2.0/visualize-data/).
