---
title: InfluxDB Cloud Dedicated documentation
description: >
  InfluxDB Cloud Dedicated is a hosted and managed InfluxDB Cloud cluster
  dedicated to a single tenant.
  The InfluxDB time series platform is designed to handle high write and query loads.
  Learn how to use and leverage InfluxDB Cloud Dedicated for your specific
  time series use case.
menu:
  influxdb_cloud_dedicated:
    name: InfluxDB Cloud Dedicated
weight: 1
---

InfluxDB Cloud Dedicated is a hosted and managed InfluxDB Cloud cluster
dedicated to a single tenant.
The InfluxDB time series platform is designed to handle high write and query loads.
Learn how to use and leverage InfluxDB Cloud Dedicated for your specific
time series use case.

<a class="btn" href="{{< dedicated-link >}}">Request an InfluxDB Cloud Dedicated cluster</a>  
<a class="btn" href="/influxdb/cloud-dedicated/get-started/">Get started with InfluxDB Cloud Dedicated</a>

## The InfluxDB IOx storage engine

**InfluxDB IOx** is InfluxDB's next generation storage engine that unlocks series
limitations present in the Time Structured Merge Tree (TSM) storage engine.
InfluxDB IOx allows infinite series cardinality without any impact on
overall database performance. It also brings with it native
**SQL support** and improved InfluxQL performance.

View the following video for more information about InfluxDB IOx:

{{< youtube "CzWVcDxmWbM" >}}

{{% code-placeholders "(DATABASE|API)_(NAME|TOKEN|ENDPOINT)" %}}
```sh
INFLUX_DATABASE=DATABASE_NAME
INFLUX_TOKEN=DATABASE_TOKEN
INFLUX_ENDPOINT=API_ENDPOINT
```
{{% /code-placeholders %}}

```sh
INFLUX_DATABASE=DATABASE_NAME
INFLUX_TOKEN=DATABASE_TOKEN
INFLUX_ENDPOINT=API_ENDPOINT
```
