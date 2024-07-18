---
title: Configure your InfluxDB cluster using Helm
description: >
  ...
menu:
  influxdb_clustered:
    name: Use Helm
    parent: Configure your cluster
weight: 230
---

The [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered)
provides an alternative method for deploying your InfluxDB cluster using
[Helm](https://helm.sh/). When using Helm, apply configuration options in the
`values.yaml` file provided by the Helm chart.