---
title: Replicate with EDR
description: >
  Configure EDR to replicate InfluxDB 3 Enterprise data to another
  Enterprise instance, to InfluxDB 3 Cloud, or to multiple destinations at
  once.
menu:
  influxdb3_enterprise:
    parent: edr
    identifier: edr-replicate
    name: Replicate
weight: 5
---

<!-- ADAPTED_FROM: none — docs-v2 original (site IA scaffolding) -->

Use the following guides to configure EDR replication for your destination.

| Your destination | Guide |
|---|---|
| Another InfluxDB 3 Enterprise instance | [Replicate to InfluxDB 3 Enterprise](/influxdb3/enterprise/edr/replicate/to-enterprise/) |
| InfluxDB 3 Cloud | [Replicate to InfluxDB 3 Cloud](/influxdb3/enterprise/edr/replicate/to-cloud/) |
| Multiple destinations at once | [Replicate to multiple destinations](/influxdb3/enterprise/edr/replicate/to-multiple-destinations/) |

For the full configuration schema, see
[Configuration file reference](/influxdb3/enterprise/edr/reference/config-file/).

{{< children >}}
