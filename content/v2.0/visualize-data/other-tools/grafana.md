---
title: Use Grafana with InfluxDB
description: >
  Use [Grafana](https://grafana.com/) to visualize data from **InfluxDB 2.0** and **InfluxDB Cloud**.
menu:
  v2_0:
    name: Use Grafana
    parent: Other visualization tools
weight: 201
v2.0/tags: [grafana]
---

Use [Grafana](https://grafana.com/) to visualize data from **InfluxDB 2.0** and **InfluxDB Cloud**.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
{{% /note %}}

1. [Sign up for {{< cloud-name >}}](/v2.0/get-started/) or
   [start InfluxDB 2.0 OSS](/v2.0/get-started/#start-with-influxdb-oss).
2. [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or
   [download and install Grafana](https://grafana.com/grafana/download).
3. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   `http://localhost:3000` in your browser.
5. In the left navigation of the Grafana UI, hover over the gear
   icon to expand the **Configuration** section. Click **Data Sources**.
6. Click **Add data source**.
7. Select **InfluxDB** from the list of available data sources.

## Configure your InfluxDB 2.0 connection
In the Grafana UI, configure your InfluxDB data source:

1. Enter a **name** for your InfluxDB data source.
2. Under **Query Language**, select **Flux**.
3. Under **Connection**, enter the following:

    - **URL**: Your [InfluxDB URL](/v2.0/reference/urls/) with the `/api/v2` path.

        ```sh
        http://localhost:9999/api/v2
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/v2.0/organizations/view-orgs/).
    - **Token**: Your InfluxDB [authentication token](/v2.0/security/tokens/).
    - **Default Bucket**: The default [bucket](/v2.0/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/2-0-visualize-grafana.png" />}}

4. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.

## Query and visualize data
With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in **InfluxDB 2.0** or **{{< cloud-name >}}**.

[Grafana documentation](https://grafana.com/docs/grafana/latest/).
If you're just learning Flux, see [Getting started with Flux](/v2.0/query-data/get-started/).
