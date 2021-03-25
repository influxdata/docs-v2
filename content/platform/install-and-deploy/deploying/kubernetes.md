---
title: Deploy InfluxData Platform components in Kubernetes
list_title: Deploy with Kubernetes
description: Deploy the InfluxData Platform components in Kubernetes
menu:
  platform:
    name: Kubernetes
    identifier: deploy-k8s
    parent: deploy-platform
    weight: 4
---

Install and configure the TICK stack—Telegraf, InfluxDB, Chronograf, and Kapacitor—in Kubernetes.

### Use Helm Charts to deploy InfluxData Platform components

InfluxData provides [InfluxData Helm charts](https://github.com/influxdata/helm-charts) to install the platform on Kubernetes.

To install the InfluxDB 2.0 platform, use the following Helm charts:

- [InfluxDB 2.0](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb2)
- [Telegraf](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf)

To install the InfluxDB 1.x platform, use the following Helm charts:

- [Telegraf](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf)
- [InfluxDB 1.x](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb)
- [Chronograf](https://github.com/influxdata/helm-charts/tree/master/charts/chronograf)
- [Kapacitor](https://github.com/influxdata/helm-charts/tree/master/charts/kapacitor)

### Use the InfluxDB Operator

[InfluxDB operator](https://github.com/influxdata/influxdata-operator) is a [Kubernetes operator](https://coreos.com/operators/) that can be used to deploy InfluxDB 1.x OSS in Kubernetes. The InfluxDB operator can handle operational tasks, like creating a backup, automatically. The operator currently has been tested on [AWS's Elastic Kubernetes Service](https://aws.amazon.com/eks/) and [GCP's Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).

[Deploy InfluxDB using the InfluxData operator](https://github.com/influxdata/influxdata-operator)
