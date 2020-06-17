---
title: Delete a Telegraf configuration
seotitle: Delete a Telegraf configuration from the InfluxDB UI
description: Delete a Telegraf configuration created in the InfluxDB UI.
aliases:
  - /v2.0/collect-data/use-telegraf/auto-config/delete-telegraf-config
menu:
  v2_0:
    parent: Automatically configure Telegraf
weight: 303
---

To delete a Telegraf configuration:

1. In the navigation menu on the left, select **Data** (**Load Data**) > **Telegraf**.

    {{< nav-icon "load data" >}}

3. Hover over the configuration you want to delete, click the **{{< icon "trash" >}}**
   icon, and click **Delete**.

{{% note %}}
Deleting a Telegraf configuration does not affect _**running**_ Telegraf agents.
However, if an agents stops, it needs a new configuration to start.
{{% /note %}}
