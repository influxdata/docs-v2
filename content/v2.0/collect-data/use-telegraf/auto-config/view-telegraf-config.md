---
title: View a Telegraf configuration
seotitle: View a Telegraf configuration in the InfluxDB UI
description: >
  View the `telegraf.conf` and setup instructions associated with a Telegraf configuration
  created in the InfluxDB UI.
menu:
  v2_0:
    parent: Automatically configure Telegraf
weight: 301
---

View Telegraf configuration information in the InfluxDB user interface (UI):

1. Click the **Settings** tab in the navigation bar.

    {{< nav-icon "settings" >}}

2. Click the **Telegraf** tab.
3. Hover over a configuration to view options.

    {{< img-hd src="/img/2-0-telegraf-config-view.png" />}}


### View and download the telegraf.conf
To view the actual `telegraf.conf` associated with the configuration,
click the **Name** of the configuration.
Then click **Download Config** to download the file.

### View the setup instructions
To view the setup instructions, click **Setup Instructions**.
Setup instructions include commands for adding your InfluxDB authentication token
as an environment variable and starting Telegraf with the specific configuration.
