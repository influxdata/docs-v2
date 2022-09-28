---
title: Remove a Telegraf configuration
description: >
  Use the InfluxDB UI or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
  to remove Telegraf configurations from InfluxDB.
weight: 104
menu:
  influxdb_2_0:
    name: Remove a config
    parent: Telegraf configurations
aliases:
  - /influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/delete-telegraf-config/
  - /influxdb/v2.0/collect-data/use-telegraf/auto-config/delete-telegraf-config
---

Use the InfluxDB user interface (UI) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/)
to remove Telegraf configurations from InfluxDB.

{{% note %}}
Deleting a Telegraf configuration does not affect _**running**_ Telegraf agents.
However, if an agents stops, it needs a new configuration to start.
{{% /note %}}

To remove a Telegraf configuration, do one of the following:

- [Use the InfluxDB UI](#use-the-influxdb-ui)
- [Use the `influx` CLI](#use-the-influx-cli)

## Use the InfluxDB UI

1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

2. Hover over the configuration you want to delete, click the **{{< icon "trash" "v2" >}}**
   icon, and then click **Delete**.


## Use the influx CLI
Use the [`influx telegrafs rm` command](/influxdb/v2.0/reference/cli/influx/telegrafs/rm/)
to remove a Telegraf configuration from InfluxDB.

Provide the following:

- **Telegraf configuration ID** (shown in the output of `influx telegrafs`)

```sh
# Syntax
influx telegrafs rm -i <telegraf-config-id>

# Example
influx telegrafs rm -i 12ab34de56fg78hi
```
