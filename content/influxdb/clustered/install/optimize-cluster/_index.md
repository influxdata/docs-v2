---
title: Optimize your InfluxDB cluster
description: >
  ....
menu:
  influxdb_clustered:
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

- Simulate a production-like workload
- Define your schema
- Define your query patterns
- Optimize for your workload:
  - Querying by specific tag values? Partition by those tags.
  - Is your schema wide? SELECT specific columns in queries rather than wildcards.

