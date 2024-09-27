---
title: Set up your InfluxDB cluster
description: >
  Get a basic InfluxDB cluster up and running with as few external
  dependencies as possible and confirm you can write and query data.
menu:
  influxdb_clustered:
    name: Set up your cluster
    parent: Install InfluxDB Clustered
weight: 101
metadata: ['Install InfluxDB Clustered -- Phase 1']
---

The first phase of installing InfluxDB Clustered is to get a basic InfluxDB
cluster up and running with as few external dependencies as possible and confirm
you can write and query data.

{{< children type="ordered-list" >}}


- Use internal admin authorization to bypass the need to integrate with an
  identity provider. This is a temporary measure while setting and testing your
  cluster. Before moving into production, you will

{{< page-nav next="/influxdb/clustered/install/set-up-cluster/prerequisites/" nextText="Set up prerequisites" >}}
