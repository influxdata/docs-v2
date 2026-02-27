---
title: Enable autoscaling
seotitle: Configure autoscaling for InfluxDB Cloud Dedicated
description: >
  Learn how autoscaling works in InfluxDB Cloud Dedicated and how to
  enable and configure autoscaling limits for your clusters.
menu:
  influxdb3_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 106
influxdb3/cloud-dedicated/tags: [admin, autoscaling, performance]
---

Enable autoscaling to automatically adjust your {{% product-name %}} cluster capacity in response to workload demand.
Autoscaling helps protect performance during spikes while minimizing manual intervention and over-provisioning.

- [What is autoscaling](#what-is-autoscaling)
- [How autoscaling works](#how-autoscaling-works)
- [Enable autoscaling for a cluster](#enable-autoscaling-for-a-cluster)
- [Update or disable autoscaling](#update-or-disable-autoscaling)
- [Monitor autoscaling behavior](#monitor-autoscaling-behavior)

## What is autoscaling

Autoscaling for InfluxDB Cloud Dedicated automatically scales cluster components based on workload demand.
Clusters scale up from a minimum committed size to upper limits you have chosen, and scale back toward the baseline when demand decreases.

With autoscaling, you can:

- **Improve performance**: Scale up automatically during peak loads to maintain ingest and query performance.
- **Increase cost efficiency**: Scale down to your baseline commitment when demand is lower to optimize infrastructure costs.
- **Simplify operations**: Reduce manual interventions needed to resize clusters depending on workload demand.

Autoscaling is generally available for {{% product-name %}} clusters.

## How autoscaling works

Autoscaling for {{% product-name %}} uses Kubernetes autoscaling under the hood and supports independent scaling of cluster components.
In particular, ingest and query components can scale separately based on their respective workloads.

### At a high level

- You have a **baseline configuration** that defines your committed cluster size.
- You select **upper autoscaling limits** for key components (for example, querier and ingester CPU).
- When workload demand increases and resource utilization exceeds thresholds, autoscaling increases resources for the affected components, up to the configured limits.
- When demand drops and capacity is no longer required, autoscaling gradually scales components back toward the baseline.
- Scaling events can be extremely granular, adding as few CPUs and memory as possible and use both CPU and memory as vectors to determine when and how to scale.

Autoscaling does not change other aspects of your contract, such as data retention or feature availability.
 {{% product-name %}} Support will confirm appropriate limits for each cluster.

### Important details

- Autoscaling occurs **only when your workload requires it**. 
- While the cluster runs at or below the baseline configuration, usage is covered by your existing commitment.
- If autoscaling increases resources above the baseline, you may incur **additional usage charges** beyond your committed spend. 

Work with your Account Executive to choose limits that balance performance goals and cost expectations.

## Enable autoscaling for a cluster

To enable autoscaling for a Cloud Dedicated cluster, [contact InfluxData support](https://support.influxdata.com) to review your autoscaling requirements and configure limits.



## Update or disable autoscaling

Autoscaling settings can be adjusted at any time after enablement.
For example, you might raise the upper limit for querier CPU, lower the limit for ingester CPU, or turn autoscaling off entirely.

To update or disable autoscaling for a cluster, [contact InfluxData support](https://support.influxdata.com) and provide:

- Cloud Dedicated account ID and cluster ID.
- Whether you want to:
  - Change autoscaling limits for querier and ingester components, or
  - Disable autoscaling for the cluster.
- Any relevant workload or performance context (for example, new peak load patterns).

## Monitor autoscaling behavior

If autoscaling is enabled, you will be able to see the limits in the cluster card on the overview page of the Admin UI. 

<!-- vale Vale.Terms = NO -->
{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-autoscaling.png" alt="Autoscaling enabled for cluster in Admin UI Cluster Overview page" />}}



After autoscaling is enabled, you can monitor cluster performance and capacity to understand how and when scaling occurs.
If autoscaling is enabled, you can use the same page to monitor CPU allocation, component CPU distribution, and cluster metrics.
  See [Monitor your cluster](/influxdb3/cloud-dedicated/admin/monitor-your-cluster/).


If you see sustained utilization near your autoscaling limits or frequent scaling events during normal workloads, contact your Account Executive or support team to review and adjust limits.

