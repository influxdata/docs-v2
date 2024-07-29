---
title: Configure your InfluxDB cluster
description: >
  InfluxDB Clustered deployments are managed using Kubernetes and configured using
  a YAML configuration file.
menu:
  influxdb_clustered:
    name: Configure your cluster
    parent: Install InfluxDB Clustered
weight: 130
related:
  - /influxdb/clustered/admin/upgrade/
---

InfluxDB Clustered deployments are managed using Kubernetes and configured using
a YAML configuration file. 
Configuration settings applied to your cluster by editing and applying a
Kubernetes custom resource (CRD) called `AppInstance`.
The AppInstance CRD is defined in a YAML file (use example-customer.yml as a
template) or, if using the InfluxDB Clustered Helm chart, is provided by the
chart and configured in a `values.yaml` file.

Use one of the following methods to configure your InfluxDB cluster:

{{< children type="anchored-list" >}}

{{< children >}}
