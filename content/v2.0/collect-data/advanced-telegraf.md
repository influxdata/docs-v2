---
title: Configure Telegraf to collect data into InfluxDB 2.0 OSS
seotitle: Configure Telegraf to collect data into InfluxDB 2.0 OSS
description: >
  Configure a Telegraf plugin to start collecting data from InfluxDB 2.0 OSS
menu:
  v2_0:
    name: Configure Telegraf to collect data
    parent: Collect data
    weight: 2
---



>**Note:**

* Telegraf 1.9.x is required to use the https:// option with Telegraf.
* Currently, not all plugins are supported.
* If you are already have a Telegraf agent running, you can use v. 1.8 or later and add the InfluxDB v2 output plugin to "dual land" data into your existing InfluxDB 1.x and InfluxDB 2.0 instances.
