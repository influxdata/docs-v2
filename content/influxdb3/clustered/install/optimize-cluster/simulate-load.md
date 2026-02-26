---
title: Simulate a production-like load
description: >
  Simulate a production-like load that writes data to your InfluxDB cluster.
menu:
  influxdb3_clustered:
    name: Simulate load
    parent: Optimize your cluster
weight: 203
---

With your schema defined you can begin to simulate a production-like load that
writes data to your InfluxDB cluster. This process helps to ensure that your
schema works as designed and that both your cluster's scale and configuration
are able to meet your cluster's write requirements.

> [!Warning]
> Do not write production data to your InfluxDB cluster at this point.

## Load testing tools

Contact your [InfluxData sales representative](https://influxdata.com/contact-sales)
for information about load testing tools.
These tools can simulate your schema and
desired write concurrency to ensure your cluster performs under production-like load.

<!-- TO-DO: Would love to be able to list available tools here -->

## Use your own tools

You can also build and use your own tools to load test a production-like workload.
Use Telegraf, client libraries, or the InfluxDB API to build out tests that
simulate writes to your cluster.

{{< page-nav prev="/influxdb3/clustered/install/optimize-cluster/write-methods/" prevText="Identify write methods" next="/influxdb3/clustered/install/optimize-cluster/optimize-querying/" nextText="Optimize querying" >}}
