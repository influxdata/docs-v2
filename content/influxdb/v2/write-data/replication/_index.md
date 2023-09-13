---
title: Edge Data Replication
seotitle: InfluxDB Edge Data Replication
description: >
  Use InfluxDB Edge Data Replication to replicate local data at the edge to InfluxDB Cloud.
weight: 106
menu:
  influxdb_v2:
    name: Edge data replication
    parent: Write data
---

Running [InfluxDB OSS](/influxdb/v2/install/) at the edge lets you collect, process, transform, and analyze high-precision data locally.
**Edge Data Replication** lets you replicate data from distributed edge environments to [InfluxDB Cloud](/influxdb/cloud/sign-up/), aggregating and storing data for long-term management and analysis.

{{< youtube qsj_TTpDyf4 >}}

{{% note %}}
While replicating data from InfluxDB OSS to InfluxDB Cloud is the most common use case, you may also replicate data from any InfluxDB bucket to a bucket in another InfluxDB instance, for example, InfluxDB OSS, InfluxDB Cloud, or InfluxDB Enterprise.
{{% /note %}}

{{< children >}}
