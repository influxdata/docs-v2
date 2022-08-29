---
title: Edge Data Replication
seotitle: InfluxDB Edge Data Replication
description: >
  Use InfluxDB Edge Data Replication to replicate local data at the edge to InfluxDB Cloud InfluxDB.
weight: 106
menu:
  influxdb_2_4:
    name: Replicate data
    parent: Write data
---

Running [InfluxDB OSS](/influxdb/v2.4/install/) at the edge lets you collect, 
process, transform, and analyze high-precision data locally. 
**Edge Data Replication** lets you replicate data from distributed edge 
environments to [InfluxDB Cloud](/influxdb/cloud/sign-up/), aggregating and 
storing data for long-term management and analysis.

{{< youtube qsj_TTpDyf4 >}}

{{< children >}}

{{% note %}}
To replicate data from InfluxDB OSS to a remote InfluxDB OSS instance, see
[Replicate data to a remote InfluxDB instance](/influxdb/v2.4/write-data/replication/replicate-data).
{{% /note %}}