---
title: Use Grafana with InfluxDB Cloud
description: >
  Use [Grafana](https://grafana.com/) to visualize data from your **InfluxDB Cloud** instance.
menu:
  influxdb_cloud:
    name: Use Grafana
    parent: Tools & integrations
weight: 104
influxdb/cloud/tags: [grafana]
related:
  - https://grafana.com/docs/, Grafana documentation
  - /influxdb/cloud/query-data/get-started/
  - /influxdb/cloud/query-data/influxql/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from InfluxDB Cloud.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
{{% /note %}}

1. [Sign up for {{< cloud-name >}}](/influxdb/cloud/get-started/).
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

    - **URL**: Your [InfluxDB URL](/influxdb/cloud/reference/urls/).

        ```sh
        https://cloud2.influxdata.com/
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/influxdb/cloud/organizations/view-orgs/).
    - **Token**: Your InfluxDB [authentication token](/influxdb/cloud/security/tokens/).
    - **Default Bucket**: The default [bucket](/influxdb/cloud/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/influxdb/2-0-visualize-grafana.png" />}}

2. Click **Save & Test**. Grafana attempts to connect to the InfluxDB datasource
   and returns the results of the test.
{{% /tab-content %}}
<!----------------------------- END FLUX CONTENT ----------------------------->
<!-------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}

## Configure Grafana to use InfluxQL

With **InfluxQL** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/cloud/reference/urls/).

        ```sh
        https://cloud2.influxdata.com
        ```
    - **Access**: Server (default)

2. Under **Auth**, enable **Basic Auth**.
3. Under **Basic Auth Details**, provide your InfluxDB authentication credentials:

    - **User**: InfluxDB username
    - **Password**: InfluxDB [authentication token](/influxdb/cloud/security/tokens/)

4. Under **InfluxDB Details**, do the following:

    - **Database**: Enter the ID of the bucket to query in InfluxDB Cloud. To retrieve your bucket ID, see how to [view buckets](/influxdb/cloud/organizations/buckets/view-buckets/).
    - **User**: Enter the username to sign into InfluxDB.
    - **Password**: Enter the token used to query the bucket above. To retrieve your token, see how to [view tokens](/influxdb/cloud/security/tokens/view-tokens/).

    {{< img-hd src="/img/influxdb/2-0-visualize-grafana-influxql.png" />}}

5. Click **Save & Test**. Grafana attempts to connect to the InfluxDB datasource
   and returns the results of the test.
{{% /tab-content %}}
<!--------------------------- END INFLUXQL CONTENT --------------------------->
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in **{{< cloud-name >}}**.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/influxdb/cloud/query-data/get-started/).
