---
title: Scrape Prometheus metrics
seotitle: Scape Prometheus metrics into InfluxDB
weight: 205
description: >
  Use Telegraf or Flux to scrape Prometheus-formatted metrics
  from an HTTP-accessible endpoint and store them in InfluxDB.
menu:
  influxdb_cloud:
    name: Scrape Prometheus metrics
    parent: Developer tools
related:
  - /{{< latest "telegraf" >}}/plugins/#prometheus, Telegraf Prometheus input plugin
  - /{{< latest "flux" >}}/prometheus/scrape-prometheus/
  - /{{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/
  - /{{< latest "flux" >}}/prometheus/metric-types/
influxdb/v2.0/tags: [prometheus]
---

{{< duplicate-oss >}}