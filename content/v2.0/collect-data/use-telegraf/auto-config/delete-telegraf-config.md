---
title: Delete a Telegraf configuration
seotitle: Delete a Telegraf configuration from the InfluxDB UI
description: Delete a Telegraf configuration created in the InfluxDB UI.
menu:
  v2_0:
    parent: Automatically configure Telegraf
weight: 303
---

To delete a Telegraf configuration:

1. Click the **Settings** tab in the navigation bar.

    {{< nav-icon "settings" >}}

2. Click the **Telegraf** tab.
3. Hover over the configuration you want to delete and click **Delete** on the far right.
4. Click **Confirm**.

    {{< img-hd src="/img/2-0-telegraf-config-delete.png" />}}

{{% note %}}
Deleting a Telegraf configuration does not affect _**running**_ Telegraf agents.
However, if an agents stops, it needs a new configuration to start.
{{% /note %}}
