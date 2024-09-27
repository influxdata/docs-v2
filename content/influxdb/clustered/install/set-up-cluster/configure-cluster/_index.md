---
title: Configure your InfluxDB cluster
description: >
  InfluxDB Clustered deployments are managed using Kubernetes and configured using
  a YAML configuration file.
menu:
  influxdb_clustered:
    name: Configure your cluster
    parent: Set up your cluster
weight: 220
related:
  - /influxdb/clustered/admin/upgrade/
aliases:
  - /influxdb/clustered/install/configure-cluster/
cascade:
  metadata: ['Install InfluxDB Clustered -- Phase 1: Set up your Cluster']
---

InfluxDB Clustered deployments are managed using Kubernetes and configured using
a YAML configuration file. 
Apply configuration settings to your cluster by editing and applying a
Kubernetes custom resource (CRD) called `AppInstance`.
The AppInstance CRD is defined in a YAML file (use the `example-customer.yml`
provided by InfluxData as a template) or, if using the InfluxDB Clustered Helm
chart, is provided by the chart and configured in a `values.yaml` file.

Use one of the following methods to configure your InfluxDB cluster:

{{< children type="anchored-list" >}}

{{< children >}}
