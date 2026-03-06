---
title: Use Grafana with InfluxDB Enterprise v1
description: >
  Configure Grafana to query and visualize data from InfluxDB Enterprise v1.
menu:
  enterprise_influxdb_v1:
    name: Grafana
    weight: 60
    parent: Tools
related:
  - /flux/v0/get-started/, Get started with Flux
  - https://grafana.com/docs/, Grafana documentation
aliases:
  - /enterprise_influxdb/v1/visualize-data/grafana/
alt_links:
  core: /influxdb3/core/visualize-data/grafana/
  enterprise: /influxdb3/enterprise/visualize-data/grafana/
  cloud-serverless: /influxdb3/cloud-serverless/process-data/visualize/grafana/
  cloud-dedicated: /influxdb3/cloud-dedicated/process-data/visualize/grafana/
  clustered: /influxdb3/clustered/process-data/visualize/grafana/
canonical: /influxdb/v2/tools/grafana/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB Enterprise** cluster.

> [!Note]
> {{< influxdb-version-detector context="grafana" >}}

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
3. If running Grafana locally, enable the `newInfluxDSConfigPageDesign` feature flag to use the latest InfluxDB data source plugin.

   {{< expand-wrapper >}}
   {{% expand "Option 1: Configuration file (recommended)" %}}

   Add the following to your `grafana.ini` configuration file:

   ```ini
   [feature_toggles]
   enable = newInfluxDSConfigPageDesign
   ```

   Configuration file locations:
   - **Linux**: `/etc/grafana/grafana.ini`
   - **macOS (Homebrew)**: `/opt/homebrew/etc/grafana/grafana.ini`
   - **Windows**: `<GRAFANA_INSTALL_DIR>\conf\grafana.ini`

   {{% /expand %}}

   {{% expand "Option 2: Command line" %}}

   Enable the feature flag when starting Grafana:

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Linux](#)
   [macOS (Homebrew)](#)
   [Windows](#)
   {{% /code-tabs %}}
   {{% code-tab-content %}}

   ```sh
   grafana-server --config /etc/grafana/grafana.ini \
     cfg:default.feature_toggles.enable=newInfluxDSConfigPageDesign
   ```

   {{% /code-tab-content %}}
   {{% code-tab-content %}}

   ```sh
   /opt/homebrew/opt/grafana/bin/grafana server \
     --config /opt/homebrew/etc/grafana/grafana.ini \
     --homepath /opt/homebrew/opt/grafana/share/grafana \
     --packaging=brew \
     cfg:default.paths.logs=/opt/homebrew/var/log/grafana \
     cfg:default.paths.data=/opt/homebrew/var/lib/grafana \
     cfg:default.paths.plugins=/opt/homebrew/var/lib/grafana/plugins \
     cfg:default.feature_toggles.enable=newInfluxDSConfigPageDesign
   ```

   {{% /code-tab-content %}}
   {{% code-tab-content %}}

   ```powershell
   grafana-server.exe --config <GRAFANA_INSTALL_DIR>\conf\grafana.ini `
     cfg:default.feature_toggles.enable=newInfluxDSConfigPageDesign
   ```

   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

   {{% /expand %}}
   {{< /expand-wrapper >}}

   For more information, see [Configure feature toggles](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/feature-toggles/) in the Grafana documentation.

4. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   <http://localhost:3000> in your browser.

> [!Note]
> #### Grafana 12.2+
>
> The instructions below are for **Grafana 12.2+** with the `newInfluxDSConfigPageDesign`
> feature flag enabled. This introduces the newest version of the InfluxDB core plugin.
> The updated plugin includes **SQL support** for InfluxDB 3-based products such
> as {{< product-name >}}, and the interface dynamically adapts based on your
> product and query language selection in [URL and authentication](#configure-url-and-authentication).

> [!Note]
> #### Using Grafana Cloud with a local InfluxDB instance
>
> If you need to keep your database local, consider running Grafana locally instead of using Grafana Cloud,
> as this avoids the need to expose your database to the internet.
>
> To use InfluxDB running on your private network with Grafana Cloud, you must configure a
> [private data source for Grafana Cloud](https://grafana.com/docs/grafana-cloud/data-sources/private-data-sources/).

> [!Note]
> #### Query language support
> - InfluxQL is supported in InfluxDB Enterprise v1.8.x and later.
> - Flux is supported in InfluxDB Enterprise v1.8.1 and later.
> - SQL is only supported in InfluxDB 3. For more information, see how to [get started with InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar.
2. Click **Data sources**.
3. Click **Add new connection**.
4. Search for and select **InfluxDB**. The InfluxDB data source configuration page displays.
5. In the **Settings** tab, enter a **Name** for your data source.

### Configure URL and authentication

In the **URL and authentication** section, configure the following:

- **URL**: Your server or load balancer URL--for example, `https://{{< influxdb/host >}}`
- **Product**: From the dropdown, select **InfluxDB Enterprise 1.x**
- **Query Language**: Select **InfluxQL** or **Flux**
- _(Optional)_ **Advanced HTTP Settings**, **Auth**, and **TLS/SSL Settings** as needed for your environment

### Configure database settings

The fields in this section change based on your query language selection in [URL and authentication](#configure-url-and-authentication).

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

{{< img-hd src="/img/grafana/enterprise-influxdb-v1-grafana-influxql.png" alt="InfluxQL configuration for InfluxDB Enterprise 1.x" />}}

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

{{< img-hd src="/img/grafana/enterprise-influxdb-v1-grafana-flux.png" alt="Flux configuration for InfluxDB Enterprise 1.x" />}}

Click **Save & Test**. Grafana attempts to connect to InfluxDB Enterprise and returns the result of the test.

<!------------------------------ END FLUX CONTENT ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana to query and visualize time series data.

### Query inspection in Grafana 

To learn about query management and inspection in Grafana, see the
[Grafana Explore documentation](https://grafana.com/docs/grafana/latest/explore/).

### Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).
