---
title: View Telegraf configurations
description: >
  Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
  to view and download InfluxDB Telegraf configurations.
weight: 102
menu:
  influxdb_2_0:
    name: View configs
    parent: Telegraf configurations
aliases:
  - /influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/view-telegraf-config/
  - /influxdb/v2.0/collect-data/use-telegraf/auto-config/view-telegraf-config
---

Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
to view and download InfluxDB Telegraf configurations.

To view Telegraf configurations, do one of the following:

- [Use the InfluxDB UI](#use-the-influxdb-ui)
- [Use the `influx` CLI](#use-the-influx-cli)

## Use the InfluxDB UI
In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

{{< nav-icon "load data" >}}

### View and download the telegraf.conf
To view the `telegraf.conf` associated with the configuration,
click the **Name** of the configuration.
Then click **Download Config** to download the file.

### View setup instructions
To view the setup instructions for a Telegraf configuration, click **Setup Instructions**.
Setup instructions include commands for adding your InfluxDB authentication token
as an environment variable and starting Telegraf with the specific configuration.

## Use the influx CLI
Use the [`influx telegrafs` command](/influxdb/v2.0/reference/cli/influx/telegrafs/) to
list Telegraf configurations stored in InfluxDB.

```sh
influx telegrafs
```
