---
title: Create scrapable endpoints
seotitle: Create scrapable endpoints for InfluxDB
description: placeholder
menu:
  v2_0:
    parent: Scrape data
weight: 202
v2.0/tags: [scraper]
---

InfluxDB scrapers can collect data from any HTTP/S-accessible endpoint, provided the returned data
is in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
The links below provide information about the Prometheus data format as well
as tools and clients that will generate Prometheus-formatted metrics for you.

## Prometheus Node Exporter
The [Prometheus Node Exporter](https://github.com/prometheus/node_exporter) exposes
a wide variety of hardware- and kernel-related metrics for **\*nix** systems.

##### Helpful links
[Monitoring linux host metrics with the Node Exporter](https://prometheus.io/docs/guides/node-exporter/)  

## Prometheus exporters and integrations
[Prometheus exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/)
export Prometheus metrics from third-party systems or services.

##### Helpful links
[List of third-party exporters](https://prometheus.io/docs/instrumenting/exporters/#third-party-exporters)  
[Write a custom Prometheus exporter](https://prometheus.io/docs/instrumenting/writing_exporters/)  

## Prometheus client libraries
[Prometheus client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)
instrument applications for each of their respective languages.
Application metrics are output to an HTTP/S endpoint from which they can be scraped.

##### Helpful links
[Instrumenting a Go application for Prometheus](https://prometheus.io/docs/guides/go-application/)  
[Write Prometheus client libraries](https://prometheus.io/docs/instrumenting/writing_clientlibs/)  
