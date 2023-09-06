---
title: High availability with InfluxDB
description: >
  High availability clustering is not available with InfluxDB OSS v1.8, but is
  available with InfluxDB Enterprise.
menu:
  influxdb_v1:
    name: High availability
    weight: 100
aliases:
  - /influxdb/v1/clustering/
  - /influxdb/v1/clustering/cluster_setup/
  - /influxdb/v1/clustering/cluster_node_config/
  - /influxdb/v1/guides/clustering/
  - /influxdb/v1/high_availability/clusters/
related:
  - /{{< latest "enterprise_influxdb" >}}/introduction/installation/
  - /{{< latest "enterprise_influxdb" >}}/concepts/clustering/
canonical: /{{< latest "enterprise_influxdb" >}}/introduction/installation/
---

InfluxDB OSS {{< current-version >}} does **not** support clustering.
For high availability or horizontal scaling of InfluxDB, use the commercial
clustered offering, [InfluxDB Enterprise](/{{< latest "enterprise_influxdb" >}}/).

- For information about creating an InfluxDB Enterprise cluster, see
  [Install an InfluxDB Enterprise cluster](/{{< latest "enterprise_influxdb" >}}/introduction/installation/).

- To learn more about high availability clustering, see
  [Clustering in InfluxDB Enterprise](/{{< latest "enterprise_influxdb" >}}/concepts/clustering/).
