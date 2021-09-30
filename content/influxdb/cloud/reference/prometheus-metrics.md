---
title: Prometheus metric parsing formats
description: >
  When scraping [Prometheus-formatted metrics](https://prometheus.io/docs/concepts/data_model/)
  and writing them to InfluxDB Cloud, metrics are parsed and stored in InfluxDB in different formats.
menu:
  influxdb_cloud_ref:
    name: Prometheus metrics
weight: 8
influxdb/v2.0/tags: [prometheus]
related:
  - https://prometheus.io/docs/concepts/data_model/, Prometheus data model
  - /influxdb/cloud/write-data/developer-tools/scrape-prometheus-metrics/
  - /{{< latest "telegraf" >}}/plugins/#prometheus, Telegraf Prometheus input plugin
  - /{{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/
---

{{< duplicate-oss >}}