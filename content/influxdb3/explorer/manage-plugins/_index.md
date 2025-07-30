---
title: Manage InfluxDB 3 plugins with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to manage InfluxDB 3 processing engine plugins.
menu:
  influxdb3_explorer:
    name: Manage InfluxDB plugins
weight: 5
cascade:
  related:
    - /influxdb3/core/plugins/, InfluxDB 3 Core Processing engine plugins
    - /influxdb3/enterprise/plugins/, InfluxDB 3 Enterprise Processing engine plugins
---

{{% product-name %}} lets you manage plugins in your InfluxDB 3 instance or cluster.
[InfluxDB 3 Processing engine plugins](/influxdb3/enterprise/plugins/) let you
extend your database with custom Python code.
Use {{% product-name %}} to manage plugins in your InfluxDB 3 instance and
install prebuilt plugins from the _Plugin Library_.

Each plugin can define one or more _triggers_—rules that
specify when the plugin should execute. Triggers are typically based on
conditions such as data arriving in a specific table or matching certain
criteria.

- **Data writes** - Process and transform data as it enters the database
- **Scheduled events** - Run code at defined intervals or specific times
- **HTTP requests** - Expose custom API endpoints that execute your code

When a trigger condition is met, InfluxDB 3 automatically runs the associated
plugin code. This enables real-time data processing, enrichment, or alerting
without manual intervention.
Use the InfluxDB 3 Explorer UI to enable, disable, or configure triggers for each plugin.

<!-- TOC -->

- [View installed plugins](#view-installed-plugins)
  - [Filter installed plugins](#filter-installed-plugins)
- [Enable or disable a plugin](#enable-or-disable-a-plugin)
- [View Plugin Logs](#view-plugin-logs)
- [Edit a plugin](#edit-a-plugin)
- [Delete a plugin](#delete-a-plugin)
- [Use the Plugin Library](#use-the-plugin-library)

<!-- /TOC -->

## View installed plugins

To view plugins installed in your InfluxDB 3 server, navigate to
**Manage Plugins** > **Overview**.

1.  Navigate to the **Manage Plugins** > **Overview** section in the left sidebar.
2.  All installed plugins are listed under the _All Plugins_ tab.

### Filter installed plugins

To filter installed plugins by state, use the top tabs to filter by:

- **All Plugins**
- **Running**
- **Stopped**
- **Errors**

You can also use the **search bar** to filter by plugin name.

## Enable or disable a plugin

1.  In the plugin list, locate the desired plugin.

    - **If the plugin is currently running (enabled)**, click {{< icon "pause" >}} to disable the plugin.
    - **If the plugin is currently stopped (disabled)**, click the {{< icon "play" >}} button to enable the plugin.

## View plugin logs

1. In the plugin list, locate the desired plugin.
2. Click **Logs** to view the most recent logs output by the plugin.
3. To view more log entries, click **View More**.
4. To export the logs, click **Export**.

## Edit a plugin

1. In the plugin list, locate the desired plugin.
2. Click **Edit**.
3. Edit the plugins settings.
4. Click **Save**.

> ![Note]
> #### Editing a plugin removes and recreates the plugin
>
> When editing an InfluxDB 3 plugin, InfluxDB 3 Explorer removes and recreates
> the plugin using the updated settings.

## Delete a plugin

1. In the plugin list, locate the desired plugin.
2. Click the **{{< icon "trash" >}} button** to delete the plugin.
3. Confirm that you want to delete the plugin.

{{< children hlevel="h2" >}}
