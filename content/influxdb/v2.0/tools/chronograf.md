---
title: Use Chronograf with InfluxDB OSS
description: >
  Use [Chronograf](/chronograf/) to visualize data from your **InfluxDB OSS 2.0** instance.
menu:
  influxdb_2_0:
    name: Use Chronograf
    parent: Tools & integrations
weight: 103
related:
  - /{{< latest "chronograf" >}}/
---

Use [Chronograf](/{{< latest "chronograf" >}}/) to visualize data from **InfluxDB Cloud** and **InfluxDB OSS 2.0**.
Chronogaf uses the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/)
so you can continue to use InfluxQL in your dashboards and when exploring data.

{{% note %}}
#### Limited InfluxQL support
InfluxDB Cloud and InfluxDB OSS 2.0 support InfluxQL **read-only** queries.
For more information, see [InfluxQL support](/influxdb/v2.0/query-data/influxql/#influxql-support),
{{% /note %}}

## Create an InfluxDB connection
1. Click **Configuration** in the left navigation bar, and then click **{{< icon "plus" >}} Add Connection**.
2. Enter your InfluxDB connection credentials:
    - **Connection URL:** InfluxDB URL _(see [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
      or [InfluxDB OSS URLs](/influxdb/v2.0/reference/urls/))_

      ```
      http://localhost:8086
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration.
    - **Username:** InfluxDB username
    - **Password:** InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)
    - **Telegraf Database Name:** Default database name
    - **Default Retention Policy:** Default retention policy

    {{% note %}}
#### DBRPs map to InfluxDB buckets
In InfluxDB Cloud and InfluxDB OSS 2.0, database/retention-policy (DBRP) combinations
are mapped to buckets using the `database-name/retention-policy` naming convention.
For more information, see [DBRP mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)
and [Map unmapped buckets](/influxdb/v2.0/query-data/influxql/#map-unmapped-buckets).
    {{% /note %}}

3. Click **Add Connection**
4. Select any dashboards you would like to create and then click **Next**.
5. Configure a Kapacitor connection and then click **Continue**.
   If you do not wish to create a Kapacitor connection, click **Skip**.
   _For more information about using Kapacitor with InfluxDB Cloud or InfluxDB OSS 2.0,
   see [Use Kapacitor with InfluxDB](/influxdb/v2.0/tools/kapacitor/)._
6. Click **Finish**.
