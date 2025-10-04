---
title: Use Grafana with InfluxDB Enterprise
seotitle: Use Grafana with InfluxDB Enterprise v1.8
description: >
  Configure Grafana to query and visualize data from InfluxDB Enterprise v1.8.
menu:
  enterprise_influxdb_v1:
    name: Grafana
    weight: 60
    parent: Tools
canonical: /influxdb/v2/tools/grafana/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB Enterprise** cluster.

> [!Note]
> #### Required
> - The instructions in this guide require **Grafana Cloud** or **Grafana v10.3+**.
>   For information about using InfluxDB with other versions of Grafana,
>   see the [Grafana documentation](https://grafana.com/docs/grafana/latest/datasources/influxdb/).
> - To use **Flux**, use **InfluxDB 1.8.1+** and [enable Flux](/enterprise_influxdb/v1/flux/installation/)
>   in your InfluxDB data nodes.

- [Install Grafana](#install-grafana)
- [Create an InfluxDB data source](#create-an-influxdb-data-source)
- [Query and visualize data](#query-and-visualize-data)

## Install Grafana

1. [Set up an InfluxDB Enterprise cluster](/enterprise_influxdb/v1/introduction/installation/).
2. [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or
   [download and install Grafana](https://grafana.com/grafana/download).
3. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   <http://localhost:3000> in your browser.

> [!Note]
> #### Query language support
> - InfluxQL is supported in InfluxDB Enterprise v1.8.x and later.
> - Flux is supported in InfluxDB Enterprise v1.8.1 and later.
> - SQL is only supported in InfluxDB 3.

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar
2. Click **Data sources**
3. In the **Data sources** page, click **Add new data source**
4. In the **Add data source** page, locate and click the **InfluxDB** card

   The InfluxDB configuration page displays with four numbered sections in the left sidebar:

   1. **URL and authentication**
   2. **Database settings**
   3. **Private data source connect**
   4. **Save & test**
5. Click **Add new connection**
6. Locate and click the **InfluxDB** card

   The InfluxDB configuration page displays with four numbered sections in the left sidebar.

7. **Name**: Enter a descriptive name for your data source
8. **URL**: Enter your InfluxDB Enterprise URL or load balancer URL: `http://localhost:8086`
9. **Product**: From the dropdown, select **InfluxDB Enterprise 1.x**
10. **Query Language**: Select **InfluxQL** or **Flux**

   After selecting your query language, section 2 (Database settings) displays fields specific to your selection.

### Configure database settings

The fields in this section change based on your query language selection.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxQL](#)
[Flux](#)                 
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------- BEGIN INFLUXQL CONTENT -------------------------->

## Configure Grafana to use InfluxQL

When you select **InfluxQL** as the query language, configure the following:

- **Database**: Your database name
- **User**: Your InfluxDB username _(if [authentication is enabled](/enterprise_influxdb/v1/administration/authentication_and_authorization/))_
- **Password**: Your InfluxDB password _(if [authentication is enabled](/enterprise_influxdb/v1/administration/authentication_and_authorization/))_

{{< img-hd src="/img/influxdb3/enterprise-v1-grafana-product-dropdown-flux.png" alt="InfluxQL configuration for InfluxDB Enterprise 1.x" />}}

Click **Save & Test**. Grafana attempts to connect to InfluxDB Enterprise and returns the result of the test.

<!---------------------------- END INFLUXQL CONTENT --------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN FLUX CONTENT ---------------------------->

## Configure Grafana to use Flux

When you select **Flux** as the query language, configure the following:

1. Ensure [Flux is enabled](/enterprise_influxdb/v1/flux/installation/) in your InfluxDB Enterprise data nodes.

2. Configure the database settings:

   - **Organization**: Provide an arbitrary value (InfluxDB Enterprise 1.x does not use organizations)
   - **Default Bucket**: Provide a default database and retention policy 
   - **Token**: If [InfluxDB authentication is enabled](/enterprise_influxdb/v1/administration/authentication_and_authorization/)

{{< img-hd src="/img/influxdb3/enterprise-v1-grafana-product-dropdown-flux.png" alt="Flux configuration for InfluxDB Enterprise 1.x" />}}

Click **Save & Test**. Grafana attempts to connect to InfluxDB Enterprise and returns the result of the test.

<!------------------------------ END FLUX CONTENT ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana to query and visualize time series data.

For more information, see:
- [Grafana documentation](https://grafana.com/docs/grafana/latest/)
- [Get started with Flux](/flux/v0/get-started/)