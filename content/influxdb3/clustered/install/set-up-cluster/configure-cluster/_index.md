---
title: Configure your InfluxDB cluster
description: >
  InfluxDB Clustered deployments are managed using Kubernetes and configured using
  a YAML configuration file.
menu:
  influxdb3_clustered:
    name: Configure your cluster
    parent: Set up your cluster
weight: 220
aliases:
  - /influxdb3/clustered/install/configure-cluster/
---

InfluxDB Clustered deployments are managed using Kubernetes and configured using
a YAML configuration file. 
Apply configuration settings to your cluster by editing and applying a
Kubernetes custom resource (CRD) called `AppInstance`.
The AppInstance CRD is defined in a YAML file (use the `example-customer.yml`
provided by InfluxData as a template).

We recommend editing the `AppInstance` resource directly as the primary method
for configuring and managing your InfluxDB cluster.
After you have edited your `AppInstance`, use the `kubit` CLI or `kubectl` [deployment tool](/influxdb3/clustered/install/set-up-cluster/configure-cluster/#choose-the-right-deployment-tool-for-your-environment), depending on your requirements.

If you are required to use
[Helm](https://helm.sh/), there is an InfluxDB Clustered Helm chart available
that acts as a wrapper for the `AppInstance` resource and lets you use Helm to
manage configuration changes in your InfluxDB cluster.

{{% expand-wrapper %}}
{{% expand "Choose the right deployment tool for your environment" %}}

| Deployment Tool | Best For | Requirements | Considerations |
|----------------|----------|--------------|----------------|
| [**kubectl**](#when-to-use-kubectl) | Standard deployments | Cluster-wide permissions | Simplest option if you have required permissions |
| [**kubit CLI**](#when-to-use-kubit-cli) | Limited permission environments or air-gapped | Local workstation access | Better for environments with permission restrictions |
| [**Helm**](#when-to-use-helm) | Teams standardized on Helm | Helm installation (includes kubit operator) | Provides consistent deployment with other Helm-managed applications |

### When to use kubectl

Use the `kubectl` approach when:

- You have cluster-wide permissions to install CRDs
- You prefer the simplest deployment method

> [!important]
> 
> #### kubectl requires cluster-wide permissions
>
> InfluxDB Clustered uses an `AppInstance` Kubernetes custom resource (CR) to
> configure and deploy your InfluxDB Cluster. Installing a `CustomResourceDefinition` 
> (CRD) requires cluster-wide permissions, so if you don't have these permissions, 
> `kubectl` may fail.

### When to use kubit CLI

Use the `kubit local apply` CLI approach when:

- You don't have permissions to install CRDs
- You don't have permissions to install operators in the `kubit` namespace
- You don't have permissions to create cluster-wide RBAC
- You're working in an air-gapped environment
- You want to preview generated YAML before applying
- You don't want to run the operator in your cluster

The `kubit local apply` method is specifically designed to avoid having to install the operator in air-gapped environments, making it easier to implement. This approach processes the AppInstance resource on your local machine and then applies the resulting Kubernetes resources directly to the cluster without requiring the kubit operator to be running in the cluster.

### When to use Helm

Use the `Helm` approach when:

- Your team is standardized on Helm for Kubernetes deployments
- You prefer consistent deployment methods across applications
- You want simplified management of the full stack
- You need better support for upgrades and rollbacks

The InfluxDB Clustered Helm chart includes the [kubecfg kubit operator](/influxdb3/clustered/install/set-up-cluster/configure-cluster/use-helm/#kubecfg-kubit-operator).

{{% /expand %}}
{{% /expand-wrapper %}}

{{< children >}}
