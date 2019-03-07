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

1. Click **Organizations** in the left navigation menu.

    {{< nav-icon "orgs" >}}

2. Click the **Name** of the organization that owns the configuration you want to delete.
3. Click the **Telegraf** tab.
4. Hover over the configuration you want to delete and click **Delete** on the far right.
5. Click **Confirm**.

    {{< img-hd src="/img/2-0-telegraf-config-delete.png" />}}

{{% note %}}
Deleting a Telegraf configuration does not affect _**running**_ Telegraf agents.
However, if an agents stops, it needs a new configuration to start.
{{% /note %}}
