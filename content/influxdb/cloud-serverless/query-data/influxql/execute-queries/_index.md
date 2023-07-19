---
title: Execute InfluxQL queries
description: >
  Use tools and libraries to query data with InfluxQL stored in InfluxDB Cloud Serverless.
weight: 201
menu:
  influxdb_cloud_serverless:
    name: Execute InfluxQL queries
    parent: Query with InfluxQL
    identifier: influxql-execute-queries
influxdb/cloud-serverless/tags: [query, influxql]
---

There are multiple ways to execute InfluxQL queries with {{< cloud-name >}}.
Choose from the following options:

{{< children type="anchored-list" >}}

{{% note %}}
#### Map databases and retention policies to buckets

Before using InfluxQL, make sure database and retention policy (DBRP)
combinations are mapped to buckets. For more information, see
[Map databases and retention policies to buckets](/influxdb/cloud-serverless/query-data/influxql/dbrp/).
{{% /note %}}

---

{{< children readmore=true hr=true >}}
