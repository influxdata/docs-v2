---
title: Use Grafana with InfluxDB OSS
description: >
  Use [Grafana](https://grafana.com/) to visualize data from your **InfluxDB** instance.
menu:
  influxdb_2_0:
    name: Use Grafana
    parent: Tools & integrations
weight: 104
influxdb/v2.0/tags: [grafana]
aliases:
  - /influxdb/v2.0/visualize-data/other-tools/
related:
  - https://grafana.com/docs/, Grafana documentation
  - /influxdb/v2.0/query-data/get-started/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB** instance.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
{{% /note %}}

1. [Start InfluxDB OSS 2.0](/influxdb/v2.0/get-started/).
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
{{% tab-content %}}
## Configure Grafana to use Flux

With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **Connection**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/v2.0/reference/urls/).

        ```sh
        http://localhost:8086/
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/influxdb/v2.0/organizations/view-orgs/).
    - **Token**: Your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/).
    - **Default Bucket**: The default [bucket](/influxdb/v2.0/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/influxdb/2-0-visualize-grafana.png" />}}

2. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.
{{% /tab-content %}}
<!----------------------------- END FLUX CONTENT ----------------------------->
<!-------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}
## Configure Grafana to use InfluxQL

With **InfluxQL** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/v2.0/reference/urls/).

        ```sh
        http://localhost:8086/
        ```
    - **Access**: Server (default)

2. Under **Custom HTTP Headers**, select **Add Header**. Provide your InfluxDB authentication credentials:

    - **Header**: "Authorization"
    - **Value**: use the `Token` schema and provide your [InfluxDB authentication token](/influxdb/v2.0/security/tokens/) (for example: `Token y0uR5uP3rSecr3tT0k3n`)

4. Under **InfluxDB Details**, do the following:

    - **Database**: Enter the ID of the bucket to query in InfluxDB 2.0. To retrieve your bucket ID, see how to [view buckets](/influxdb/v2.0/organizations/buckets/view-buckets/).
    - **User**: Enter the username to sign into InfluxDB.
    - **Password**: Enter the token used to query the bucket above. To retrieve your token, see how to [view tokens](/influxdb/v2.0/security/tokens/view-tokens/).
    - **HTTP Method**: Select **GET**.

    {{< img-hd src="/img/influxdb/2-0-visualize-grafana-influxql.png" />}}

5. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.
{{% /tab-content %}}
<!--------------------------- END INFLUXQL CONTENT --------------------------->
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in your **InfluxDB** instance.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/influxdb/v2.0/query-data/get-started/).
