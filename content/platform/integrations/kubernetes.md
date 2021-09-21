---
title: Kubernetes
description: Deploy InfluxDB OSS in Kubernetes and monitor Kubernetes
menu:
  platform:
    name: Kubernetes
    parent: integrate-platform
---

[Kubernetes](https://kubernetes.io/) is a popular way to deploy and manage containers across multiple servers and cloud providers.

{{% note %}}
This page is about using Kubernetes with the TICK stack and 1.x versions of InfluxDB. To install InfluxDB 2.0 and Kubernetes, see the **Kubernetes** tab in [Install InfluxDB 2.0](/influxdb/v2.0/install/).
{{% /note %}}

Use InfluxData platform and Kubernetes to do the following:

- [Monitor Kubernetes](#monitor-kubernetes)
  - [Use the kube-influxdb project](#use-the-kube--influxdb-project)
  - [Collect Kubernetes metrics with Telegraf](#collect-kubernetes-metrics-with-telegraf)
  - [Use the Prometheus remote read and write API](#use-the-prometheus-remote-read-and-write-api)
- [Deploy the TICK stack in Kubernetes](#deploy-the-tick-stack-in-kubernetes)
  - [Helm Charts](#helm-charts)
  - [K8s Operator](#k8s-operator)
  - [Solutions for Kubernetes services](#solutions-for-kubernetes-services)
- [Frequently asked questions](#frequently-asked-questions)
  - [How is the InfluxData Platform (TICK) different from Prometheus?](#how-is-the-influxdata-platform-tick-different-from-prometheus)
  - [Should I run InfluxDB in Kubernetes?](#should-i-run-influxdb-in-kubernetes)

## Monitor Kubernetes

Use the TICK stack to monitor services that make up a Kubernetes cluster, whether you're running InfluxDB in a Kubernetes cluster or somewhere else. Do the following to monitor Kubernetes:

- Use the [kube-influxdb project](#kube--influxdb-project)
- [Collect Kubernetes metrics with Telegraf](#collect-kubernetes-metrics-with-telegraf)
- [### Use the Prometheus remote read and write API](#use-the-prometheus-remote-read-and-write-api)

### Use the kube-influxdb project

The [kube-influxdb](https://github.com/influxdata/kube-influxdb) project is a
set of Helm charts to make collection and visualization of Kubernetes metrics
easy. It uses Telegraf, the metrics collection agent, to collect metrics and
events and includes a set of pre-configured Chronograf dashboards.

See the [kube-influxdb Getting Started guide](https://github.com/influxdata/kube-influxdb/blob/master/docs/v1.0/getting_started.md).

### Collect Kubernetes metrics with Telegraf

Use [Telegraf](/{{< latest "telegraf" >}}/introduction/getting-started/) to collect metrics in a Kubernetes cluster, including [Docker container metrics](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/docker/README.md)
and [stats from kubelets](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kubernetes). Or use Telegraf to scrape [Prometheus metrics API endpoints](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/prometheus).
Telegraf is used in the [kube-influxdb project](#kube-influxdb-kubernetes-monitoring-project)
to collect metrics.

See [Set up a Kubernetes monitoring architecture using Telegraf](https://www.influxdata.com/blog/monitoring-kubernetes-architecture/).

### Use the Prometheus remote read and write API

Use the Prometheus remote read and write API for clusters already using Prometheus for metrics collection. For more information, see [Prometheus remote read and write API support in InfluxDB](/{{< latest "influxdb" "v1" >}}/supported_protocols/prometheus/).

## Deploy the TICK stack in Kubernetes

To install and configure the open source TICK stack--Telegraf, InfluxDB, Chronograf, and Kapacitor--in Kubernetes, do one of the following:

- [Use Helm charts](#use-helm-charts)
- [Use K8s operator](#use-k8s-operator)
- [Use solutions for Kubernetes services](#use-solutions-for-kubernetes-services)

### Use Helm charts

InfluxData maintains [Helm charts](https://github.com/influxdata/helm-charts) for setting up data collection and monitoring in Kubernetes using InfluxDB and related applications.

### Use K8s operator

The [InfluxData operator](https://github.com/influxdata/influxdata-operator) is
a [Kubernetes operator](https://coreos.com/operators/). Use the InfluxData operator to deploy InfluxDB in Kubernetes and handle operational tasks automatically, like creating a backup. The operator has been tested on [AWS's Elastic Kubernetes Service](https://aws.amazon.com/eks/) and [GCP's Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).

[Deploy InfluxDB using the InfluxData
operator](https://github.com/influxdata/influxdata-operator)

### Use solutions for Kubernetes services

InfluxData maintains ways to deploy the InfluxData Platform components to popular Kubernetes service providers.

- [TICK Stack on the AWS Container Marketplace](https://aws.amazon.com/marketplace/pp/B07KGM885K?qid=1544514373950&sr=0-18&ref_=srh_res_product_title)
- [Telegraf, InfluxDB, and Grafana on the GCP Marketplace](https://console.cloud.google.com/marketplace/details/influxdata-public/telegraf-influxdb-grafana?q=telegraf)

## Frequently asked questions

### How is the InfluxData platform (TICK) different from Prometheus?

InfluxDB is specifically built to handle time series data. InfluxDB handles string data types and event data that occurs in irregular intervals, including structured logs, application events, and tracing data.

### How should I run InfluxDB in Kubernetes?

InfluxData provides several [ways to deploy InfluxDB in Kubernetes](/platform/install-and-deploy/deploying/kubernetes/). For a declarative way to deploy InfluxDB, we recommend exploring the [Terraform InfluxDB module](https://registry.terraform.io/modules/influxdata/influxdb/aws/1.0.4).
