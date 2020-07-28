---
title: Use Grafana with InfluxDB
description: >
  Use [Grafana](https://grafana.com/) to visualize data from **InfluxDB 2.0** and **InfluxDB Cloud**.
menu:
  v2_0:
    name: Use Grafana
    parent: Other visualization tools
weight: 201
aliases:
  - /v2.0/visualize-data/other-tools/grafana/
v2.0/tags: [grafana]
related:
  - https://grafana.com/docs/, Grafana documentation
  - /v2.0/query-data/get-started/
  - /v2.0/query-data/influxql/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from **InfluxDB 2.0** and **{{< cloud-name "short" >}}**.

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
4. In the left navigation of the Grafana UI, hover over the gear
   icon to expand the **Configuration** section. Click **Data Sources**.
5. Click **Add data source**.
6. Select **InfluxDB** from the list of available data sources.
7. On the **Data Source configuration page**, enter a **name** for your InfluxDB data source.
8. Under **Query Language**, select one of the following:

{{< tabs-wrapper >}}
{{% tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /tabs %}}
<!---------------------------- BEGIN FLUX CONTENT ---------------------------->
{{% tab-content %}}
## Configure Grafana to use Flux
With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **Connection**, enter the following:

    - **URL**: Your [InfluxDB URL](/v2.0/reference/urls/) **with the `/api/v2` path**.

        ```sh
        http://localhost:9999/api/v2
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/v2.0/organizations/view-orgs/).
    - **Token**: Your InfluxDB [authentication token](/v2.0/security/tokens/).
    - **Default Bucket**: The default [bucket](/v2.0/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/2-0-visualize-grafana.png" />}}

2. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.
{{% /tab-content %}}
<!----------------------------- END FLUX CONTENT ----------------------------->
<!-------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}
## Configure Grafana to use InfluxQL

{{% cloud %}}
**{{< cloud-name "short" >}}** supports InfluxQL, but **InfluxDB 2.0 OSS** does not.
{{% /cloud %}}

With **InfluxQL** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB URL](/v2.0/reference/urls/).

        ```sh
        https://cloud2.influxdata.com
        ```
    - **Access**: Server (default)

2. Under **Auth**, enable **Basic Auth**.
3. Under **Basic Auth Details**, provide your InfluxDB authentication credentials:

    - **username**: InfluxDB username
    - **password**: InfluxDB [authentication token](/v2.0/security/tokens/)

4. Under **InfluxDB details**, set the following:

    - **Database**: The database to use when querying InfluxDB 2.0.
      _See [Database and retention policy mapping](/v2.0/reference/api/influxdb-1x/dbrp/)._
    - **HTTP Method**: Select **GET**.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/2-0-visualize-grafana-influxql.png" />}}

5. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.
{{% /tab-content %}}
<!--------------------------- END INFLUXQL CONTENT --------------------------->
{{< /tabs-wrapper >}}

## Query and visualize data
With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in **InfluxDB 2.0** or **{{< cloud-name >}}**.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/v2.0/query-data/get-started/).
