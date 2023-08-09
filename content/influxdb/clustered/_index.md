---
title: InfluxDB Clustered documentation
description: >
  InfluxDB Clustered is a highly available InfluxDB 3.0 cluster hosted and
  managed on your own hardware.
  The InfluxDB time series platform is designed to handle high write and query loads.
  Learn how to use and leverage InfluxDB Clustered for your specific
  time series use case.
menu:
  influxdb_clustered:
    name: InfluxDB Clustered
weight: 1
---

{{% note %}}
#### Currently in early access

InfluxDB Clustered is currently in early access and only available to a limited
group of InfluxData customers.
If interested in being part of the InfluxDB Clustered early access group,
please contact the [InfluxData Sales team]({{< dedicated-link >}}).
{{% /note %}}

InfluxDB Clustered is a highly available InfluxDB 3.0 cluster hosted and
managed on your own infrastructure.
The InfluxDB time series platform is designed to handle high write and query loads.
Learn how to use and leverage InfluxDB Clustered for your specific
time series use case.

<!-- <a class="btn" href="{{< dedicated-link >}}">Get an InfluxDB Clustered license</a>   -->
<a class="btn" href="/influxdb/clustered/get-started/">Get started with InfluxDB Clustered</a>

## The InfluxDB 3.0 storage engine

The InfluxDB 3.0 storage engine unlocks series limitations present in the Time
Structured Merge Tree (TSM) storage engine.
InfluxDB 3.0 allows infinite series cardinality without any impact on
overall database performance. It also brings with it native
**SQL support** and improved InfluxQL performance.

View the following video for more information about InfluxDB 3.0:

{{< youtube "CzWVcDxmWbM" >}}
