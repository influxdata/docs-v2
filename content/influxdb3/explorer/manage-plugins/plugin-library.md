---
title: Use the Plugin Library
description: >
  Use InfluxDB 3 Explorer Plugin Library to view and install pre-built InfluxDB
  3 processing engine plugins.
menu:
  influxdb3_explorer:
    name: Plugin Library
    parent: Manage InfluxDB plugins
weight: 101
related:
  - /influxdb3/core/plugins/, InfluxDB 3 Core Processing engine plugins
  - /influxdb3/enterprise/plugins/, InfluxDB 3 Enterprise Processing engine plugins
metadata: [beta]
---

The _InfluxDB Plugin Library_ is a collection of pre-built InfluxDB 3 plugins that
you can install in your InfluxDB 3 server. To view the Plugin library, navigate
to **Manage Plugins** > **Plugin Library** in the left sidebar.

## Search the Plugin Library

To search for plugins in the Plugin library, submit a search term in the search bar.

## Install a plugin

1.  In the **Plugin Library**, locate the plugin you want to install.
2.  Click on the plugin card to open its details.
3.  To install a plugin from {{% product-name %}} select **Install Plugin**:
4.  Provide the following:

    - **Database**: The name of the InfluxDB 3 database to associate the
      plugin with.
    - **Trigger Name**: A unique name for the plugin and trigger combination.
    - **Trigger Type**: The trigger type. What trigger types are available
      depend on the plugin.
      
      _For more information about InfluxDB 3 plugin triggers, see
      [Understand trigger types](/influxdb3/enterprise/plugins/#understand-trigger-types)._
      
      Depending on the selected trigger type, provide the following:

      - **Data Writes (All Tables)**: _no additional configuration options_.
      - **Data Writes (Single Table)**:
        - **Table Name**: The name of the table that, when written to, triggers the plugin to run.
      - **Schedule**:
        - **Frequency**: When to run the plugin using one of the following patterns:
          - `every:<duration>`: Run at specified intervals--for example:
            `every:15m`.
          - `cron:<cron-experssion>`: Run on a cron schedule--for
            example: `cron:0 */12 * * *`.
      - **HTTP Endpoint**:
        - **API Endpoint**: The API endpoint name to use to trigger the plugin--for
          example: `downsample`. To trigger the plugin, you would then send
          a request to the `/api/v3/engine/downsample` endpoint of your InfluxDB
          server to trigger the plugin.
      
      - **Advanced Settings**
        - **Run Asynchronously**: Execute the plugin asynchronously and do not
          wait for a response.
        - **Error Behavior**: Specify the action you want the plugin to take
          when it encounters an error:
            - **Log**: Log the error to your InfluxDB server's logs.
            - **Retry**: Retry the plugin execution.
            - **Disable**: Disable the plugin.

      - **Arguments**: Specific arguments to pass to the Plugin.
        Plugins can have both required and optional arguments.

5.  Click **Deploy** to install the plugin.

### Other plugin installation options

{{% product-name %}} also lets you doe the following:

- **Download Code**: Download the plugin code to view it or modify it for you own use.
- **Copy Install Command** Copy the `influxdb3` CLI command you can use to
  manually install the plugin on your InfluxDB 3 server.
