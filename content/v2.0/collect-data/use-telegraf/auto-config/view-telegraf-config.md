---
title: View a Telegraf configuration
seotitle: View a Telegraf configuration in the InfluxDB UI
description: >
  View the `telegraf.conf` and setup details associated with a Telegraf configuration
  created in the InfluxDB UI.
menu:
  v2_0:
    parent: Automatically configure Telegraf
weight: 301
---

View Telegraf configuration information in the InfluxDB user interface (UI):

1. Click **Organizations** in the left navigation menu.

    {{< nav-icon "orgs" >}}

2. Click the **Name** of the organization that owns the configuration you want to delete.
3. Click the **Telegraf** tab.
4. Hover over a configuration to view options.

    {{< img-hd src="/img/2-0-telegraf-config-view.png" />}}


### View the telegraf.conf
To view the actual `telegraf.conf` associated with the configuration, click **View**.

### View the setup details
To view the setup instructions, click **Setup Details**.
Setup details include commands for adding your InfluxDB authentication token as an environment
variable and starting Telegraf with the specific configuration.
