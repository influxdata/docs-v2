---
title: End-of-Life of Native Collector - MQTT
description: >
  InfluxData has made a strategic decision to end-of-life (EOL) the
  Native Collector - MQTT feature that is currently available in
  InfluxDB Cloud (TSM) on **April 30th, 2024**.
menu:
  influxdb_cloud_ref:
    parent: Service notices
    name: EOL - Native Collector - MQTT
weight: 101
---

InfluxData has made a strategic decision to end-of-life (EOL) the
Native Collector - MQTT feature that is currently available in InfluxDB Cloud (TSM).
This EOL will take effect **April 30th, 2024**, after which this feature will be
completely removed from InfluxDB Cloud (TSM) and will no longer be supported. 

Please refer to the FAQ below for more details and guidance on alternate
solutions currently available.

- [What is the Native Collector - MQTT Feature?](#what-is-the-native-collector---mqtt-feature)
- [Why is this feature being EOL'd?](#why-is-this-feature-being-eold)
- [What alternatives are available in light of this EOL announcement?](#what-alternatives-are-available-in-light-of-this-eol-announcement)
- [What are the expected next steps?](#what-are-the-expected-next-steps)
- [Will I lose any data already ingested?](#will-i-lose-any-data-already-ingested)
- [Where can I get more information on using Telegraf as a replacement for Native Collector - MQTT?](#where-can-i-get-more-information-on-using-telegraf-as-a-replacement-for-native-collector---mqtt)

### What is the Native Collector - MQTT Feature?

The Native Collector - MQTT feature was introduced in InfluxDB Cloud in 2022 as
a way to ingest data directly from MQTT sources into InfluxDB Cloud.
This feature has been removed and is no longer available to new customers or
existing customers who have not been using it.
It was only available to a limited number of existing customers who were
actively using it.

### Why is this feature being EOL'd?

The adoption of this feature was lower than anticipated given most customers
continued to use [Telegraf](/telegraf/v1/), InfluxData’s data collection agent,
which provides more features for MQTT ingestion than this feature did.
After a thorough assessment, we determined that our customers can have a similar
(and even superior) experience using the
[MQTT Consumer Telegraf input plugin](https://www.influxdata.com/integration/mqtt-telegraf-consumer/).

### What alternatives are available in light of this EOL announcement?

We recommend using [Telegraf](/telegraf/v1/) with the [MQTT Consumer Telegraf input plugin](https://www.influxdata.com/integration/mqtt-telegraf-consumer/)
as an alternative to the Native Collector - MQTT feature.

Telegraf is InfluxData’s popular open source data collection agent that comes with 300+ plugins for data input and output,
including MQTT.

### What are the expected next steps?

The Native Collector - MQTT feature will continue to work and function until
**April 30th, 2024**.
In the meantime, we won't release any new enhancements to the feature.
After the EOL date, we will decommission the feature, and any MQTT subscriptions that you have will no
longer receive and ingest data into InfluxDB.

### Will I lose any data already ingested?

No, data already written to InfluxDB will not be affected by this change.

### Where can I get more information on using Telegraf as a replacement for Native Collector - MQTT?

See [MQTT Consumer Telegraf input plugin](https://www.influxdata.com/integration/mqtt-telegraf-consumer/).
