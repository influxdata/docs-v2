---
title: Update a Telegraf configuration
seotitle: Update Telegraf configurations in the InfluxDB UI
description: Update the name and description of a Telegraf configuration created in the InfluxDB UI.
menu:
  v2_0:
    parent: Automatically configure Telegraf
weight: 302
---

The InfluxDB user interface (UI) allows you to update the **name** or **description**
of a Telegraf configuration created in the UI.

{{% note %}}
You cannot modify Telegraf settings in existing Telegraf configurations through the UI.
{{% /note %}}

1. Click **Organizations** in the left navigation menu.

    {{< nav-icon "orgs" >}}

2. Click on the **Name** of the organization that owns the configuration you want to delete.
3. Click the **Telegraf** tab.
4. Hover over the configuration you want to edit and click **{{< icon "pencil" >}}**
   to update the name or description.
5. Press Return or click out of the editable field to save your changes.

    {{< img-hd src="/img/2-0-telegraf-config-update.png" />}}
