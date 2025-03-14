---
title: Optimize your InfluxDB cluster
description: >
  Test your cluster with a production-like workload and optimize your cluster
  for your workload.
menu:
  influxdb3_clustered:
    name: Optimize your cluster
    parent: Install InfluxDB Clustered
weight: 103
cascade:
  metadata:
    - Install InfluxDB Clustered
    - 'Phase 3: Optimize your cluster'
metadata:
  - Install InfluxDB Clustered
  - Phase 3
---

The goal of this phase of the installation process is to simulate a
production-like workload against your InfluxDB cluster and make changes to
optimize your cluster for your workload.

> [!Note]
> Depending on your requirements, this phase is likely to take the longest of all
> the installation phases.

## Identify performance requirements {note="Recommended"}

Before beginning this process, we recommend identifying performance requirements
and goals--for example:

- Writes per second
- Query concurrency
- Query response time

This gives specific metrics to test for and make adjustments towards.
Consult with [InfluxData support](https://support.influxdata.com) as you make
changes to meet these requirements and goals.

## Phase 3 process

{{< children type="ordered-list" >}}

{{< page-nav prev="/influxdb3/clustered/install/customize-cluster/config/" prevText="Customize cluster configuration" next="/influxdb3/clustered/install/optimize-cluster/design-schema/" nextText="Design your schema" >}}
