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
aliases:
  - /influxdb/clustered/install/configure-cluster/
---

InfluxDB Clustered deployments are managed using Kubernetes and configured using
a YAML configuration file. 
Apply configuration settings to your cluster by editing and applying a
Kubernetes custom resource (CRD) called `AppInstance`.
The AppInstance CRD is defined in a YAML file (use the `example-customer.yml`
provided by InfluxData as a template).

We recommend editing the `AppInstance` resource directly as the primary method
for configuring and managing your InfluxDB cluster. If you are required to use
[Helm](https://helm.sh/), there is a InfluxDB Clustered Helm chart available
that acts as a wrapper for the `AppInstance` resource and lets you use Helm to
manage configuration changes in your InfluxDB cluster.

{{< children >}}
